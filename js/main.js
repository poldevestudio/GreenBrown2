/**
 * Green Brown D2 — Modern Organic Studio & Command Deck
 * Poldev Estudio | JavaScript Nativo ES6+
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. CONFIGURACIÓN DEL CLIENTE (Fácil de actualizar)
  // =========================================================================
  const CONFIG = {
    // Reemplazar con el número de teléfono real del cliente (formato internacional sin '+' ni espacios)
    whatsappPhone: '5491100000000',
    defaultMessage: 'Hola Green Brown! Quiero consultar presupuesto para el mantenimiento de un parque.'
  };

  // Botón directo de visita inicial 24-48h hacia WhatsApp
  const radarBtn = document.querySelector('.radar-action-btn');
  if (radarBtn) {
    const radarMsg = encodeURIComponent('Hola Green Brown! Vi los turnos disponibles de 24-48h y quiero coordinar una visita inicial para mi lote.');
    radarBtn.href = `https://wa.me/${CONFIG.whatsappPhone}?text=${radarMsg}`;
  }

  // =========================================================================
  // 2. SELECTOR INTERACTIVO DE SERVICIOS (CARRUSEL CONTINUO TÁCTIL)
  // =========================================================================
  const nav = document.querySelector('.service-tabs-nav');
  const servicePanels = document.querySelectorAll('.service-panel');

  if (nav) {
    const originalButtons = Array.from(nav.querySelectorAll('.tab-button'));

    // Duplicamos los botones para crear un circuito infinito continuo sin salto visual
    for (let s = 0; s < 2; s++) {
      originalButtons.forEach(btn => {
        const clone = btn.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        nav.appendChild(clone);
      });
    }

    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let dragDistance = 0;
    let resumeTimer = null;
    const speed = 0.55; // Velocidad lenta y elegante hacia la izquierda (~33px/s)

    // Medir ancho de un set completo para el salto invisible
    function getSetWidth() {
      const allButtons = nav.querySelectorAll('.tab-button');
      if (allButtons.length > originalButtons.length) {
        const dist = allButtons[originalButtons.length].offsetLeft - allButtons[0].offsetLeft;
        if (dist > 0) return dist;
      }
      return nav.scrollWidth / 3;
    }

    // Auto-scroll continuo de derecha a izquierda (scrollLeft incrementa de forma suave)
    function autoScroll() {
      if (!isPaused && !isDragging) {
        nav.scrollLeft += speed;
        const setWidth = getSetWidth();
        if (setWidth > 0 && nav.scrollLeft >= setWidth) {
          nav.scrollLeft -= setWidth;
        }
      }
      requestAnimationFrame(autoScroll);
    }
    requestAnimationFrame(autoScroll);

    function pause() {
      isPaused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    }

    function resumeLater(delay = 2000) {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        if (!isDragging) {
          isPaused = false;
        }
      }, delay);
    }

    function checkLoopBounds() {
      const setWidth = getSetWidth();
      if (setWidth > 0) {
        if (nav.scrollLeft >= setWidth * 2) {
          nav.scrollLeft -= setWidth;
        } else if (nav.scrollLeft <= 0) {
          nav.scrollLeft += setWidth;
        }
      }
    }

    // Mouse events (Desktop Drag & Hover)
    nav.addEventListener('mouseenter', pause);
    nav.addEventListener('mouseleave', () => {
      if (!isDragging) resumeLater(600);
    });

    nav.addEventListener('mousedown', (e) => {
      isDragging = true;
      pause();
      dragDistance = 0;
      startX = e.pageX;
      scrollStart = nav.scrollLeft;
      nav.classList.add('is-grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.pageX - startX;
      dragDistance = Math.abs(deltaX);
      nav.scrollLeft = scrollStart - deltaX;
      checkLoopBounds();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        nav.classList.remove('is-grabbing');
        resumeLater(2200);
      }
    });

    // Touch events (Mobile - arrastre fluido con el dedo y pausa al tocar)
    nav.addEventListener('touchstart', (e) => {
      pause();
      isDragging = true;
      dragDistance = 0;
      startX = e.touches[0].pageX;
      scrollStart = nav.scrollLeft;
    }, { passive: true });

    nav.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].pageX;
      const deltaX = currentX - startX;
      dragDistance = Math.abs(deltaX);
      checkLoopBounds();
    }, { passive: true });

    nav.addEventListener('touchend', () => {
      isDragging = false;
      resumeLater(2500);
    });

    nav.addEventListener('scroll', () => {
      checkLoopBounds();
    }, { passive: true });

    // Delegación de click/tap en botones
    nav.addEventListener('click', (e) => {
      // Si el usuario estaba deslizando con el dedo o mouse, no activar click
      if (dragDistance > 6) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const button = e.target.closest('.tab-button');
      if (!button) return;

      const targetTab = button.getAttribute('data-tab');
      if (!targetTab) return;

      // Actualizar todos los botones (originales y clones) con este data-tab
      const allButtons = nav.querySelectorAll('.tab-button');
      allButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === targetTab) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }
      });

      // Mostrar panel correspondiente
      servicePanels.forEach(panel => {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Pausar unos segundos para permitir lectura tranquila de la especialidad
      pause();
      resumeLater(4000);
    });
  }

  // Botón "Cotizar este servicio" dentro de cada panel
  const selectServiceBtns = document.querySelectorAll('.btn-select-service');
  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceValue = btn.getAttribute('data-service-select');

      // Abrir desplegable automáticamente
      setConsoleOpen(true);

      // Buscar la opción correspondiente en la consola del cotizador
      const matchingPill = document.querySelector(`.ctrl-pill[data-type="service"][data-value*="${serviceValue}"]`) ||
                           document.querySelector(`.ctrl-pill[data-type="service"][data-value="${serviceValue}"]`);

      if (matchingPill) {
        matchingPill.click();
      }

      // Desplazar suavemente a la consola de cotización
      const cotizadorEl = document.getElementById('cotizador');
      if (cotizadorEl) {
        cotizadorEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // 3. CONSOLA DE PRESUPUESTO EN VIVO (Desplegable Compacto)
  // =========================================================================
  const state = {
    property: 'Country / Barrio Cerrado',
    surface: '400 a 1.200 m²',
    service: 'Mantenimiento Periódico (Corte y Bordes)'
  };

  const consoleWrap = document.getElementById('consoleWrap');
  const consoleHeaderToggle = document.getElementById('consoleHeaderToggle');
  const toggleBtnLabel = document.querySelector('.toggle-btn-label');
  const sendWaBtn = document.getElementById('sendWaBtn');
  const ctrlPills = document.querySelectorAll('.ctrl-pill');

  function setConsoleOpen(isOpen) {
    if (!consoleWrap) return;
    if (isOpen) {
      consoleWrap.classList.add('is-open');
      if (consoleHeaderToggle) consoleHeaderToggle.setAttribute('aria-expanded', 'true');
      if (toggleBtnLabel) toggleBtnLabel.textContent = 'Ocultar filtros';
    } else {
      consoleWrap.classList.remove('is-open');
      if (consoleHeaderToggle) consoleHeaderToggle.setAttribute('aria-expanded', 'false');
      if (toggleBtnLabel) toggleBtnLabel.textContent = 'Personalizar terreno';
    }
  }

  if (consoleHeaderToggle) {
    consoleHeaderToggle.addEventListener('click', () => {
      const isCurrentlyOpen = consoleWrap.classList.contains('is-open');
      setConsoleOpen(!isCurrentlyOpen);
    });

    consoleHeaderToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isCurrentlyOpen = consoleWrap.classList.contains('is-open');
        setConsoleOpen(!isCurrentlyOpen);
      }
    });
  }

  function updateQuoteConsole() {
    // Generar mensaje de texto plano codificado para URL de WhatsApp
    const plainText = `Hola Green Brown! Vengo desde su web. Quiero consultar presupuesto para un ${state.property} de ${state.surface} para ${state.service}.`;
    const waUrl = `https://wa.me/${CONFIG.whatsappPhone}?text=${encodeURIComponent(plainText)}`;

    if (sendWaBtn) {
      sendWaBtn.href = waUrl;
    }
  }

  ctrlPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const type = pill.getAttribute('data-type');
      const val = pill.getAttribute('data-value');

      // Remover activo de los hermanos del mismo grupo
      const siblingPills = document.querySelectorAll(`.ctrl-pill[data-type="${type}"]`);
      siblingPills.forEach(p => p.classList.remove('active'));

      // Activar el seleccionado
      pill.classList.add('active');

      // Actualizar estado
      if (type === 'property') state.property = val;
      if (type === 'surface') state.surface = val;
      if (type === 'service') state.service = val;

      updateQuoteConsole();
    });
  });

  // Inicializar el cotizador con los valores por defecto
  updateQuoteConsole();

  // =========================================================================
  // 4. CHIPS DE ZONAS (Micro-interacción táctil en Hero)
  // =========================================================================
  const zonePills = document.querySelectorAll('.zone-pill');
  zonePills.forEach(pill => {
    pill.addEventListener('click', () => {
      zonePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // =========================================================================
  // 5. VISIBILIDAD & OBSERVER ACTIVO PARA FLOATING ISLAND DOCK
  // =========================================================================
  const dock = document.querySelector('.floating-island-dock');
  const heroSection = document.getElementById('inicio');

  if (dock) {
    const handleDockVisibility = () => {
      // Solo aparece cuando se scrollea hacia abajo y se pierde la primera página
      // Si el usuario vuelve a subir hasta arriba, desaparece
      const threshold = heroSection ? Math.min(heroSection.offsetHeight * 0.45, 300) : 260;
      if (window.scrollY > threshold) {
        dock.classList.add('is-visible');
      } else {
        dock.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', handleDockVisibility, { passive: true });
    handleDockVisibility();
  }

  const dockItems = document.querySelectorAll('.dock-item');
  const sectionsToWatch = ['inicio', 'servicios', 'cotizador'];

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dockItems.forEach(item => {
          const href = item.getAttribute('href');
          if (href === `#${id}`) {
            item.style.color = 'var(--accent-lime)';
            item.style.background = 'rgba(255, 255, 255, 0.08)';
          } else if (href.startsWith('#')) {
            item.style.color = '';
            item.style.background = '';
          }
        });
      }
    });
  }, observerOptions);

  sectionsToWatch.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // =========================================================================
  // 6. SUAVIZADO DE SCROLL Y ACCESIBILIDAD
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // =========================================================================
  // 7. DESPLEGABLES DE PREGUNTAS FRECUENTES (FAQ ACCORDIONS)
  // =========================================================================
  const faqCards = document.querySelectorAll('.faq-fast-card');
  faqCards.forEach(card => {
    const toggleFaq = () => {
      const isOpen = card.classList.contains('is-open');
      card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', !isOpen);
    };

    card.addEventListener('click', toggleFaq);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq();
      }
    });
  });

});
