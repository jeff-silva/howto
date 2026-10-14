from odoo import models, fields

class BadgeValue(models.Model):
    _name = 'capp.badge.value'
    _description = 'Valores do Crachá'

    order_id = fields.Many2one('capp.badge.order', string='Pedido', required=True, ondelete='cascade')
    attribute_id = fields.Many2one('capp.badge.attribute', string='Atributo', required=True)
    attribute_name = fields.Char(related='attribute_id.label', string='Campo', readonly=True)
    attribute_type = fields.Selection(related='attribute_id.field_type', string='Tipo', readonly=True)
    
    value_text = fields.Char(string='Texto')
    value_file = fields.Binary(string='Arquivo / Imagem', attachment=True)
