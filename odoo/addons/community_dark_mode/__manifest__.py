{
    'name': 'Community Dark Mode',
    'version': '1.0',
    'summary': 'Enable Dark Mode in Odoo Community',
    'category': 'Hidden',
    'author': 'Agent',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'community_dark_mode/static/src/js/dark_mode_menu.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
