import json
from odoo import http
from odoo.http import request

class CustomApiController(http.Controller):

    @http.route('/api/public_products', type='http', auth='public', methods=['GET', 'OPTIONS'], cors='*', csrf=False)
    def public_products(self, **kw):
        # Parâmetros de paginação
        try:
            page = int(kw.get('page', 1))
            limit = int(kw.get('limit', 20))
        except ValueError:
            page = 1
            limit = 20

        if page < 1:
            page = 1
        if limit < 1 or limit > 100:
            limit = 20

        offset = (page - 1) * limit
        domain = [('sale_ok', '=', True)]

        # Buscamos o total de registros para informar ao frontend
        total_count = request.env['product.template'].sudo().search_count(domain)

        # Buscamos os produtos da página atual
        products = request.env['product.template'].sudo().search_read(
            domain,
            ['id', 'name', 'list_price'],
            limit=limit,
            offset=offset
        )
        
        response_data = json.dumps({
            'status': 'success', 
            'data': products,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            }
        })

        return request.make_response(
            response_data,
            headers=[('Content-Type', 'application/json')]
        )
