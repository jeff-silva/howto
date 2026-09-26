# Rendering Maps in HyperFrames (Headless Environments)

When generating videos using a headless rendering engine like HyperFrames, traditional map implementations (like Leaflet with a standard `TileLayer`) will fail or render blank screens. 

This tutorial explains the root cause of this issue and provides a step-by-step architectural solution to perfectly render geographical maps in a headless, frame-by-frame environment.

## 1. The Problem: Asynchronous Tile Loading

Traditional map engines load tiles asynchronously. When the camera moves or zooms, the map engine fires HTTP requests (e.g., `https://tile.openstreetmap.org/{z}/{x}/{y}.png`) to fetch new tiles. 
In a browser, the user waits a few milliseconds. In HyperFrames, the engine renders frames instantaneously. The frame is captured **before** the asynchronous network requests finish, resulting in a blank map or a checkerboard pattern.

## 2. The Solution: Synchronous Local Image Overlay

To fix this, we completely bypass asynchronous network requests during the video render. Instead of relying on a `TileLayer`, we:
1. Pre-download and stitch all necessary map tiles into a **single, high-resolution static image**.
2. Feed this single image into the map engine using an `ImageOverlay`.
3. Align the corners of the image perfectly with geographic coordinates (Latitude/Longitude bounding box).

Since the image is a single local file, the browser loads it synchronously, guaranteeing the map is fully visible in every captured frame.

## 3. Step-by-Step Implementation

### Step A: Stitching the Map Offline
Write a script to pre-fetch map tiles for your target bounding box and stitch them together. You can use Node.js with the `jimp` library for this.

```javascript
const fs = require('fs');
const { Jimp } = require('jimp');

const ZOOM = 19; // 18 is fast but blurry on zoom-in. 19 is high-res (4x larger).
const minLat = -19.806, maxLat = -19.797;
const minLon = -43.942, maxLon = -43.934;

// Math to convert Lat/Lon to Tile X/Y at a specific Zoom
function lon2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

const minX = lon2tile(minLon, ZOOM), maxX = lon2tile(maxLon, ZOOM);
const minY = lat2tile(maxLat, ZOOM), maxY = lat2tile(minLat, ZOOM);

async function generateMap() {
    const width = (maxX - minX + 1) * 256;
    const height = (maxY - minY + 1) * 256;
    const image = new Jimp({ width, height, color: 0x000000FF });
    
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            const url = `https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`;
            const res = await fetch(url, { headers: { 'User-Agent': 'MapStitcher/1.0' } });
            if (!res.ok) continue;
            
            const buffer = await res.arrayBuffer();
            const tile = await Jimp.read(Buffer.from(buffer));
            image.composite(tile, (x - minX) * 256, (y - minY) * 256);
        }
    }
    await image.write('assets/map_bg.png');
}
generateMap();
```

### Step B: Calculating the Exact Bounding Box
Because the tiles snap to a grid, the edges of your stitched image are slightly wider than your original bounding box. You **must** calculate the exact Latitude and Longitude of the extreme corners of your stitched image to prevent the map from misaligning with your GPS routes.

```javascript
// Math to convert Tile X/Y back to exact Lat/Lon
function tile2lon(x,z) { return (x/Math.pow(2,z)*360-180); }
function tile2lat(y,z) { 
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2,z); 
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n)))); 
}

const trueMinLon = tile2lon(minX, ZOOM);
const trueMaxLon = tile2lon(maxX + 1, ZOOM); // Right edge of the last tile
const trueMaxLat = tile2lat(minY, ZOOM); // Top edge
const trueMinLat = tile2lat(maxY + 1, ZOOM); // Bottom edge

console.log(`Bounds: [[${trueMinLat}, ${trueMinLon}], [${trueMaxLat}, ${trueMaxLon}]]`);
```

### Step C: Rendering with D3.js (Flawless Headless Compatibility)
Leaflet can still introduce layout quirks (like z-index pane issues or floating point rounding errors) when used headless with a massive image overlay. The most mathematically perfect and bulletproof method is using D3.js, because both OpenStreetMap tiles and D3 use the **exact same Web Mercator projection**.

You can map the geographical coordinates perfectly onto your stitched image using an SVG and D3's `geoMercator().fitSize()`:

```javascript
// 1. Dimensions and Exact Bounds from Step B
const imgW = 3328, imgH = 3840;
const imgWest = -43.94256591796875, imgEast = -43.93363952636719;
const imgNorth = -19.796425363822536, imgSouth = -19.806116059729394;

// 2. Create a Feature representing the exact image boundaries
const imageFeature = {
    type: "Feature",
    geometry: {
        type: "Polygon",
        coordinates: [[[imgWest, imgNorth], [imgEast, imgNorth], [imgEast, imgSouth], [imgWest, imgSouth], [imgWest, imgNorth]]]
    }
};

// 3. Project perfectly to the image dimensions
const projection = d3.geoMercator().fitSize([imgW, imgH], imageFeature);

// 4. Create SVG and append background image
const svg = d3.select("#map_wrapper").append("svg").attr("width", imgW).attr("height", imgH);
svg.append("image").attr("href", "assets/map_bg.png").attr("width", imgW).attr("height", imgH);

// 5. Draw routes mathematically perfectly!
const [x, y] = projection([-43.940477, -19.802074]); // Get pixel coordinates for any point!
svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 10).attr("fill", "red");
```

## Summary for AI Agents
If you are tasked with rendering a map inside a headless video generator:
1. **Never use standard Leaflet TileLayers**. They will cause blank maps.
2. Generate a single static raster map (PNG) of the bounding box offline.
3. Use **D3.js** (`geoMercator().fitSize()`) to create an SVG that perfectly overlays coordinates onto the static map image.
4. Animate the camera by using GSAP to move the outer container (`x`, `y`, `scale`) relative to the screen center. Because the background is a single local image and markers are SVG elements, the rendering will be 100% synchronous, perfectly aligned, and artifact-free.
