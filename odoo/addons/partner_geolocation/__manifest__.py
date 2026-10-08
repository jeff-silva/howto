# -*- coding: utf-8 -*-
{
    'name': 'Partner Geolocation',
    'version': '1.0',
    'summary': 'Add Leaflet map to partner form for coordinate management and reverse geocoding.',
    'category': 'Sales',
    'author': 'Agent',
    'depends': ['base', 'web'],
    'data': [
        'views/res_partner_views.xml',
        'views/global_map_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
            'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
            'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
            'partner_geolocation/static/src/css/map_widget.css',
            'partner_geolocation/static/src/js/map_widget.js',
            'partner_geolocation/static/src/xml/map_widget.xml',
            'partner_geolocation/static/src/js/global_map.js',
            'partner_geolocation/static/src/xml/global_map.xml',
        ],
    },
    'installable': True,
    'application': False,
}
