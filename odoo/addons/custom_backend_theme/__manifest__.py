{
    'name': 'Custom Theme',
    'version': '1.0',
    'summary': 'Customização geral de Tema',
    'category': 'Theme/Backend',
    'author': 'Agent',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'custom_backend_theme/static/src/scss/dark_mode.scss',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
}
