# Partner Geolocation (Agent Rules)

## Overview
`partner_geolocation` is a custom Odoo 20 module designed to enhance the `res.partner` (Contact/Customer) form by integrating a visual interactive map using the Leaflet.js library.

## Goal
To allow users to precisely pinpoint a contact's location on a map. When the user drags and drops the map marker, the system will automatically perform reverse geocoding using the OpenStreetMap (Nominatim) API to fetch the full address (Street, City, State, ZIP/CEP, Country) and automatically populate the standard Odoo address fields in the form.

## Technical Architecture & Rules

### 1. Data Model (`res.partner`)
- We must add two new fields to `res.partner`: `partner_lat` (Float) and `partner_lng` (Float).
- **Note:** Odoo has a native `base_geolocalize` module which adds `partner_latitude` and `partner_longitude`. We should evaluate if we want to inherit those existing fields or create our own isolated fields. For maximum control, creating our own namespaced fields (e.g., `pg_latitude`, `pg_longitude`) is acceptable, but reusing native fields is usually better for compatibility.

### 2. User Interface (XML)
- The map must be placed in a dedicated notebook page (tab) within the `res.partner` form view, ensuring the primary contact view remains clean.
- We will define a custom field widget (e.g., `widget="leaflet_map"`) to render the interactive map.

### 3. Javascript / Frontend (Owl Framework)
- The module must follow Odoo 20's Owl component architecture for creating the custom field widget.
- **Leaflet Integration:** The Leaflet CSS and JS must be correctly loaded via Odoo's asset bundles (`web.assets_backend`).
- **Reverse Geocoding:** When the Leaflet marker's `dragend` event is fired, the Owl component must:
  1. Capture the new Latitude and Longitude.
  2. Make an asynchronous `fetch` request to `https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}`.
  3. Parse the returned JSON to extract the address components.
  4. Update the `res.partner` form fields dynamically before saving (mutating the record's current state in the UI).

### 4. Odoo 20 Gotchas
- **Assets Registration:** In Odoo 20, Javascript and CSS assets must be declared in the `__manifest__.py` under the `'assets'` dictionary, targeting `'web.assets_backend'`.
- **Owl Components:** All new widgets must be written as Owl components. Avoid legacy `Widget` classes.

## Development Workflow
1. Create `__manifest__.py` and `__init__.py`.
2. Create the Python model extending `res.partner`.
3. Create the XML views injecting the new tab.
4. Download and add Leaflet.js and Leaflet.css to `static/src/lib/`.
5. Create the Owl component in `static/src/js/leaflet_widget.js`.
6. Test coordinate binding.
7. Implement the Nominatim reverse geocoding fetch logic.
