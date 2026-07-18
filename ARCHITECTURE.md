# Architecture Guide

This project follows a layered NestJS structure designed to scale as features grow. Use this guide to decide where new code belongs.

## Folder overview

```
src/
├── main.ts                 # Bootstrap only
├── app.module.ts           # Root module wiring
├── config/                 # Environment configuration
├── core/                   # Global API behavior
├── infrastructure/         # External system integrations
├── shared/                 # Reusable utilities (no I/O)
└── modules/                # Feature / domain modules
```

## Decision tree

Ask these questions in order:

1. Is it about a business feature (users, orders, videos)? → **`modules/`**
2. Does it connect to an external system (DB, Redis, HTTP, S3, email)? → **`infrastructure/`**
3. Does it change how every request/response behaves? → **`core/`**
4. Is it a reusable utility with no Nest providers and no external I/O? → **`shared/`**
5. Is it env/config registration? → **`config/`**

---

## Layers

### `modules/` — business features

**Use when:** the code is about a domain (User, Video, Order).

Examples:

- Controllers, services, feature DTOs
- “Create user”, “process video”, “list orders”

```
modules/user/
├── dto/
├── user.controller.ts
├── user.service.ts
└── user.module.ts
```

**Rule:** feature code owns business rules. Import infrastructure and shared helpers as needed.

---

### `infrastructure/` — external systems

**Use when:** you wrap a third-party or system dependency.

Current examples:

| Folder | Purpose |
|--------|---------|
| `database/` | Prisma / database access |
| `http/` | Outbound HTTP client |

Future examples:

- `cache/` → Redis
- `storage/` → S3
- `mail/` → SendGrid / SES
- `queue/` → shared BullMQ connection setup

**Rule:** no business rules here — only “how to talk to X”.

---

### `core/` — global API behavior

**Use when:** the behavior applies to (almost) every request.

Current examples:

- Exception filter
- Response transform interceptor
- Success / error response envelope
- Swagger / Scalar documentation setup

**Rule:** if removing it would change every API response, it belongs in `core/`.

---

### `shared/` — reusable helpers (no I/O)

**Use when:** many modules need the same pure utility.

Current examples:

- Pagination helpers and query DTO
- Shared constants (queue names, throttler defaults)

Also good here:

- Date helpers, ID generators, pure validators
- Shared enums/types that are not tied to one feature

**Rule:** no Nest `@Injectable()` services that call DB/HTTP. If it needs Prisma or Axios, put it in `infrastructure/` (or a feature service).

---

### `config/` — environment configuration

**Use when:** reading `process.env` into typed namespaces via `registerAs`.

Examples:

- `app.config.ts` — port, name, version
- `redis.config.ts` — Redis connection
- `database.config.ts` — database URL
- `http.config.ts` — HTTP client settings

Prefer `ConfigService` over reading `process.env` directly in application code.

---

## Quick reference

| What you’re building | Where it goes |
|----------------------|---------------|
| `CreateUserDto` | `modules/user/dto/` |
| `UserService.createUser()` | `modules/user/` |
| Prisma client wrapper | `infrastructure/database/` |
| HTTP client for external APIs | `infrastructure/http/` |
| Global error JSON shape | `core/responses/` |
| `@ApiPaginatedResponse` decorator | `core/docs/` |
| `?page=&limit=` helper | `shared/pagination/` |
| Queue name constant | `shared/constants/` |
| `APP_PORT` config | `config/` |

---

## Mental model

| Folder | Think of it as |
|--------|----------------|
| `modules` | **What** the product does |
| `infrastructure` | **How** we talk to the outside world |
| `core` | **How** every API call looks/behaves |
| `shared` | **Tools** anyone can reuse |
| `config` | **Settings** from the environment |

---

## Import conventions

Use the `@/` path alias for cross-folder imports:

```typescript
import { TransformInterceptor, setupApiDocumentation } from '@/core';
import { PrismaService } from '@/infrastructure/database';
import { HttpClientModule, HTTP_CLIENT } from '@/infrastructure/http';
import { PaginationQueryDto, paginate } from '@/shared/pagination';
import { VIDEO_QUEUE_NAME } from '@/shared/constants';
```

Same-folder imports can stay relative:

```typescript
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
```

---

## Adding a new feature module

1. Create the feature folder under `modules/`:

```
modules/orders/
├── dto/
├── orders.controller.ts
├── orders.service.ts
└── orders.module.ts
```

2. Import only the infrastructure you need (`DatabaseModule` is already global):

```typescript
@Module({
  imports: [HttpClientModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
```

3. Register the module in `app.module.ts`.

4. Reuse `shared/pagination` for list endpoints and `@ApiPaginatedResponse` for Swagger docs.

---

## Still unsure?

- Between **`shared`** and **`infrastructure`**: if it needs a network/DB connection or Nest provider → `infrastructure`. If it’s a pure function, DTO, or constant → `shared`.
- Between **`modules`** and **`shared`**: if only one feature uses it → keep it in that module. Promote to `shared` only after a second feature needs it.
- Between **`core`** and **`shared`**: if it shapes every API response or is wired globally in `main.ts` → `core`. Otherwise → `shared`.
