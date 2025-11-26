# Guía de Despliegue en Render.com

## Configuración en Render.com

### 1. Crear un nuevo Web Service

1. Conecta tu repositorio de GitHub/GitLab
2. Selecciona el servicio tipo **Web Service**
3. Configura los siguientes valores:

### 2. Configuración del Build

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 3. Variables de Entorno

Configura las siguientes variables de entorno en Render:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Entorno de ejecución |
| `PORT` | *(automático)* | Puerto asignado por Render |
| `CACHE_TTL_MS` | `300000` | TTL del caché (5 minutos) |
| `NEWS_REFRESH_INTERVAL_MS` | `600000` | Intervalo de refresco (10 minutos) |
| `SWAGGER_SERVER_URL` | `https://tu-app.onrender.com` | URL de producción para Swagger |

### 4. Verificación

Una vez desplegado, verifica:

- ✅ Health check: `https://tu-app.onrender.com/health`
- ✅ API Docs: `https://tu-app.onrender.com/api-docs`
- ✅ News endpoint: `https://tu-app.onrender.com/news`

## Notas Importantes

- El servicio se reinicia automáticamente cuando haces push a la rama principal
- Render asigna el puerto automáticamente a través de la variable `PORT`
- El caché se mantiene en memoria, por lo que se reinicia con cada deploy
- El scheduler se ejecuta cada 10 minutos para refrescar las noticias

## Troubleshooting

Si el servicio no inicia:

1. Verifica los logs en Render Dashboard
2. Asegúrate de que `NODE_ENV=production` esté configurado
3. Verifica que el build se complete exitosamente
4. Revisa que el puerto esté configurado correctamente

