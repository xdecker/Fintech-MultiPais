# Credit System (Fintech Multipaís)

Este proyecto es un MVP de sistema de gestión de solicitudes de crédito para múltiples países.

Incluye:

- Backend en NestJS con PostgreSQL y Redis  
- Frontend en Next.js  
- Workers para procesamiento asíncrono de riesgo de crédito usando BullMQ  
- Estrategias por país implementadas con factory (fácil de agregar un nuevo país creando su archivo de configuración)  
- Seeds iniciales para usuarios y datos de prueba  
- Actualización casi en tiempo real en frontend usando WebSocket  

---

## Tecnologías

- **Backend**: Node.js, NestJS, Prisma ORM, Redis, PostgreSQL, BullMQ  
- **Frontend**: Next.js 16, React 19, TailwindCSS, Socket.IO  
- **Procesamiento asíncrono**: Workers con BullMQ, triggers de Postgres  
- **Cache**: Redis  
- **Colas / Jobs**: BullMQ  
- **Contenedores**: Docker (solo infraestructura: Redis y Postgres)  
- **Autenticación**: JWT  

---

## Levantar el proyecto modo local

1. Levantar infraestructura mínima con Docker:

```bash
docker compose up -d
```

- Postgres en localhost:5435  
- Redis en localhost:6379  

2. Configurar backend:

Crear un `.env` en `credit-system-backend` (hay un template de ejemplo):

```
DATABASE_URL=postgresql://postgres:Xdecker123@localhost:5435/credit_system
REDIS_URL=redis://localhost:6379
JWT_SECRET=774437823accca4e9d923b76003f42c7
PORT=3000
```

Instalar dependencias, correr migraciones y seeds:

```bash
cd credit-system-backend
npm install        # Instala todas las dependencias
npx prisma migrate deploy   # Aplica migraciones a la base de datos
npx ts-node -r tsconfig-paths/register prisma/seed.ts  # Crea usuarios y datos iniciales
npm run start:dev  # Levanta el backend en modo desarrollo
```

> Nota: **el seed es crítico** porque crea los usuarios iniciales y datos de prueba, paso indispensable antes de usar el frontend.

3. Configurar frontend:

Crear `.env.local` en `credit-system-frontend`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

Instalar dependencias y correr frontend:

```bash
cd credit-system-frontend
npm install
npm run dev -- -p 3001
```

Abrir: [http://localhost:3001](http://localhost:3001)

---

## Estructura del proyecto

- **application/**: Lógica de negocio y casos de uso  
- **domain/**: Entidades, interfaces, estrategias por país y eventos  
- **infrastructure/**: Integraciones (DB, Redis, WebSocket, Logger, Webhooks)  
- **interfaces/**: Controladores HTTP y WebSocket  
- **workers/**: Procesamiento asíncrono (evaluación de riesgo)  
- **shared/**: Logger y utilidades compartidas  
- **main.ts**: Bootstrap de NestJS  

---

## Supuestos

- Se implementaron varios países para validaciones y se configuró para facil implementación de nuevos paises mediante factory strategy de validaciones.
- Webhooks Proveedores bancarios son simulados  
- Estados de crédito: `APPROVED`, `UNDER_REVIEW`, `REJECTED`, `PENDING`  
- Frontend almacena JWT en localstorage

---

## Decisiones técnicas importantes

- NestJS modular para separar capas: controladores, servicios, repositorios, estrategias  
- Prisma ORM para acceso a Postgres  
- BullMQ para procesamiento de riesgo en segundo plano  
- Redis para cache y coordinación de workers  
- WebSocket (Socket.IO) para actualización casi en tiempo real  
- TailwindCSS + Next.js para frontend rápido y responsivo  
- Estrategias por país implementadas con **factory pattern**, agregar un nuevo país es solo crear su archivo y registrar en el factory  
- Migraciones + seeds para inicializar DB y usuarios antes de levantar el sistema  

---

## Seguridad

- JWT para autenticación  
- Roles y guards para autorización
- Usuarios consultan y realizan registros de acuerdo a paises asignados  
- No se exponen datos sensibles en respuestas de API  

---

## Escalabilidad y grandes volúmenes

- Índices en `credit_request(id, country_code, status, created_at)`  
- Tablas particionables por país si crece el volumen  
- Consulta de listado con filtros paginados  
- Cache de catálogos y resultados de dashboard en Redis  
- Jobs en cola permiten escalar workers horizontalmente  

---

## Concurrencia y colas

- Evaluación de riesgo dispara un worker de BullMQ  
- Postgres triggers notifican cambios de estado a los workers  
- Webhook simulado actualiza estado y dispara eventos WebSocket  

---

## Cache

- Redis cachea listas de solicitudes y resultados de riesgo  
- Estrategia simple: TTL de 60s, invalidación al actualizar la solicitud  

---

## Frontend

- Crear solicitud  
- Listar solicitudes por país y estado  
- Ver detalles de solicitud  
- Actualizar estado (solo roles autorizados)  
- Actualización casi en tiempo real con WebSocket  
- Métricas en dashboard  

---

## Posibles mejoras futuras

- Dockerizar frontend y backend al 100% para no depender de entorno local  
- Agregar más filtros y controles en el listado de créditos  
- Completar módulo de auth: creación de usuarios, recuperación de contraseña, asignar paises  
- Indicadores más robustos en dashboard (KPIs, alertas)  
- Mejorar la integración frontend con cambios de estado en tiempo real  
- Añadir más países usando la estrategia factory, sin tocar código base existente  

---

## Extras incluidos

- Workers asíncronos con BullMQ  
- Logs estructurados con Pino  
- Scripts para Postgres (triggers y notificaciones)  
- Estrategia de extensibilidad por país y proveedor  
- Seeds iniciales para usuarios y datos de prueba  


## Autor
Xavier Decker