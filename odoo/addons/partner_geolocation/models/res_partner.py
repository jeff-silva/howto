from odoo import models, fields

class ResPartner(models.Model):
    _inherit = 'res.partner'

    pg_latitude = fields.Float(string='Latitude', digits=(16, 5))
    pg_longitude = fields.Float(string='Longitude', digits=(16, 5))
