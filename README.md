# ITX Frontend Test Mobile Shop

Aplicación SPA construida con React + Vite que permite listar dispositivos, consultarlos en detalle y añadirlos al carrito cumpliendo los requisitos de la prueba.

## Aclaraciones relevantes

- La instancia para el back se levanta bajo demanda, por lo que la primera descarga de datos al levantar la aplicación puede tardar más de lo esperado.
- La llamada POST para actualizar el carrito, según entiendo el enunciado, debería devolver el contador del carrito actualizado cada vez que se añade un elemento. Pero la respuesta siempre es un { count: 1 }, por lo que en el carrito se muestra 1 siempre. Podría guardarse localmente ese contador al añadir productos, pero en un entorno de trabajo real, no me arriesgaría a generar errores por desincronizar el cliente del server.

## Requisitos

- Node.js 18+
- npm 10+

## Scripts

- npm install: instala las dependencias.
- npm start: inicia el entorno de desarrollo.
- npm run build: genera la compilación para producción.
- npm test: ejecuta los tests.
- npm run lint: analiza el código con ESLint.

## Detalles de arquitectura

- **Gestor de caché**: todas las peticiones a API se cachean en localStorage durante una hora.
- **Contexto global del carrito**: el carrito se actualiza tras cada alta y persiste entre sesiones.

## Levantar la aplicación en entorno local

npm install
npm start

## Lanzar tests

npm test
