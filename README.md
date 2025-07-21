# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# Guía: Permitir o restringir contenido embebido en SharePoint

## 🔐 Configurar Seguridad de Campo HTML en SharePoint

Los administradores de colecciones de sitios en SharePoint pueden controlar si los colaboradores pueden insertar contenido externo (por ejemplo, iframes) mediante el elemento web **Insertar**.

### 📍 Pasos para acceder a la configuración

1. Ir al **sitio raíz** de la colección de sitios.
2. Seleccionar **Configuración > Configuración del sitio**.
   - Si no aparece, haz clic en **Información del sitio > Ver toda la configuración del sitio**.
3. En la sección **Administración de la colección de sitios**, haz clic en **Seguridad de campo HTML**.

### ⚙️ Opciones disponibles

- ❌ **No permitir iframes desde dominios externos** (por defecto).
- ✅ **Permitir iframes desde cualquier dominio** (no recomendado por seguridad).
- 🔒 **Permitir iframes solo desde los siguientes dominios** (lista personalizada).

Puedes agregar o quitar dominios en esa lista. Luego haz clic en **Aceptar**.

> 📝 Nota: Si el scripting personalizado está desactivado, esta opción solo aplica al elemento web Insertar.

---

## 📚 Recursos adicionales

- [Permitir o evitar scripts personalizados en SharePoint](https://learn.microsoft.com/es-es/sharepoint/allow-or-prevent-custom-script)
- [Elementos web en SharePoint](https://learn.microsoft.com/es-es/sharepoint/dev/spfx/web-parts/overview-web-parts)

