# 🚀 SocialHub

**SocialHub** es una plataforma web para la gestión de publicaciones y comentarios, desarrollada como desafío práctico utilizando una arquitectura separada de **Frontend + API REST**.

La aplicación permite crear, consultar, actualizar y eliminar publicaciones, gestionar comentarios asociados, realizar búsquedas y filtros, y visualizar métricas generales desde un dashboard interactivo.

---

## 👨‍💻 Autor

**William Antonio Hernández Iraheta**  
Ingeniería en Computación  
Carné: **HI220365**

---

## 🎯 Objetivo

Desarrollar una aplicación web completa que permita administrar publicaciones y comentarios mediante una API REST, integrando persistencia de datos, validaciones, manejo de errores, documentación OpenAPI/Swagger y una interfaz moderna y responsiva.

---

# ✨ Funcionalidades

## 📊 Dashboard

El dashboard presenta información obtenida dinámicamente desde el backend:

- Total de publicaciones.
- Total de comentarios.
- Publicación más comentada.
- Publicaciones más comentadas.
- Publicación con mayor interacción.
- Publicaciones recientes.

Endpoint utilizado:

```http
GET /dashboard
```

---

## 📝 Publicaciones

SocialHub permite realizar las operaciones principales sobre publicaciones:

- Crear publicaciones.
- Listar publicaciones.
- Consultar una publicación por ID.
- Actualizar publicaciones.
- Eliminar publicaciones.
- Buscar publicaciones por texto.
- Filtrar publicaciones por fecha.
- Mostrar dinámicamente el número de comentarios.

### Endpoints

```http
GET    /posts
POST   /posts
GET    /posts/{id}
PUT    /posts/{id}
DELETE /posts/{id}

GET    /posts/search?query={texto}
GET    /posts/filter?date={yyyy-MM-dd}
```

---

## 💬 Comentarios

Cada comentario pertenece a una publicación mediante una relación **uno a muchos (1:N)**.

La aplicación permite:

- Crear comentarios.
- Listar comentarios de una publicación.
- Consultar un comentario.
- Actualizar comentarios.
- Eliminar comentarios.
- Eliminar automáticamente los comentarios asociados cuando se elimina una publicación.

### Endpoints

```http
GET    /posts/{postId}/comments
POST   /posts/{postId}/comments

GET    /posts/{postId}/comments/{commentId}
PUT    /posts/{postId}/comments/{commentId}
DELETE /posts/{postId}/comments/{commentId}
```

---

# 🔎 Búsqueda y filtrado

## Búsqueda por texto

Permite localizar publicaciones cuyo título o contenido coincida con el texto ingresado.

```http
GET /posts/search?query=Spring
```

## Filtro por fecha

Permite consultar publicaciones correspondientes a una fecha determinada.

```http
GET /posts/filter?date=2026-09-17
```

---

# 🧮 Conteo dinámico de comentarios

El atributo:

```json
{
  "commentCount": 1
}
```

es calculado dinámicamente a partir de los comentarios relacionados con cada publicación.

No es necesario mantener manualmente un contador independiente en la base de datos.

---

# 🏗️ Arquitectura

SocialHub utiliza una arquitectura cliente-servidor.

```text
┌───────────────────────────────┐
│           FRONTEND            │
│                               │
│ React + Vite                  │
│ React Router                  │
│ Axios                         │
│ Tailwind CSS                  │
└───────────────┬───────────────┘
                │
                │ HTTP / JSON
                ▼
┌───────────────────────────────┐
│          API REST             │
│                               │
│ Spring Boot                   │
│ Controllers                   │
│ Services                      │
│ DTOs / Mappers                │
│ Repositories                  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        PERSISTENCIA           │
│                               │
│ Spring Data JPA               │
│ H2 Database                   │
└───────────────────────────────┘
```

---

# ⚙️ Backend

El backend fue desarrollado utilizando:

- Java.
- Spring Boot.
- Spring Web.
- Spring Data JPA.
- Hibernate.
- H2 Database.
- Bean Validation.
- MapStruct.
- Lombok.
- Springdoc OpenAPI / Swagger.
- Maven.

Entorno de desarrollo utilizado:

**IntelliJ IDEA**

---

## Estructura lógica del backend

```text
src/main/java/sv/edu/udb/
│
├── config/
├── controller/
│   ├── request/
│   └── response/
├── domain/
├── exception/
├── repository/
├── service/
│   ├── implementation/
│   └── mapper/
└── ...
```

La aplicación sigue principalmente el flujo:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
JPA / H2
```

Los DTOs permiten separar los datos utilizados por la API de las entidades de persistencia.

---

# 🎨 Frontend

El frontend fue desarrollado con:

- React.
- Vite.
- JavaScript.
- React Router DOM.
- Axios.
- Tailwind CSS.
- Framer Motion.
- Lucide React.

Entorno de desarrollo utilizado:

**Visual Studio Code**

---

## Estructura del frontend

```text
socialhub-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

# 🔗 Comunicación Frontend ↔ Backend

El frontend utiliza **Axios** para consumir la API REST.

Configuración principal:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})
```

El backend permite solicitudes provenientes del servidor local de Vite mediante configuración CORS para:

```text
http://localhost:5173
```

---

# 🗄️ Base de datos

Se utiliza **H2 Database** con almacenamiento persistente en archivo.

Configuración:

```properties
spring.datasource.url=jdbc:h2:file:./data/socialhub
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
```

Esto permite conservar las publicaciones y comentarios incluso después de reiniciar el backend.

---

# 🔄 Relación entre entidades

La relación principal es:

```text
POST
 │
 │ 1
 │
 └────────────── N
              COMMENT
```

Una publicación puede contener múltiples comentarios y cada comentario pertenece a una única publicación.

En JPA se implementa mediante:

```java
@OneToMany(
    mappedBy = "post",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
```

y:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "post_id")
```

La eliminación en cascada garantiza que al eliminar una publicación también se eliminen sus comentarios relacionados.

---

# 🛡️ Validaciones

La aplicación implementa validaciones tanto en frontend como en backend.

## Publicaciones

Se validan:

- Título obligatorio.
- Longitud del título.
- Contenido obligatorio.
- Longitud del contenido.
- Fecha obligatoria.
- La fecha no puede estar en el pasado.

## Comentarios

Se validan:

- Nombre de usuario obligatorio.
- Longitud válida del nombre.
- Comentario obligatorio.
- Longitud válida del comentario.

El backend utiliza **Jakarta Bean Validation** para evitar que datos inválidos lleguen a la capa de persistencia.

---

# ⚠️ Manejo de errores

La API implementa un manejador global de excepciones mediante:

```java
@RestControllerAdvice
```

Entre los códigos HTTP utilizados se encuentran:

| Código | Significado |
|---|---|
| `200 OK` | Operación realizada correctamente |
| `201 Created` | Recurso creado correctamente |
| `204 No Content` | Recurso eliminado correctamente |
| `400 Bad Request` | Datos o parámetros inválidos |
| `404 Not Found` | Recurso inexistente |
| `500 Internal Server Error` | Error inesperado del servidor |

Las respuestas de error incluyen información estructurada como:

```json
{
  "timestamp": "2026-09-17T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validación"
}
```

---

# 📚 Swagger / OpenAPI

La API se encuentra documentada utilizando **Springdoc OpenAPI**.

Con el backend ejecutándose, la documentación puede consultarse mediante Swagger UI.

La especificación OpenAPI también está disponible en:

```text
http://localhost:8080/api-docs
```

La documentación incluye:

- Endpoints disponibles.
- Métodos HTTP.
- Parámetros.
- Request Body.
- Responses.
- Códigos HTTP.
- Esquemas utilizados por la API.

---

# 💡 Justificación de endpoints

## `/posts`

Representa la colección principal de publicaciones.

```http
GET /posts
POST /posts
```

GET obtiene la colección y POST crea un nuevo recurso.

## `/posts/{id}`

Representa una publicación específica identificada por su ID.

```http
GET
PUT
DELETE
```

Permite consultar, actualizar o eliminar el recurso.

## `/posts/search`

La búsqueda se mantiene como una operación de consulta y utiliza el método GET.

```http
GET /posts/search?query={texto}
```

## `/posts/filter`

Permite aplicar un criterio de fecha sin modificar ningún recurso.

```http
GET /posts/filter?date={yyyy-MM-dd}
```

## `/posts/{postId}/comments`

Se utiliza una ruta anidada porque los comentarios pertenecen a una publicación específica.

```http
/posts/{postId}/comments
```

Esto expresa directamente la relación existente entre ambos recursos.

## `/dashboard`

```http
GET /dashboard
```

El dashboard únicamente consulta información agregada y no modifica recursos, por lo que utiliza GET.

---

# 🚀 Ejecución del proyecto

## 1. Backend

Abrir el proyecto backend en **IntelliJ IDEA**.

Proyecto:

```text
spring-api-rest
```

Ejecutar la aplicación Spring Boot.

El backend estará disponible en:

```text
http://localhost:8080
```

---

## 2. Frontend

Abrir una terminal en:

```text
socialhub-frontend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar Vite:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

# 🧪 Pruebas realizadas

Durante el desarrollo se verificaron:

- Creación de publicaciones.
- Consulta de publicaciones.
- Actualización de publicaciones.
- Eliminación de publicaciones.
- CRUD completo de comentarios.
- Conteo dinámico de comentarios.
- Búsqueda por texto.
- Filtrado por fecha.
- Validaciones.
- Respuestas HTTP 400.
- Respuestas HTTP 404.
- Eliminación en cascada.
- Dashboard.
- Persistencia después de reiniciar el backend.
- Comunicación frontend/backend mediante CORS.
- Documentación OpenAPI.
- Visualización responsive en dispositivos móviles.

---

# 📱 Diseño responsive

La interfaz fue diseñada para adaptarse a diferentes tamaños de pantalla.

Incluye:

- Navegación para escritorio.
- Menú móvil.
- Dashboard responsive.
- Listado responsive de publicaciones.
- Detalle de publicación adaptable.
- Gestión de comentarios desde dispositivos móviles.

---

# 🧰 Herramientas de desarrollo

| Área | Herramienta |
|---|---|
| Backend | IntelliJ IDEA |
| Frontend | Visual Studio Code |
| API | Spring Boot |
| Frontend | React + Vite |
| Persistencia | H2 Database |
| ORM | Spring Data JPA / Hibernate |
| API Docs | Swagger / OpenAPI |
| HTTP Client | Axios |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion |
| Iconos | Lucide React |

---

# 📌 Estado del proyecto

**SocialHub se encuentra funcional e integrado.**

Los módulos principales de publicaciones, comentarios, búsqueda, filtrado y dashboard se encuentran conectados con la API REST y persistencia H2.

---

## 📄 Licencia

Proyecto desarrollado con fines académicos.