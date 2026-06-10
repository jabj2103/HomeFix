# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Google Analytics 4

HomeFix carga Google Analytics mediante `gtag.js` y registra un `page_view`
cuando cambia una ruta de React Router.

La integración usa esta variable de entorno:

```env
VITE_GA_MEASUREMENT_ID=G-BGFB85W85H
```

Para desarrollo local, agrega la variable al archivo `.env`. En Vercel,
configúrala en **Project Settings > Environment Variables** para los ambientes
Production, Preview y Development. Después de modificarla, realiza un nuevo
deploy para que Vite la incluya durante la compilación.

El archivo `.env.production` incluye el ID actual como valor de respaldo para
los builds de producción. Una variable configurada directamente en Vercel puede
reemplazarlo sin modificar el código.

La aplicación envía los cambios de ruta manualmente. Para evitar page views
duplicados, desactiva en el flujo web de GA4 la opción de medición mejorada
**Page changes based on browser history events** si estuviera habilitada.
