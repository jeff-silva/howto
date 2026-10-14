{
    'name': 'Resumas',
    'version': '1.0',
    'category': 'Human Resources',
    'summary': 'Gerenciamento de Currículos e Aplicações para Vagas',
    'description': """
Módulo Headless para Gerenciamento de Currículos.
Permite a criação e gestão de currículos por candidatos via painel externo (Nuxt/Vue).
    """,
    'author': 'Jeff',
    'depends': ['base'],
    'external_dependencies': {
        'python': ['weasyprint'],
    },
    'data': [
        'security/ir.access.csv',
        'views/resume_views.xml',
        'views/resume_templates.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'resumas/static/src/js/resume_widget.js',
            'resumas/static/src/xml/resume_widget.xml',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
