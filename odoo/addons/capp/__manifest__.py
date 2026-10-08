# -*- coding: utf-8 -*-
{
    'name': 'CAPP - Gestão de Crachás',
    'version': '1.0',
    'summary': 'Módulo para gestão de pedidos de crachás customizados por cliente',
    'category': 'Sales',
    'author': 'Agent',
    'depends': ['base', 'sale'],
    'data': [
        'security/ir.access.csv',
        'views/department_views.xml',
        'views/badge_template_views.xml',
        'views/badge_order_views.xml',
        'views/res_partner_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'capp/static/src/css/style.css',
        ],
    },
    'installable': True,
    'application': True,
}
