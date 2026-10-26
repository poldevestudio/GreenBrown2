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

  // =========================================================================
  // 2. SELECTOR INTERACTIVO DE SERVICIOS (TABS)
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-button');
  const servicePanels = document.querySelectorAll('.service-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Actualizar botones de tabs
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Mostrar panel correspondiente
      servicePanels.forEach(panel => {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Botón "Cotizar este servicio" dentro de cada panel
  const selectServiceBtns = document.querySelectorAll('.btn-select-service');
  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceValue = btn.getAttribute('data-service-select');

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
  // 3. CONSOLA DE PRESUPUESTO EN VIVO (Cotizador Express en 3 Pasos)
  // =========================================================================
  const state = {
    property: 'Country / Barrio Cerrado',
    surface: '400 a 1.200 m²',
    service: 'Mantenimiento Periódico (Corte y Bordes)'
  };

  const sendWaBtn = document.getElementById('sendWaBtn');
  const ctrlPills = document.querySelectorAll('.ctrl-pill');

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
  // 5. OBSERVER ACTIVO PARA FLOATING ISLAND DOCK
  // =========================================================================
  const dockItems = document.querySelectorAll('.dock-item');
  const sectionsToWatch = ['servicios', 'cotizador', 'garantia'];

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

});
