# Ledgerly API Product Requirements Document (PRD)

## 1) Overview
Ledgerly API is a NestJS-based backend for a personal finance and budgeting product. It provides secure, role-based access to manage users, categories, transactions, category budgets, and audit logs. The API is consumed by the web UI at ledgerly.uz and can be extended for mobile or admin tooling.

## 2) Vision and Goals
### 2.1 Vision
Help users track income and expenses, organize spending by category, and stay within budgets, while giving administrators reliable audit visibility.

### 2.2 Goals
- Enable reliable transaction recording, categorization, and budgeting.
- Provide secure authentication and role-based access control.
- Maintain a clean, layered architecture for fast iteration and future features.

### 2.3 Objectives (measurable)
- 99.9% availability for auth, categories, and transactions endpoints.
- p95 response time under 300ms for list and read endpoints at typical load.
- 80% automated test coverage for domain and application layers.
- < 1% error rate on production requests for core features.

## 3) Non-Goals
- Bank account aggregation or third-party financial integrations.
- Automated bill payment or money transfer.
- Full accounting system (e.g., double-entry ledgering).
- Native mobile apps (web UI is primary for this phase).

## 4) Personas and Use Cases
### 4.1 End User (role: user)
- Records daily income/expenses.
- Organizes spending with personal categories.
- Tracks monthly budgets and spending patterns.

### 4.2 Admin (role: admin/superadmin)
- Reviews audit logs for operational or compliance needs.
- Investigates user activity and system actions.

### 4.3 System Integrator
- Integrates the API with web UI and future clients.
- Requires stable API contracts, pagination, and filtering.

## 5) User Stories
- As a user, I can register and log in to access my data securely.
- As a user, I can create and manage categories.
- As a user, I can add transactions and see them in lists and summaries.
- As a user, I can create budgets per category and month.
- As a user, I can request category suggestions when entering a transaction title.
- As an admin, I can query audit logs by actor or entity.

## 6) Functional Requirements

### 6.1 Authentication and Users
#### 6.1.1 Registration
- **Endpoint:** `POST /users/register` (public)
- **Inputs:** `firstName`, `lastName`, `email`, `phone`, `password`, `role`, `language`
- **Validation:** email uniqueness and format; password policy; role validated against existing roles.
- **Output:** created user profile (and role info in response).

#### 6.1.2 Login
- **Endpoint:** `POST /users/login` (public)
- **Inputs:** `email`, `password`
- **Output:** JWT access token and user profile.

#### 6.1.3 Password Change
- **Endpoint:** `PATCH /users/:id/change-password`
- **Inputs:** `currentPassword`, `newPassword`, `newPasswordConfirmation`
- **Rules:** current password must match; confirmation must match; new password meets policy.

#### 6.1.4 User Management
- **Endpoints:**
  - `GET /users` (list)
  - `GET /users/:id` (detail)
  - `GET /users/search` (search)
  - `PATCH /users/:id` (update)
  - `DELETE /users/:id` (soft delete)
- **Filters:** `page`, `limit`, `status`, `sortBy`, `sortOrder` (where supported)
- **Constraints:** users can only edit their own profile unless elevated role is used.

### 6.2 Categories
- **Endpoints:**
  - `POST /categories`
  - `GET /categories`
  - `GET /categories/:id`
  - `PATCH /categories/:id`
  - `DELETE /categories/:id`
- **Data:** `title`, `color`, `icon?`
- **Rules:** categories are scoped per user; title alias must be unique per user.

### 6.3 Category Budgets
- **Endpoints:**
  - `POST /category-budgets`
  - `GET /category-budgets`
  - `PATCH /category-budgets/:id`
- **Data:** `categoryId`, `year`, `month`, `plannedAmount`, `limitAmount?`, `currency`, `note?`
- **Rules:** one budget per category per month per user; validate year/month bounds.

### 6.4 Transactions
- **Endpoints:**
  - `POST /transactions`
  - `GET /transactions`
  - `DELETE /transactions/:id`
  - `POST /transactions/suggest-category`
  - `GET /transactions/expense-chart`
- **Data:** `categoryId`, `title`, `type`, `amount`, `currency`, `occurredAt`, `note?`
- **Rules:** type must be a valid enum; amount must be positive; `occurredAt` defaults to now when omitted.

#### 6.4.1 Suggest Category
- Uses LLM provider to generate up to 3 AI suggestions plus up to 2 frequent categories.
- Suggestions are de-duplicated against existing categories and returned without DB writes.

#### 6.4.2 Expense Chart
- Returns totals per category for a given month.
- Titles are localized using the current user language and fallbacks.

### 6.5 Audit Logs
- **Endpoints:**
  - `GET /audit`
  - `GET /audit/:id`
- **Filters:** `page`, `limit`, `sortBy`, `sortOrder`, `actorType`, `actorUserId`, `targetEntity`, `targetId`, `category`, `type`
- **Rules:** restricted to admin/superadmin roles.

## 7) Non-Functional Requirements
- **Security:** JWT-based auth, secure password hashing, role-based access control.
- **Performance:** pagination for list endpoints; indexes for common filters.
- **Reliability:** consistent validation errors and mapped domain errors.
- **Maintainability:** layered architecture with clean separation of controllers, usecases, and repositories.
- **Localization:** user language stored and used for category titles.

## 8) Data Model Overview
- **User:** `id`, `name`, `email`, `phone`, `passwordHash`, `role`, `status`, `language`, timestamps.
- **Category:** `id`, `userId`, `title` (multi-language), `alias`, `color`, `icon`, `usageCount`, `lastUsedAt`, status, timestamps.
- **Transaction:** `id`, `userId`, `categoryId`, `title`, `type`, `amount`, `currency`, `occurredAt`, `note`, timestamps.
- **CategoryBudget:** `id`, `userId`, `categoryId`, `year`, `month`, `plannedAmount`, `limitAmount`, `currency`, `note`, status, timestamps.
- **AuditLog:** `id`, `actorType`, `actorUserId`, `targetEntity`, `targetId`, `category`, `type`, `metadata`, timestamps.

## 9) API Contract Expectations
- **Authentication:** `Authorization: Bearer <token>` required unless marked public.
- **Pagination:** `page` and `limit` query params for list endpoints.
- **Sorting:** `sortBy` and `sortOrder` where supported.
- **Error format:** `{ statusCode, message, error }` with validation details in `message`.

## 10) Success Metrics
- Weekly active users and transactions per active user.
- Budget creation rate and budget adherence usage.
- Low churn and support tickets per active user.

## 11) Risks and Mitigations
- **Risk:** Inconsistent category ownership across transactions.
  - **Mitigation:** enforce ownership checks in services and usecases.
- **Risk:** Audit log growth and storage overhead.
  - **Mitigation:** retention/archiving strategy in later phase.
- **Risk:** LLM suggestion quality or latency.
  - **Mitigation:** cap suggestion count and fall back to frequent categories.

## 12) Milestones
1. **MVP:** Auth, categories, transactions, budgets.
2. **Analytics:** Expense chart and category suggestion.
3. **Admin:** Audit log access and monitoring.

## 13) Open Questions
- Currency validation list: fixed ISO set or per-user configuration?
- Audit log retention and export requirements.
- Additional analytics needed beyond expense chart.
