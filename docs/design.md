# Design
System architecture and basic design decisions

## Overview
Ledgerly API is a layered, use-case driven backend that separates HTTP concerns from domain logic and persistence. The core idea is to keep business rules in the domain and application layers, while infrastructure focuses on delivery (controllers), wiring (DI), and data access (repositories).

## Architecture
- **Presentation layer (infrastructure/controllers)**
  - REST endpoints handled by NestJS controllers (e.g., `CategoryController`, `TransactionController`).
  - Guards and decorators enforce authentication and role-based access.
  - DTOs validate/shape input, and presenters map domain objects to API responses.
- **Application layer (app/usecases)**
  - Usecases orchestrate flows (create, update, delete, suggest) and are the main entry for business workflows.
  - Usecases depend on domain services and utilities, not on controllers or persistence details.
- **Domain layer (domain/**)
  - Entities (User, Category, Transaction, CategoryBudget, AuditLog) model the business.
  - Services encapsulate domain rules and enforce invariants (ownership checks, status changes, usage counters).
  - Repositories are interfaces; implementations live in infrastructure.
- **Infrastructure layer (infrastructure/**)
  - DI modules wire concrete implementations to interfaces.
  - External services (JWT, hashing, translation, slugging, LLM providers) are provided here.
  - Database repositories implement query and persistence details.

## Core flows
- **Create category**
  - Controller accepts request and resolves current user/context.
  - Usecase translates title into multi-language fields, generates alias (slug), checks duplicates, creates entity through `CategoryService`, and logs an audit entry.
  - Audit logging failures do not block the main request.
- **Suggest category**
  - Usecase loads user categories, calls LLM provider for suggestions, de-duplicates and merges with frequent categories, and returns suggestions without persisting anything.
- **Create transaction**
  - Usecase validates input and ownership of category, creates transaction via repository, and returns a response DTO.
- **Get expense chart**
  - Controller takes year/month, resolves current user, and passes to usecase.
  - Usecase derives month range, fetches expense totals by category, loads user categories, and builds chart items with localized titles, color, and icon.
- **Get transactions**
  - Controller applies pagination pipe and optional filters (date range, category, type).
  - Usecase calls `TransactionService.findPaginatedByUser` with userId and returns items plus total/page metadata.
- **User registration**
  - Public endpoint maps request DTO into create params and invokes `CreateUserUsecase`.
  - Usecase resolves role (default User), checks for existing email, creates the user, and writes an audit log entry; log failures are ignored.

## Data model decisions
- **Multi-language fields** are stored on category titles to support RU/UZ/EN with translation at creation/update time.
- **Soft deletes** are implemented via `deleted` flags and status changes rather than hard deletion.
- **Usage tracking** on categories (usageCount, lastUsedAt) supports better suggestion ranking and insights.
- **Audit logs** capture security and behavioral events; context metadata (requestId, userAgent, IP) is recorded.

## Cross-cutting concerns
- **Authentication/authorization**: JWT and role guards apply at controller level; usecases assume an authenticated `CurrentUser`.
- **Validation**: DTOs validate input shape; domain services validate ownership and rule consistency.
- **Error handling**: domain errors are mapped to HTTP responses via controller exception mapping.
- **Extensibility**: new usecases can be added without changing controllers or persistence contracts, only DI wiring.

## Design principles
- **Separation of concerns**: Controllers are thin; business logic stays in usecases and domain services.
- **Dependency inversion**: Usecases depend on interfaces, not concrete repositories.
- **Consistency**: Domain entities are the single source of truth for invariants and state changes.
- **Auditability**: Significant actions are logged to support debugging and compliance.
