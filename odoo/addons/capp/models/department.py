from odoo import models, fields

class CappDepartment(models.Model):
    _name = 'capp.department'
    _description = 'Departamento de Produção'

    name = fields.Char(string='Nome do Departamento', required=True)
    active = fields.Boolean(default=True)
    stage_ids = fields.One2many('capp.stage', 'department_id', string='Etapas')
