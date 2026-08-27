/**
 * ==========================================================================
 * MOTOR CENTRAL DE ALGORITMO GENÉTICO (GeneTech Core Engine)
 * ==========================================================================
 */

/**
 * Clase que representa un Individuo (Cromosoma) en la población.
 */
class Chromosome {
    /**
     * @param {Array|String} genes - El material genético del cromosoma.
     */
    constructor(genes) {
        this.genes = genes;
        this.fitness = 0;
        this.rawScore = 0; // Puntuación bruta antes de normalizar
    }

    /**
     * Clona el cromosoma actual.
     * @returns {Chromosome} Una copia profunda del cromosoma.
     */
    clone() {
        const copyGenes = Array.isArray(this.genes) ? [...this.genes] : this.genes;
        const copy = new Chromosome(copyGenes);
        copy.fitness = this.fitness;
        copy.rawScore = this.rawScore;
        return copy;
    }
}

/**
 * Motor general que ejecuta el bucle de Algoritmo Genético.
 */
class GeneticAlgorithm {
    /**
     * @param {Object} options - Parámetros de configuración del AG.
     */
    constructor(options = {}) {
        this.populationSize = options.populationSize || 100;
        this.mutationRate = options.mutationRate || 0.01; // Probabilidad de mutación (0.0 a 1.0)
        this.crossoverRate = options.crossoverRate || 0.8; // Probabilidad de cruce (0.0 a 1.0)
        this.selectionMethod = options.selectionMethod || 'tournament'; // 'tournament' o 'roulette'
        
        // Funciones específicas del problema (Inyectadas)
        this.fitnessFn = options.fitnessFn; // function(genes): number
        this.geneGeneratorFn = options.geneGeneratorFn; // function(index): gene
        this.crossoverFn = options.crossoverFn; // function(parentGenesA, parentGenesB): [childGenesA, childGenesB]
        this.mutateFn = options.mutateFn; // function(genes, rate): mutatedGenes
        
        this.chromosomeLength = options.chromosomeLength || 10;
        this.generation = 0;
        this.population = [];
        this.bestIndividual = null;
        this.history = []; // Historial de fitness máximo y promedio por generación
    }

    /**
     * Inicializa la población con individuos generados aleatoriamente.
     */
    initPopulation() {
        this.population = [];
        this.generation = 0;
        this.history = [];
        this.bestIndividual = null;

        for (let i = 0; i < this.populationSize; i++) {
            const genes = [];
            for (let j = 0; j < this.chromosomeLength; j++) {
                genes.push(this.geneGeneratorFn(j));
            }
            // En caso de que el generador devuelva una cadena en lugar de un array
            const finalGenes = typeof genes[0] === 'string' && this.chromosomeLength === 1 ? genes.join('') : genes;
            
            this.population.push(new Chromosome(finalGenes));
        }
        
        this.evaluatePopulation();
    }

    /**
     * Evalúa la aptitud (fitness) de cada individuo en la población.
     */
    evaluatePopulation() {
        let maxFitness = -Infinity;
        let sumFitness = 0;

        for (let ind of this.population) {
            ind.fitness = this.fitnessFn(ind.genes);
            sumFitness += ind.fitness;
            
            if (ind.fitness > maxFitness) {
                maxFitness = ind.fitness;
                this.bestIndividual = ind.clone();
            }
        }

        const avgFitness = sumFitness / this.populationSize;
        
        // Guardar métricas en el historial
        this.history.push({
            generation: this.generation,
            bestFitness: this.bestIndividual.fitness,
            avgFitness: avgFitness
        });
    }

    /**
     * Realiza la selección por torneo (Escoge K individuos aleatorios y devuelve el mejor).
     * @param {number} k - Tamaño del torneo.
     * @returns {Chromosome} El individuo seleccionado.
     */
    selectTournament(k = 3) {
        let best = null;
        for (let i = 0; i < k; i++) {
            const ind = this.population[Math.floor(Math.random() * this.populationSize)];
            if (!best || ind.fitness > best.fitness) {
                best = ind;
            }
        }
        return best;
    }

    /**
     * Realiza la selección proporcional por ruleta (Aptitud proporcional al área de la ruleta).
     * @returns {Chromosome} El individuo seleccionado.
     */
    selectRoulette() {
        // Encontrar la aptitud mínima para evitar valores negativos
        let minFitness = Infinity;
        for (let ind of this.population) {
            if (ind.fitness < minFitness) minFitness = ind.fitness;
        }

        // Desplazar aptitudes si hay negativas para que todas sean >= 0
        const offset = minFitness < 0 ? Math.abs(minFitness) : 0;
        
        let totalSum = 0;
        for (let ind of this.population) {
            totalSum += (ind.fitness + offset);
        }

        // Si la suma total es 0 (ej. todos tienen fitness idéntico o 0), elegir aleatorio
        if (totalSum === 0) {
            return this.population[Math.floor(Math.random() * this.populationSize)];
        }

        let rand = Math.random() * totalSum;
        let runningSum = 0;
        
        for (let ind of this.population) {
            runningSum += (ind.fitness + offset);
            if (runningSum >= rand) {
                return ind;
            }
        }
        
        return this.population[this.populationSize - 1];
    }

    /**
     * Selecciona un padre usando el método configurado.
     */
    selectParent() {
        if (this.selectionMethod === 'roulette') {
            return this.selectRoulette();
        } else {
            return this.selectTournament(3);
        }
    }

    /**
     * Avanza el algoritmo genético exactamente una generación (Bucle evolutivo principal).
     */
    step() {
        const nextGeneration = [];

        // Conservar Elitismo (El mejor de la generación anterior pasa intacto)
        if (this.bestIndividual) {
            nextGeneration.push(this.bestIndividual.clone());
        }

        // Engendrar el resto de la población
        while (nextGeneration.length < this.populationSize) {
            const parentA = this.selectParent();
            const parentB = this.selectParent();
            
            let childGenesA = Array.isArray(parentA.genes) ? [...parentA.genes] : parentA.genes;
            let childGenesB = Array.isArray(parentB.genes) ? [...parentB.genes] : parentB.genes;
            
            // Operador de Cruce (Crossover)
            if (Math.random() < this.crossoverRate) {
                const offspring = this.crossoverFn(parentA.genes, parentB.genes);
                childGenesA = offspring[0];
                childGenesB = offspring[1];
            }

            // Operador de Mutación
            childGenesA = this.mutateFn(childGenesA, this.mutationRate);
            childGenesB = this.mutateFn(childGenesB, this.mutationRate);

            nextGeneration.push(new Chromosome(childGenesA));
            if (nextGeneration.length < this.populationSize) {
                nextGeneration.push(new Chromosome(childGenesB));
            }
        }

        this.population = nextGeneration;
        this.generation++;
        this.evaluatePopulation();
    }
}
