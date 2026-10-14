from odoo import models, fields

class BadgeAttribute(models.Model):
    _name = 'capp.badge.attribute'
    _description = 'Atributo do Crachá'
    _order = 'sequence, id'

    template_id = fields.Many2one('capp.badge.template', string='Modelo de Crachá', required=True, ondelete='cascade')
    name = fields.Char(string='Nome Técnico', required=True, help='Ex: matricula, nome, foto_perfil')
    label = fields.Char(string='Rótulo', required=True, help='Nome amigável exibido (Ex: Matrícula, Foto)')
    field_type = fields.Selection([
        ('text', 'Texto Curto'),
        ('file', 'Arquivo / Imagem'),
        ('price', 'Preço / Moeda'),
        ('number', 'Número')
    ], string='Tipo', required=True, default='text')
    required = fields.Boolean(string='Obrigatório', default=True)
    sequence = fields.Integer(string='Sequência', default=10)
