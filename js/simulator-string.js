/**
 * ==========================================================================
 * SIMULADOR DE TEXTO (String Matcher / Mono Infinito)
 * ==========================================================================
 */

class StringSimulator {
    constructor() {
        this.targetString = "ALGORITMO GENETICO";
        this.possibleGenes = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ ";
        this.ga = null;
        
        // Referencias al DOM
        this.bestIndividualEl = document.getElementById("lab-string-best-individual");
        this.popListEl = document.getElementById("lab-string-pop-list");
        this.chartCanvas = document.getElementById("fitnessChart");
        this.chartCtx = this.chartCanvas ? this.chartCanvas.getContext("2d") : null;
    }

    /**
     * Inicializa el simulador con los parámetros de la interfaz.
     */
    init(options = {}) {
        this.targetString = (options.targetString || "ALGORITMO GENETICO").toUpperCase();
        
        // Instanciar el AG
        this.ga = new GeneticAlgorithm({
            populationSize: options.populationSize || 150,
            mutationRate: options.mutationRate || 0.01,
            crossoverRate: options.crossoverRate || 0.8,
            selectionMethod: options.selectionMethod || 'tournament',
            chromosomeLength: this.targetString.length,
            
            // Generador de genes (un carácter aleatorio de nuestra bolsa)
            geneGeneratorFn: () => {
                return this.possibleGenes[Math.floor(Math.random() * this.possibleGenes.length)];
            },
            
            // Función de evaluación de aptitud (fitness)
            fitnessFn: (genes) => {
                let matches = 0;
                for (let i = 0; i < this.targetString.length; i++) {
                    if (genes[i] === this.targetString[i]) {
                        matches++;
                    }
                }
                // Escalar de 0.0 a 1.0. Podemos usar una escala exponencial (ej. al cuadrado) para acelerar la convergencia
                return Math.pow(matches / this.targetString.length, 2);
            },
            
            // Crossover monopunto
            crossoverFn: (parentA, parentB) => {
                const splitIndex = Math.floor(Math.random() * parentA.length);
                const childA = parentA.substring(0, splitIndex) + parentB.substring(splitIndex);
                const childB = parentB.substring(0, splitIndex) + parentA.substring(splitIndex);
                return [childA, childB];
            },
            
            // Mutación por caracter
            mutateFn: (genes, rate) => {
                let mutated = "";
                for (let i = 0; i < genes.length; i++) {
                    if (Math.random() < rate) {
                        mutated += this.possibleGenes[Math.floor(Math.random() * this.possibleGenes.length)];
                    } else {
                        mutated += genes[i];
                    }
                }
                return mutated;
            }
        });

        this.ga.initPopulation();
        this.resizeChartCanvas();
        this.drawChart();
    }

    /**
     * Ejecuta una generación.
     */
    step() {
        if (!this.ga) return;
        this.ga.step();
        this.render();
    }

    /**
     * Comprueba si el algoritmo ha convergido (mejor aptitud = 100%).
     */
    isFinished() {
        if (!this.ga || !this.ga.bestIndividual) return false;
        // Para comprobar coincidencia exacta, los genes del mejor individuo deben ser iguales a la frase objetivo
        return this.ga.bestIndividual.genes === this.targetString;
    }

    /**
     * Dibuja los cambios en la UI.
     */
    render() {
        if (!this.ga) return;

        // Actualizar estadísticas básicas
        document.getElementById("lab-stat-gen").textContent = this.ga.generation;
        
        // La aptitud en porcentaje real es la raíz del fitness guardado (ya que lo elevamos al cuadrado)
        const bestRealFit = Math.sqrt(this.ga.bestIndividual.fitness) * 100;
        document.getElementById("lab-stat-best-fit").textContent = `${bestRealFit.toFixed(1)}%`;
        
        let avgRealSum = 0;
        for (let ind of this.ga.population) {
            avgRealSum += Math.sqrt(ind.fitness);
        }
        const avgRealFit = (avgRealSum / this.ga.populationSize) * 100;
        document.getElementById("lab-stat-avg-fit").textContent = `${avgRealFit.toFixed(1)}%`;

        // Renderizar el mejor individuo con resaltado de aciertos
        if (this.bestIndividualEl) {
            let htmlMarkup = "";
            const bestGenes = this.ga.bestIndividual.genes;
            for (let i = 0; i < this.targetString.length; i++) {
                if (bestGenes[i] === this.targetString[i]) {
                    htmlMarkup += `<span class="text-green">${bestGenes[i]}</span>`;
                } else {
                    htmlMarkup += `<span class="text-muted">${bestGenes[i] === " " ? "_" : bestGenes[i]}</span>`;
                }
            }
            this.bestIndividualEl.innerHTML = htmlMarkup;
        }

        // Renderizar Top 8 individuos en la lista
        if (this.popListEl) {
            // Ordenar una copia de la población de mayor a menor fitness
            const sortedPop = [...this.ga.population]
                .sort((a, b) => b.fitness - a.fitness)
                .slice(0, 8);

            this.popListEl.innerHTML = sortedPop.map((ind, idx) => {
                const fitPercent = Math.sqrt(ind.fitness) * 100;
                // Escapar espacios en el display
                const displayDna = ind.genes.replace(/ /g, "_");
                return `
                    <div class="pop-item">
                        <span class="pop-item-dna">#${idx + 1} ${displayDna}</span>
                        <span class="pop-item-fit">${fitPercent.toFixed(0)}%</span>
                    </div>
                `;
            }).join("");
        }

        // Redibujar gráfico histórico
        this.drawChart();
    }

    /**
     * Ajusta el Canvas del gráfico al tamaño real disponible.
     */
    resizeChartCanvas() {
        if (!this.chartCanvas) return;
        const rect = this.chartCanvas.parentElement.getBoundingClientRect();
        this.chartCanvas.width = rect.width;
        this.chartCanvas.height = Math.max(180, rect.height);
    }

    /**
     * Dibuja un gráfico de líneas personalizado con la evolución del fitness.
     */
    drawChart() {
        if (!this.chartCtx || !this.ga) return;
        const ctx = this.chartCtx;
        const w = this.chartCanvas.width;
        const h = this.chartCanvas.height;
        const history = this.ga.history;

        // Limpiar lienzo
        ctx.clearRect(0, 0, w, h);

        // Dibujar cuadricula de fondo sutil
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            const y = h - (h / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
            
            // Etiquetas de porcentaje
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.font = "9px Fira Code";
            ctx.fillText(`${i * 25}%`, 5, y - 5);
        }

        if (history.length < 2) return;

        const maxGen = history.length - 1;

        // Función para mapear una coordenada (generación, fitness) a píxeles
        const getX = (gen) => (gen / maxGen) * (w - 20) + 10;
        const getY = (fit) => h - (Math.sqrt(fit) * (h - 20) + 10); // Escalado por raíz cuadrada para mapear porcentaje lineal

        // 1. Dibujar área rellena bajo la curva del promedio (Fitness Promedio)
        ctx.beginPath();
        ctx.moveTo(getX(0), h);
        for (let i = 0; i < history.length; i++) {
            ctx.lineTo(getX(i), getY(history[i].avgFitness));
        }
        ctx.lineTo(getX(maxGen), h);
        ctx.closePath();
        
        let gradAvg = ctx.createLinearGradient(0, 0, 0, h);
        gradAvg.addColorStop(0, "rgba(6, 182, 212, 0.15)");
        gradAvg.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.fillStyle = gradAvg;
        ctx.fill();

        // Dibujar línea del promedio
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(history[0].avgFitness));
        for (let i = 1; i < history.length; i++) {
            ctx.lineTo(getX(i), getY(history[i].avgFitness));
        }
        ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 2. Dibujar línea del mejor fitness (Máximo)
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(history[0].bestFitness));
        for (let i = 1; i < history.length; i++) {
            ctx.lineTo(getX(i), getY(history[i].bestFitness));
        }
        ctx.strokeStyle = "rgba(16, 185, 129, 0.9)";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
