# Comandos cURL para Postman Collection

Base URL: `https://rss-aggregator-yxql.onrender.com`

## 1. Health Check

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/health" \
  -H "Accept: application/json"
```

## 2. Get All News (sin filtros, ordenado por fecha descendente)

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/news" \
  -H "Accept: application/json"
```

## 3. Get News with Pagination

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/news?limit=10&offset=0" \
  -H "Accept: application/json"
```

## 4. Search News by Keyword

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/news?q=bitcoin" \
  -H "Accept: application/json"
```

## 5. Get News by Date Range

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/news?fromDate=2024-01-01T00:00:00Z&toDate=2024-12-31T23:59:59Z" \
  -H "Accept: application/json"
```

## 6. Get News from Date (hasta hoy)

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/news?fromDate=2024-11-01T00:00:00Z" \
  -H "Accept: application/json"
```

## 7. Get News until Date (desde siempre)

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/news?toDate=2024-11-30T23:59:59Z" \
  -H "Accept: application/json"
```

## 8. Search News with Date Range and Pagination

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/news?q=economia&fromDate=2024-11-01T00:00:00Z&toDate=2024-11-30T23:59:59Z&limit=20&offset=0" \
  -H "Accept: application/json"
```

## 9. Swagger API Documentation

```bash
curl -X GET "https://rss-aggregator-yxql.onrender.com/api-docs" \
  -H "Accept: text/html"
```

---

## Para importar en Postman

### Opción 1: Importar desde cURL
1. Abre Postman
2. Click en **Import**
3. Selecciona **Raw text**
4. Pega cualquiera de los comandos curl de arriba
5. Postman convertirá automáticamente a una request

### Opción 2: Crear Collection manualmente

**Collection Name**: `RSS Aggregator API`

**Variables de Collection**:
- `base_url`: `https://rss-aggregator-yxql.onrender.com`

**Requests**:

1. **Health Check**
   - Method: `GET`
   - URL: `{{base_url}}/health`

2. **Get All News**
   - Method: `GET`
   - URL: `{{base_url}}/news`

3. **Get News Paginated**
   - Method: `GET`
   - URL: `{{base_url}}/news?limit=10&offset=0`

4. **Search News**
   - Method: `GET`
   - URL: `{{base_url}}/news?q=bitcoin`

5. **Get News by Date Range**
   - Method: `GET`
   - URL: `{{base_url}}/news?fromDate=2024-01-01T00:00:00Z&toDate=2024-12-31T23:59:59Z`

6. **Search with Date Range**
   - Method: `GET`
   - URL: `{{base_url}}/news?q=economia&fromDate=2024-11-01T00:00:00Z&toDate=2024-11-30T23:59:59Z&limit=20&offset=0`

7. **Swagger Docs**
   - Method: `GET`
   - URL: `{{base_url}}/api-docs`
