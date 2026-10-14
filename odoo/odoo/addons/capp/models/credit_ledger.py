from odoo import models, fields

class CreditLedger(models.Model):
    _name = 'capp.credit.ledger'
    _description = 'Extrato de Créditos'

    partner_id = fields.Many2one('res.partner', string='Cliente', required=True, ondelete='cascade')
    amount = fields.Integer(string='Quantidade', required=True)
    description = fields.Char(string='Descrição')
