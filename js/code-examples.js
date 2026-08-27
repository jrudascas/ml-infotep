/**
 * ==========================================================================
 * BIBLIOTECA DE CÓDIGO EXPANDIDA — 4 Problemas × 2 Lenguajes (GeneTech)
 * ==========================================================================
 * Problemas: onemax | string | knapsack | tsp
 * Lenguajes: js | python
 */

class CodeExamplesModule {
    constructor() {
        this.currentLang = 'js';
        this.currentProblem = 'onemax';

        // ===================================================================
        // METADATOS DE PROBLEMAS
        // ===================================================================
        this.problems = {
            onemax: {
                title: '📊 OneMax — Maximizar Bits',
                difficulty: 'Introductorio',
                diffClass: 'diff-intro',
                desc: 'El problema OneMax busca el cromosoma binario de longitud N que tenga la máxima cantidad de bits en 1. Es el "Hola Mundo" de los Algoritmos Genéticos: simple, determinista y perfecto para entender los operadores fundamentales.',
                tags: ['Binario', 'Fitness Lineal', 'Convergencia Garantizada']
            },
            string: {
                title: '🔤 Mono Infinito — Texto Objetivo',
                difficulty: 'Intermedio',
                diffClass: 'diff-mid',
                desc: 'Inspirado en el "Teorema del Mono Infinito", el GA debe evolucionar una población de cadenas de caracteres aleatorias hasta que converja en una frase objetivo. Demuestra la extraordinaria potencia de la selección natural dirigida.',
                tags: ['Caracteres ASCII', 'Fitness por Caracteres', 'Espacio de Búsqueda Exponencial']
            },
            knapsack: {
                title: '🎒 Problema de la Mochila 0/1',
                difficulty: 'Intermedio',
                diffClass: 'diff-mid',
                desc: 'Un viajero tiene una mochila con capacidad limitada de peso y N objetos, cada uno con un peso y valor. El GA evoluciona cromosomas binarios que representan qué objetos incluir para maximizar el valor total sin superar la capacidad.',
                tags: ['Optimización Combinatoria', 'Restricciones', 'NP-Difícil']
            },
            tsp: {
                title: '🗺️ TSP — Viajero de Comercio',
                difficulty: 'Avanzado',
                diffClass: 'diff-adv',
                desc: 'El Problema del Viajero de Comercio: dado un conjunto de ciudades, encontrar la ruta más corta que las visite todas y regrese al origen. Uno de los problemas NP-difíciles más famosos de la computación. Requiere codificación de permutaciones.',
                tags: ['Permutación', 'Cruce OX', 'Mutación por Inversión']
            }
        };

        // ===================================================================
        // CÓDIGOS FUENTE
        // ===================================================================
        this.codes = {

            // ----------------------------------------------------------------
            // ONEMAX — JavaScript
            // ----------------------------------------------------------------
            onemax_js: `/**
 * PROBLEMA ONEMAX — JavaScript
 * Objetivo: Encontrar el cromosoma binario con todos sus bits en 1.
 * Fitness: f(x) = Σ xᵢ  (contar cuántos 1s hay)
 * Codificación: Array de bits [0, 1, 0, 1, ...]
 */

const LARGO_GEN  = 20;    // Longitud del cromosoma
const TAM_POB    = 100;   // Tamaño de la población
const TASA_MUT   = 0.02;  // Probabilidad de mutación por bit
const TASA_CRUCE = 0.85;  // Probabilidad de cruce
const MAX_GENS   = 500;   // Generaciones máximas

// ── Generar un cromosoma aleatorio ────────────────────────────────────────
function crearCromosoma() {
    return Array.from({ length: LARGO_GEN }, () => Math.round(Math.random()));
}

// ── Función de Aptitud ────────────────────────────────────────────────────
function fitness(cromosoma) {
    return cromosoma.reduce((s, b) => s + b, 0); // Contar 1s
}

// ── Selección por Torneo (k=3) ────────────────────────────────────────────
function seleccionTorneo(poblacion, fitnesses) {
    let mejorIdx = -1, mejorFit = -Infinity;
    for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * poblacion.length);
        if (fitnesses[idx] > mejorFit) { mejorFit = fitnesses[idx]; mejorIdx = idx; }
    }
    return poblacion[mejorIdx];
}

// ── Cruce Monopunto ───────────────────────────────────────────────────────
function cruzar(a, b) {
    if (Math.random() > TASA_CRUCE) return [a.slice(), b.slice()];
    const pt = 1 + Math.floor(Math.random() * (LARGO_GEN - 1));
    return [
        [...a.slice(0, pt), ...b.slice(pt)],
        [...b.slice(0, pt), ...a.slice(pt)]
    ];
}

// ── Mutación Bit-Flip ─────────────────────────────────────────────────────
function mutar(cromosoma) {
    return cromosoma.map(bit => Math.random() < TASA_MUT ? 1 - bit : bit);
}

// ── Bucle Evolutivo Principal ─────────────────────────────────────────────
function ejecutar() {
    let poblacion = Array.from({ length: TAM_POB }, crearCromosoma);

    for (let gen = 1; gen <= MAX_GENS; gen++) {
        // 1. Evaluar
        const fits = poblacion.map(fitness);

        // 2. Elitismo: preservar el mejor individuo
        const mejorIdx = fits.indexOf(Math.max(...fits));
        const elite    = poblacion[mejorIdx].slice();

        // 3. Reproducción
        const nueva = [elite]; // El élite pasa sin cambios
        while (nueva.length < TAM_POB) {
            const [h1, h2] = cruzar(
                seleccionTorneo(poblacion, fits),
                seleccionTorneo(poblacion, fits)
            );
            nueva.push(mutar(h1), mutar(h2));
        }
        poblacion = nueva.slice(0, TAM_POB);

        // 4. Condición de parada
        const mejorFit = Math.max(...poblacion.map(fitness));
        console.log(\`Gen \${gen}: Mejor Fitness = \${mejorFit}/\${LARGO_GEN}\`);
        if (mejorFit === LARGO_GEN) {
            console.log(\`✅ Solución óptima encontrada en la generación \${gen}!\`);
            break;
        }
    }
}

ejecutar();`,

            // ----------------------------------------------------------------
            // ONEMAX — Python
            // ----------------------------------------------------------------
            onemax_python: `# ============================================================
# PROBLEMA ONEMAX — Python 3
# Objetivo: Encontrar el cromosoma binario con todos sus bits en 1.
# Fitness: f(x) = Σ xᵢ  (contar cuántos 1s hay)
# Codificación: Lista de bits [0, 1, 0, 1, ...]
# ============================================================
import random

LARGO_GEN  = 20   # Longitud del cromosoma
TAM_POB    = 100  # Tamaño de la población
TASA_MUT   = 0.02 # Probabilidad de mutación por bit
TASA_CRUCE = 0.85 # Probabilidad de cruce
MAX_GENS   = 500  # Generaciones máximas

# ── Generar cromosoma aleatorio ──────────────────────────────
def crear_cromosoma():
    return [random.randint(0, 1) for _ in range(LARGO_GEN)]

# ── Función de Aptitud ───────────────────────────────────────
def fitness(cromosoma):
    return sum(cromosoma)  # Contar cuántos 1s tiene

# ── Selección por Torneo (k=3) ───────────────────────────────
def seleccion_torneo(poblacion):
    torneo = random.sample(poblacion, 3)
    return max(torneo, key=fitness)

# ── Cruce Monopunto ──────────────────────────────────────────
def cruzar(a, b):
    if random.random() > TASA_CRUCE:
        return a[:], b[:]
    pt = random.randint(1, LARGO_GEN - 1)
    return a[:pt] + b[pt:], b[:pt] + a[pt:]

# ── Mutación Bit-Flip ────────────────────────────────────────
def mutar(cromosoma):
    return [1 - b if random.random() < TASA_MUT else b
            for b in cromosoma]

# ── Bucle Evolutivo Principal ────────────────────────────────
def ejecutar():
    poblacion = [crear_cromosoma() for _ in range(TAM_POB)]

    for gen in range(1, MAX_GENS + 1):
        # Elitismo: conservar el mejor
        elite = max(poblacion, key=fitness)[:]

        # Reproducción
        nueva = [elite]
        while len(nueva) < TAM_POB:
            h1, h2 = cruzar(
                seleccion_torneo(poblacion),
                seleccion_torneo(poblacion)
            )
            nueva.extend([mutar(h1), mutar(h2)])
        poblacion = nueva[:TAM_POB]

        mejor_fit = max(fitness(c) for c in poblacion)
        print(f"Gen {gen}: Mejor Fitness = {mejor_fit}/{LARGO_GEN}")

        if mejor_fit == LARGO_GEN:
            print(f"✅ Solución óptima en la generación {gen}!")
            break

if __name__ == "__main__":
    ejecutar()`,

            // ----------------------------------------------------------------
            // STRING MATCHER — JavaScript
            // ----------------------------------------------------------------
            string_js: `/**
 * MONO INFINITO (String Matching) — JavaScript
 * Objetivo: Evolucionar la frase "ALGORITMO GENETICO" desde caracteres aleatorios.
 * Fitness: Porcentaje de caracteres en posición correcta.
 * Codificación: Cadena de texto (String de caracteres).
 */

const OBJETIVO    = "ALGORITMO GENETICO";
const BOLSA       = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ ";
const TAM_POB     = 150;
const TASA_MUT    = 0.015;
const TASA_CRUCE  = 0.85;

// ── Utilidades ────────────────────────────────────────────────────────────
const genAleatorio = () => BOLSA[Math.floor(Math.random() * BOLSA.length)];

function crearIndividuo() {
    return Array.from({ length: OBJETIVO.length }, genAleatorio).join('');
}

// ── Función de Aptitud ────────────────────────────────────────────────────
// Eleva al cuadrado para presionar más a los individuos casi perfectos.
function fitness(individuo) {
    let aciertos = 0;
    for (let i = 0; i < OBJETIVO.length; i++) {
        if (individuo[i] === OBJETIVO[i]) aciertos++;
    }
    return Math.pow(aciertos / OBJETIVO.length, 2); // [0, 1]
}

// ── Selección por Ruleta (Proporcional al Fitness) ────────────────────────
function seleccionRuleta(poblacion, fits) {
    const total = fits.reduce((a, b) => a + b, 0);
    let aleatorio = Math.random() * total;
    for (let i = 0; i < poblacion.length; i++) {
        aleatorio -= fits[i];
        if (aleatorio <= 0) return poblacion[i];
    }
    return poblacion[poblacion.length - 1];
}

// ── Cruce Uniforme ────────────────────────────────────────────────────────
// Cada carácter del hijo se toma con 50% de probabilidad de cada padre.
function cruzarUniforme(a, b) {
    if (Math.random() > TASA_CRUCE) return [a, b];
    let h1 = '', h2 = '';
    for (let i = 0; i < a.length; i++) {
        if (Math.random() < 0.5) { h1 += a[i]; h2 += b[i]; }
        else                      { h1 += b[i]; h2 += a[i]; }
    }
    return [h1, h2];
}

// ── Mutación por Sustitución de Carácter ─────────────────────────────────
function mutar(individuo) {
    return individuo.split('').map(c =>
        Math.random() < TASA_MUT ? genAleatorio() : c
    ).join('');
}

// ── Bucle Evolutivo ───────────────────────────────────────────────────────
function ejecutar() {
    let poblacion = Array.from({ length: TAM_POB }, crearIndividuo);
    let generacion = 0;

    while (true) {
        generacion++;
        const fits = poblacion.map(fitness);

        // Buscar la mejor solución actual
        const mejorIdx = fits.indexOf(Math.max(...fits));
        const mejor    = poblacion[mejorIdx];
        const pct      = (Math.sqrt(fits[mejorIdx]) * 100).toFixed(1);

        console.log(\`Gen \${generacion}: "\${mejor}" (\${pct}%)\`);

        if (mejor === OBJETIVO) {
            console.log("🎉 ¡Texto evolucionado correctamente!");
            break;
        }

        // Nueva generación
        const nueva = [mejor]; // Elitismo
        while (nueva.length < TAM_POB) {
            const [h1, h2] = cruzarUniforme(
                seleccionRuleta(poblacion, fits),
                seleccionRuleta(poblacion, fits)
            );
            nueva.push(mutar(h1), mutar(h2));
        }
        poblacion = nueva.slice(0, TAM_POB);

        if (generacion > 10000) { console.log("⏱️ Límite de generaciones alcanzado."); break; }
    }
}

ejecutar();`,

            // ----------------------------------------------------------------
            // STRING MATCHER — Python
            // ----------------------------------------------------------------
            string_python: `# ============================================================
# MONO INFINITO (String Matching) — Python 3
# Objetivo: Evolucionar la frase "ALGORITMO GENETICO".
# Fitness: Porcentaje de caracteres en posición correcta.
# Codificación: Cadena de texto (string de caracteres).
# ============================================================
import random, math

OBJETIVO   = "ALGORITMO GENETICO"
BOLSA      = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ "
TAM_POB    = 150
TASA_MUT   = 0.015
TASA_CRUCE = 0.85

# ── Generar individuo aleatorio ──────────────────────────────
def crear_individuo():
    return "".join(random.choice(BOLSA) for _ in OBJETIVO)

# ── Función de Aptitud ───────────────────────────────────────
def fitness(ind):
    aciertos = sum(1 for a, b in zip(ind, OBJETIVO) if a == b)
    return (aciertos / len(OBJETIVO)) ** 2  # Cuadrática

# ── Selección por Ruleta ─────────────────────────────────────
def seleccion_ruleta(poblacion, fits):
    total = sum(fits)
    valor = random.uniform(0, total)
    acum  = 0
    for ind, f in zip(poblacion, fits):
        acum += f
        if acum >= valor:
            return ind
    return poblacion[-1]

# ── Cruce Uniforme ───────────────────────────────────────────
def cruzar_uniforme(a, b):
    if random.random() > TASA_CRUCE:
        return a, b
    h1 = "".join(ac if random.random() < 0.5 else bc for ac, bc in zip(a, b))
    h2 = "".join(bc if random.random() < 0.5 else ac for ac, bc in zip(a, b))
    return h1, h2

# ── Mutación por Sustitución ─────────────────────────────────
def mutar(ind):
    return "".join(
        random.choice(BOLSA) if random.random() < TASA_MUT else c
        for c in ind
    )

# ── Bucle Evolutivo ──────────────────────────────────────────
def ejecutar():
    poblacion  = [crear_individuo() for _ in range(TAM_POB)]
    generacion = 0

    while True:
        generacion += 1
        fits   = [fitness(ind) for ind in poblacion]
        mejor  = max(poblacion, key=fitness)
        pct    = math.sqrt(fitness(mejor)) * 100

        print(f'Gen {generacion}: "{mejor}" ({pct:.1f}%)')

        if mejor == OBJETIVO:
            print("🎉 ¡Texto evolucionado correctamente!")
            break

        nueva = [mejor]  # Elitismo
        while len(nueva) < TAM_POB:
            h1, h2 = cruzar_uniforme(
                seleccion_ruleta(poblacion, fits),
                seleccion_ruleta(poblacion, fits)
            )
            nueva.extend([mutar(h1), mutar(h2)])
        poblacion = nueva[:TAM_POB]

        if generacion > 10_000:
            print("⏱️ Límite de generaciones alcanzado.")
            break

if __name__ == "__main__":
    ejecutar()`,

            // ----------------------------------------------------------------
            // KNAPSACK — JavaScript
            // ----------------------------------------------------------------
            knapsack_js: `/**
 * PROBLEMA DE LA MOCHILA 0/1 — JavaScript
 * Objetivo: Seleccionar objetos para maximizar valor total sin exceder
 *           la capacidad de peso de la mochila.
 * Codificación: Cromosoma binario [0/1] = excluir/incluir cada objeto.
 * Penalización: Si el peso supera la capacidad, fitness = 0.
 */

// ── Dataset de objetos ────────────────────────────────────────────────────
const OBJETOS = [
    { nombre: "Laptop",     peso: 3,  valor: 10 },
    { nombre: "Cámara",     peso: 1,  valor: 5  },
    { nombre: "Libros",     peso: 4,  valor: 3  },
    { nombre: "Auriculares",peso: 1,  valor: 4  },
    { nombre: "Tablet",     peso: 2,  valor: 7  },
    { nombre: "Linterna",   peso: 1,  valor: 2  },
    { nombre: "Botella",    peso: 2,  valor: 1  },
    { nombre: "Cargador",   peso: 1,  valor: 3  },
    { nombre: "Ropa",       peso: 5,  valor: 2  },
    { nombre: "GPS",        peso: 1,  valor: 6  }
];
const CAPACIDAD = 10; // Capacidad máxima de la mochila (kg)
const TAM_POB   = 80;
const TASA_MUT  = 0.05;
const MAX_GENS  = 300;

// ── Función de Aptitud con Penalización ───────────────────────────────────
function fitness(cromosoma) {
    let pesoTotal  = 0;
    let valorTotal = 0;
    for (let i = 0; i < cromosoma.length; i++) {
        if (cromosoma[i] === 1) {
            pesoTotal  += OBJETOS[i].peso;
            valorTotal += OBJETOS[i].valor;
        }
    }
    // Penalización estricta: si no cabe, fitness = 0
    return pesoTotal <= CAPACIDAD ? valorTotal : 0;
}

// ── Selección por Torneo ──────────────────────────────────────────────────
function torneo(poblacion, k = 3) {
    let mejor = null, mejorFit = -1;
    for (let i = 0; i < k; i++) {
        const c = poblacion[Math.floor(Math.random() * poblacion.length)];
        const f = fitness(c);
        if (f > mejorFit) { mejorFit = f; mejor = c; }
    }
    return mejor;
}

// ── Cruce Monopunto ───────────────────────────────────────────────────────
function cruzar(a, b) {
    const pt = Math.floor(Math.random() * a.length);
    return [
        [...a.slice(0, pt), ...b.slice(pt)],
        [...b.slice(0, pt), ...a.slice(pt)]
    ];
}

// ── Mutación Bit-Flip ─────────────────────────────────────────────────────
function mutar(c) {
    return c.map(bit => Math.random() < TASA_MUT ? 1 - bit : bit);
}

// ── Bucle Evolutivo ───────────────────────────────────────────────────────
function ejecutar() {
    let poblacion = Array.from({ length: TAM_POB }, () =>
        OBJETOS.map(() => Math.round(Math.random()))
    );

    for (let gen = 1; gen <= MAX_GENS; gen++) {
        // Elitismo
        const elite = poblacion.reduce((m, c) =>
            fitness(c) > fitness(m) ? c : m
        );

        const nueva = [elite.slice()];
        while (nueva.length < TAM_POB) {
            const [h1, h2] = cruzar(torneo(poblacion), torneo(poblacion));
            nueva.push(mutar(h1), mutar(h2));
        }
        poblacion = nueva.slice(0, TAM_POB);

        if (gen % 50 === 0 || gen === MAX_GENS) {
            const mejor     = elite;
            const valorMej  = fitness(mejor);
            const pesoMej   = mejor.reduce((s, b, i) => s + b * OBJETOS[i].peso, 0);
            const items     = OBJETOS.filter((_, i) => mejor[i] === 1).map(o => o.nombre);
            console.log(\`Gen \${gen}: Valor=\${valorMej}  Peso=\${pesoMej}kg  Items=[\${items.join(", ")}]\`);
        }
    }
}

ejecutar();`,

            // ----------------------------------------------------------------
            // KNAPSACK — Python
            // ----------------------------------------------------------------
            knapsack_python: `# ============================================================
# PROBLEMA DE LA MOCHILA 0/1 — Python 3
# Objetivo: Seleccionar objetos para maximizar valor total
#           sin exceder la capacidad de peso de la mochila.
# Codificación: Lista binaria [0/1] por cada objeto.
# ============================================================
import random

OBJETOS = [
    {"nombre": "Laptop",      "peso": 3, "valor": 10},
    {"nombre": "Cámara",      "peso": 1, "valor": 5 },
    {"nombre": "Libros",      "peso": 4, "valor": 3 },
    {"nombre": "Auriculares", "peso": 1, "valor": 4 },
    {"nombre": "Tablet",      "peso": 2, "valor": 7 },
    {"nombre": "Linterna",    "peso": 1, "valor": 2 },
    {"nombre": "Botella",     "peso": 2, "valor": 1 },
    {"nombre": "Cargador",    "peso": 1, "valor": 3 },
    {"nombre": "Ropa",        "peso": 5, "valor": 2 },
    {"nombre": "GPS",         "peso": 1, "valor": 6 },
]
CAPACIDAD = 10  # Capacidad máxima (kg)
TAM_POB   = 80
TASA_MUT  = 0.05
MAX_GENS  = 300

# ── Función de Aptitud con Penalización ──────────────────────
def fitness(cromosoma):
    peso  = sum(cromosoma[i] * OBJETOS[i]["peso"]  for i in range(len(OBJETOS)))
    valor = sum(cromosoma[i] * OBJETOS[i]["valor"] for i in range(len(OBJETOS)))
    return valor if peso <= CAPACIDAD else 0  # Penalización estricta

# ── Selección por Torneo ─────────────────────────────────────
def torneo(poblacion, k=3):
    candidatos = random.sample(poblacion, k)
    return max(candidatos, key=fitness)

# ── Cruce Monopunto ──────────────────────────────────────────
def cruzar(a, b):
    pt = random.randint(1, len(a) - 1)
    return a[:pt] + b[pt:], b[:pt] + a[pt:]

# ── Mutación Bit-Flip ────────────────────────────────────────
def mutar(c):
    return [1 - b if random.random() < TASA_MUT else b for b in c]

# ── Bucle Evolutivo ──────────────────────────────────────────
def ejecutar():
    n = len(OBJETOS)
    poblacion = [[random.randint(0, 1) for _ in range(n)]
                 for _ in range(TAM_POB)]

    for gen in range(1, MAX_GENS + 1):
        elite = max(poblacion, key=fitness)

        nueva = [elite[:]]
        while len(nueva) < TAM_POB:
            h1, h2 = cruzar(torneo(poblacion), torneo(poblacion))
            nueva.extend([mutar(h1), mutar(h2)])
        poblacion = nueva[:TAM_POB]

        if gen % 50 == 0 or gen == MAX_GENS:
            mejor  = max(poblacion, key=fitness)
            val    = fitness(mejor)
            peso   = sum(mejor[i] * OBJETOS[i]["peso"] for i in range(n))
            items  = [OBJETOS[i]["nombre"] for i in range(n) if mejor[i] == 1]
            print(f"Gen {gen}: Valor={val}  Peso={peso}kg  Items={items}")

if __name__ == "__main__":
    ejecutar()`,

            // ----------------------------------------------------------------
            // TSP — JavaScript
            // ----------------------------------------------------------------
            tsp_js: `/**
 * PROBLEMA DEL VIAJERO DE COMERCIO (TSP) — JavaScript
 * Objetivo: Encontrar la ruta más corta que visite todas las ciudades
 *           exactamente una vez y regrese al punto de partida.
 * Codificación: Permutación de índices de ciudades [2, 0, 4, 1, 3, ...]
 * Cruce: Order Crossover (OX1) — preserva el orden relativo.
 * Mutación: Swap — intercambia dos ciudades al azar.
 */

// ── Generar ciudades aleatorias ───────────────────────────────────────────
function generarCiudades(n, ancho = 500, alto = 400) {
    return Array.from({ length: n }, (_, i) => ({
        id: i,
        x: Math.random() * ancho,
        y: Math.random() * alto
    }));
}

// ── Distancia Euclidiana ──────────────────────────────────────────────────
function distancia(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

// ── Longitud total de una ruta ────────────────────────────────────────────
function longitudRuta(ruta, ciudades) {
    let total = 0;
    for (let i = 0; i < ruta.length; i++) {
        total += distancia(ciudades[ruta[i]], ciudades[ruta[(i + 1) % ruta.length]]);
    }
    return total;
}

// ── Función de Aptitud: inverso de la distancia ───────────────────────────
function fitness(ruta, ciudades) {
    return 1 / longitudRuta(ruta, ciudades);
}

// ── Cruce OX1 (Order Crossover) ───────────────────────────────────────────
// Preserva un segmento del padre A y completa con el orden del padre B.
function cruzarOX(a, b) {
    const n   = a.length;
    const i1  = Math.floor(Math.random() * n);
    const i2  = Math.floor(Math.random() * n);
    const [lo, hi] = [Math.min(i1, i2), Math.max(i1, i2)];

    const segmento = a.slice(lo, hi + 1);
    const restante = b.filter(city => !segmento.includes(city));
    return [...restante.slice(0, lo), ...segmento, ...restante.slice(lo)];
}

// ── Mutación Swap ─────────────────────────────────────────────────────────
function mutarSwap(ruta, tasaMut) {
    const r = ruta.slice();
    if (Math.random() < tasaMut) {
        const i = Math.floor(Math.random() * r.length);
        const j = Math.floor(Math.random() * r.length);
        [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
}

// ── Selección por Torneo ──────────────────────────────────────────────────
function torneo(poblacion, ciudades, k = 4) {
    let mejor = null, mejorFit = -Infinity;
    for (let i = 0; i < k; i++) {
        const c = poblacion[Math.floor(Math.random() * poblacion.length)];
        const f = fitness(c, ciudades);
        if (f > mejorFit) { mejorFit = f; mejor = c; }
    }
    return mejor;
}

// ── Bucle Evolutivo ───────────────────────────────────────────────────────
function ejecutarTSP(numCiudades = 15, tamPob = 100, maxGens = 1000, tasaMut = 0.08) {
    const ciudades  = generarCiudades(numCiudades);
    const indices   = ciudades.map(c => c.id);

    // Población inicial: permutaciones aleatorias
    let poblacion = Array.from({ length: tamPob }, () => {
        const perm = indices.slice();
        for (let i = perm.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [perm[i], perm[j]] = [perm[j], perm[i]];
        }
        return perm;
    });

    let mejorRuta   = null;
    let mejorDist   = Infinity;

    for (let gen = 1; gen <= maxGens; gen++) {
        // Elitismo: conservar la mejor ruta conocida
        for (const ruta of poblacion) {
            const d = longitudRuta(ruta, ciudades);
            if (d < mejorDist) { mejorDist = d; mejorRuta = ruta.slice(); }
        }

        const nueva = [mejorRuta.slice()]; // Élite
        while (nueva.length < tamPob) {
            const hijo = mutarSwap(
                cruzarOX(torneo(poblacion, ciudades), torneo(poblacion, ciudades)),
                tasaMut
            );
            nueva.push(hijo);
        }
        poblacion = nueva.slice(0, tamPob);

        if (gen % 100 === 0) {
            console.log(\`Gen \${gen}: Distancia mínima = \${mejorDist.toFixed(2)}px\`);
        }
    }

    console.log("🏁 Mejor ruta encontrada:", mejorRuta.join(" → "), "→ 0");
    console.log(\`📏 Distancia total: \${mejorDist.toFixed(2)}px\`);
}

ejecutarTSP();`,

            // ----------------------------------------------------------------
            // TSP — Python
            // ----------------------------------------------------------------
            tsp_python: `# ============================================================
# PROBLEMA DEL VIAJERO DE COMERCIO (TSP) — Python 3
# Objetivo: Encontrar la ruta más corta que visite todas
#           las ciudades y regrese al origen.
# Codificación: Permutación de índices [2, 0, 4, 1, 3...]
# Cruce: Order Crossover (OX1)
# Mutación: Swap de dos ciudades aleatorias
# ============================================================
import random, math

# ── Generar ciudades aleatorias ──────────────────────────────
def generar_ciudades(n, ancho=500, alto=400):
    return [(random.uniform(0, ancho), random.uniform(0, alto))
            for _ in range(n)]

# ── Distancia Euclidiana ─────────────────────────────────────
def distancia(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

# ── Longitud de una ruta ─────────────────────────────────────
def longitud_ruta(ruta, ciudades):
    total = sum(distancia(ciudades[ruta[i]], ciudades[ruta[(i+1) % len(ruta)]])
                for i in range(len(ruta)))
    return total

# ── Función de Aptitud ───────────────────────────────────────
def fitness(ruta, ciudades):
    return 1 / longitud_ruta(ruta, ciudades)

# ── Cruce OX1 (Order Crossover) ──────────────────────────────
def cruzar_ox(a, b):
    n  = len(a)
    i1, i2 = sorted(random.sample(range(n), 2))
    segmento  = a[i1:i2+1]
    restante  = [c for c in b if c not in segmento]
    return restante[:i1] + segmento + restante[i1:]

# ── Mutación Swap ────────────────────────────────────────────
def mutar_swap(ruta, tasa_mut):
    r = ruta[:]
    if random.random() < tasa_mut:
        i, j = random.sample(range(len(r)), 2)
        r[i], r[j] = r[j], r[i]
    return r

# ── Selección por Torneo ─────────────────────────────────────
def torneo(poblacion, ciudades, k=4):
    candidatos = random.sample(poblacion, k)
    return max(candidatos, key=lambda r: fitness(r, ciudades))

# ── Bucle Evolutivo ──────────────────────────────────────────
def ejecutar_tsp(num_ciudades=15, tam_pob=100, max_gens=1000, tasa_mut=0.08):
    ciudades   = generar_ciudades(num_ciudades)
    indices    = list(range(num_ciudades))

    # Población inicial con permutaciones aleatorias
    poblacion  = [random.sample(indices, num_ciudades) for _ in range(tam_pob)]
    mejor_ruta = None
    mejor_dist = float('inf')

    for gen in range(1, max_gens + 1):
        # Actualizar el mejor global
        for ruta in poblacion:
            d = longitud_ruta(ruta, ciudades)
            if d < mejor_dist:
                mejor_dist = d
                mejor_ruta = ruta[:]

        nueva = [mejor_ruta[:]]  # Elitismo
        while len(nueva) < tam_pob:
            hijo = mutar_swap(
                cruzar_ox(torneo(poblacion, ciudades),
                           torneo(poblacion, ciudades)),
                tasa_mut
            )
            nueva.append(hijo)
        poblacion = nueva[:tam_pob]

        if gen % 100 == 0:
            print(f"Gen {gen}: Distancia mínima = {mejor_dist:.2f}px")

    ruta_str = " → ".join(str(c) for c in mejor_ruta) + " → 0"
    print(f"🏁 Mejor ruta: {ruta_str}")
    print(f"📏 Distancia total: {mejor_dist:.2f}px")

if __name__ == "__main__":
    ejecutar_tsp()`
        };

        // ===================================================================
        // EXPLICACIONES POR PROBLEMA+LENGUAJE
        // ===================================================================
        this.explanations = {
            onemax_js: [
                { title: '1. Cromosoma Binario', text: 'Un array de 0s y 1s de longitud fija. Cada bit representa una variable de decisión. Simple pero demostrativo de todos los operadores genéticos.' },
                { title: '2. Fitness Lineal', text: '<code>suma(genes)</code> — a más 1s, mayor aptitud. Esta función es convexa y garantiza convergencia rápida.' },
                { title: '3. Elitismo', text: 'El mejor individuo de cada generación se copia directamente a la siguiente sin modificación. Garantiza que la mejor solución nunca se pierde.' },
                { title: '4. Cruce Monopunto', text: 'Se elige un <code>puntoCorte</code> aleatorio. El hijo 1 toma la parte izquierda del padre A y la derecha del padre B, y viceversa.' },
                { title: '5. Mutación Bit-Flip', text: 'Con probabilidad <code>TASA_MUT</code> por bit, el gen se invierte (0→1 o 1→0). Introduce diversidad y evita mínimos locales.' }
            ],
            onemax_python: [
                { title: '1. List Comprehensions', text: 'Python permite crear cromosomas en una línea: <code>[random.randint(0,1) for _ in range(N)]</code>. Mucho más legible que un bucle for explícito.' },
                { title: '2. max() con key', text: '<code>max(torneo, key=fitness)</code> busca el elemento de mayor aptitud de manera elegante y eficiente usando la función fitness como criterio.' },
                { title: '3. Slicing para Cruce', text: '<code>a[:pt] + b[pt:]</code> realiza el cruce monopunto en una sola expresión, aprovechando la sintaxis de slicing de listas de Python.' },
                { title: '4. Comprensión en Mutación', text: '<code>1 - b</code> es una fórmula algebraica para invertir un bit: si b=0 da 1, si b=1 da 0. Evita un <code>if/else</code> innecesario.' }
            ],
            string_js: [
                { title: '1. Codificación de Caracteres', text: 'Cada gen es un carácter de la bolsa de letras. La cadena completa forma el "fenotipo" del individuo (la frase visible).' },
                { title: '2. Fitness Cuadrático', text: '<code>Math.pow(aciertos/total, 2)</code> amplifica la diferencia entre individuos parecidos al objetivo, acelerando la selección de los mejores.' },
                { title: '3. Selección por Ruleta', text: 'Cada individuo tiene una probabilidad proporcional a su fitness de ser seleccionado. Los mejores tienen más chances, pero los peores también pueden reproducirse.' },
                { title: '4. Cruce Uniforme', text: 'Cada posición del hijo elige aleatoriamente entre el carácter del padre A o B con 50/50. Más disruptivo que el monopunto, bueno para espacios de búsqueda grandes.' },
                { title: '5. Mutación por Sustitución', text: 'Reemplaza el carácter con uno aleatorio de la bolsa. En la última fase de la evolución, la mayoría de caracteres ya son correctos y se mantienen estables.' }
            ],
            string_python: [
                { title: '1. zip() para comparar', text: '<code>zip(ind, OBJETIVO)</code> empareja caracteres en la misma posición de ambas cadenas para comparar aciertos de forma idiomática.' },
                { title: '2. Generador en Mutación', text: 'La mutación se implementa con un generador de comprensión dentro de <code>join()</code>, creando la cadena mutada eficientemente en memoria.' },
                { title: '3. Cruce Uniforme Bidireccional', text: 'Se crean dos hijos complementarios: h1 toma ac cuando random<0.5, h2 toma bc en las mismas posiciones. Maximiza la diversidad genética.' },
                { title: '4. Elitismo Simple', text: '<code>nueva = [mejor]</code> preserva el mejor individuo como primera entrada de la nueva generación antes de poblarla con descendencia.' }
            ],
            knapsack_js: [
                { title: '1. Representación Binaria', text: 'El cromosoma tiene un bit por cada objeto. Si el bit es 1, el objeto se incluye; si es 0, no. Elegante y directo para problemas de selección.' },
                { title: '2. Penalización por Restricción', text: 'Si el peso total supera la capacidad, el fitness se fuerza a 0. Esto es penalización "estricta" o "kill". Simple pero efectivo.' },
                { title: '3. Función de Agregación', text: '<code>reduce</code> con un índice calcula peso y valor en una sola pasada. Más eficiente que filtrar con indexOf.' },
                { title: '4. Torneo con Fitness Dinámico', text: 'En cada torneo se llama a <code>fitness(c)</code> en tiempo real, evitando almacenar arrays de aptitudes que podrían quedar desactualizados.' }
            ],
            knapsack_python: [
                { title: '1. Diccionarios como Objetos', text: 'Cada objeto de la mochila es un dict con "nombre", "peso" y "valor". Python permite acceso legible con <code>obj["peso"]</code>.' },
                { title: '2. Comprensión para Calcular Totales', text: '<code>sum(c[i] * obj["valor"] for i in range(n))</code> calcula el valor total de forma concisa aprovechando el producto binario.' },
                { title: '3. Penalización Condicional', text: '<code>return valor if peso <= CAPACIDAD else 0</code> implementa la restricción de capacidad en una sola línea elegante usando expresiones condicionales.' },
                { title: '4. Slice para Elitismo', text: '<code>elite = max(poblacion, key=fitness)</code> obtiene la mejor solución. <code>elite[:]</code> hace una copia para no modificar el original al evolucionar.' }
            ],
            tsp_js: [
                { title: '1. Codificación por Permutación', text: 'El cromosoma es una lista de índices de ciudades. La solución [2,0,3,1] significa: visitar ciudad 2, luego 0, luego 3, luego 1 y volver.' },
                { title: '2. Cruce OX1 (Order Crossover)', text: 'Copia un segmento del padre A y rellena el resto siguiendo el orden en que aparecen las ciudades en el padre B, evitando duplicados.' },
                { title: '3. Mutación Swap', text: 'Intercambia dos ciudades en la ruta. A diferencia de los problemas binarios, no podemos eliminar ciudades, solo reordenarlas.' },
                { title: '4. Fitness como Inverso de Distancia', text: '<code>1 / distancia_total</code>: cuanto menor sea la ruta, mayor es el fitness. El AG maximiza el fitness, minimizando implícitamente la distancia.' },
                { title: '5. Cierre de Ruta', text: '<code>(i + 1) % ruta.length</code> asegura que el último punto regrese al primero (circuito cerrado), característico del TSP clásico.' }
            ],
            tsp_python: [
                { title: '1. math.hypot()', text: '<code>math.hypot(dx, dy)</code> calcula la hipotenusa (distancia euclidiana) de forma precisa y más legible que <code>sqrt(dx**2 + dy**2)</code>.' },
                { title: '2. sorted(random.sample())', text: '<code>sorted(random.sample(range(n), 2))</code> selecciona 2 puntos de cruce ordenados en una sola línea, sin necesidad de comparar i1 e i2 manualmente.' },
                { title: '3. Comprensión con enumerate implícito', text: 'El cruce OX usa comprensión de lista con <code>not in segmento</code> para filtrar eficientemente las ciudades ya incluidas en el segmento copiado.' },
                { title: '4. float(\'inf\') como Centinela', text: '<code>mejor_dist = float(\'inf\')</code> garantiza que cualquier distancia real sea menor al inicio, evitando inicializar con un valor arbitrario.' }
            ]
        };
    }

    // -----------------------------------------------------------------------
    // INICIALIZACIÓN
    // -----------------------------------------------------------------------
    init() {
        // Botones de lenguaje
        const btnJs = document.getElementById('code-btn-js');
        const btnPy = document.getElementById('code-btn-python');
        if (btnJs) btnJs.onclick = () => this.switchLanguage('js');
        if (btnPy) btnPy.onclick = () => this.switchLanguage('python');

        // Botones de problema
        document.querySelectorAll('.problem-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const prob = btn.getAttribute('data-problem');
                this.switchProblem(prob);
            });
        });

        // Botón copiar
        const btnCopy = document.getElementById('btn-copy-code');
        if (btnCopy) btnCopy.onclick = () => this.copyToClipboard();

        // Cargar estado inicial
        this.switchProblem('onemax');
    }

    // -----------------------------------------------------------------------
    // CAMBIAR PROBLEMA
    // -----------------------------------------------------------------------
    switchProblem(problem) {
        this.currentProblem = problem;

        // Actualizar tabs de problema
        document.querySelectorAll('.problem-tab').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-problem') === problem);
        });

        // Renderizar descripción del problema
        const descEl = document.getElementById('code-problem-desc');
        if (descEl) {
            const meta = this.problems[problem];
            descEl.innerHTML = `
                <div class="problem-desc-inner">
                    <h3>${meta.title}</h3>
                    <p>${meta.desc}</p>
                    <div class="problem-tags">
                        <span class="prob-tag ${meta.diffClass}">${meta.difficulty}</span>
                        ${meta.tags.map(t => `<span class="prob-tag">${t}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // Recargar código con el lenguaje actual
        this._renderCode();
    }

    // -----------------------------------------------------------------------
    // CAMBIAR LENGUAJE
    // -----------------------------------------------------------------------
    switchLanguage(lang) {
        this.currentLang = lang;

        const btnJs = document.getElementById('code-btn-js');
        const btnPy = document.getElementById('code-btn-python');
        if (btnJs) btnJs.classList.toggle('active', lang === 'js');
        if (btnPy) btnPy.classList.toggle('active', lang === 'python');

        this._renderCode();
    }

    // -----------------------------------------------------------------------
    // RENDERIZAR CÓDIGO Y EXPLICACIONES
    // -----------------------------------------------------------------------
    _renderCode() {
        const key = `${this.currentProblem}_${this.currentLang}`;
        const code = this.codes[key] || '// Código no disponible para esta combinación.';
        const exps = this.explanations[key] || [];

        const codeDisplay = document.getElementById('code-display');
        if (codeDisplay) {
            codeDisplay.className = this.currentLang === 'js' ? 'language-js' : 'language-python';
            codeDisplay.textContent = code;
        }

        const expList = document.getElementById('code-explanation-list');
        if (expList) {
            expList.innerHTML = exps.map(item => `
                <li>
                    <strong>${item.title}</strong>
                    <span>${item.text}</span>
                </li>
            `).join('');
        }
    }

    // -----------------------------------------------------------------------
    // COPIAR AL PORTAPAPELES
    // -----------------------------------------------------------------------
    copyToClipboard() {
        const key = `${this.currentProblem}_${this.currentLang}`;
        const textToCopy = this.codes[key] || '';

        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyBtnText = document.getElementById('copy-btn-text');
            if (copyBtnText) {
                copyBtnText.textContent = '¡Copiado! ✓';
                copyBtnText.style.color = 'var(--neon-green)';
                setTimeout(() => {
                    copyBtnText.textContent = 'Copiar Código';
                    copyBtnText.style.color = '';
                }, 2000);
            }
        }).catch(err => console.error('No se pudo copiar:', err));
    }

    // Método legado para compatibilidad con admin panel
    addCustomQuestion() {}
}
