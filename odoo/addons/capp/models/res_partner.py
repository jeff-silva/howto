from odoo import models, fields, api

class ResPartner(models.Model):
    _inherit = 'res.partner'

    capp_billing_type = fields.Selection([
        ('pre', 'Pré-pago'),
        ('post', 'Pós-pago')
    ], string='Tipo de Cobrança', default='pre')
    
    capp_credit_ledger_ids = fields.One2many('capp.credit.ledger', 'partner_id', string='Extrato de Créditos')
    capp_credit_balance = fields.Integer(string='Saldo Atual', compute='_compute_capp_credit_balance')
    capp_billing_summary = fields.Char(string='Cobrança / Saldo', compute='_compute_capp_billing_summary')

    capp_add_credit = fields.Integer(string='Inserir/Remover Créditos')
    capp_add_credit_desc = fields.Char(string='Descrição do Ajuste')

    @api.depends('capp_credit_ledger_ids.amount')
    def _compute_capp_credit_balance(self):
        for rec in self:
            rec.capp_credit_balance = sum(rec.capp_credit_ledger_ids.mapped('amount'))

    @api.depends('capp_billing_type', 'capp_credit_balance')
    def _compute_capp_billing_summary(self):
        for rec in self:
            if rec.capp_billing_type:
                prefix = 'Pré' if rec.capp_billing_type == 'pre' else 'Pós'
                rec.capp_billing_summary = f"{prefix}: {rec.capp_credit_balance}"
            else:
                rec.capp_billing_summary = ''

    def write(self, vals):
        credits_to_add = vals.pop('capp_add_credit', 0)
        desc = vals.pop('capp_add_credit_desc', '')

        res = super(ResPartner, self).write(vals)

        if credits_to_add:
            for rec in self:
                final_desc = desc if desc else 'Ajuste Manual de Saldo'
                self.env['capp.credit.ledger'].create({
                    'partner_id': rec.id,
                    'amount': credits_to_add,
                    'description': final_desc
                })
        return res
