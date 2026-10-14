/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onMounted, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class GlobalMap extends Component {
    static template = "partner_geolocation.GlobalMap";

    setup() {
        this.mapId = 'global_map_' + String(Math.random()).substring(2);
        this.map = null;
        this.markers = [];
        this.resizeObserver = null;
        
        // Hooks services for database and UI
        this.orm = useService("orm");
        this.action = useService("action");

        // Force CSS load directly to bypass Odoo asset bundler bugs
        if (!document.getElementById('leaflet_css_cdn')) {
            const link = document.createElement('link');
            link.id = 'leaflet_css_cdn';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        onMounted(() => {
            this.initMap();
            this.loadPartners();
        });

        onWillUnmount(() => {
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
                this.resizeObserver = null;
            }
            if (this.map) {
                this.map.remove();
                this.map = null;
            }
        });
    }

    initMap() {
        setTimeout(() => {
            const mapEl = document.getElementById(this.mapId);
            if (!mapEl) return;

            // Default to whole world
            this.map = L.map(mapEl).setView([0, 0], 2);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(this.map);

            this.resizeObserver = new ResizeObserver(() => {
                if (this.map && this.map.getContainer()) {
                    this.map.invalidateSize();
                }
            });
            this.resizeObserver.observe(mapEl);
        }, 100);
    }

    async loadPartners() {
        // Search for all partners that have latitude and longitude
        const domain = [['pg_latitude', '!=', false], ['pg_latitude', '!=', 0]];
        const fields = ['id', 'name', 'email', 'phone', 'city', 'pg_latitude', 'pg_longitude'];
        const partners = await this.orm.searchRead('res.partner', domain, fields);

        if (!this.map) return;

        // Clear existing clusters if they exist
        if (this.markerClusterGroup) {
            this.map.removeLayer(this.markerClusterGroup);
        }
        
        // Inicializar o grupo de agrupamento (Cluster Group)
        this.markerClusterGroup = L.markerClusterGroup({
            chunkedLoading: true, // Garante que a tela não congele com milhares de marcadores
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
        });

        if (partners.length === 0) return;

        const bounds = L.latLngBounds();

        for (const p of partners) {
            const lat = p.pg_latitude;
            const lng = p.pg_longitude;
            
            const marker = L.marker([lat, lng]);
            
            // Build a pretty popup
            const popupContent = `
                <div style="min-width: 150px;">
                    <h5 style="margin-bottom: 5px;">${p.name}</h5>
                    <p style="margin: 0; font-size: 12px; color: #666;">
                        ${p.city ? `<i class="fa fa-building"></i> ${p.city}<br>` : ''}
                        ${p.email ? `<i class="fa fa-envelope"></i> ${p.email}<br>` : ''}
                        ${p.phone ? `<i class="fa fa-phone"></i> ${p.phone}` : ''}
                    </p>
                    <button class="btn btn-sm btn-primary mt-2 w-100" onclick="window.openContact(${p.id})">Abrir Contato</button>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            this.markerClusterGroup.addLayer(marker);
            bounds.extend([lat, lng]);
        }

        // Adicionar o cluster group inteiro de uma vez ao mapa
        this.map.addLayer(this.markerClusterGroup);

        // Add a global click handler so the popup button works
        window.openContact = (id) => {
            this.action.doAction({
                type: 'ir.actions.act_window',
                res_model: 'res.partner',
                res_id: id,
                views: [[false, 'form']],
                target: 'current'
            });
        };

        // Fit the map so all markers are visible!
        this.map.fitBounds(bounds, { padding: [50, 50] });
    }
}

registry.category("actions").add("partner_geolocation.global_map", GlobalMap);
