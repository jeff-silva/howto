from odoo import models, fields, api

class BadgeTemplate(models.Model):
    _name = 'capp.badge.template'
    _description = 'Modelo de Crachá'

    name = fields.Char(string='Nome do Modelo', required=True)
    partner_id = fields.Many2one('res.partner', string='Cliente', required=True, ondelete='cascade')
    department_id = fields.Many2one('capp.department', string='Departamento de Produção')
    product_id = fields.Many2one('product.product', string='Produto (Faturamento)', ondelete='restrict')
    active = fields.Boolean(default=True)
    attribute_ids = fields.One2many('capp.badge.attribute', 'template_id', string='Atributos')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if 'name' in vals and not vals.get('product_id'):
                product = self.env['product.product'].create({
                    'name': vals['name'],
                    'type': 'service',
                    'invoice_policy': 'order',
                })
                vals['product_id'] = product.id
        return super(BadgeTemplate, self).create(vals_list)

    def write(self, vals):
        res = super(BadgeTemplate, self).write(vals)
        if 'name' in vals:
            for rec in self:
                if rec.product_id:
                    rec.product_id.name = rec.name
        return res
