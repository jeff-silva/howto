from odoo import models, fields

class CappStage(models.Model):
    _name = 'capp.stage'
    _description = 'Etapa de Produção'
    _order = 'sequence, id'

    name = fields.Char(string='Nome da Etapa', required=True)
    sequence = fields.Integer(string='Sequência', default=10)
    department_id = fields.Many2one('capp.department', string='Departamento', required=True, ondelete='cascade')
