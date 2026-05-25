# Generador de Paletas de Colores

Una aplicación web estática diseñada para generar paletas de colores armónicas de manera aleatoria, permitiendo la personalización del tamaño de la paleta y el formato de los códigos de color (HEX/RGBA).

## 🚀 Manual de Usuario
Esta herramienta permite visualizar paletas de colores de forma rápida y eficiente:
1. **Selección:** Elige el tamaño deseado (6, 8 o 9 colores) y el formato del código secundario (HEX o RGBA) en la barra superior.
2. **Generación:** Haz clic en el botón "Generar Paleta" para actualizar los colores.
3. **Copia:** Haz clic sobre cualquier código de color (HEX o secundario) para copiarlo automáticamente al portapapeles. Un mensaje de confirmación aparecerá en pantalla.

## 🛠 Manual Técnico (Decisiones Técnicas)
*   **Arquitectura:** Aplicación web estática (Vanilla JS/HTML/CSS).
*   **Lógica de Color:** Se utiliza el modelo **HSL** para la generación de colores base. Esto permite controlar la saturación y luminosidad, asegurando que los colores generados siempre sean vibrantes y tengan un buen contraste.
*   **Conversión:** Implementación de funciones matemáticas personalizadas para convertir HSL a HEX y RGBA, evitando dependencias externas.
*   **Accesibilidad:** 
    *   Uso de elementos semánticos HTML5.
    *   Implementación de `aria-live` para notificaciones a lectores de pantalla.
    *   Soporte de navegación por teclado mediante `:focus-visible`.
*   **Microfeedback:** Sistema de *Toast* notificaciones autogestionadas.

## 💻 Ejecución Local
1. Asegúrate de tener instalado un navegador moderno.
2. Clona el repositorio:
```bash
   git clone <URL-de-tu-repositorio>