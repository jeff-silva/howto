import json
import base64
from odoo import models, fields, api
from odoo.exceptions import UserError

class Resume(models.Model):
    _name = 'resumas.resume'
    _description = 'Currículo do Candidato'

    name = fields.Char(string='Título do Currículo', required=True)
    json_resume = fields.Json(string='Estrutura JSON Resume')
    
    # Ligação com o usuário
    user_id = fields.Many2one('res.users', string='Usuário', default=lambda self: self.env.user, required=True)

    language = fields.Selection([
        ('pt_BR', 'Português (Brasil)'),
        ('en_US', 'Inglês (EUA)'),
        ('es_ES', 'Espanhol')
    ], string='Idioma', default='pt_BR', required=True)
    
    state = fields.Selection([
        ('draft', 'Rascunho'),
        ('active', 'Ativo'),
        ('archived', 'Arquivado')
    ], string='Status', default='draft')

    preview_html = fields.Html(string='Preview', compute='_compute_preview_html', sanitize=False)

    def _compute_preview_html(self):
        for record in self:
            if record.id:
                record.preview_html = f'<iframe src="/resumas/resume_render/{record.id}/html" style="width: 100%; height: 800px; border: none; overflow: hidden; border-radius: 8px;"></iframe>'
            else:
                record.preview_html = '<div style="padding: 20px; text-align: center; color: #777;">Salve o currículo primeiro para visualizar a prévia.</div>'

    def action_download_pdf(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_url',
            'url': f'/resumas/resume_render/{self.id}/pdf',
            'target': 'new',
        }
