# 🌿 Green Brown D2 — Rediseño Vanguardista & Command Studio

Sitio web oficial desarrollado para **Green Brown** (`@green.brown3962`), servicio especializado en mantenimiento y corte de césped para countries, quintas y predios industriales en Zona Norte.

Desarrollado por **Poldev Estudio** bajo estándares de diseño UI/UX Senior, arquitectura compacta ("Command Studio"), navegación táctil en dock flotante y alta conversión a WhatsApp.

---

## 💡 ¿Por qué esta versión D2 resuelve el rechazo de la primera presentación?

1. **Eliminación del menú hamburguesa tradicional:**  
   En sitios de servicio directo a domicilio, el menú hamburguesa esconde las opciones y añade un clic innecesario. En D2, la navegación se resuelve con un **Floating Tactical Island Dock** inferior fijado en la zona natural del pulgar del usuario móvil, con acceso directo a Servicios, Cotizador, Modalidad y WhatsApp.
2. **Web corta y al grano (Zero Scroll Fatigue):**  
   En lugar de apilar 4 bloques gigantes de servicios en vertical, se implementó un **Catálogo por Solapas Táctiles**. Con 1 toque el cliente cambia de servicio, ve las fotos reales de la labor y presiona "Cotizar este servicio".
3. **Identidad Tipográfica Editorial:**  
   Se combinó **Outfit** (moderna y geométrica) con acentos en **Instrument Serif** itálica (*"Sin que muevas un solo dedo"*), brindando un aspecto de revista de paisajismo y club de campo de alta gama.
4. **Consola de Presupuesto en 15 Segundos:**  
   Selector dinámico en 3 toques con previsualización en tiempo real estilo burbuja de WhatsApp y botón de disparo en 1 clic.
5. **Autonomía Operativa Destacada:**  
   Aclara de forma contundente que ingresan por guardia con video al finalizar, llevan maquinaria y combustible propios, y emiten Factura A y B.

---

## 📁 Estructura del Proyecto

```
GreenBrownD2/ (y WEBS/GreenBrownD2/)
├── css/
│   └── style.css            # Sistema de diseño botánico oscuro + Bento Grid + Floating Dock
├── js/
│   └── main.js              # Lógica de tabs, cotizador dinámico, WhatsApp generator y observer
├── images/
│   ├── logo-light.png       # Variante clara del logo oficial
│   ├── logo.png             # Logo oficial GB Green Brown
│   ├── hero-bg.jpg          # Fotografía paisajística de césped rasante
│   ├── card-periodicidad.jpg# Foto corte regular programado
│   ├── card-seriedad.jpg    # Foto colocación de grama bahiana
│   ├── card-autonomia.jpg   # Foto predios industriales y maquinaria
│   └── card-entorno.jpg     # Foto poda y puesta a punto de cercos
├── index.html               # Landing de alto impacto (Command Studio)
└── README.md
```

---

## ⚙️ Configuración para el Cierre de Venta

Para vincular el número de WhatsApp oficial del cliente:
1. Abrir `js/main.js` y actualizar:
   ```javascript
   const CONFIG = {
     whatsappPhone: '54911XXXXXXXX', // Número oficial
     defaultMessage: 'Hola Green Brown! Quiero consultar presupuesto...'
   };
   ```
2. Reemplazar `5491100000000` en los enlaces de `index.html`.
