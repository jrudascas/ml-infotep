/**
 * ==========================================================================
 * COORDINADOR Y CONTROLADOR PRINCIPAL DE LA PLATAFORMA (GeneTech App Core)
 * ==========================================================================
 */

class AppController {
    constructor() {
        this.currentTab = "inicio";
        this.isPlaying = false;
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        
        // Estado de Seguridad y Roles
        this.userRole = null; // 'student' o 'admin'
        this.username = "";
        
        // Base de Datos Simulada de Notas para el Administrador
        this.studentGrades = [
            { name: "Juan Pérez", role: "Estudiante", score: 7, badge: "Científico del Genoma", date: "2026-05-28" },
            { name: "María Gómez", role: "Estudiante", score: 8, badge: "Gran Creador Artificial", date: "2026-05-28" },
            { name: "Carlos Ruiz", role: "Estudiante", score: 4, badge: "Ingeniero de Mutación", date: "2026-05-27" },
            { name: "Ana Delgado", role: "Estudiante", score: 2, badge: "Novato del Gen", date: "2026-05-26" }
        ];

        // Instancias de Módulos
        this.stringSim = new StringSimulator();
        this.tspSim = new TSPSimulator();
        this.courseMod = new CourseModule();
        this.quizMod = new QuizModule();
        this.codeMod = new CodeExamplesModule();

        // Estado del demo en Inicio
        this.demoInterval = null;
        this.demoIsRunning = false;
    }

    /**
     * Inicializa toda la plataforma.
     */
    init() {
        // 1. Inicializar Módulos de Contenido
        this.courseMod.init();
        this.quizMod.init();
        this.codeMod.init();

        // 2. Configurar Navegación SPA
        const navBtns = document.querySelectorAll(".nav-btn");
        navBtns.forEach(btn => {
            btn.onclick = () => {
                const tab = btn.getAttribute("data-tab");
                this.switchTab(tab);
            };
        });

        // Logo redirige al inicio
        const navLogo = document.getElementById("nav-logo");
        if (navLogo) {
            navLogo.onclick = (e) => {
                e.preventDefault();
                if (this.userRole) {
                    this.switchTab("inicio");
                }
            };
        }

        // 3. Configurar el Sistema de Autenticación (Login)
        this.setupAuthentication();

        // 4. Configurar Controles e Interactividad en el Laboratorio
        this.setupLabControls();

        // 5. Configurar el Demo de la pestaña de Inicio
        this.setupHomeDemo();

        // 6. Escuchar el cambio de tamaño de pantalla para gráficos
        window.addEventListener("resize", () => {
            if (this.currentTab === "laboratorio" && this.userRole) {
                this.stringSim.resizeChartCanvas();
                this.stringSim.drawChart();
                this.tspSim.render();
            }
        });
    }

    /**
     * Configura los eventos del flujo de inicio de sesión.
     */
    setupAuthentication() {
        const btnStudent = document.getElementById("btn-login-student");
        const btnAdmin = document.getElementById("btn-login-admin");
        const formLogin = document.getElementById("login-form");
        const btnLogout = document.getElementById("btn-logout");

        if (btnStudent) {
            btnStudent.onclick = () => {
                this.login("student", "Estudiante Invitado");
            };
        }

        if (btnAdmin) {
            btnAdmin.onclick = () => {
                this.login("admin", "Prof. Darwin");
            };
        }

        if (formLogin) {
            formLogin.onsubmit = (e) => {
                e.preventDefault();
                const usernameInput = document.getElementById("login-username").value.trim();
                const roleSelect = document.getElementById("login-role-select").value;
                
                if (usernameInput) {
                    this.login(roleSelect, usernameInput);
                }
            };
        }

        if (btnLogout) {
            btnLogout.onclick = () => {
                this.logout();
            };
        }
    }

    /**
     * Inicia sesión de un usuario con un rol.
     * @param {string} role - 'student' o 'admin'
     * @param {string} name - Nombre completo del usuario
     */
    login(role, name) {
        this.userRole = role;
        this.username = name;

        // Ocultar Overlay de Login
        document.getElementById("login-overlay").classList.add("hidden");

        // Mostrar y configurar el perfil de usuario en la cabecera
        const profileNav = document.getElementById("user-profile-nav");
        const displayName = document.getElementById("user-display-name");
        const displayRole = document.getElementById("user-display-role");
        const avatarInitials = document.getElementById("user-avatar-initials");

        if (profileNav) profileNav.classList.remove("hidden");
        if (displayName) displayName.textContent = name;
        if (displayRole) displayRole.textContent = role === "admin" ? "Administrador" : "Estudiante";
        if (avatarInitials) avatarInitials.textContent = name.substring(0, 2).toUpperCase();

        // Configurar accesos específicos del rol
        const btnAdminTab = document.getElementById("tab-btn-admin");
        if (role === "admin") {
            if (btnAdminTab) btnAdminTab.classList.remove("hidden");
            this.setupAdminPanel(); // Inicializar Gradebook y eventos del admin
        } else {
            if (btnAdminTab) btnAdminTab.classList.add("hidden");
        }

        // Renderizar la advertencia escolar en el laboratorio para el estudiante
        this.renderStudentWarningNotice();

        // Inicializar el Simulador por defecto con los parámetros correspondientes
        this.resetSimulatorWithParams();

        // Ir a inicio por defecto
        this.switchTab("inicio");
    }

    /**
     * Cierra la sesión activa y restaura el estado inicial bloqueado.
     */
    logout() {
        this.pauseEvolution();
        this.stopHomeDemo();

        this.userRole = null;
        this.username = "";

        // Mostrar overlay de login
        document.getElementById("login-overlay").classList.remove("hidden");

        // Ocultar perfil en cabecera
        document.getElementById("user-profile-nav").classList.add("hidden");
        document.getElementById("tab-btn-admin").classList.add("hidden");

        // Limpiar inputs
        document.getElementById("login-username").value = "";

        // Resetear vista activa
        this.switchTab("inicio");
    }

    /**
     * Muestra u oculta la burbuja de advertencia estudiantil en el panel de parámetros del Laboratorio.
     */
    renderStudentWarningNotice() {
        const sidebar = document.querySelector(".lab-sidebar");
        if (!sidebar) return;

        // Eliminar aviso anterior si existe
        const existingNotice = document.querySelector(".student-warning-notice");
        if (existingNotice) existingNotice.remove();

        if (this.userRole === "student") {
            const notice = document.createElement("div");
            notice.className = "student-warning-notice";
            notice.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px; height:18px; margin-top:2px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <div>
                    <strong>Límites Escolares Activos:</strong><br>
                    Para asegurar la estabilidad, los estudiantes tienen la población limitada a 200 y la mutación al 5%. Inicia sesión como Admin para omitir límites.
                </div>
            `;
            // Insertar justo antes del bloque de botones de acción
            const actions = document.querySelector(".lab-actions");
            if (actions) {
                sidebar.insertBefore(notice, actions);
            }
        }
    }

    /**
     * Navega dinámicamente entre pestañas/vistas de la SPA.
     * @param {string} tabId - Identificador de la pestaña ('inicio', 'curso', 'laboratorio', etc.)
     * @param {number} [lessonIndex] - Opcional, abre una lección específica si va a 'curso'
     */
    switchTab(tabId, lessonIndex) {
        // Impedir navegación si no está logueado
        if (!this.userRole) return;

        // Impedir que un estudiante intente entrar por código a la vista admin
        if (tabId === "admin" && this.userRole !== "admin") {
            this.switchTab("inicio");
            return;
        }

        // Pausar simulación si cambiamos de sección
        if (this.isPlaying) {
            this.pauseEvolution();
        }

        // Desactivar pestañas anteriores
        document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
        document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

        // Activar la nueva pestaña
        this.currentTab = tabId;
        const targetView = document.getElementById(`view-${tabId}`);
        const targetBtn = document.getElementById(`tab-btn-${tabId}`);

        if (targetView) targetView.classList.add("active");
        if (targetBtn) targetBtn.classList.add("active");

        // Rutinas de carga especiales por pestaña
        if (tabId === "laboratorio") {
            // Asegurar que el canvas del gráfico tome su tamaño real
            setTimeout(() => {
                this.stringSim.resizeChartCanvas();
                this.stringSim.render();
                this.tspSim.render();
            }, 50);
        } else if (tabId === "curso" && lessonIndex !== undefined) {
            this.courseMod.selectLesson(lessonIndex);
        } else if (tabId === "admin") {
            this.renderAdminGradebook();
        }

        // Si salimos de inicio, detener el demo de inicio
        if (tabId !== "inicio" && this.demoIsRunning) {
            this.stopHomeDemo();
        }

        // Hacer scroll hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Configura y enlaza todos los sliders y selectores del laboratorio.
     */
    setupLabControls() {
        const simSelector = document.getElementById("sim-selector");
        const sliderPop = document.getElementById("slider-pop-size");
        const sliderMut = document.getElementById("slider-mutation");
        const sliderCross = document.getElementById("slider-crossover");
        const selectSel = document.getElementById("select-selection");
        const inputString = document.getElementById("input-target-string");
        const sliderCities = document.getElementById("slider-cities");
        const sliderSpeed = document.getElementById("slider-speed");

        // Botones
        const btnPlay = document.getElementById("btn-lab-play");
        const btnStep = document.getElementById("btn-lab-step");
        const btnReset = document.getElementById("btn-lab-reset");
        const btnClearCities = document.getElementById("btn-tsp-clear-cities");

        // Sincronizar Sliders de control con su valor numérico de texto visible
        const bindSlider = (slider, valueEl, suffix = "", isPopLimit = false, isMutLimit = false) => {
            if (slider && valueEl) {
                slider.addEventListener("input", () => {
                    let val = parseFloat(slider.value);
                    
                    // Enjuiciar límites del Estudiante
                    if (this.userRole === "student") {
                        if (isPopLimit && val > 200) {
                            slider.value = 200;
                            val = 200;
                            valueEl.textContent = "200 (🔒 Límite)";
                        } else if (isMutLimit && val > 5) {
                            slider.value = 5;
                            val = 5;
                            valueEl.textContent = "5% (🔒 Límite)";
                        } else {
                            valueEl.textContent = slider.value + suffix;
                        }
                    } else {
                        valueEl.textContent = slider.value + suffix;
                    }
                    
                    this.resetSimulatorWithParams(); // Recalcular con nuevos parámetros en tiempo real
                });
            }
        };

        bindSlider(sliderPop, document.getElementById("val-pop-size"), "", true, false);
        bindSlider(sliderMut, document.getElementById("val-mutation"), "%", false, true);
        bindSlider(sliderCross, document.getElementById("val-crossover"), "%");
        bindSlider(sliderCities, document.getElementById("val-cities"));

        // Slider especial de velocidad
        if (sliderSpeed) {
            sliderSpeed.addEventListener("input", () => {
                const valSpeed = document.getElementById("val-speed");
                const val = parseInt(sliderSpeed.value);
                if (val === 60) {
                    valSpeed.textContent = "Normal (60fps)";
                } else {
                    valSpeed.textContent = `${val} generaciones/seg`;
                }
            });
        }

        // Selector de Problema (String vs TSP)
        if (simSelector) {
            simSelector.onchange = () => {
                const isString = simSelector.value === "string";
                
                // Mostrar/ocultar paneles laterales correspondientes
                document.getElementById("string-controls-group").style.display = isString ? "block" : "none";
                document.getElementById("tsp-controls-group").style.display = isString ? "none" : "block";

                // Mostrar/ocultar pantallas de simulación centrales
                document.getElementById("screen-string").style.display = isString ? "flex" : "none";
                document.getElementById("screen-tsp").style.display = isString ? "none" : "flex";

                this.resetSimulatorWithParams();
            };
        }

        // Entrada de texto objetivo (filtrar caracteres válidos en mayúsculas)
        if (inputString) {
            inputString.oninput = () => {
                // Filtrar solo letras de la bolsa
                const filtered = inputString.value.toUpperCase().replace(/[^A-ZÑ ]/g, "");
                inputString.value = filtered;
                this.resetSimulatorWithParams();
            };
        }

        // Acción: Play / Pausa
        if (btnPlay) {
            btnPlay.onclick = () => {
                if (this.isPlaying) {
                    this.pauseEvolution();
                } else {
                    this.startEvolution();
                }
            };
        }

        // Acción: Paso único
        if (btnStep) {
            btnStep.onclick = () => {
                this.pauseEvolution();
                this.evolveStep();
            };
        }

        // Acción: Reiniciar
        if (btnReset) {
            btnReset.onclick = () => {
                this.pauseEvolution();
                this.resetSimulatorWithParams();
            };
        }

        // Acción TSP: Limpiar ciudades interactivo
        if (btnClearCities) {
            btnClearCities.onclick = () => {
                this.pauseEvolution();
                this.tspSim.clearCities();
                
                // Forzar sincronización de contadores a cero
                if (sliderCities) {
                    sliderCities.value = 0;
                    document.getElementById("val-cities").textContent = "0";
                }
            };
        }
    }

    /**
     * Reinicia e inicializa el simulador activo usando los parámetros de la interfaz de usuario.
     */
    resetSimulatorWithParams() {
        if (!this.userRole) return;

        const isString = document.getElementById("sim-selector").value === "string";
        
        // Obtener parámetros
        let popSize = parseInt(document.getElementById("slider-pop-size").value);
        let mutationVal = parseFloat(document.getElementById("slider-mutation").value);
        const crossoverRate = parseInt(document.getElementById("slider-crossover").value) / 100;
        const selectionMethod = document.getElementById("select-selection").value;

        // Forzar límites en la carga si el rol es estudiante
        if (this.userRole === "student") {
            if (popSize > 200) {
                popSize = 200;
                document.getElementById("slider-pop-size").value = 200;
                document.getElementById("val-pop-size").textContent = "200 (🔒 Límite)";
            }
            if (mutationVal > 5) {
                mutationVal = 5;
                document.getElementById("slider-mutation").value = 5;
                document.getElementById("val-mutation").textContent = "5% (🔒 Límite)";
            }
        }

        const mutationRate = mutationVal / 100;

        if (isString) {
            const targetString = document.getElementById("input-target-string").value || "ALGORITMO GENETICO";
            this.stringSim.init({
                targetString: targetString,
                populationSize: popSize,
                mutationRate: mutationRate,
                crossoverRate: crossoverRate,
                selectionMethod: selectionMethod
            });
        } else {
            const numCities = parseInt(document.getElementById("slider-cities").value);
            this.tspSim.init({
                numCities: numCities,
                populationSize: popSize,
                mutationRate: mutationRate,
                crossoverRate: crossoverRate,
                selectionMethod: selectionMethod
            });
        }

        // Restablecer botón de reproducción
        const btnPlay = document.getElementById("btn-lab-play");
        if (btnPlay) {
            btnPlay.textContent = "▶️ Iniciar";
            btnPlay.className = "btn btn-success btn-block";
        }
    }

    /**
     * Comienza el bucle evolutivo automático.
     */
    startEvolution() {
        this.isPlaying = true;
        const btnPlay = document.getElementById("btn-lab-play");
        if (btnPlay) {
            btnPlay.textContent = "⏸️ Pausar";
            btnPlay.className = "btn btn-danger btn-block";
        }
        
        this.lastFrameTime = performance.now();
        this.evolutionLoop();
    }

    /**
     * Pausa el bucle evolutivo automático.
     */
    pauseEvolution() {
        this.isPlaying = false;
        const btnPlay = document.getElementById("btn-lab-play");
        if (btnPlay) {
            btnPlay.textContent = "▶️ Reanudar";
            btnPlay.className = "btn btn-success btn-block";
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Da un paso único de evolución.
     */
    evolveStep() {
        const isString = document.getElementById("sim-selector").value === "string";
        if (isString) {
            this.stringSim.step();
            if (this.stringSim.isFinished()) {
                this.pauseEvolution();
            }
        } else {
            this.tspSim.step();
        }
    }

    /**
     * Bucle evolutivo principal controlado por el slider de velocidad.
     */
    evolutionLoop(now = performance.now()) {
        if (!this.isPlaying) return;

        const isString = document.getElementById("sim-selector").value === "string";
        const speedSetting = parseInt(document.getElementById("slider-speed").value);

        // Controlar frames por segundo según la velocidad elegida
        if (speedSetting === 60) {
            // Máxima velocidad: un paso en cada frame de animación (60 FPS aprox)
            this.evolveStep();
        } else {
            // Velocidad acotada (ej. 5, 10, 30 generaciones por segundo)
            const interval = 1000 / speedSetting;
            const elapsed = now - this.lastFrameTime;

            if (elapsed >= interval) {
                // Cuántos pasos dar si el navegador se ralentizó
                const steps = Math.min(3, Math.floor(elapsed / interval));
                for (let i = 0; i < steps; i++) {
                    this.evolveStep();
                }
                this.lastFrameTime = now - (elapsed % interval);
            }
        }

        // Comprobar si el simulador ha finalizado para frenar el bucle
        const activeSim = isString ? this.stringSim : this.tspSim;
        if (activeSim.isFinished()) {
            this.pauseEvolution();
            return;
        }

        this.animationFrameId = requestAnimationFrame((timestamp) => this.evolutionLoop(timestamp));
    }

    /**
     * ======================================================================
     * MÉTODOS Y EVENTOS DEL PANEL DE ADMINISTRACIÓN
     * ======================================================================
     */
    setupAdminPanel() {
        const searchInput = document.getElementById("admin-search-student");
        const formQuestion = document.getElementById("admin-question-form");

        // Evento de búsqueda de notas
        if (searchInput) {
            searchInput.oninput = () => {
                this.renderAdminGradebook(searchInput.value);
            };
        }

        // Evento de creación de preguntas
        if (formQuestion) {
            formQuestion.onsubmit = (e) => {
                e.preventDefault();
                
                const qText = document.getElementById("admin-q-text").value.trim();
                const optA = document.getElementById("admin-q-opt-a").value.trim();
                const optB = document.getElementById("admin-q-opt-b").value.trim();
                const optC = document.getElementById("admin-q-opt-c").value.trim();
                const optD = document.getElementById("admin-q-opt-d").value.trim();
                const correctIdx = parseInt(document.getElementById("admin-q-correct").value);
                const explanation = document.getElementById("admin-q-explanation").value.trim();

                if (qText && optA && optB && optC && optD && explanation) {
                    // Inyectar en el módulo de quiz
                    this.quizMod.addCustomQuestion(qText, [optA, optB, optC, optD], correctIdx, explanation);
                    
                    // Mostrar feedback de éxito
                    const feedback = document.getElementById("admin-form-feedback");
                    if (feedback) {
                        feedback.classList.remove("hidden");
                        setTimeout(() => {
                            feedback.classList.add("hidden");
                        }, 3000);
                    }

                    // Resetear formulario
                    formQuestion.reset();
                    this.updateAdminMetrics();
                }
            };
        }

        this.updateAdminMetrics();
    }

    /**
     * Calcula y actualiza las métricas en las tarjetas del panel de control de administrador.
     */
    updateAdminMetrics() {
        const totalEl = document.getElementById("admin-stat-total-students");
        const scoreEl = document.getElementById("admin-stat-average-score");
        const badgeEl = document.getElementById("admin-stat-top-badge");

        if (totalEl) totalEl.textContent = this.studentGrades.length;

        if (scoreEl) {
            const sum = this.studentGrades.reduce((acc, current) => acc + current.score, 0);
            const avg = sum / this.studentGrades.length;
            // El cuestionario original tiene 8, pero se puede escalar
            scoreEl.textContent = `${avg.toFixed(1)} / 8`;
        }

        if (badgeEl) {
            // Contar la insignia más popular
            const counts = {};
            this.studentGrades.forEach(g => counts[g.badge] = (counts[g.badge] || 0) + 1);
            let topBadge = "Ninguna";
            let maxCount = 0;
            for (let b in counts) {
                if (counts[b] > maxCount) {
                    maxCount = counts[b];
                    topBadge = b.split(" ")[0]; // Solo la primera palabra para que quepa bien
                }
            }
            badgeEl.textContent = topBadge;
        }
    }

    /**
     * Renderiza la tabla de alumnos y notas con soporte de filtrado por buscador.
     * @param {string} [filterText=""] - Cadena de búsqueda para filtrar alumnos
     */
    renderAdminGradebook(filterText = "") {
        const tableBody = document.getElementById("admin-table-grades-body");
        if (!tableBody) return;

        const query = filterText.toLowerCase().trim();
        const filtered = this.studentGrades.filter(grade => 
            grade.name.toLowerCase().includes(query) || 
            grade.badge.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; color: var(--text-muted); padding: 20px;">
                        Ningún alumno coincide con la búsqueda.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = filtered.map(grade => {
            let scoreColor = "text-green";
            if (grade.score < 4) scoreColor = "text-pink";
            else if (grade.score < 6) scoreColor = "text-yellow";

            return `
                <tr>
                    <td style="font-weight:600; color:var(--text-primary);">${grade.name}</td>
                    <td><span class="user-role" style="font-size:8.5px;">${grade.role}</span></td>
                    <td><strong class="${scoreColor}">${grade.score} / 8</strong></td>
                    <td class="text-cyan">${grade.badge}</td>
                    <td style="color:var(--text-muted); font-size:12px;">${grade.date}</td>
                </tr>
            `;
        }).join("");
    }

    /**
     * ======================================================================
     * DEMO DE LA PESTAÑA DE INICIO
     * ======================================================================
     */
    setupHomeDemo() {
        const btnDemo = document.getElementById("btn-demo-start");
        const helixContainer = document.getElementById("demo-dna-helix");

        // Crear una hélice de ADN visual interactiva de fondo
        if (helixContainer) {
            let helixHtml = "";
            for (let i = 0; i < 20; i++) {
                const delay = (i * 0.1).toFixed(1);
                helixHtml += `<div class="dna-bar" style="animation-delay: ${delay}s;"></div>`;
            }
            helixContainer.innerHTML = helixHtml;
        }

        if (btnDemo) {
            btnDemo.onclick = () => {
                if (this.demoIsRunning) {
                    this.stopHomeDemo();
                } else {
                    this.startHomeDemo();
                }
            };
        }
    }

    /**
     * Inicia la mini evolución automática del dashboard.
     */
    startHomeDemo() {
        const btnDemo = document.getElementById("btn-demo-start");
        if (btnDemo) {
            btnDemo.textContent = "⏹️ Detener Demostración";
            btnDemo.className = "btn btn-danger btn-sm";
        }
        
        this.demoIsRunning = true;
        
        const target = "ALGORITMO GENETICO";
        const pool = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ ";
        
        const demoGA = new GeneticAlgorithm({
            populationSize: 80,
            mutationRate: 0.02,
            crossoverRate: 0.8,
            chromosomeLength: target.length,
            geneGeneratorFn: () => pool[Math.floor(Math.random() * pool.length)],
            fitnessFn: (genes) => {
                let matches = 0;
                for (let i = 0; i < target.length; i++) {
                    if (genes[i] === target[i]) matches++;
                }
                return Math.pow(matches / target.length, 2);
            },
            crossoverFn: (parentA, parentB) => {
                const pt = Math.floor(Math.random() * parentA.length);
                return [
                    parentA.substring(0, pt) + parentB.substring(pt),
                    parentB.substring(0, pt) + parentA.substring(pt)
                ];
            },
            mutateFn: (genes, rate) => {
                let mut = "";
                for (let i = 0; i < genes.length; i++) {
                    mut += (Math.random() < rate) ? pool[Math.floor(Math.random() * pool.length)] : genes[i];
                }
                return mut;
            }
        });

        demoGA.initPopulation();

        const bestEl = document.getElementById("demo-best-chromosome");
        const genEl = document.getElementById("demo-generation");
        const fitEl = document.getElementById("demo-fitness");

        this.demoInterval = setInterval(() => {
            demoGA.step();
            
            if (genEl) genEl.textContent = demoGA.generation;
            
            const bestGenes = demoGA.bestIndividual.genes;
            const bestRealFit = Math.sqrt(demoGA.bestIndividual.fitness) * 100;
            
            if (fitEl) fitEl.textContent = `${bestRealFit.toFixed(0)}%`;
            
            if (bestEl) {
                let markup = "";
                for (let i = 0; i < target.length; i++) {
                    if (bestGenes[i] === target[i]) {
                        markup += `<span class="text-green">${bestGenes[i]}</span>`;
                    } else {
                        markup += `<span class="text-muted" style="opacity:0.5;">${bestGenes[i] === " " ? "_" : bestGenes[i]}</span>`;
                    }
                }
                bestEl.innerHTML = markup;
            }

            if (bestGenes === target || demoGA.generation >= 500) {
                this.stopHomeDemo();
            }
        }, 40);
    }

    /**
     * Detiene la mini evolución.
     */
    stopHomeDemo() {
        if (this.demoInterval) {
            clearInterval(this.demoInterval);
            this.demoInterval = null;
        }
        
        this.demoIsRunning = false;
        
        const btnDemo = document.getElementById("btn-demo-start");
        if (btnDemo) {
            btnDemo.textContent = "▶️ Iniciar Demostración";
            btnDemo.className = "btn btn-primary btn-sm";
        }
    }
}

// Instanciar globalmente para interactividad directa del HTML onclick
window.app = new AppController();

// Arrancar cuando el DOM esté completamente cargado
window.addEventListener("DOMContentLoaded", () => {
    window.app.init();
});
