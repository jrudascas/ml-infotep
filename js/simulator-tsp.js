/**
 * ==========================================================================
 * SIMULADOR DEL PROBLEMA DEL VIAJANTE (TSP - Traveling Salesperson)
 * ==========================================================================
 */

class TSPSimulator {
    constructor() {
        this.cities = [];
        this.ga = null;
        
        // Referencia al Canvas
        this.canvas = document.getElementById("tspCanvas");
        this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
        
        // Registrar evento de clic en el canvas para agregar ciudades
        if (this.canvas) {
            this.canvas.addEventListener("mousedown", (e) => this.handleCanvasClick(e));
        }
    }

    /**
     * Inicializa las ciudades de forma aleatoria o conserva las existentes.
     * @param {number} numCities - Cantidad de ciudades a generar.
     */
    generateRandomCities(numCities) {
        this.cities = [];
        const w = this.canvas ? this.canvas.width : 700;
        const h = this.canvas ? this.canvas.height : 420;
        
        // Margen para evitar colocar ciudades pegadas al borde
        const margin = 40;
        
        for (let i = 0; i < numCities; i++) {
            this.cities.push({
                x: margin + Math.random() * (w - margin * 2),
                y: margin + Math.random() * (h - margin * 2)
            });
        }
    }

    /**
     * Inicializa el simulador y el Algoritmo Genético.
     */
    init(options = {}) {
        const numCities = options.numCities || 20;
        
        // Generar ciudades solo si no existen o si cambió la cantidad pedida
        if (this.cities.length === 0 || this.cities.length !== numCities) {
            this.generateRandomCities(numCities);
        }

        // Instanciar el AG para el problema TSP
        this.ga = new GeneticAlgorithm({
            populationSize: options.populationSize || 150,
            mutationRate: options.mutationRate || 0.02,
            crossoverRate: options.crossoverRate || 0.8,
            selectionMethod: options.selectionMethod || 'tournament',
            chromosomeLength: this.cities.length,
            
            // Generador base secuencial (se barajará inmediatamente)
            geneGeneratorFn: (index) => {
                return index;
            },
            
            // Función de aptitud (fitness): Inversa de la distancia total del camino.
            // A menor distancia, mayor aptitud.
            fitnessFn: (route) => {
                const dist = this.calculateRouteDistance(route);
                // Evitamos división por cero y escalamos
                return dist === 0 ? 0 : 100000 / dist;
            },
            
            // Cruce Ordenado (Ordered Crossover - OX) para permutaciones válidas
            crossoverFn: (parentA, parentB) => {
                const len = parentA.length;
                const childA = new Array(len).fill(-1);
                const childB = new Array(len).fill(-1);

                // Escoger dos puntos de corte aleatorios
                let cut1 = Math.floor(Math.random() * len);
                let cut2 = Math.floor(Math.random() * len);
                if (cut1 > cut2) {
                    const temp = cut1;
                    cut1 = cut2;
                    cut2 = temp;
                }

                // Copiar segmento del padre A al hijo A
                for (let i = cut1; i <= cut2; i++) {
                    childA[i] = parentA[i];
                }

                // Llenar el resto del hijo A usando elementos del padre B en orden circular
                let currentPos = (cut2 + 1) % len;
                for (let i = 0; i < len; i++) {
                    const candidateCity = parentB[(cut2 + 1 + i) % len];
                    if (!childA.includes(candidateCity)) {
                        childA[currentPos] = candidateCity;
                        currentPos = (currentPos + 1) % len;
                    }
                }

                // Copiar segmento del padre B al hijo B
                for (let i = cut1; i <= cut2; i++) {
                    childB[i] = parentB[i];
                }

                // Llenar el resto del hijo B usando elementos del padre A en orden circular
                currentPos = (cut2 + 1) % len;
                for (let i = 0; i < len; i++) {
                    const candidateCity = parentA[(cut2 + 1 + i) % len];
                    if (!childB.includes(candidateCity)) {
                        childB[currentPos] = candidateCity;
                        currentPos = (currentPos + 1) % len;
                    }
                }

                return [childA, childB];
            },
            
            // Mutación por intercambio (Swap Mutation)
            mutateFn: (route, rate) => {
                const mutated = [...route];
                const len = mutated.length;

                for (let i = 0; i < len; i++) {
                    if (Math.random() < rate) {
                        // Escoger otro índice aleatorio para intercambiar
                        const j = Math.floor(Math.random() * len);
                        const temp = mutated[i];
                        mutated[i] = mutated[j];
                        mutated[j] = temp;
                    }
                }
                return mutated;
            }
        });

        // 1. Inicializar población base (secuencial [0,1,2,3...])
        this.ga.initPopulation();

        // 2. Barajar los genes de toda la población inicial para tener diversidad
        for (let ind of this.ga.population) {
            ind.genes = this.shuffle([...ind.genes]);
        }

        // 3. Evaluar la población barajada
        this.ga.evaluatePopulation();

        // Dibujar el estado inicial
        this.render();
    }

    /**
     * Baraja un array de forma aleatoria (Fisher-Yates Shuffle).
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /**
     * Calcula la distancia euclidiana total de una ruta circular de ciudades.
     */
    calculateRouteDistance(route) {
        if (!route || route.length < 2) return 0;
        let total = 0;

        for (let i = 0; i < route.length; i++) {
            const cityA = this.cities[route[i]];
            const cityB = this.cities[route[(i + 1) % route.length]]; // Circular
            
            const dx = cityA.x - cityB.x;
            const dy = cityA.y - cityB.y;
            total += Math.sqrt(dx * dx + dy * dy);
        }

        return total;
    }

    /**
     * Maneja los clics en el canvas para agregar ciudades interactivamente.
     */
    handleCanvasClick(e) {
        if (!this.canvas) return;
        
        // Obtener coordenadas relativas al lienzo
        const rect = this.canvas.getBoundingClientRect();
        
        // Corregir escalado si el canvas tiene CSS width: 100%
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        // Añadir nueva ciudad
        this.cities.push({ x: mouseX, y: mouseY });

        // Actualizar el control del slider del DOM del número de ciudades para reflejar la realidad
        const sliderCities = document.getElementById("slider-cities");
        const valCities = document.getElementById("val-cities");
        if (sliderCities) {
            sliderCities.value = this.cities.length;
            if (valCities) valCities.textContent = this.cities.length;
        }

        // Reiniciar la simulación con la nueva ciudad añadida
        // Obtenemos los parámetros actuales de los sliders
        const popSize = parseInt(document.getElementById("slider-pop-size").value);
        const mutationRate = parseFloat(document.getElementById("slider-mutation").value) / 100;
        const crossoverRate = parseInt(document.getElementById("slider-crossover").value) / 100;
        const selectionMethod = document.getElementById("select-selection").value;

        // Si la simulación estaba corriendo, notificar a la app principal para detener o reiniciar
        if (window.app) {
            window.app.resetSimulatorWithParams();
        } else {
            this.init({
                numCities: this.cities.length,
                populationSize: popSize,
                mutationRate: mutationRate,
                crossoverRate: crossoverRate,
                selectionMethod: selectionMethod
            });
        }
    }

    /**
     * Limpia todas las ciudades actuales para permitir dibujar de cero.
     */
    clearCities() {
        this.cities = [];
        this.render();
    }

    /**
     * Avanza una generación.
     */
    step() {
        if (!this.ga || this.cities.length < 2) return;
        this.ga.step();
        this.render();
    }

    /**
     * Comprueba si terminó (en TSP no hay un final estricto, sino que sigue optimizando, 
     * pero podemos retornar false o considerar convergencia si no hay cambios en 200 gen).
     */
    isFinished() {
        return false;
    }

    /**
     * Renderiza las ciudades y el mejor camino en el canvas.
     */
    render() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Limpiar lienzo negro profundo
        ctx.fillStyle = "#020305";
        ctx.fillRect(0, 0, w, h);

        // Si no hay ciudades, mostrar texto explicativo
        if (this.cities.length === 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "16px Outfit, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Haz clic en esta pantalla para colocar tus ciudades de destino...", w / 2, h / 2);
            
            document.getElementById("lab-stat-gen").textContent = "0";
            document.getElementById("lab-stat-best-fit").textContent = "0%";
            document.getElementById("lab-stat-avg-fit").textContent = "0%";
            document.getElementById("lab-tsp-best-dist").textContent = "0.0px";
            return;
        }

        // Actualizar estadísticas de texto en el DOM
        if (this.ga && this.ga.bestIndividual) {
            document.getElementById("lab-stat-gen").textContent = this.ga.generation;
            
            // La aptitud bruta del mejor camino (distancia inversa)
            const bestDist = this.calculateRouteDistance(this.ga.bestIndividual.genes);
            document.getElementById("lab-tsp-best-dist").textContent = `${bestDist.toFixed(1)}px`;
            
            // Mapear aptitud relativa en la barra (podemos escalarlo de forma representativa)
            document.getElementById("lab-stat-best-fit").textContent = `${(100000 / bestDist).toFixed(0)} pts`;
            
            // Aptitud promedio
            let avgDistSum = 0;
            for (let ind of this.ga.population) {
                avgDistSum += this.calculateRouteDistance(ind.genes);
            }
            const avgDist = avgDistSum / this.ga.populationSize;
            document.getElementById("lab-stat-avg-fit").textContent = `${(100000 / avgDist).toFixed(0)} pts`;

            // 1. Dibujar el MEJOR CAMINO (Línea Neón Rosa Brillante)
            const route = this.ga.bestIndividual.genes;
            ctx.beginPath();
            ctx.moveTo(this.cities[route[0]].x, this.cities[route[0]].y);
            
            for (let i = 1; i < route.length; i++) {
                ctx.lineTo(this.cities[route[i]].x, this.cities[route[i]].y);
            }
            ctx.closePath(); // Circular
            
            // Sombra neón brillante
            ctx.shadowColor = "#ec4899";
            ctx.shadowBlur = 12;
            ctx.strokeStyle = "#ec4899";
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Reset de sombra para optimizar velocidad de dibujado del resto
            ctx.shadowBlur = 0;
        }

        // 2. Dibujar las ciudades (Círculos brillantes morados/cian)
        this.cities.forEach((city, index) => {
            // Dibujar halo exterior
            ctx.beginPath();
            ctx.arc(city.x, city.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(139, 92, 246, 0.25)";
            ctx.fill();

            // Dibujar centro sólido
            ctx.beginPath();
            ctx.arc(city.x, city.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = index === 0 ? "#10b981" : "#06b6d4"; // Ciudad de origen en Verde, el resto en Cian
            ctx.fill();

            // Dibujar borde del círculo central
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Si el total de ciudades es bajo, numerarlas
            if (this.cities.length <= 25) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.font = "9px Fira Code";
                ctx.textAlign = "center";
                ctx.fillText(index.toString(), city.x, city.y - 12);
            }
        });
    }
}
