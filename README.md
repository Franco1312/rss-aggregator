# RSS Aggregator

Agregador de noticias económicas para Argentina usando feeds RSS. Servicio backend minimalista en Node.js + TypeScript siguiendo principios de Clean Architecture y Clean Code.

## Características

- ✅ Agregación de noticias desde múltiples fuentes RSS de economía argentina
- ✅ Caché en memoria con TTL configurable
- ✅ API REST para consultar noticias
- ✅ Filtrado por fuente y búsqueda por texto
- ✅ Paginación de resultados
- ✅ Scheduler automático para refrescar noticias
- ✅ Arquitectura limpia y mantenible

## Fuentes RSS

El proyecto incluye las siguientes fuentes configuradas:

- **Clarín - Economía**: `https://www.clarin.com/rss/economia/`
- **Ámbito - Economía**: `https://www.ambito.com/rss/pages/economia.xml`
- **Ámbito - Finanzas**: `https://www.ambito.com/rss/pages/finanzas.xml`
- **Perfil - Economía**: `https://www.perfil.com/feed/economia`

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```bash
PORT=3000
CACHE_TTL_MS=300000
NEWS_REFRESH_INTERVAL_MS=600000
NODE_ENV=development
```

### Variables de entorno

- `PORT`: Puerto del servidor (default: 3000)
- `CACHE_TTL_MS`: TTL del caché en milisegundos (default: 300000 = 5 minutos)
- `NEWS_REFRESH_INTERVAL_MS`: Intervalo de refresco automático en milisegundos (default: 600000 = 10 minutos)
- `NODE_ENV`: Entorno de ejecución (development/production)

## Uso

### Desarrollo

```bash
npm run dev
```

Inicia el servidor con hot reload usando `ts-node-dev`.

### Producción

```bash
npm run build
npm start
```

Compila TypeScript y ejecuta el servidor.

## API Endpoints

### GET /health

Verifica el estado del servidor.

**Respuesta:**
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /news

Obtiene noticias agregadas desde los feeds RSS.

**Query Parameters:**
- `sourceId` (opcional): Filtrar por ID de fuente (ej: "clarin-economia")
- `q` (opcional): Buscar texto en título y resumen
- `limit` (opcional): Cantidad de resultados (default: 20)
- `offset` (opcional): Offset para paginación (default: 0)

**Ejemplos:**
```bash
# Obtener todas las noticias
GET http://localhost:3000/news

# Filtrar por fuente
GET http://localhost:3000/news?sourceId=clarin-economia

# Buscar por texto
GET http://localhost:3000/news?q=dólar

# Con paginación
GET http://localhost:3000/news?limit=10&offset=0
```

**Respuesta:**
```json
{
  "items": [
    {
      "id": "clarin-economia-abc123",
      "sourceId": "clarin-economia",
      "sourceName": "Clarín - Economía",
      "title": "Título de la noticia",
      "summary": "Resumen de la noticia...",
      "link": "https://www.clarin.com/...",
      "publishedAt": "2024-01-01T10:00:00.000Z",
      "fetchedAt": "2024-01-01T12:00:00.000Z",
      "categories": ["economia"],
      "imageUrl": "https://..."
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

### GET /sources

Obtiene la lista de fuentes RSS configuradas.

**Respuesta:**
```json
{
  "sources": [
    {
      "id": "clarin-economia",
      "name": "Clarín - Economía",
      "url": "https://www.clarin.com/rss/economia/",
      "defaultCategory": "economia",
      "isActive": true
    }
  ]
}
```

## Tests

```bash
npm test
```

Ejecuta los tests unitarios.

```bash
npm run test:watch
```

Ejecuta los tests en modo watch.

## Estructura del Proyecto

```
src/
├── domain/              # Capa de dominio
│   ├── entities/       # Entidades de negocio
│   └── repositories/   # Interfaces de repositorios
├── application/        # Capa de aplicación
│   └── use-cases/      # Casos de uso
├── infrastructure/     # Capa de infraestructura
│   ├── cache/          # Implementación de caché
│   ├── config/         # Configuración
│   ├── http/           # Servidor HTTP (Express)
│   ├── logging/        # Logger
│   ├── repositories/   # Implementaciones de repositorios
│   ├── rss/            # Cliente y agregador RSS
│   └── scheduler/      # Scheduler de jobs
└── interfaces/         # Capa de interfaces
    ├── controllers/    # Controladores HTTP
    └── mappers/        # Mappers DTO
```

## Tecnologías

- **Node.js** + **TypeScript**
- **Express**: Framework HTTP
- **rss-parser**: Parser de feeds RSS
- **dotenv**: Gestión de variables de entorno
- **Jest**: Framework de testing

## Arquitectura

El proyecto sigue principios de Clean Architecture:

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara
- **Inversión de dependencias**: Las capas internas no dependen de las externas
- **Testabilidad**: Fácil de testear gracias a la separación de capas
- **Mantenibilidad**: Código limpio y bien organizado

## Licencia

MIT
