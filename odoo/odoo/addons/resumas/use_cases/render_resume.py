import json

class RenderResumeHTMLUseCase:
    def __init__(self, env):
        self.env = env

    def execute(self, resume_id):
        resume = self.env['resumas.resume'].sudo().browse(resume_id)
        if not resume.exists():
            return "<h1>Currículo não encontrado</h1>"
        
        resume_data = {}
        if resume.json_resume:
            try:
                resume_data = json.loads(resume.json_resume)
            except Exception as e:
                pass
                
        # To keep it completely independent from Odoo UI views/templates,
        # we can render the HTML manually or use QWeb if we want.
        # But a Use Case should ideally hold the logic. 
        # Using a QWeb template registered in Odoo is the "Odoo Way".
        
        # We will call ir.qweb to render the resumas.resume_html_template
        html = self.env['ir.qweb']._render('resumas.resume_html_template', {
            'data': resume_data,
            'resume': resume
        })
        
        return html
