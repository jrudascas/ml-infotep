/**
 * ==========================================================================
 * CONTENIDO Y LOGICA DEL CURSO INTERACTIVO (GeneTech Course Module)
 * ==========================================================================
 */

class CourseModule {
    constructor() {
        this.currentLessonIdx = 0;
        
        // Contenido de las lecciones detalladas en Español
        this.lessons = [
            {
                title: "1. ¿Qué es un Algoritmo Genético?",
                category: "Introducción",
                content: `
                    <p>Los <strong>Algoritmos Genéticos (AG)</strong> son métodos de optimización y búsqueda inspirados en la teoría de la evolución natural de Charles Darwin. Forman parte de la disciplina de la <strong>Computación Evolutiva</strong> dentro de la Inteligencia Artificial.</p>
                    <p>Fueron popularizados por el científico computacional John Henry Holland en la década de 1970. La premisa fundamental es simple pero sumamente potente: <strong>hacer competir soluciones candidatas entre sí para que las mejores sobrevivan y transmitan sus virtudes a la siguiente generación</strong>.</p>
                    
                    <h3>El proceso de Selección Natural en la Computación</h3>
                    <p>En el mundo biológico, los seres vivos se adaptan a su entorno a lo largo del tiempo. Aquellos que poseen rasgos favorables (como mejor camuflaje o mayor fuerza) tienen más probabilidades de sobrevivir y reproducirse. En computación, aplicamos esta misma regla:</p>
                    <ul>
                        <li><strong>Individuos:</strong> Representan soluciones candidatas para el problema que deseamos resolver (ej. una ruta de camiones, una clave descifrada o un conjunto de pesos de una red neuronal).</li>
                        <li><strong>Entorno:</strong> El problema en sí.</li>
                        <li><strong>Supervivencia del más apto:</strong> Las soluciones que den mejores resultados (evaluadas mediante una función) son seleccionadas preferentemente.</li>
                    </ul>
                    <p>A lo largo de este curso, aprenderemos cómo programar estas fuerzas biológicas en la computadora para resolver retos complejos de optimización.</p>
                `
            },
            {
                title: "2. Cromosomas y Población Inicial",
                category: "Bases del AG",
                content: `
                    <p>Para que la evolución funcione en una computadora, primero debemos traducir la solución física del problema a un formato digital manipulable. Esto se logra mediante la distinción entre dos conceptos clave:</p>
                    
                    <h3>Genotipo vs. Fenotipo</h3>
                    <ul>
                        <li><strong>Genotipo (Cromosoma):</strong> La representación codificada de la solución. Generalmente se almacena en forma de cadenas binarias (ceros y unos), arrays de números o cadenas de texto.</li>
                        <li><strong>Fenotipo:</strong> La solución real en el mundo físico una vez decodificada. Por ejemplo, en el simulador de ruta, el genotipo es el array de índices <code>[0, 3, 1, 2]</code> y el fenotipo es el dibujo de la ruta conectando los puntos en el mapa.</li>
                    </ul>

                    <h3>Población Inicial</h3>
                    <p>Un algoritmo genético no trabaja con una sola solución a la vez, sino con un grupo completo llamado <strong>Población</strong>. La población inicial suele crearse de forma <strong>totalmente aleatoria</strong> para garantizar que el algoritmo explore un área amplia del espacio de soluciones.</p>
                    
                    <blockquote>
                        <strong>💡 Nota sobre Diversidad:</strong> Si la población inicial es demasiado pequeña o carece de variedad (poca diversidad genética), la evolución se estancará rápidamente en soluciones mediocres, conocidas como <em>óptimos locales</em>.
                    </blockquote>
                `
            },
            {
                title: "3. La Función de Aptitud (Fitness)",
                category: "Evaluación",
                content: `
                    <p>La <strong>Función de Aptitud</strong> (o <em>Fitness Function</em> en inglés) es el componente más crucial de un Algoritmo Genético. Es la brújula que guía a la evolución hacia el éxito.</p>
                    <p>Su función es recibir los genes de un cromosoma, evaluarlos frente al problema y devolver un <strong>único valor numérico</strong> que califique la calidad de dicha solución. Cuanto mayor sea este valor, mejor adaptado está el individuo.</p>

                    <h3>Ejemplos de Funciones de Aptitud</h3>
                    <ol>
                        <li><strong>En el Buscador de Texto (String Matcher):</strong> La aptitud se calcula contando cuántas letras del cromosoma coinciden exactamente en letra y posición con la frase objetivo.</li>
                        <li><strong>En el Problema del Viajante (TSP):</strong> Deseamos encontrar la distancia más corta. Como los algoritmos genéticos buscan maximizar el fitness, una estrategia habitual es usar la inversa de la distancia total del camino: 
                        <div style="text-align: center; margin: 15px 0; font-family: var(--font-mono); color: var(--neon-cyan);">Fitness = C / Distancia_Total</div>
                        Donde <code>C</code> es una constante (ej. 100,000). A menor distancia recorrida, el valor resultante de la división será mayor, premiando las rutas cortas.</li>
                    </ol>
                    <p>Diseñar una buena función de aptitud requiere entender a fondo el problema, ya que el algoritmo genético optimizará <em>estrictamente</em> lo que la función premie.</p>
                `
            },
            {
                title: "4. Operadores Genéticos en Acción",
                category: "Evolución",
                content: `
                    <p>Una vez que evaluamos la aptitud de la población, aplicamos tres operadores evolutivos para engendrar la siguiente generación mejorada:</p>
                    
                    <h3>1. Selección Natural</h3>
                    <p>Escoge qué individuos de la generación actual se reproducirán. Las técnicas comunes son la <strong>Ruleta</strong> (donde la probabilidad es proporcional al fitness) y el <strong>Torneo</strong> (se escogen <em>k</em> aleatorios y sobrevive el mejor de ellos).</p>

                    <h3>2. Cruce (Crossover) - Recombinación</h3>
                    <p>Imita la reproducción sexual. Mezcla el material genético de dos progenitores aptos para engendrar nuevos hijos. El punto de corte define dónde se dividen y combinan los genes.</p>
                    
                    <!-- WIDGET DE CRUCE INTERACTIVO -->
                    <div id="widget-crossover-placeholder"></div>

                    <h3>3. Mutación</h3>
                    <p>Añade variedad genética alterando genes individuales de forma aleatoria con una probabilidad muy baja (tasa de mutación $p_m$, usualmente del 0.5% al 2%). Impide que la población se clone idénticamente y se atasque en callejones sin salida.</p>
                    
                    <!-- WIDGET DE MUTACIÓN INTERACTIVA -->
                    <div id="widget-mutation-placeholder"></div>
                `
            },
            {
                title: "5. Convergencia y Criterios de Parada",
                category: "Finalización",
                content: `
                    <p>A medida que transcurren las generaciones, notaremos que la población se vuelve cada vez más homogénea. Las soluciones mediocres desaparecen y los mejores genes se propagan hasta que la población converge.</p>
                    
                    <h3>Criterios de Parada Habituales</h3>
                    <p>¿Cuándo detenemos la evolución? Puesto que en muchos problemas del mundo real desconocemos la solución perfecta de antemano, se suelen configurar los siguientes límites:</p>
                    <ul>
                        <li><strong>Solución Perfecta Encontrada:</strong> Cuando un cromosoma alcanza la puntuación de fitness ideal (ej. en el String Matcher, coincidencia al 100%).</li>
                        <li><strong>Generaciones Máximas:</strong> Detener el algoritmo tras alcanzar un límite (ej. 1,000 generaciones).</li>
                        <li><strong>Estancamiento (Estabilidad):</strong> Detener la evolución si el mejor individuo no ha mejorado su aptitud tras un número determinado de generaciones consecutivas (ej. 150 generaciones sin cambios).</li>
                    </ul>
                    <p>¡Ahora que dominas la teoría completa, estás listo para probar tus conocimientos en la sección de **Evaluación** o experimentar libremente en el **Laboratorio de Simulaciones**!</p>
                `
            }
        ];
    }

    /**
     * Inicializa y dibuja la navegación lateral de las lecciones.
     */
    init() {
        const navContainer = document.getElementById("lessons-nav");
        if (!navContainer) return;

        navContainer.innerHTML = this.lessons.map((lesson, idx) => {
            return `
                <button class="lesson-nav-btn ${idx === 0 ? 'active' : ''}" 
                        id="lesson-nav-${idx}"
                        onclick="course.selectLesson(${idx})">
                    ${lesson.title}
                </button>
            `;
        }).join("");

        // Cargar primera lección
        this.selectLesson(0);

        // Registrar eventos para botones Siguiente y Anterior
        const btnPrev = document.getElementById("btn-lesson-prev");
        const btnNext = document.getElementById("btn-lesson-next");

        if (btnPrev) btnPrev.onclick = () => this.navigateLesson(-1);
        if (btnNext) btnNext.onclick = () => this.navigateLesson(1);
    }

    /**
     * Muestra la lección indicada.
     */
    selectLesson(index) {
        if (index < 0 || index >= this.lessons.length) return;
        
        // Quitar clase activa de la barra lateral
        const prevActiveBtn = document.getElementById(`lesson-nav-${this.currentLessonIdx}`);
        if (prevActiveBtn) prevActiveBtn.classList.remove("active");

        this.currentLessonIdx = index;
        
        // Poner clase activa
        const newActiveBtn = document.getElementById(`lesson-nav-${index}`);
        if (newActiveBtn) newActiveBtn.classList.add("active");

        // Cargar contenidos
        const lesson = this.lessons[index];
        document.getElementById("lesson-current-category").textContent = lesson.category;
        document.getElementById("lesson-current-title").textContent = lesson.title;
        
        const bodyEl = document.getElementById("lesson-current-body");
        bodyEl.innerHTML = lesson.content;

        // Inyectar y arrancar widgets interactivos si la lección es la de operadores (índice 3)
        if (index === 3) {
            this.injectCrossoverWidget();
            this.injectMutationWidget();
        }

        // Controlar visibilidad de botones del pie de página
        document.getElementById("btn-lesson-prev").style.visibility = index === 0 ? "hidden" : "visible";
        document.getElementById("btn-lesson-next").textContent = index === this.lessons.length - 1 ? "Ir al Examen 📝" : "Siguiente Lección ➔";
        
        // Scroll automático hacia arriba en el panel de contenido
        document.getElementById("lesson-content-panel").scrollTop = 0;
    }

    /**
     * Navega adelante o atrás en las lecciones.
     */
    navigateLesson(direction) {
        const nextIndex = this.currentLessonIdx + direction;
        
        if (nextIndex >= this.lessons.length) {
            // Ir a la pestaña del Quiz
            if (window.app) {
                window.app.switchTab("evaluacion");
            }
        } else {
            this.selectLesson(nextIndex);
        }
    }

    /**
     * Inyecta el widget interactivo de Cruce (Crossover)
     */
    injectCrossoverWidget() {
        const placeholder = document.getElementById("widget-crossover-placeholder");
        if (!placeholder) return;

        placeholder.className = "interactive-widget";
        placeholder.innerHTML = `
            <div class="widget-title">
                <span>🧬 Simulador de Cruce (Crossover) Monopunto</span>
            </div>
            <div class="crossover-container">
                <div class="chromosomes-widget-row">
                    <div>
                        <div class="chromosome-block-label">Padre 1</div>
                        <div class="chromosome-binary" id="cross-p1">
                            <span class="part-a">1111</span><span class="part-b">1111</span>
                        </div>
                    </div>
                    <div>
                        <div class="chromosome-block-label">Padre 2</div>
                        <div class="chromosome-binary" id="cross-p2">
                            <span class="part-a">0000</span><span class="part-b">0000</span>
                        </div>
                    </div>
                </div>

                <div class="crossover-slider-control">
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom: 5px;">
                        <span>Punto de Cruce:</span>
                        <strong id="cross-split-val" class="text-cyan">4</strong>
                    </div>
                    <input type="range" id="slider-widget-crossover" min="1" max="7" value="4" style="margin:0;">
                </div>

                <div class="chromosomes-widget-row">
                    <div>
                        <div class="chromosome-block-label">Hijo 1</div>
                        <div class="chromosome-binary" id="cross-h1">
                            <span class="part-a">1111</span><span class="part-b">0000</span>
                        </div>
                    </div>
                    <div>
                        <div class="chromosome-block-label">Hijo 2</div>
                        <div class="chromosome-binary" id="cross-h2">
                            <span class="part-a">0000</span><span class="part-b">1111</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Lógica del Slider del widget de Cruce
        const slider = document.getElementById("slider-widget-crossover");
        const splitVal = document.getElementById("cross-split-val");
        
        const p1 = "11111111";
        const p2 = "00000000";

        const updateCrossoverWidget = () => {
            const splitPoint = parseInt(slider.value);
            splitVal.textContent = splitPoint;

            // Cortar cromosomas
            const p1A = p1.substring(0, splitPoint);
            const p1B = p1.substring(splitPoint);
            const p2A = p2.substring(0, splitPoint);
            const p2B = p2.substring(splitPoint);

            // Armar Hijos
            const h1A = p1A;
            const h1B = p2B;
            const h2A = p2A;
            const h2B = p1B;

            // Imprimir con colores
            document.getElementById("cross-p1").innerHTML = `<span class="part-a">${p1A}</span><span style="opacity:0.4; color:var(--text-primary);">|</span><span class="part-b">${p1B}</span>`;
            document.getElementById("cross-p2").innerHTML = `<span class="part-a">${p2A}</span><span style="opacity:0.4; color:var(--text-primary);">|</span><span class="part-b">${p2B}</span>`;
            
            document.getElementById("cross-h1").innerHTML = `<span class="part-a">${h1A}</span><span style="opacity:0.4; color:var(--text-primary);">|</span><span class="part-b" style="color:var(--neon-cyan);">${h1B}</span>`;
            document.getElementById("cross-h2").innerHTML = `<span class="part-a" style="color:var(--neon-cyan);">${h2A}</span><span style="opacity:0.4; color:var(--text-primary);">|</span><span class="part-b">${h2B}</span>`;
        };

        slider.oninput = updateCrossoverWidget;
        updateCrossoverWidget();
    }

    /**
     * Inyecta el widget interactivo de Mutación
     */
    injectMutationWidget() {
        const placeholder = document.getElementById("widget-mutation-placeholder");
        if (!placeholder) return;

        placeholder.className = "interactive-widget";
        placeholder.innerHTML = `
            <div class="widget-title">
                <span>🧬 Simulador de Mutación y Aptitud Decimal</span>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">Haz clic en cualquiera de los bits para provocar una mutación artificial (invertir 0 por 1) y observa cómo cambia su valor y fitness decimal en tiempo real.</p>
            
            <div class="mutation-gene-row" id="mutation-bits-container">
                <!-- Inyectado por JS -->
            </div>

            <div class="gene-info-output">
                Valor Entero Decodificado: <strong id="mutation-decimal" class="text-purple">172</strong> &bull; 
                Fitness (Valor/255): <strong id="mutation-fitness" class="text-green">67%</strong>
            </div>
        `;

        // Lógica de Mutación
        let bits = [1, 0, 1, 0, 1, 1, 0, 0]; // 172 por defecto
        const bitsContainer = document.getElementById("mutation-bits-container");

        const renderBits = () => {
            if (!bitsContainer) return;
            
            bitsContainer.innerHTML = bits.map((bit, idx) => {
                const isMutated = bit === 1;
                return `
                    <button class="gene-bit-btn ${isMutated ? 'mutated' : ''}" 
                            onclick="course.toggleBit(${idx})">
                        ${bit}
                    </button>
                `;
            }).join("");

            // Calcular decimal
            let decimalVal = 0;
            for (let i = 0; i < 8; i++) {
                if (bits[i] === 1) {
                    decimalVal += Math.pow(2, 7 - i); // Bit más significativo a la izquierda
                }
            }

            // Calcular fitness (decimalVal / 255)
            const fitness = (decimalVal / 255) * 100;

            document.getElementById("mutation-decimal").textContent = decimalVal;
            document.getElementById("mutation-fitness").textContent = `${fitness.toFixed(1)}%`;
        };

        // Guardar la función de palanca global
        this.toggleBit = (index) => {
            bits[index] = bits[index] === 0 ? 1 : 0;
            renderBits();
        };

        renderBits();
    }
}
