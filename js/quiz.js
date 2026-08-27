/**
 * ==========================================================================
 * MÓDULO DE EVALUACIONES — 3 Exámenes Especializados (GeneTech)
 * ==========================================================================
 * Exámenes:
 *   basics    → Fundamentos Básicos       (10 preguntas, nivel Introductorio)
 *   operators → Operadores Genéticos      (10 preguntas, nivel Intermedio)
 *   realworld → Aplicaciones Mundo Real   (10 preguntas, nivel Avanzado)
 */

class QuizModule {
    constructor() {
        this.currentExam    = null; // 'basics' | 'operators' | 'realworld'
        this.questions      = [];
        this.currentIdx     = 0;
        this.score          = 0;
        this.answered       = false;

        // Historial de notas por examen para el alumno activo
        this.examHistory = { basics: null, operators: null, realworld: null };

        // Metadatos de los exámenes
        this.examMeta = {
            basics:    { title: 'Examen de Fundamentos', icon: '🔬', color: '#00c6ff' },
            operators: { title: 'Operadores Genéticos',  icon: '⚙️', color: '#f093fb' },
            realworld: { title: 'Aplicaciones del Mundo Real', icon: '🌎', color: '#00ffa3' }
        };

        // ===================================================================
        // BANCO DE PREGUNTAS — EXAMEN 1: FUNDAMENTOS BÁSICOS
        // ===================================================================
        this.questionBank = {
            basics: [
                {
                    q: '¿Cuál es la inspiración biológica principal de los Algoritmos Genéticos?',
                    opts: [
                        'La selección natural y la herencia genética de Darwin',
                        'La reproducción asexual de los organismos unicelulares',
                        'El sistema nervioso de los mamíferos superiores',
                        'La fotosíntesis de las plantas verdes'
                    ],
                    correct: 0,
                    exp: 'Los Algoritmos Genéticos fueron inspirados por la Teoría de la Evolución de Charles Darwin: los individuos más aptos tienen mayor probabilidad de sobrevivir y reproducirse, transfiriendo sus características a la descendencia.'
                },
                {
                    q: '¿Qué es el "cromosoma" en el contexto de un Algoritmo Genético?',
                    opts: [
                        'El proceso de evaluación de cada individuo',
                        'La representación codificada de una posible solución al problema',
                        'El operador que mezcla dos soluciones parentales',
                        'La velocidad con que converge el algoritmo'
                    ],
                    correct: 1,
                    exp: 'En un AG, el cromosoma (también llamado genotipo) es la representación estructurada —generalmente un array binario, de caracteres o de números— que codifica una solución candidata al problema que se desea resolver.'
                },
                {
                    q: '¿Cuál es la función de la "función de aptitud" (fitness function) en un AG?',
                    opts: [
                        'Genera individuos aleatorios para la población inicial',
                        'Controla la tasa de mutación en cada generación',
                        'Cuantifica qué tan buena es cada solución candidata',
                        'Mezcla los genes de dos individuos parentales'
                    ],
                    correct: 2,
                    exp: 'La función de aptitud asigna un valor numérico a cada individuo que indica su calidad como solución. Es el puente entre el genotipo (cromosoma) y el fenotipo (solución real). Los individuos con mayor fitness tienen más probabilidades de reproducirse.'
                },
                {
                    q: '¿Qué diferencia existe entre el genotipo y el fenotipo?',
                    opts: [
                        'El genotipo es la solución real; el fenotipo es su codificación interna',
                        'El genotipo es la representación codificada; el fenotipo es la solución interpretada',
                        'Son sinónimos que describen la misma entidad del algoritmo',
                        'El genotipo es el fitness; el fenotipo es la población completa'
                    ],
                    correct: 1,
                    exp: 'El genotipo es la representación interna del individuo (ej. cadena binaria "101100"). El fenotipo es la decodificación de esa representación al dominio del problema (ej. el número 44 o una ruta específica de ciudades).'
                },
                {
                    q: '¿Cuál es el orden correcto del ciclo evolutivo en un AG estándar?',
                    opts: [
                        'Cruce → Selección → Mutación → Evaluación',
                        'Evaluación → Mutación → Selección → Cruce',
                        'Selección → Evaluación → Cruce → Mutación',
                        'Inicialización → Evaluación → Selección → Cruce → Mutación'
                    ],
                    correct: 3,
                    exp: 'El ciclo correcto es: (1) Inicializar población aleatoria, (2) Evaluar fitness de cada individuo, (3) Seleccionar padres según fitness, (4) Cruzar padres para generar hijos, (5) Mutar los hijos. Este ciclo se repite hasta cumplir el criterio de parada.'
                },
                {
                    q: '¿Qué representa el "tamaño de la población" en un Algoritmo Genético?',
                    opts: [
                        'El número máximo de generaciones que el algoritmo puede ejecutar',
                        'La longitud del cromosoma de cada individuo',
                        'La cantidad de individuos (soluciones candidatas) que coexisten en cada generación',
                        'El número de genes que se intercambian en el cruce'
                    ],
                    correct: 2,
                    exp: 'El tamaño de la población determina cuántas soluciones candidatas se evalúan en paralelo por generación. Una población grande aporta mayor diversidad genética pero exige más cómputo por generación. Una muy pequeña puede converger prematuramente.'
                },
                {
                    q: '¿Qué significa "convergencia prematura" en un Algoritmo Genético?',
                    opts: [
                        'El algoritmo termina de forma correcta al encontrar el óptimo global',
                        'La población pierde diversidad y queda atrapada en un óptimo local',
                        'El fitness promedio supera al fitness del mejor individuo',
                        'Los operadores de cruce se desactivan automáticamente'
                    ],
                    correct: 1,
                    exp: 'La convergencia prematura ocurre cuando toda la población se vuelve muy similar entre sí antes de encontrar el óptimo global. Esto suele suceder cuando la presión de selección es muy alta y la mutación es baja, ya que los individuos buenos dominan toda la población rápidamente.'
                },
                {
                    q: '¿En qué tipo de problemas son especialmente útiles los Algoritmos Genéticos?',
                    opts: [
                        'Problemas con espacios de búsqueda pequeños y solución exacta conocida',
                        'Problemas complejos, no lineales, con grandes espacios de búsqueda donde los métodos exactos son intratables',
                        'Únicamente en problemas de clasificación de texto con redes neuronales',
                        'Problemas donde la función objetivo es siempre convexa y unimodal'
                    ],
                    correct: 1,
                    exp: 'Los AGs brillan en problemas de optimización complejos, NP-difíciles, no lineales o discontinuos, donde no existen fórmulas cerradas y los métodos exactos (fuerza bruta, programación dinámica) son computacionalmente inviables. TSP, diseño de circuitos y scheduling son ejemplos clásicos.'
                },
                {
                    q: '¿Qué es el "elitismo" en el contexto de un Algoritmo Genético?',
                    opts: [
                        'Un método de selección que favorece únicamente a los peores individuos',
                        'La práctica de copiar directamente los mejores individuos a la siguiente generación sin modificarlos',
                        'Un operador de cruce que combina más de dos individuos parentales',
                        'El proceso de aumentar la tasa de mutación cuando el fitness no mejora'
                    ],
                    correct: 1,
                    exp: 'El elitismo garantiza que las mejores soluciones encontradas no se pierdan por efectos aleatorios del cruce o la mutación. Al copiar el n% de los mejores directamente a la próxima generación, el fitness máximo nunca disminuye entre generaciones.'
                },
                {
                    q: '¿Cuál es la principal diferencia entre los Algoritmos Genéticos y la búsqueda aleatoria pura?',
                    opts: [
                        'La búsqueda aleatoria es siempre más rápida que un AG para cualquier problema',
                        'Un AG usa información del fitness de generaciones previas para guiar la exploración de forma inteligente',
                        'Los AGs no usan ningún componente aleatorio en sus operadores',
                        'La búsqueda aleatoria produce soluciones de mejor calidad en espacios continuos'
                    ],
                    correct: 1,
                    exp: 'La búsqueda aleatoria genera y evalúa soluciones sin aprender de los resultados anteriores. Un AG, en cambio, dirige la búsqueda mediante la selección natural: las soluciones más aptas se reproducen más, concentrando la exploración en zonas prometedoras del espacio de búsqueda.'
                }
            ],

            // =================================================================
            // BANCO DE PREGUNTAS — EXAMEN 2: OPERADORES GENÉTICOS
            // =================================================================
            operators: [
                {
                    q: '¿Cuál es la diferencia clave entre la selección por Torneo y la selección por Ruleta?',
                    opts: [
                        'El torneo es estocástico; la ruleta es completamente determinista',
                        'La ruleta selecciona proporcionalmente al fitness; el torneo enfrenta subgrupos aleatorios y elige el mejor',
                        'Ambos métodos producen exactamente el mismo resultado en todas las poblaciones',
                        'El torneo es siempre más lento computacionalmente que la ruleta'
                    ],
                    correct: 1,
                    exp: 'En la selección por Ruleta, cada individuo tiene una probabilidad de ser elegido igual a su fitness relativo en la población (puede favorecer enormemente a los muy aptos). En el Torneo, se selecciona un subgrupo aleatorio (k individuos) y el más apto del grupo gana. El torneo controla mejor la presión selectiva ajustando k.'
                },
                {
                    q: '¿En qué consiste el Cruce Uniforme y cuándo conviene usarlo?',
                    opts: [
                        'Divide el cromosoma exactamente por la mitad y es ideal para problemas cortos',
                        'Cada gen se hereda del padre A o B con igual probabilidad; útil cuando la posición de los genes no importa',
                        'Realiza n cortes equidistantes en el cromosoma; ideal para problemas numéricos',
                        'Solo aplica a cromosomas de longitud par y garantiza diversidad máxima siempre'
                    ],
                    correct: 1,
                    exp: 'En el Cruce Uniforme, para cada posición gen se lanza una moneda: si cara, el hijo hereda el gen del padre A; si cruz, del padre B. No asume ninguna dependencia posicional entre genes, por lo que es muy efectivo cuando los genes contribuyen de forma independiente al fitness.'
                },
                {
                    q: '¿Qué problema específico resuelve el Cruce OX (Order Crossover) y para qué tipo de codificación fue diseñado?',
                    opts: [
                        'Resuelve el problema de bits duplicados en cromosomas binarios largos',
                        'Preserva el orden relativo de los elementos en cromosomas de tipo permutación (como rutas en TSP)',
                        'Maximiza la diversidad genética en problemas de codificación real con valores flotantes',
                        'Garantiza que todos los hijos sean infactibles para forzar la exploración del espacio'
                    ],
                    correct: 1,
                    exp: 'El OX fue diseñado para el problema TSP y otros de permutación. En cromosomas tipo permutación, cada ciudad/elemento debe aparecer exactamente una vez. El OX copia un segmento del padre A y completa al hijo siguiendo el orden en que los elementos restantes aparecen en el padre B, evitando duplicados.'
                },
                {
                    q: '¿Qué efectos opuestos tiene la tasa de mutación en el rendimiento del AG?',
                    opts: [
                        'Tasa alta → garantiza convergencia rápida; tasa baja → garantiza diversidad máxima',
                        'Tasa muy alta → la búsqueda degenera en aleatoria; tasa muy baja → riesgo de convergencia prematura',
                        'La tasa de mutación no afecta la diversidad de la población, solo acelera el cruce',
                        'Tasa alta → mejor fitness siempre; tasa baja → peor fitness siempre'
                    ],
                    correct: 1,
                    exp: 'Una tasa de mutación muy baja no introduce suficiente diversidad y el AG puede quedar atrapado en óptimos locales (convergencia prematura). Una tasa muy alta hace que los cromosomas se "rompan" constantemente, destruyendo el aprendizaje acumulado y convirtiendo el AG en una búsqueda aleatoria.'
                },
                {
                    q: '¿Cuál es la función del operador de cruce (crossover) desde el punto de vista de la exploración/explotación?',
                    opts: [
                        'Introducir variación completamente aleatoria para mantener la diversidad (exploración pura)',
                        'Combinar los "bloques de construcción" buenos de dos soluciones para crear mejores hijos (explotación guiada)',
                        'Eliminar los peores individuos de la población en cada generación',
                        'Ajustar automáticamente la tasa de mutación basada en el progreso del fitness'
                    ],
                    correct: 1,
                    exp: 'El cruce explota el conocimiento ya acumulado: combina partes buenas de individuos aptos para potencialmente crear descendencia aún mejor. La Hipótesis de los Bloques de Construcción (Building Blocks Hypothesis) de Holland sugiere que el cruce mezcla esquemas positivos de ambos padres.'
                },
                {
                    q: '¿Qué es el Cruce BLX-α (Blend Crossover) y para qué tipo de cromosoma es apropiado?',
                    opts: [
                        'Un cruce binario que intercambia bloques de bits aleatorios entre dos padres',
                        'Un cruce para valores reales que genera hijos en el rango extendido [min-α·d, max+α·d] de los valores parentales',
                        'Un método de selección que combina ruleta y torneo en una sola operación',
                        'Una variante del cruce uniforme aplicada exclusivamente a cadenas de caracteres'
                    ],
                    correct: 1,
                    exp: 'El BLX-α es un operador de cruce para cromosomas de codificación real (flotantes). Dado que el padre A tiene valor xA y el padre B tiene xB, el hijo puede tomar cualquier valor en el rango [min(xA,xB) - α·d, max(xA,xB) + α·d], donde d = |xA - xB|. α controla cuánto puede "salirse" del rango parental.'
                },
                {
                    q: '¿Cuál es la diferencia entre la mutación "Bit-Flip" y la mutación "Inversión de Segmento"?',
                    opts: [
                        'Bit-Flip aplica a permutaciones; Inversión de Segmento aplica a cromosomas binarios',
                        'Bit-Flip invierte genes individuales aleatoriamente; la Inversión invierte el orden de un segmento del cromosoma',
                        'Ambas producen el mismo resultado pero la Inversión es más eficiente computacionalmente',
                        'Bit-Flip solo funciona con población de tamaño par; la Inversión no tiene esta restricción'
                    ],
                    correct: 1,
                    exp: 'La mutación Bit-Flip selecciona genes individuales y los invierte (0→1 o 1→0). La Inversión de Segmento (inversion mutation) selecciona dos puntos y revierte el orden de todos los genes entre esos puntos. La inversión es especialmente útil en permutaciones porque no crea duplicados.'
                },
                {
                    q: '¿Por qué la presión de selección alta puede ser perjudicial para un AG?',
                    opts: [
                        'Porque impide que los mejores individuos se reproduzcan con la frecuencia necesaria',
                        'Porque los individuos muy aptos dominan rápidamente la población, reduciendo la diversidad y atrapando el AG en óptimos locales',
                        'Porque aumenta exponencialmente el tiempo de ejecución de cada generación',
                        'Porque desactiva automáticamente el operador de mutación en las últimas generaciones'
                    ],
                    correct: 1,
                    exp: 'Una presión de selección alta hace que los pocos individuos con el mayor fitness monopolicen la reproducción. En pocas generaciones, casi toda la población es descendiente directa de ese subconjunto, perdiendo diversidad genética. El resultado es un AG que no puede escapar de los óptimos locales.'
                },
                {
                    q: '¿Qué es el "problema de letargo genético" (genetic drift) en poblaciones pequeñas?',
                    opts: [
                        'La tendencia de los operadores de mutación a inactivarse en generaciones tardías',
                        'La pérdida aleatoria de variantes genéticas valiosas por efectos del muestreo estocástico en poblaciones reducidas',
                        'El fenómeno donde los genes dominantes siempre suplantan a los recesivos en la población',
                        'La disminución gradual de la tasa de cruce conforme avanza la evolución'
                    ],
                    correct: 1,
                    exp: 'En poblaciones pequeñas, el muestreo aleatorio de padres puede, por pura casualidad, excluir variantes genéticas valiosas de la reproducción. A diferencia de la selección natural, el genetic drift es un fenómeno neutral: no favorece ni perjudica, simplemente reduce la diversidad por azar.'
                },
                {
                    q: '¿Cuál es la ventaja del reemplazo generacional completo ("generational replacement") vs. el reemplazo estable ("steady-state")?',
                    opts: [
                        'El generacional preserva siempre a los mejores individuos; el estable los reemplaza todos',
                        'El generacional renueva toda la población cada ciclo; el estable reemplaza solo uno o pocos individuos por ciclo, manteniendo más continuidad',
                        'El generacional es siempre más lento; el estable converge en menos generaciones en todos los casos',
                        'No hay diferencia práctica: ambos producen los mismos resultados con el mismo tiempo de ejecución'
                    ],
                    correct: 1,
                    exp: 'En el reemplazo generacional, una nueva generación completa reemplaza a la antigua (mayor disrupción, más diversidad). En el steady-state, solo se crean 1-2 hijos por ciclo y se reemplazan los peores individuos (más continuidad, convergencia más suave). Ambos tienen ventajas según el tipo de problema.'
                }
            ],

            // =================================================================
            // BANCO DE PREGUNTAS — EXAMEN 3: APLICACIONES MUNDO REAL
            // =================================================================
            realworld: [
                {
                    q: '¿Por qué el Problema del Viajero de Comercio (TSP) es considerado NP-difícil y cómo lo aborda un AG?',
                    opts: [
                        'Es NP-difícil porque tiene infinitas soluciones; el AG evalúa todas exhaustivamente',
                        'Es NP-difícil porque el número de rutas posibles crece factorialmente con las ciudades; el AG busca heurísticamente buenas soluciones sin garantizar el óptimo',
                        'Es NP-difícil solo cuando hay más de 1000 ciudades; para N<100 se resuelve exactamente con AG',
                        'Es NP-difícil por sus restricciones de tiempo real; los AGs lo convierten en un problema polinomial'
                    ],
                    correct: 1,
                    exp: 'Para N ciudades existen (N-1)!/2 rutas posibles, un número que crece factorialmente. Para 20 ciudades hay ~60 billones de rutas. Los AGs no garantizan el óptimo global en TSP, pero producen soluciones de alta calidad en tiempo razonable, típicamente dentro del 1-5% del óptimo teórico.'
                },
                {
                    q: '¿Cómo se aplican los Algoritmos Genéticos en el diseño de antenas de telecomunicaciones?',
                    opts: [
                        'Se usan solo para calcular la frecuencia de transmisión óptima',
                        'Evolucionan la geometría (forma, longitud, ángulos) de la antena para maximizar ganancia y minimizar interferencias según restricciones de fabricación',
                        'Únicamente determinan el material conductor más adecuado para la antena',
                        'Se aplican exclusivamente en antenas de radio AM de baja frecuencia'
                    ],
                    correct: 1,
                    exp: 'La NASA usó un AG para diseñar la antena ST5 (2006), produciendo una forma irregular que ningún ingeniero humano hubiera diseñado, pero con rendimiento superior. El cromosoma codificaba la geometría de la antena; el fitness medía las propiedades electromagnéticas simuladas.'
                },
                {
                    q: '¿Qué es la Optimización Multiobjetivo y cómo la manejan los AGs (NSGA-II)?',
                    opts: [
                        'Optimizar una función objetivo contra múltiples conjuntos de datos simultáneamente',
                        'Encontrar soluciones que equilibren múltiples objetivos en conflicto, representadas como un Frente de Pareto',
                        'Ejecutar el mismo AG múltiples veces con diferentes semillas aleatorias y tomar el promedio',
                        'Usar múltiples AGs independientes, uno por cada objetivo, y combinar sus soluciones al final'
                    ],
                    correct: 1,
                    exp: 'La mayoría de problemas reales tienen múltiples objetivos en conflicto (ej: minimizar costo Y maximizar rendimiento). No existe un único óptimo, sino un conjunto de soluciones Pareto-óptimas donde mejorar un objetivo empeora otro. NSGA-II evoluciona toda esta frontera simultáneamente.'
                },
                {
                    q: '¿En qué consiste el "Job Shop Scheduling" y por qué es un caso de uso clásico de los AGs?',
                    opts: [
                        'Es la asignación de empleados a turnos de trabajo diarios en una empresa de servicios',
                        'Es la planificación del orden y la asignación de N trabajos en M máquinas para minimizar el tiempo total (makespan), un problema combinatorio NP-difícil',
                        'Es la optimización de los horarios de vuelo de aerolíneas con restricciones de combustible',
                        'Es la generación automática de cronogramas de proyectos con dependencias entre tareas'
                    ],
                    correct: 1,
                    exp: 'El Job Shop Scheduling asigna trabajos a máquinas en el orden correcto para minimizar el tiempo total de producción. Con N trabajos y M máquinas hay (N!)^M combinaciones posibles. Es NP-difícil y los AGs, junto con la búsqueda tabú, son de las mejores heurísticas conocidas para resolverlo.'
                },
                {
                    q: '¿Cómo se usan los Algoritmos Genéticos en el campo de la Bioinformática?',
                    opts: [
                        'Solo para visualizar estructuras de ADN en 3D sin análisis computacional',
                        'Para el alineamiento múltiple de secuencias, predicción de estructura de proteínas y descubrimiento de motivos genéticos en grandes bases de datos',
                        'Exclusivamente para el análisis estadístico de datos de expresión génica',
                        'Para clasificar especies en taxonomías filogenéticas usando redes neuronales'
                    ],
                    correct: 1,
                    exp: 'En Bioinformática, los AGs evolucionan alineamientos de secuencias de ADN/proteínas para maximizar la similitud entre ellas, ayudando a identificar regiones conservadas evolutivamente. También se usan en el plegamiento de proteínas (predicción de estructura 3D a partir de la secuencia de aminoácidos).'
                },
                {
                    q: '¿Qué es un "Algoritmo Genético Paralelo" y qué ventaja ofrece sobre el AG estándar?',
                    opts: [
                        'Un AG que ejecuta múltiples operadores de cruce en secuencia dentro de cada generación',
                        'Un AG con múltiples sub-poblaciones (islas) que evolucionan independientemente con migraciones periódicas, mejorando la diversidad y escalando en hardware multi-núcleo',
                        'Un AG que procesa en paralelo el cálculo del fitness de todos los individuos usando GPU',
                        'Un AG que usa múltiples funciones objetivo calculadas en diferentes hilos de ejecución'
                    ],
                    correct: 1,
                    exp: 'El Modelo de Islas (Island Model) divide la población en sub-poblaciones que evolucionan en paralelo. Periódicamente, los mejores individuos migran entre islas, introduciendo diversidad. Esto combate la convergencia prematura y aprovecha los procesadores multi-núcleo modernos, acelerando la búsqueda.'
                },
                {
                    q: '¿Cómo se aplica un AG a la optimización de carteras de inversión (Portfolio Optimization)?',
                    opts: [
                        'El AG predice los precios futuros de las acciones usando análisis técnico',
                        'El cromosoma codifica la proporción invertida en cada activo; el fitness maximiza el retorno esperado penalizando el riesgo (varianza), encontrando la Frontera Eficiente de Markowitz',
                        'Los AGs solo seleccionan el mejor activo individual en el que invertir toda la cartera',
                        'El AG optimiza el momento de compra/venta pero no la distribución entre activos'
                    ],
                    correct: 1,
                    exp: 'En finanzas, el cromosoma puede ser un vector de pesos [w1, w2, ..., wn] donde cada wᵢ representa el porcentaje invertido en el activo i. El fitness evalúa el balance retorno/riesgo de la cartera. Restricciones (∑wᵢ=1, wᵢ≥0) se manejan con reparación o penalización.'
                },
                {
                    q: '¿Qué son los "Algoritmos Evolutivos Diferenciales" (Differential Evolution) y cómo difieren de los AGs clásicos?',
                    opts: [
                        'Son AGs binarios que usan representación en punto fijo en lugar de coma flotante',
                        'Son una variante para espacios continuos donde la mutación se basa en las diferencias entre vectores de individuos aleatorios, sin operador de cruce monopunto',
                        'Son AGs con múltiples funciones de fitness que compiten por dominar la selección',
                        'Son AGs que usan gramáticas formales para codificar programas en lugar de arrays'
                    ],
                    correct: 1,
                    exp: 'La Evolución Diferencial (DE) es un tipo de EA para optimización continua. La mutación crea un "vector de ruido" sumando la diferencia ponderada de dos individuos a un tercero: v = a + F·(b−c). No usa operadores de cruce tradicionales. Es extremadamente efectivo en funciones multimodales de alta dimensión.'
                },
                {
                    q: '¿Cuál es el rol de los Algoritmos Genéticos en el aprendizaje automático (Neuroevolución)?',
                    opts: [
                        'Reemplazan el backpropagation para entrenar redes neuronales feedforward estándar como alternativa idéntica',
                        'Evolucionan los pesos, la arquitectura y la topología de redes neuronales sin usar gradientes, útil cuando la función de error no es diferenciable o tiene muchos mínimos locales',
                        'Solo se usan para seleccionar el conjunto de hiperparámetros óptimos antes de iniciar el entrenamiento con SGD',
                        'Generan datos sintéticos de entrenamiento para aumentar datasets de imágenes'
                    ],
                    correct: 1,
                    exp: 'La Neuroevolución (NEAT, HyperNEAT) usa AGs para evolucionar simultáneamente los pesos y la estructura de redes neuronales. Es especialmente útil en aprendizaje por refuerzo donde no hay etiquetas y la señal de recompensa es escasa. DeepMind y OpenAI han usado AGs para evolucionar agentes de juegos.'
                },
                {
                    q: '¿Por qué los AGs son útiles en el diseño de fármacos (Drug Discovery)?',
                    opts: [
                        'Porque pueden sintetizar físicamente nuevas moléculas en laboratorio sin intervención humana',
                        'Porque evolucionan la estructura química de moléculas para maximizar su afinidad con una proteína objetivo, explorando el vasto espacio de moléculas posibles de forma guiada',
                        'Porque reemplazan los ensayos clínicos con simulaciones genéticas de reacciones farmacológicas',
                        'Solo porque aceleran el análisis estadístico de bases de datos de compuestos conocidos'
                    ],
                    correct: 1,
                    exp: 'El espacio de moléculas drug-like tiene más de 10^60 compuestos posibles (más que átomos en el universo observable). Los AGs codifican moléculas como grafos o SMILES strings y usan funciones de docking molecular como fitness. Han acelerado el descubrimiento de candidatos a fármacos para cáncer, Alzheimer y COVID-19.'
                }
            ]
        };
    }

    // =========================================================================
    // INICIALIZACIÓN
    // =========================================================================
    init() {
        // Botones de las tarjetas de examen
        document.querySelectorAll('.exam-start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const exam = btn.getAttribute('data-exam');
                this.startExam(exam);
            });
        });

        // Volver al hub desde el header del examen activo
        const btnBackHub = document.getElementById('btn-quiz-back-to-hub');
        if (btnBackHub) btnBackHub.onclick = () => this.showHub();

        // Volver al hub desde resultados
        const btnBackHubResult = document.getElementById('btn-quiz-back-hub-result');
        if (btnBackHubResult) btnBackHubResult.onclick = () => this.showHub();

        // Siguiente pregunta
        const btnNext = document.getElementById('btn-quiz-next');
        if (btnNext) btnNext.onclick = () => this.nextQuestion();

        // Repetir examen
        const btnRestart = document.getElementById('btn-quiz-restart');
        if (btnRestart) btnRestart.onclick = () => this.startExam(this.currentExam);

        // Actualizar historial de pantalla inicial
        this._updateHistoryDisplay();
    }

    // =========================================================================
    // FLUJO DE NAVEGACIÓN
    // =========================================================================

    showHub() {
        const hub = document.getElementById('quiz-hub-screen');
        const container = document.getElementById('quiz-active-container');
        if (hub) { hub.classList.add('active'); hub.style.display = ''; }
        if (container) container.style.display = 'none';
        this._updateHistoryDisplay();
    }

    startExam(examKey) {
        this.currentExam = examKey;
        this.questions   = this._shuffle([...this.questionBank[examKey]]);
        this.currentIdx  = 0;
        this.score       = 0;
        this.answered    = false;

        // Cambiar vista
        const hub = document.getElementById('quiz-hub-screen');
        const container = document.getElementById('quiz-active-container');
        if (hub) { hub.classList.remove('active'); hub.style.display = 'none'; }
        if (container) container.style.display = '';

        // Actualizar cabecera del examen activo
        const meta = this.examMeta[examKey];
        const titleEl = document.getElementById('quiz-active-title');
        const badgeEl = document.getElementById('quiz-active-badge');
        if (titleEl) titleEl.textContent = meta.title;
        if (badgeEl) badgeEl.textContent = meta.icon;

        // Mostrar pantalla de preguntas, ocultar resultados
        this._showScreen('question');

        // Cargar primera pregunta
        this._renderQuestion();
    }

    // =========================================================================
    // LÓGICA DEL QUIZ
    // =========================================================================

    _renderQuestion() {
        const q = this.questions[this.currentIdx];
        const total = this.questions.length;

        // Ocultar explicación
        const expBox = document.getElementById('quiz-explanation-box');
        if (expBox) expBox.classList.add('hidden');
        this.answered = false;

        // Texto de la pregunta
        const qText = document.getElementById('quiz-question-text');
        if (qText) qText.textContent = q.q;

        // Contador
        const currNumEl = document.getElementById('quiz-curr-q-num');
        const totalEl = document.getElementById('quiz-total-q-count');
        if (currNumEl) currNumEl.textContent = this.currentIdx + 1;
        if (totalEl)   totalEl.textContent   = total;

        // Barra de progreso
        const bar = document.getElementById('quiz-progress-bar');
        if (bar) bar.style.width = `${((this.currentIdx) / total) * 100}%`;

        // Opciones
        const container = document.getElementById('quiz-options-container');
        if (!container) return;

        container.innerHTML = q.opts.map((opt, i) => `
            <button class="option-btn" data-idx="${i}" id="opt-btn-${i}">
                <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
                <span class="opt-text">${opt}</span>
            </button>
        `).join('');

        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                this.answerQuestion(idx);
            });
        });
    }

    answerQuestion(selectedIdx) {
        if (this.answered) return;
        this.answered = true;

        const q = this.questions[this.currentIdx];
        const isCorrect = selectedIdx === q.correct;
        if (isCorrect) this.score++;

        // Resaltar opciones
        const optBtns = document.querySelectorAll('.option-btn');
        optBtns.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) {
                btn.classList.add('correct');
            } else if (i === selectedIdx && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Mostrar explicación
        const expBox    = document.getElementById('quiz-explanation-box');
        const expStatus = document.getElementById('quiz-explanation-status');
        const expText   = document.getElementById('quiz-explanation-text');

        if (expBox)    expBox.classList.remove('hidden');
        if (expStatus) {
            expStatus.textContent = isCorrect ? '¡Correcto! ✓' : '✗ Incorrecto';
            expStatus.className = 'explanation-status ' + (isCorrect ? 'correct-status' : 'wrong-status');
        }
        if (expText) expText.innerHTML = q.exp;

        // Cambiar texto del botón siguiente si es la última pregunta
        const btnNext = document.getElementById('btn-quiz-next');
        if (btnNext) {
            const isLast = this.currentIdx === this.questions.length - 1;
            btnNext.textContent = isLast ? 'Ver Resultados 🏆' : 'Siguiente Pregunta →';
        }
    }

    nextQuestion() {
        if (!this.answered) return;
        this.currentIdx++;
        if (this.currentIdx >= this.questions.length) {
            this._showResults();
        } else {
            this._renderQuestion();
        }
    }

    // =========================================================================
    // RESULTADOS
    // =========================================================================

    _showResults() {
        this._showScreen('result');

        const total   = this.questions.length;
        const score   = this.score;
        const pct     = (score / total) * 100;

        // Guardar en historial
        this.examHistory[this.currentExam] = { score, total, pct };

        // Registrar en el admin del app global si existe
        if (window.app && window.app.studentGrades) {
            const meta = this.examMeta[this.currentExam];
            window.app.studentGrades.push({
                name:  window.app.username || 'Alumno',
                role:  'Estudiante',
                score: score,
                badge: this._getBadge(pct).name,
                date:  new Date().toISOString().split('T')[0],
                exam:  meta.title
            });
            window.app.updateAdminMetrics?.();
        }

        // Actualizar DOM
        const badge = this._getBadge(pct);

        const scoreEl  = document.getElementById('quiz-result-score');
        const totalEl  = document.getElementById('quiz-total-q-count-result');
        const iconEl   = document.getElementById('quiz-result-badge-icon');
        const nameEl   = document.getElementById('quiz-result-badge-name');
        const descEl   = document.getElementById('quiz-result-badge-desc');

        if (scoreEl) scoreEl.textContent = score;
        if (totalEl) totalEl.textContent = total;
        if (iconEl)  iconEl.textContent  = badge.icon;
        if (nameEl)  nameEl.textContent  = badge.name;
        if (descEl)  descEl.textContent  = badge.desc;

        // Animación de la barra de progreso al 100%
        const bar = document.getElementById('quiz-progress-bar');
        if (bar) bar.style.width = '100%';
    }

    _getBadge(pct) {
        if (pct >= 100) return { icon: '🏆', name: 'Gran Creador Artificial', desc: 'Puntuación perfecta. Dominas completamente esta área de los Algoritmos Genéticos. ¡Eres un maestro!' };
        if (pct >= 80)  return { icon: '🥇', name: 'Científico del Genoma',  desc: 'Excelente dominio del tema. Solo unos matices te separan de la perfección. ¡Sigue adelante!' };
        if (pct >= 60)  return { icon: '🥈', name: 'Ingeniero de Mutación',  desc: 'Buen nivel. Comprendes los conceptos centrales. Repasa las explicaciones de las respuestas incorrectas.' };
        if (pct >= 40)  return { icon: '🥉', name: 'Aprendiz Evolutivo',     desc: 'Base sólida en construcción. Te recomendamos revisar el módulo del curso y volver a intentarlo.' };
        return { icon: '🌱', name: 'Novato del Gen', desc: 'Todo viaje evolutivo comienza desde cero. Revisa el curso completo y regresa: ¡evolucionarás!' };
    }

    // =========================================================================
    // AUXILIARES
    // =========================================================================

    _showScreen(screen) {
        const questionScreen = document.getElementById('quiz-question-screen');
        const resultScreen   = document.getElementById('quiz-result-screen');
        if (questionScreen) questionScreen.classList.toggle('active', screen === 'question');
        if (resultScreen)   resultScreen.classList.toggle('active', screen === 'result');
    }

    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    _updateHistoryDisplay() {
        ['basics', 'operators', 'realworld'].forEach(key => {
            const el = document.getElementById(`hist-${key}`);
            if (!el) return;
            const hist = this.examHistory[key];
            if (hist) {
                el.textContent = `${hist.score}/${hist.total} (${hist.pct.toFixed(0)}%)`;
                el.style.color = hist.pct >= 80 ? 'var(--neon-green)' : hist.pct >= 60 ? 'var(--neon-yellow, #f5e642)' : 'var(--neon-pink)';
            } else {
                el.textContent = '—';
                el.style.color = '';
            }
        });
    }

    // Compatibilidad con el admin panel
    addCustomQuestion(q, opts, correct, exp) {
        const customQ = { q, opts, correct, exp };
        // Añadir a los tres exámenes para que esté disponible en cualquiera
        Object.keys(this.questionBank).forEach(k => {
            this.questionBank[k].push(customQ);
        });
    }
}
