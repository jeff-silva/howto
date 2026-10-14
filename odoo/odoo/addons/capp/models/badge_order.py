from odoo import models, fields, api
from odoo.exceptions import ValidationError, UserError

class BadgeOrder(models.Model):
    _name = 'capp.badge.order'
    _description = 'Pedido de Crachá'

    name = fields.Char(string='Referência', required=True, copy=False, readonly=True, default='Novo')
    partner_id = fields.Many2one('res.partner', string='Cliente', required=True)
    template_id = fields.Many2one('capp.badge.template', string='Modelo de Crachá', required=True, domain="[('partner_id', '=', partner_id)]")
    sale_order_id = fields.Many2one('sale.order', string='Pedido de Venda Oficial', readonly=True, copy=False)
    state = fields.Selection([
        ('draft', 'Iniciado'),
        ('confirmed', 'Confirmado'),
        ('production', 'Em Produção'),
        ('done', 'Finalizado'),
        ('cancelled', 'Cancelado')
    ], string='Status', default='draft', required=True)

    quantity = fields.Integer(string='Quantidade', default=1, required=True)
    value_ids = fields.One2many('capp.badge.value', 'order_id', string='Dados do Crachá')
    stage_id = fields.Many2one('capp.stage', string='Etapa Atual', group_expand='_read_group_stage_ids')
    department_id = fields.Many2one('capp.department', string='Departamento', related='template_id.department_id', store=True)

    @api.model
    def _read_group_stage_ids(self, stages, domain=None, order=None, **kwargs):
        stage_domain = []
        department_found = False
        if domain:
            for arg in domain:
                if isinstance(arg, (tuple, list)) and len(arg) == 3:
                    if arg[0] == 'department_id':
                        stage_domain.append(('department_id', arg[1], arg[2]))
                        department_found = True
        
        if not department_found:
            return self.env['capp.stage'].browse()
            
        return self.env['capp.stage'].search(stage_domain)

    @api.onchange('template_id')
    def _onchange_template_id(self):
        self.value_ids = [(5, 0, 0)]
        if self.template_id:
            values = []
            for attr in self.template_id.attribute_ids:
                values.append((0, 0, {
                    'attribute_id': attr.id,
                }))
            self.value_ids = values

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', 'Novo') == 'Novo':
                vals['name'] = self.env['ir.sequence'].next_by_code('capp.badge.order') or 'Pedido Novo'
        return super(BadgeOrder, self).create(vals_list)

    def write(self, vals):
        res = super(BadgeOrder, self).write(vals)
        if 'stage_id' in vals:
            for order in self:
                if order.stage_id:
                    last_stage = self.env['capp.stage'].search(
                        [('department_id', '=', order.stage_id.department_id.id)],
                        order='sequence desc, id desc',
                        limit=1
                    )
                    if order.stage_id.id == last_stage.id and order.state == 'production':
                        order.state = 'done'
        return res

    def action_confirm(self):
        for order in self:
            cost = order.quantity
            
            if not order.template_id.product_id:
                # Fallback: se o modelo for antigo e não tiver produto, criamos na hora!
                product = self.env['product.product'].create({
                    'name': order.template_id.name,
                    'type': 'service',
                    'invoice_policy': 'order',
                })
                order.template_id.product_id = product.id

            if order.partner_id.capp_billing_type == 'pre':
                if order.partner_id.capp_credit_balance < cost:
                    raise ValidationError(f"Saldo insuficiente! O cliente precisa de {cost} créditos, mas possui apenas {order.partner_id.capp_credit_balance}.")
            
            self.env['capp.credit.ledger'].create({
                'partner_id': order.partner_id.id,
                'amount': -cost,
                'description': f"Pedido CAPP: {order.name}"
            })
            
            # Gerar Pedido de Venda
            so_vals = {
                'partner_id': order.partner_id.id,
                'origin': order.name,
                'order_line': [(0, 0, {
                    'product_id': order.template_id.product_id.id,
                    'product_uom_qty': order.quantity,
                    'name': f"Crachá CAPP: {order.template_id.name}"
                })]
            }
            sale_order = self.env['sale.order'].create(so_vals)
            order.sale_order_id = sale_order.id
            order.state = 'confirmed'

    def action_produce(self):
        for order in self:
            if not order.template_id.department_id:
                raise UserError("O modelo deste crachá não possui um Departamento de Produção configurado.")
            
            first_stage = self.env['capp.stage'].search(
                [('department_id', '=', order.template_id.department_id.id)], 
                order='sequence asc, id asc', 
                limit=1
            )
            if not first_stage:
                raise UserError(f"O departamento '{order.template_id.department_id.name}' não possui etapas cadastradas.")
                
            order.stage_id = first_stage.id
            order.state = 'production'

    def action_view_sale_order(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_window',
            'name': 'Pedido de Venda',
            'view_mode': 'form',
            'res_model': 'sale.order',
            'res_id': self.sale_order_id.id,
        }
