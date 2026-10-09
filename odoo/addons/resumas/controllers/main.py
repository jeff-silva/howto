from odoo import http
from odoo.http import request
from odoo.addons.resumas.use_cases.render_resume import RenderResumeHTMLUseCase

class ResumeController(http.Controller):

    @http.route('/resumas/resume_render/<int:resume_id>/html', type='http', auth='public')
    def render_html(self, resume_id, **kwargs):
        use_case = RenderResumeHTMLUseCase(request.env)
        html_content = use_case.execute(resume_id)
        return request.make_response(html_content, headers=[('Content-Type', 'text/html')])

    @http.route('/resumas/resume_render/<int:resume_id>/pdf', type='http', auth='public')
    def render_pdf(self, resume_id, **kwargs):
        use_case = RenderResumeHTMLUseCase(request.env)
        html_content = use_case.execute(resume_id)
        
        # Using WeasyPrint for modern CSS support
        try:
            from weasyprint import HTML
            pdf_content = HTML(string=html_content).write_pdf()
        except Exception as e:
            import traceback
            return request.make_response(f"Erro: {e}\n{traceback.format_exc()}", headers=[("Content-Type", "text/plain")])
            # except Exception as e:
            # return request.make_response(f"Erro ao gerar PDF: {e}", headers=[('Content-Type', 'text/plain')])

        pdfhttpheaders = [
            ('Content-Type', 'application/pdf'),
            ('Content-Length', len(pdf_content)),
            ('Content-Disposition', f'inline; filename="resume_{resume_id}.pdf"'),
        ]
        return request.make_response(pdf_content, headers=pdfhttpheaders)
