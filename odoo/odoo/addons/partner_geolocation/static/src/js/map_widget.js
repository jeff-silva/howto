/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onMounted, onWillUnmount, onWillUpdateProps, useProps, proxy } from "@odoo/owl";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

export class LeafletMapField extends Component {
    static template = "partner_geolocation.LeafletMapField";
    props = useProps(standardFieldProps);

    setup() {
        this.mapId = 'map_' + String(Math.random()).substring(2);
        this.map = null;
        this.marker = null;
        this.resizeObserver = null;
        this.searchTimeout = null;

        this.state = proxy({
            searchQuery: '',
            searchResults: []
        });

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

        onWillUpdateProps((nextProps) => {
            // Se o ID do registro mudou (ex: usuário clicou na seta de próximo/anterior)
            if (this.props.record.resId !== nextProps.record.resId) {
                if (this.map && this.marker) {
                    let lat = nextProps.record.data.pg_latitude;
                    let lng = nextProps.record.data.pg_longitude;
                    const hasCoords = !!(lat && lng);

                    if (!hasCoords) {
                        lat = -23.5505;
                        lng = -46.6333;
                    }

                    this.map.setView([lat, lng], hasCoords ? 15 : 13);
                    this.marker.setLatLng([lat, lng]);

                    if (!hasCoords && !nextProps.readonly) {
                        // Aguarda 1 frame para this.props.record estar atualizado e busca
                        setTimeout(() => this.geocodeAddressAndSetMap(), 0);
                    }
                }
            }
        });
    }

    initMap() {
        let lat = this.props.record.data.pg_latitude;
        let lng = this.props.record.data.pg_longitude;
        const hasCoords = !!(lat && lng);

        if (!hasCoords) {
            // Default to São Paulo se não tiver nada
            lat = -23.5505;
            lng = -46.6333; 
        }

        // Tentar encontrar o elemento (Owl pode demorar 1 frame para colocar no DOM real)
        setTimeout(() => {
            const mapEl = document.getElementById(this.mapId);
            if (!mapEl) {
                console.error("Map element not found! ID:", this.mapId);
                return;
            }
            if (typeof L === 'undefined') {
                console.error("Leaflet (L) is not defined! CDN failed to load?");
                return;
            }

            this.map = L.map(mapEl).setView([lat, lng], hasCoords ? 15 : 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        this.marker = L.marker([lat, lng], { draggable: !this.props.readonly }).addTo(this.map);

            if (!this.props.readonly) {
                this.marker.on('dragend', (e) => {
                    const position = this.marker.getLatLng();
                    this.updateCoordinates(position.lat, position.lng);
                    this.fetchAddress(position.lat, position.lng);
                });
            }

            // Fix for Leaflet rendering inside a hidden tab
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                }
            }, 500);

            // Um ResizeObserver garante que o mapa nunca quebre quando a aba for esticada
            this.resizeObserver = new ResizeObserver(() => {
                if (this.map && this.map.getContainer()) {
                    this.map.invalidateSize();
                }
            });
            this.resizeObserver.observe(mapEl);

            if (!hasCoords && !this.props.readonly) {
                this.geocodeAddressAndSetMap();
            }

        }, 100);
    }


    onSearchInput(ev) {
        this.state.searchQuery = ev.target.value;
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        if (this.state.searchQuery.length < 3) {
            this.state.searchResults = [];
            return;
        }

        this.searchTimeout = setTimeout(async () => {
            try {
                const query = encodeURIComponent(this.state.searchQuery);
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1`);
                const results = await response.json();
                this.state.searchResults = results;
            } catch (e) {
                console.error("Search failed", e);
            }
        }, 500);
    }

    selectSearchResult(result) {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Limpa a busca e fecha o dropdown
        this.state.searchQuery = result.display_name;
        this.state.searchResults = [];

        // Atualiza visualmente o mapa e o pino
        if (this.map && this.marker) {
            this.map.setView([lat, lng], 16);
            this.marker.setLatLng([lat, lng]);
        }

        // Prepara os dados para atualizar na interface
        const updateData = {
            pg_latitude: lat,
            pg_longitude: lng
        };

        // Extrai os detalhes do endereço vindos da busca
        if (result.address) {
            if (result.address.road) updateData.street = result.address.road;
            if (result.address.postcode) updateData.zip = result.address.postcode;
            
            const city = result.address.city || result.address.town || result.address.village;
            if (city) updateData.city = city;
        }

        // Atualiza os dados na interface (deixa a ficha "suja", mas SEM salvar automaticamente)
        this.props.record.update(updateData);
    }

    async updateCoordinates(lat, lng) {
        await this.props.record.update({
            pg_latitude: lat,
            pg_longitude: lng
        });
        await this.props.record.save();
    }

    async geocodeAddressAndSetMap() {
        const data = this.props.record.data;
        const addressParts = [];
        
        if (data.street) addressParts.push(data.street);
        if (data.city) addressParts.push(data.city);
        if (data.state_id && data.state_id[1]) addressParts.push(data.state_id[1]);
        if (data.country_id && data.country_id[1]) addressParts.push(data.country_id[1]);
        
        const query = addressParts.join(', ');
        if (!query) return; // Contato não tem endereço salvo

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        try {
            const response = await fetch(url);
            const results = await response.json();
            
            if (results && results.length > 0) {
                const newLat = parseFloat(results[0].lat);
                const newLng = parseFloat(results[0].lon);

                // Salva no registro (marca como alterado)
                this.updateCoordinates(newLat, newLng);

                // Centraliza o mapa e move o pino
                if (this.map && this.marker) {
                    this.map.setView([newLat, newLng], 16);
                    this.marker.setLatLng([newLat, newLng]);
                }
            }
        } catch (e) {
            console.error('Erro ao buscar endereço via Geocoding:', e);
        }
    }

    async fetchAddress(lat, lng) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            
            if (data && data.address) {
                const address = data.address;
                
                const street = address.road || '';
                const city = address.city || address.town || address.village || '';
                const zip = address.postcode || '';
                
                let updates = {};
                if (street) updates.street = street;
                if (city) updates.city = city;
                if (zip) updates.zip = zip;
                
                if (Object.keys(updates).length > 0) {
                    this.props.record.update(updates);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar endereço via geocoding", error);
        }
    }
}

registry.category("fields").add("leaflet_map", {
    component: LeafletMapField,
    supportedTypes: ["float"],
});
