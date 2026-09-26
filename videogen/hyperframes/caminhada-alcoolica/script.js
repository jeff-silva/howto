        window.__timelines = window.__timelines || {};
        const mainTl = gsap.timeline({ paused: true });

        // ==========================================
        const bgContainer = document.getElementById("bg_particles");
        
        // Criamos um contêiner que o GSAP vai mover para simular a câmera
        bgContainer.innerHTML = `
            <div id="map_wrapper" class="absolute left-0 top-0 origin-top-left"></div>
            <!-- Overlay bem suave só pra dar um clima, sem escurecer o mapa -->
            <div class="absolute inset-0 z-10 opacity-30 mix-blend-color pointer-events-none" style="background: linear-gradient(135deg, #F79F1F, #000000, #F79F1F);"></div>
        `; 
        bgContainer.className = "absolute inset-0 z-0 pointer-events-none bg-neutral-900 overflow-hidden";
        
        const mapWrapper = document.getElementById("map_wrapper");

        // Dimensões exatas da imagem gerada (assets/map_bg.png) no zoom 19
        const imgW = 3328;
        const imgH = 3840;

        // Bounding box geográfico exato da imagem
        const imgWest = -43.94256591796875;
        const imgEast = -43.93363952636719;
        const imgNorth = -19.796425363822536;
        const imgSouth = -19.806116059729394;

        // Criamos a projeção D3 encaixada perfeitamente na imagem!
        const imageFeature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [imgWest, imgNorth],
                    [imgEast, imgNorth],
                    [imgEast, imgSouth],
                    [imgWest, imgSouth],
                    [imgWest, imgNorth]
                ]]
            }
        };

        const projection = d3.geoMercator().fitSize([imgW, imgH], imageFeature);
        const geoPath = d3.geoPath().projection(projection);

        // Cria o SVG principal do mapa
        const svg = d3.select("#map_wrapper").append("svg")
            .attr("width", imgW)
            .attr("height", imgH)
            .style("position", "absolute");

        // Adiciona a imagem de fundo perfeita (Sem Leaflet, sem 404s!)
        svg.append("image")
            .attr("href", "assets/map_bg.png")
            .attr("width", imgW)
            .attr("height", imgH);

        // ==========================================
        // Rota da Caminhada Alcoólica (Carregada Off-line)
        // ==========================================
        if (window.ROUTE_GEOMETRY && window.ROUTE_GEOMETRY.type === 'FeatureCollection') {
            const features = window.ROUTE_GEOMETRY.features;
            
            // Filtra os pontos
            const routePoints = features.filter(f => f.geometry && f.geometry.type === 'Point');
            
            // O caminho (LineString) é montado conectando os pontos
            const pathCoords = routePoints.map(f => f.geometry.coordinates); // [lon, lat]

            // Linha animada do caminho
            const pathGroup = svg.append("g");
            
            // A linha amarela pontilhada (inicialmente vazia, preenchida no onUpdate)
            const routePath = pathGroup.append("path")
                .attr("fill", "none")
                .attr("stroke", "#ffcc00")
                .attr("stroke-width", 15) // Fica mais grosso por causa do scale da câmera depois
                .attr("stroke-opacity", 0.65)
                .attr("stroke-dasharray", "20, 20")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round");

            // Filtra paradas com label para colocar a caneca
            const waypointsData = routePoints.filter(f => f.properties && f.properties.label);
            
            waypointsData.forEach((wp, i) => {
                const [lon, lat] = wp.geometry.coordinates;
                const [px, py] = projection([lon, lat]);

                // Caneca de Cerveja
                const g = svg.append("g")
                    .attr("transform", `translate(${px}, ${py})`);
                
                // ForeignObject para injetar HTML no SVG
                g.append("foreignObject")
                    .attr("x", -35) // Centro
                    .attr("y", -35)
                    .attr("width", 70)
                    .attr("height", 70)
                    .html(`
                        <div id="beer_icon_${i}" class="w-full h-full flex items-center justify-center drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)] origin-center">
                            <iconify-icon icon="noto:beer-mug" width="70"></iconify-icon>
                        </div>
                    `);

                // Plaquinha
                g.append("foreignObject")
                    .attr("x", -200)
                    .attr("y", -110)
                    .attr("width", 400)
                    .attr("height", 100)
                    .style("overflow", "visible")
                    .html(`
                        <div class="w-full h-full flex items-center justify-center pointer-events-none">
                            <div id="map_label_${i}" class="opacity-0 scale-50 origin-bottom transition-none bg-[#F79F1F] text-black font-sans font-black text-[18px] px-3 py-1 rounded-xl whitespace-nowrap shadow-[2px_2px_0_rgba(0,0,0,1)] border-[3px] border-black tracking-wide">
                                ${wp.properties.label}
                            </div>
                        </div>
                    `);
            });

            // Lógica de Movimento de Câmera (GSAP)
            const camProxy = { progress: 0 };
            
            let totalDist = 0;
            const segmentDistances = [];
            for (let i = 0; i < pathCoords.length - 1; i++) {
                const p1 = pathCoords[i]; // [lon, lat]
                const p2 = pathCoords[i+1];
                const dist = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
                segmentDistances.push(dist);
                totalDist += dist;
            }

            const TEMPO_PERCURSO = 72;
            const CAMERA_SCALE = 3.5; // Aproximadamente o zoom 21 (imagem original é zoom 19, 19 -> 21 é 4x, 3.5 é bom)

            // Posiciona no ponto inicial antes da animação começar
            const [startX, startY] = projection(pathCoords[0]);
            mainTl.set(mapWrapper, {
                x: 540 - startX * CAMERA_SCALE,
                y: 960 - startY * CAMERA_SCALE + 350, // Offset Y para centralizar o marcador mais pra baixo
                scale: CAMERA_SCALE
            }, 0);

            mainTl.to(camProxy, {
                progress: 1,
                duration: TEMPO_PERCURSO,
                ease: "none",
                onUpdate: function() {
                    if (totalDist === 0) return;
                    
                    const targetDistance = camProxy.progress * totalDist;
                    
                    let currentDist = 0;
                    let segmentIndex = 0;
                    
                    for (let i = 0; i < segmentDistances.length; i++) {
                        if (currentDist + segmentDistances[i] >= targetDistance) {
                            segmentIndex = i;
                            break;
                        }
                        currentDist += segmentDistances[i];
                    }
                    
                    if (segmentIndex >= pathCoords.length - 1) segmentIndex = pathCoords.length - 2;
                    
                    const distInSegment = targetDistance - currentDist;
                    const weight = segmentDistances[segmentIndex] === 0 ? 0 : distInSegment / segmentDistances[segmentIndex];
                    
                    const lon1 = pathCoords[segmentIndex][0];
                    const lat1 = pathCoords[segmentIndex][1];
                    const lon2 = pathCoords[segmentIndex + 1][0];
                    const lat2 = pathCoords[segmentIndex + 1][1];
                    
                    const currentLon = lon1 + (lon2 - lon1) * weight;
                    const currentLat = lat1 + (lat2 - lat1) * weight;
                    
                    // 1. Atualiza a Câmera
                    const [px, py] = projection([currentLon, currentLat]);
                    gsap.set(mapWrapper, {
                        x: 540 - px * CAMERA_SCALE,
                        y: 960 - py * CAMERA_SCALE + 350 // Offset Y da plaquinha
                    });

                    // 2. Desenha a linha até o ponto atual
                    const pointsSoFar = pathCoords.slice(0, segmentIndex + 1);
                    pointsSoFar.push([currentLon, currentLat]);
                    
                    const lineGenerator = d3.line()
                        .x(d => projection(d)[0])
                        .y(d => projection(d)[1]);
                        
                    routePath.attr("d", lineGenerator(pointsSoFar));

                    // 3. Plaquinhas
                    waypointsData.forEach((wp, i) => {
                        if (!wp._revealed) {
                            const [wLon, wLat] = wp.geometry.coordinates;
                            const dist = Math.sqrt(Math.pow(currentLat - wLat, 2) + Math.pow(currentLon - wLon, 2));
                            
                            if (dist < 0.0008) {
                                wp._revealed = true;
                                const labelDiv = document.getElementById(`map_label_${i}`);
                                if (labelDiv) gsap.to(labelDiv, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" });
                            }
                        }
                    });
                }
            }, 11);

            mainTl.to("#red_curtain", { opacity: 0, duration: 1, ease: "none" }, 9);
            mainTl.to("#root", { opacity: 0, duration: 1, ease: "none" }, 87);

            mainTl.to({}, {
                duration: 90,
                ease: "none",
                onUpdate: function() {
                    const time = this.ratio * 90; 

                    const redCurtain = document.getElementById("red_curtain");
                    if (redCurtain && time <= 11) { 
                        const shift = time * 80; 
                        redCurtain.style.backgroundImage = `repeating-radial-gradient(circle at 50% 50%, transparent calc(0px + ${shift}px), transparent calc(15px + ${shift}px), #b71c1c calc(15px + ${shift}px), #b71c1c calc(55px + ${shift}px))`;
                    }

                    // Anima o tracejado SVG
                    const offset = time * -20; 
                    routePath.attr("stroke-dashoffset", offset);
                    
                    const scale = 1.0 + Math.sin(time * Math.PI * 1.5) * 0.05 + 0.05;
                    waypointsData.forEach((wp, i) => {
                        const beerDiv = document.getElementById(`beer_icon_${i}`);
                        if (beerDiv) beerDiv.style.transform = `scale(${scale})`;
                    });
                }
            }, 0);
        }

        // ==========================================
        // Renderização Simples usando AUDIO_CHUNKS
        // ==========================================
        if (typeof window.AUDIO_CHUNKS !== 'undefined') {
            const containerSlot = document.getElementById("captions_container");
            const chunks = window.AUDIO_CHUNKS;

            chunks.forEach((chunk, chunkIdx) => {
                if (chunk.length === 0) return;
                
                const container = document.createElement("div");
                container.id = `cap_${chunkIdx}`;
                container.className = "absolute top-[12%] w-[900px] flex flex-wrap justify-center gap-x-5 gap-y-3 z-50 text-[55px] font-bold uppercase text-white [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,5px_5px_0_#F79F1F] leading-tight left-1/2 -translate-x-1/2 opacity-0";
                containerSlot.appendChild(container);
                
                const start = chunk[0].start;
                const nextChunk = chunks[chunkIdx + 1];
                const end = (nextChunk && nextChunk.length > 0) ? nextChunk[0].start - 0.05 : chunk[chunk.length - 1].end + 0.5;

                mainTl.set(container, { opacity: 1 }, start);

                if (chunkIdx === 0) {
                    const mega = document.createElement("div");
                    mega.innerHTML = "📣";
                    mega.className = "absolute top-[35%] left-1/2 -translate-x-1/2 text-[300px] z-[45] opacity-0 origin-center drop-shadow-2xl";
                    document.getElementById("root").appendChild(mega);
                    
                    mainTl.set(mega, { opacity: 1, scale: 0 }, start);
                    mainTl.to(mega, { scale: 1.2, duration: 0.4, ease: "elastic.out(1, 0.5)" }, start);
                    mainTl.to(mega, { rotation: 15, duration: 0.08, yoyo: true, repeat: 7 }, start + 0.4);
                    mainTl.to(mega, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.in" }, end - 0.2);
                }

                if (chunkIdx === 1) {
                    const cal = document.createElement("div");
                    cal.className = "absolute top-[25%] left-1/2 -translate-x-1/2 w-[700px] bg-white rounded-2xl flex flex-col overflow-hidden shadow-[40px_40px_0px_rgba(0,0,0,0.4)] z-[45] opacity-0 font-sans text-center border-4 border-white ring-1 ring-black/5";
                    cal.innerHTML = `
                        <div class="w-full bg-[#F79F1F] text-white font-black text-[60px] py-6 uppercase tracking-widest relative z-10 [text-shadow:4px_4px_0_rgba(0,0,0,0.2)]">Novembro 2026</div>
                        <div class="w-full bg-white p-8 pt-10 font-sans font-bold text-[45px] text-neutral-800">
                            <div class="grid grid-cols-7 text-neutral-400 mb-8 text-[30px] tracking-wide">
                                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                            </div>
                            <div class="grid grid-cols-7 gap-y-8 items-center justify-items-center">
                                <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
                                <div>8</div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div>
                                <div class="relative flex items-center justify-center w-[85px] h-[85px] scale-110 -rotate-3"><div class="absolute inset-0 bg-[#F79F1F] rounded-2xl animate-ping opacity-60"></div><div class="relative w-full h-full bg-[#F79F1F] text-black rounded-2xl flex items-center justify-center shadow-lg z-10">15</div></div><div>16</div><div>17</div><div>18</div><div>19</div><div>20</div><div>21</div>
                                <div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div>
                                <div>29</div><div>30</div><div></div><div></div><div></div><div></div><div></div>
                            </div>
                        </div>
                    `;
                    // Vamos dar um transform style para ele poder flipar em 3D bonito
                    cal.style.transformStyle = "preserve-3d";
                    document.getElementById("root").appendChild(cal);
                    
                    // O calendário vai durar até o final da frase seguinte ("já tem programa certo") que é o chunk 2
                    const chunk2 = chunks[2];
                    const outTime = chunk2[chunk2.length - 1].end;

                    // Animação: Entra flipando em 3D
                    mainTl.set(cal, { opacity: 1, scale: 0.5, rotationY: -90, transformPerspective: 1000 }, start);
                    mainTl.to(cal, { scale: 1, rotationY: 0, duration: 0.6, ease: "back.out(1.5)" }, start);
                    
                    // Levita durante toda a duração da frase inteira
                    mainTl.to(cal, { y: -30, duration: 1, yoyo: true, repeat: 7, ease: "sine.inOut" }, start + 0.6);
                    
                    // Sai exatamente quando termina de falar "certo" (no outTime)
                    mainTl.to(cal, { scale: 0, opacity: 0, rotationY: 90, duration: 0.3, ease: "power3.in" }, outTime - 0.2);
                }

                chunk.forEach((w) => {
                    const span = document.createElement("span");
                    span.innerHTML = w.word + "&nbsp;";
                    span.className = "inline-block origin-bottom";
                    container.appendChild(span);
                    
                    // A palavra ativa acende em Laranja
                    mainTl.to(span, { 
                        color: "#F79F1F", 
                        duration: 0.1 
                    }, w.start);
                });
                
                mainTl.set(container, { opacity: 0 }, end);
            });

            // ==========================================
            // Lógica de Animação das Logos e Imagens Destaque
            // ==========================================
            const logosContainer = document.getElementById("logos_container");
            const LOGOS = [
                // Imagem de destaque centralizada (Vem aí a nossa primeira caminhada alcoólica)
                { src: 'caminhada-alcoolica.png', startIdx: 3, endIdx: 4, scale: 1.2, centerX: true, centerY: true, customClass: 'absolute max-w-[800px] max-h-[800px] object-contain opacity-0 rounded-[45px] drop-shadow-[40px_40px_0px_rgba(0,0,0,0.4)] top-1/2 left-1/2' },
                
                // Logos dos Patrocinadores
                { src: 'labscript.dev.png', startIdx: 8, endIdx: 9 },
                { src: 'elocont.jpg', startIdx: 10, endIdx: 11 },
                { src: 'delivery-gordao.png', startIdx: 12, endIdx: 13 },
                { src: 'lava-jato-2d.jpg', startIdx: 14, endIdx: 14 },
                { src: 'emporio-gostionho-da-roca.jpg', startIdx: 15, endIdx: 16, scale: 1.5 },
                { src: 'chicao-gas.jpg', startIdx: 17, endIdx: 17 },
                { src: 'sal-e-mel.jpg', startIdx: 18, endIdx: 19 },
                { src: 'hebron.jpg', startIdx: 20, endIdx: 21 },
                { src: 'di-afro-style.jpg', startIdx: 22, endIdx: 24 },
                { src: 'dit.jpg', startIdx: 25, endIdx: 26 },
                { src: 'bar-do-joao.jpg', startIdx: 27, endIdx: 28, scale: 1.7 },
                { src: 'ponto-do-peixe.jpg', startIdx: 29, endIdx: 29 },
                { src: 'to-a-toa.png', startIdx: 30, endIdx: 31 },
                { src: 'adega-jaqueline.png', startIdx: 32, endIdx: 33 },
                { src: 'bar-dirceu-e-as-meninas.jpg', startIdx: 34, endIdx: 34 },
                { src: 'fala-jaqueline.png', startIdx: 35, endIdx: 35 }
            ];

            LOGOS.forEach((logo, i) => {
                const img = document.createElement("img");
                img.id = `logo_${i}`;
                img.src = `assets/${logo.src}`;
                
                if (logo.customClass) {
                    img.className = logo.customClass;
                } else {
                    // Tamanho ajustado (550px) aproveitando o espaço inferior que o offset liberou
                    img.className = "absolute max-w-[550px] max-h-[550px] object-contain opacity-0 rounded-[35px] drop-shadow-[40px_40px_0px_rgba(0,0,0,0.4)]";
                }
                
                logosContainer.appendChild(img);

                const startChunk = chunks[logo.startIdx];
                const endChunk = chunks[logo.endIdx];
                if (!startChunk || !endChunk || startChunk.length === 0 || endChunk.length === 0) return;

                const startTime = startChunk[0].start;
                let endTime = endChunk[endChunk.length - 1].end;

                // Regra solicitada: deve terminar de sumir pelo menos 200ms ANTES da próxima aparecer
                if (LOGOS[i + 1]) {
                    const nextStartChunk = chunks[LOGOS[i + 1].startIdx];
                    if (nextStartChunk && nextStartChunk.length > 0) {
                        const nextStartTime = nextStartChunk[0].start;
                        // Como a animação de saída dura 0.2s, ela deve começar no máximo em (nextStartTime - 0.4)
                        const maxAllowedEndTime = nextStartTime - 0.4;
                        if (endTime > maxAllowedEndTime) {
                            endTime = maxAllowedEndTime;
                        }
                    }
                } else {
                    endTime += 0.5; // Margem para a última logo
                }

                const finalScale = logo.scale || 1;
                const xP = logo.centerX ? -50 : 0;
                const yP = logo.centerY ? -50 : 0;

                // Animação de entrada: Cubo Mágico 3D (Desembola de todos os eixos)
                mainTl.fromTo(img, 
                    { opacity: 0, scale: 0, rotationX: -180, rotationY: 270, rotationZ: 90, z: -800, transformPerspective: 1200, xPercent: xP, yPercent: yP }, 
                    { opacity: 1, scale: finalScale, rotationX: 0, rotationY: 0, rotationZ: 0, z: 0, xPercent: xP, yPercent: yP, duration: 0.9, ease: "back.out(1.7)" }, 
                startTime);
                
                // Animação de saída: Embola e afunda novamente
                mainTl.to(img, { 
                    opacity: 0, scale: 0.2, rotationX: 180, rotationY: -180, rotationZ: -90, z: -600, xPercent: xP, yPercent: yP,
                    duration: 0.4, ease: "power3.in" 
                }, endTime);
            });

            // Fade out final do vídeo (de 87s a 88s)
            mainTl.to("#fade_to_black", { opacity: 1, duration: 1, ease: "none" }, 87);
        }
        window.__timelines["main"] = mainTl;
