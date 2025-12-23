# Ledgerly API Product Requirements Document (PRD)

## 1) Overview
Ledgerly API is a NestJS-based backend that powers a personal finance and budgeting application. It provides authenticated access to manage users, categories, transactions, category budgets, and audit logs. The API is intended to be consumed by web/mobile clients and internal admin tools. This PRD defines the product vision, scope, requirements, and success criteria for the current implementation.

## 2) Goals & Objectives
### 2.1 Goals
- Enable end users to safely and reliably record income/expenses, categorize them, and track budgets.
- Provide a robust authentication and role-based access control system.
- Support administrators with audit logs for compliance and support investigations.
- Ensure a maintainable architecture that scales with additional features (analytics, reporting, integrations).

### 2.2 Objectives (measurable)
- 99.9% availability for core endpoints (auth, categories, transactions).
- p95 response time under 300ms for list and read endpoints at typical load.
- ≥ 80% automated test coverage for domain and application layers.
- < 1% error rate on production requests for core features.

## 3) Non-Goals
- Direct bank account aggregation or third‑party financial integrations.
- Automated bill payment or money transfer.
- Building a front-end UI.
- Full accounting system (e.g., double-entry ledgering).

## 4) Personas & Use Cases
### 4.1 End User (role: user)
- Wants to track daily spending.
- Needs to categorize transactions and see if they remain within budget.
- Expects quick data entry and consistent data retrieval.

### 4.2 Admin (role: admin/superadmin)
- Needs visibility into system actions and user activity.
- Requires audit log access for troubleshooting or compliance.

### 4.3 System Integrator
- Integrates Ledgerly API with mobile/web clients.
- Needs clear API contracts, pagination, and filter semantics.

## 5) User Stories
- As a user, I can register an account and log in to get a secure token.
- As a user, I can create custom categories so my transactions are organized.
- As a user, I can record income and expenses with amounts and dates.
- As a user, I can set monthly budgets per category and check my spending.
- As a user, I can get category suggestions based on transaction titles.
- As an admin, I can query audit logs to inspect actions by actor or entity.

## 6) Functional Requirements

### 6.1 Authentication & Users
#### 6.1.1 Registration
- **Endpoint:** `POST /users/register`
- **Inputs:** `firstName`, `lastName`, `email`, `phone`, `password`, `role`, `language`
- **Validation:**
  - Email uniqueness and valid format.
  - Password strength rules (min length, complexity as defined by policy).
  - Role must be allowed and validated against system roles.
- **Outputs:** Created user profile and an authentication token (if configured).

#### 6.1.2 Login
- **Endpoint:** `POST /users/login`
- **Inputs:** `email`, `password`
- **Outputs:** JWT access token and basic user profile.

#### 6.1.3 Password Change
- **Endpoint:** `PATCH /users/:id/change-password`
- **Inputs:** `currentPassword`, `newPassword`, `newPasswordConfirmation`
- **Rules:**
  - Current password must match.
  - New password must satisfy policy and confirmation must match.

#### 6.1.4 User Management
- **Endpoints:**
  - `GET /users` (list with pagination + filters)
  - `GET /users/:id` (detail)
  - `GET /users/search` (search by query)
  - `PATCH /users/:id` (update profile fields)
  - `DELETE /users/:id`
- **Filters:** `page`, `limit`, `status`, `sortBy`, `sortOrder`
- **Constraints:**
  - Role-based permissions for deletion and status changes.
  - Users can only edit their own profile unless admin.

### 6.2 Categories
- **Endpoints:**
  - `POST /categories`
  - `GET /categories`
  - `GET /categories/:id`
  - `PATCH /categories/:id`
  - `DELETE /categories/:id`
- **Data Model:** `title`, `color`, `icon?`
- **Rules:**
  - Categories are scoped to the authenticated user.
  - Title must be unique per user (recommended constraint).

### 6.3 Category Budgets
- **Endpoints:**
  - `POST /category-budgets`
  - `GET /category-budgets`
- **Data Model:** `categoryId`, `year`, `month`, `plannedAmount`, `limitAmount?`, `currency`, `note?`
- **Rules:**
  - One budget per category per month per user.
  - Validate year/month within acceptable ranges.

### 6.4 Transactions
- **Endpoints:**
  - `POST /transactions`
  - `GET /transactions`
  - `DELETE /transactions/:id`
  - `POST /transactions/suggest-category`
  - `GET /transactions/expense-chart`
- **Data Model:** `categoryId`, `title`, `type` (income/expense), `amount`, `currency`, `occurredAt`, `note?`
- **Rules:**
  - Type must be valid enum.
  - Amount must be positive, currency must be ISO-like format.
  - `occurredAt` defaults to current date/time if omitted.

### 6.5 Audit Logs
- **Endpoints:**
  - `GET /audit`
  - `GET /audit/:id`
- **Filters:** `page`, `limit`, `sortBy`, `sortOrder`, `actorType`, `actorUserId`, `targetEntity`, `targetId`, `category`, `type`
- **Rules:**
  - Only accessible by `admin`/`superadmin` roles.

## 7) Non-Functional Requirements
- **Security:**
  - JWT-based authentication with configurable expiration.
  - Secure password hashing and validation.
  - Role-based access control for protected endpoints.
- **Performance:**
  - Pagination required for list endpoints.
  - Query filters must be indexed for common fields.
- **Reliability:**
  - Validate request payloads with descriptive errors.
  - Use consistent error response format.
- **Maintainability:**
  - Follow layered architecture: domain, application, infrastructure.
  - Provide clear separation of concerns for services, repositories, and controllers.
- **Localization:**
  - Store user language to allow future localization.

## 8) Data Model Overview
- **User:** `id`, `firstName`, `lastName`, `email`, `phone`, `passwordHash`, `role`, `status`, `language`, timestamps.
- **Category:** `id`, `userId`, `title`, `color`, `icon`, timestamps.
- **Transaction:** `id`, `userId`, `categoryId`, `title`, `type`, `amount`, `currency`, `occurredAt`, `note`, timestamps.
- **CategoryBudget:** `id`, `userId`, `categoryId`, `year`, `month`, `plannedAmount`, `limitAmount`, `currency`, `note`, timestamps.
- **AuditLog:** `id`, `actorType`, `actorUserId`, `targetEntity`, `targetId`, `category`, `type`, `metadata`, timestamps.

## 9) API Contract Expectations
- **Authentication:** `Authorization: Bearer <token>` required unless endpoint is public.
- **Pagination:** standard query params `page` and `limit` with consistent response shape:
  - `{ data: [...], meta: { page, limit, total } }`
- **Filtering & Sorting:** `sortBy` and `sortOrder` used consistently across endpoints.
- **Error Format:**
  - `{ statusCode, message, error }` with validation errors in `message`.

## 10) Success Metrics
- High adoption of transaction logging (weekly active users).
- Budget adherence metrics used by users (budgets created per active user).
- Low churn rate measured by weekly retention.

## 11) Risks & Mitigations
- **Risk:** Budget and transaction inconsistency.
  - *Mitigation:* enforce ownership and validate relations in service layer.
- **Risk:** Audit log bloat.
  - *Mitigation:* retention policies and archiving in later phase.
- **Risk:** Security vulnerabilities in auth.
  - *Mitigation:* regular security review and dependency updates.

## 12) Milestones
1. **MVP**: Auth, categories, transactions, and category budgets.
2. **Analytics**: Expense chart and category suggestion endpoint.
3. **Admin**: Audit logging and admin-only access.

## 13) Open Questions
- Is currency defined per user or per transaction, and should it be validated against a supported list?
- What retention policy is required for audit logs?
- What additional analytics are needed beyond expense charts?
