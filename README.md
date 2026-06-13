# HomeFix

HomeFix es una plataforma web de comercio electrónico y servicios para el
hogar. Centraliza la compra de productos de mantenimiento, la solicitud de
técnicos y el seguimiento de pedidos y servicios en una sola aplicación.

El proyecto fue desarrollado con React y Vite, utiliza Appwrite Cloud como
backend y está preparado para desplegarse en Vercel.

## Funcionalidades

- Catálogo de productos cargado desde Appwrite TablesDB.
- Imágenes de productos y servicios almacenadas en Appwrite Storage.
- Carrito persistente mediante `localStorage`.
- Cantidades, subtotales y total en pesos colombianos.
- Registro, inicio de sesión y cierre de sesión con Appwrite Account.
- Checkout protegido para usuarios autenticados.
- Captura de teléfono, ciudad, dirección e indicaciones de entrega.
- Creación y consulta de pedidos asociados mediante `userId`.
- Integración de pagos con PayU Sandbox.
- Pantalla de respuesta para transacciones de PayU.
- Catálogo y formulario de solicitud de servicios técnicos.
- Fecha, franja horaria, urgencia y descripción del problema.
- Solicitudes de servicio asociadas al usuario autenticado.
- Perfil con historial de pedidos y solicitudes.
- Panel administrativo protegido por el label `admin`.
- Consulta y actualización del estado de pedidos y solicitudes.
- Política de privacidad adaptada a la Ley 1581 de 2012 de Colombia.
- Seguimiento de navegación SPA con Google Analytics 4.
- Diseño responsive para escritorio, tablet y móvil.

## Tecnologías

- React 19
- Vite 8
- React Router
- Appwrite Web SDK 25
- React Icons
- PayU Sandbox
- Google Analytics 4
- Vercel

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Página principal |
| `/products` | Catálogo de productos |
| `/services` | Servicios y solicitudes técnicas |
| `/cart` | Carrito de compras |
| `/checkout` | Datos de entrega y pago |
| `/payment-result` | Resultado enviado por PayU |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |
| `/profile` | Pedidos y solicitudes del usuario |
| `/admin` | Panel protegido para administradores |
| `/privacy` | Política de privacidad |

Vercel utiliza un rewrite hacia `index.html` para que las rutas directas sean
procesadas por React Router y no produzcan errores 404.

## Configuración local

Requisitos:

- Node.js instalado.
- Proyecto configurado en Appwrite Cloud.
- Tablas y buckets creados en Appwrite.

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` tomando como referencia `.env.example`:

```env
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=

VITE_PRODUCTS_TABLE_ID=
VITE_PRODUCTS_BUCKET_ID=
VITE_SERVICES_TABLE_ID=
VITE_SERVICES_BUCKET_ID=
VITE_SERVICE_REQUESTS_TABLE_ID=
VITE_ORDERS_TABLE_ID=

VITE_GA_MEASUREMENT_ID=G-BGFB85W85H
```

Inicia el servidor:

```bash
npm run dev
```

En Windows PowerShell también puedes ejecutar:

```powershell
npm.cmd run dev
```

La aplicación estará disponible normalmente en
`http://localhost:5173`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Appwrite

La configuración del cliente se encuentra en `src/appwrite/config.js`.

### Tablas

`products`

- Información del catálogo.
- Debe permitir lectura a los usuarios que puedan visitar la tienda.

`services`

- Servicios técnicos disponibles.
- Debe permitir lectura desde el catálogo.

`service_requests`

- Guarda `userId`, datos de contacto, dirección, servicio, fecha, franja
  horaria, urgencia, descripción y estado.
- `userId` debe ser una columna String y estar indexada para las consultas del
  perfil.

`orders`

- Guarda `userId`, total, estado, método de pago y el contenido del pedido.
- Los productos y datos de entrega se guardan en formato JSON dentro de
  `items`.
- `userId` debe ser una columna String e índice de consulta.

### Buckets

- Bucket de imágenes de productos.
- Bucket de imágenes de servicios.

Los archivos necesitan permisos de lectura compatibles con los visitantes de
los catálogos.

### Administradores

El acceso administrativo se detecta mediante:

```js
user.labels.includes("admin")
```

El frontend oculta la navegación y protege `/admin`, pero la seguridad real
depende de Appwrite. El rol `label:admin` debe tener:

- `Read` y `Update` en `orders`.
- `Read` y `Update` en `service_requests`.
- `Read` en `products`.

No se utilizan API keys administrativas en el frontend.

## PayU Sandbox

El checkout crea primero una orden en Appwrite y luego prepara el formulario
para PayU Sandbox. La URL de respuesta es:

```text
/payment-result
```

La configuración SPA de `vercel.json` permite que PayU regrese directamente a
esa ruta sin recibir un error 404.

La confirmación server-to-server de PayU debería implementarse posteriormente
en una Appwrite Function o función backend de Vercel. Las credenciales privadas
y firmas definitivas no deben generarse en el navegador para un ambiente de
producción.

## Google Analytics 4

HomeFix carga `gtag.js` desde `src/services/analytics.js`. El componente
`AnalyticsTracker` escucha los cambios de React Router y envía un `page_view`
por cada ruta, sin incluir parámetros de consulta del retorno de PayU.

La variable requerida es:

```env
VITE_GA_MEASUREMENT_ID=G-BGFB85W85H
```

En Vercel se configura en:

`Project Settings > Environment Variables`

Debe agregarse a los ambientes necesarios y realizarse un nuevo deployment
después de modificarla.

Para evitar page views duplicados, desactiva en GA4 la medición automática de
cambios basados en el historial del navegador si estuviera habilitada.

## Despliegue en Vercel

1. Conecta el repositorio de GitHub a Vercel.
2. Selecciona Vite como framework.
3. Configura todas las variables de `.env.example`.
4. Usa `npm run build` como comando de compilación.
5. Usa `dist` como directorio de salida.
6. Realiza el deployment.

El archivo `vercel.json` ya contiene el fallback necesario para una SPA.

## Estructura principal

```text
src/
  appwrite/       Configuración de Appwrite
  components/     Navbar, Footer, Analytics y rutas protegidas
  pages/          Pantallas de la aplicación
  services/       Appwrite, carrito, PayU y Analytics
```

## Consideraciones

- El archivo `.env` no debe subirse al repositorio.
- Las variables con prefijo `VITE_` se incluyen en el frontend y no deben
  contener secretos.
- Los permisos de Appwrite deben configurarse además de las restricciones
  visuales de React.
- Los registros antiguos de `service_requests` sin `userId` deben completarse
  o hacer temporalmente opcional esa columna antes de actualizarlos.
