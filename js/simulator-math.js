/**
 * ==========================================================================
 * SIMULADOR 3: MAXIMIZADOR DE FUNCIÓN MATEMÁTICA 2D (GeneTech)
 * ==========================================================================
 * Utiliza un AG de codificación real para encontrar el máximo global de
 * f(x) = x · sin(10π · x) + 2,  x ∈ [−1, 2]
 * Los cromosomas son valores flotantes. Se visualizan sobre la curva real.
 */

class MathWaveSimulator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.ga = null;
        this.generation = 0;
        this._finished = false;

        // Dominio del problema
        this.X_MIN = -1;
        this.X_MAX = 2;

        // Colores de los individuos (gradiente por aptitud)
        this.COLORS_HIGH = '#00ffa3';
        this.COLORS_LOW  = '#ff2d78';

        // Configuración actual
        this.config = {
            populationSize: 80,
            mutationRate: 0.03,
            crossoverRate: 0.8,
            selectionMethod: 'tournament'
        };
    }

    // -----------------------------------------------------------------------
    // La función objetivo
    // -----------------------------------------------------------------------
    f(x) {
        return x * Math.sin(10 * Math.PI * x) + 2;
    }

    // -----------------------------------------------------------------------
    // Inicialización del simulador
    // -----------------------------------------------------------------------
    init(config = {}) {
        this.config = { ...this.config, ...config };
        this.canvas = document.getElementById('mathCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.generation = 0;
        this._finished = false;

        const { populationSize, mutationRate, crossoverRate, selectionMethod } = this.config;
        const self = this;

        this.ga = new GeneticAlgorithm({
            populationSize,
            mutationRate,
            crossoverRate,
            selectionMethod,
            chromosomeLength: 1, // Un solo gen real

            geneGeneratorFn: () => self.X_MIN + Math.random() * (self.X_MAX - self.X_MIN),

            fitnessFn: (genes) => {
                const x = genes[0];
                // Normalizar al rango [0, 1] para el motor GA
                const raw = self.f(x);
                return Math.max(0, raw) / 5.5; // max teórico ≈ 3.85+2 ≈ 5.85
            },

            crossoverFn: (parentA, parentB) => {
                // BLX-α blending crossover para valores reales
                const alpha = 0.3;
                const xA = parentA[0], xB = parentB[0];
                const lo = Math.min(xA, xB) - alpha * Math.abs(xA - xB);
                const hi = Math.max(xA, xB) + alpha * Math.abs(xA - xB);
                const c1 = lo + Math.random() * (hi - lo);
                const c2 = lo + Math.random() * (hi - lo);
                // Clamp al dominio
                return [
                    [Math.max(self.X_MIN, Math.min(self.X_MAX, c1))],
                    [Math.max(self.X_MIN, Math.min(self.X_MAX, c2))]
                ];
            },

            mutateFn: (genes, rate) => {
                const x = genes[0];
                if (Math.random() < rate) {
                    // Mutación gaussiana suave
                    const sigma = 0.05 * (self.X_MAX - self.X_MIN);
                    const mutated = x + (Math.random() * 2 - 1) * sigma * 3;
                    return [Math.max(self.X_MIN, Math.min(self.X_MAX, mutated))];
                }
                return genes;
            }
        });

        this.ga.initPopulation();
        this.render();
        this._updateStats();
    }

    // -----------------------------------------------------------------------
    // Evolucionar un paso
    // -----------------------------------------------------------------------
    step() {
        if (!this.ga || this._finished) return;
        this.ga.step();
        this.generation++;
        this.render();
        this._updateStats();

        // Parar si llevamos 1000 generaciones (convergencia garantizada)
        if (this.generation >= 1000) {
            this._finished = true;
        }
    }

    isFinished() { return this._finished; }

    // -----------------------------------------------------------------------
    // Renderizado del canvas
    // -----------------------------------------------------------------------
    render() {
        if (!this.canvas || !this.ctx) return;

        const W = this.canvas.width;
        const H = this.canvas.height;
        const ctx = this.ctx;

        // --- Limpiar ---
        ctx.clearRect(0, 0, W, H);

        // --- Fondo ---
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#0a0a1a');
        bgGrad.addColorStop(1, '#10102a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // --- Cuadrícula suave ---
        this._drawGrid(ctx, W, H);

        // --- Curva de la función ---
        this._drawFunction(ctx, W, H);

        // --- Partículas (individuos de la población) ---
        if (this.ga) {
            this._drawPopulation(ctx, W, H);
        }

        // --- Eje X y etiquetas ---
        this._drawAxes(ctx, W, H);
    }

    // --- Cuadrícula ---
    _drawGrid(ctx, W, H) {
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += W / 10) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += H / 8) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
    }

    // --- Función f(x) ---
    _drawFunction(ctx, W, H) {
        const Y_MIN = -3, Y_MAX = 4.5;
        const mapX = (x) => ((x - this.X_MIN) / (this.X_MAX - this.X_MIN)) * W;
        const mapY = (y) => H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H;

        ctx.beginPath();
        ctx.lineWidth = 2.5;

        const gradient = ctx.createLinearGradient(0, 0, W, 0);
        gradient.addColorStop(0, '#7b2fff');
        gradient.addColorStop(0.5, '#00c6ff');
        gradient.addColorStop(1, '#00ffa3');
        ctx.strokeStyle = gradient;

        const steps = 600;
        for (let i = 0; i <= steps; i++) {
            const x = this.X_MIN + (i / steps) * (this.X_MAX - this.X_MIN);
            const y = this.f(x);
            const px = mapX(x);
            const py = mapY(y);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Área bajo la curva (sombreado)
        ctx.lineTo(mapX(this.X_MAX), mapY(Y_MIN));
        ctx.lineTo(mapX(this.X_MIN), mapY(Y_MIN));
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 198, 255, 0.06)';
        ctx.fill();
    }

    // --- Puntos (individuos) ---
    _drawPopulation(ctx, W, H) {
        const Y_MIN = -3, Y_MAX = 4.5;
        const mapX = (x) => ((x - this.X_MIN) / (this.X_MAX - this.X_MIN)) * W;
        const mapY = (y) => H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H;

        const sorted = [...this.ga.population].sort((a, b) => a.fitness - b.fitness);
        const total = sorted.length;

        sorted.forEach((ind, i) => {
            const x = ind.genes[0];
            const y = this.f(x);
            const px = mapX(x);
            const py = mapY(y);

            // Color según posición en ranking
            const t = i / (total - 1 || 1);
            const r = Math.round(255 * (1 - t) + 0 * t);
            const g = Math.round(45 * (1 - t) + 255 * t);
            const b = Math.round(120 * (1 - t) + 163 * t);
            const color = `rgba(${r},${g},${b},0.85)`;

            const radius = i === total - 1 ? 8 : 4;

            // Glow para el mejor
            if (i === total - 1) {
                ctx.shadowColor = '#00ffa3';
                ctx.shadowBlur = 16;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            // Línea vertical al eje X (solo el mejor)
            if (i === total - 1) {
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(0,255,163,0.3)';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px, H);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        });

        ctx.shadowBlur = 0;
    }

    // --- Ejes y etiquetas ---
    _drawAxes(ctx, W, H) {
        ctx.fillStyle = 'rgba(180,180,220,0.6)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';

        const labels = [-1, -0.5, 0, 0.5, 1, 1.5, 2];
        labels.forEach(v => {
            const px = ((v - this.X_MIN) / (this.X_MAX - this.X_MIN)) * W;
            ctx.fillText(v.toString(), px, H - 6);
        });

        // Etiqueta de generación
        ctx.textAlign = 'right';
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = 'rgba(200,200,255,0.5)';
        ctx.fillText(`Gen: ${this.generation}`, W - 12, 22);
    }

    // --- Actualizar stats del HUD ---
    _updateStats() {
        if (!this.ga) return;
        const best = this.ga.bestIndividual;
        if (!best) return;

        const bestX = best.genes[0];
        const bestFx = this.f(bestX);

        const elBestX = document.getElementById('lab-math-best-x');
        const elBestFx = document.getElementById('lab-math-best-fx');
        if (elBestX) elBestX.textContent = bestX.toFixed(5);
        if (elBestFx) elBestFx.textContent = bestFx.toFixed(5);
    }
}
