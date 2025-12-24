# Ledgerly - Personal Finance Assistant

## Quick testing (live demo)

- (UPD 24.12: Some CORS problem ongoing, trying to fix. please, give me some time to manage with it)
- URL: https://ledgerly.uz
- Login: test@gmail.com
- Password: 123456789

(Please, note that requests might be slower than designed because of remote DB)

## Documentation and diagrams
- Docs: `docs/` (`docs/PRD.md`, `docs/design.md`, `docs/testing.md`, `docs/sdlc.md`)
- Diagrams: `diagrams/` (`diagrams/uml.mermaid`, `diagrams/create-category.mermaid`, `diagrams/create-transaction.mermaid`, `diagrams/suggest-category.mermaid`)

## Prerequisites for testing on localhost
- Please note that for testing the project on localhost you will need secret keys and API tokens that cannot be shared via Github.
- Contact Edem Veliev (edem010100@gmail.com) for further info and accesses

## Build and run
- Install dependencies: `npm install`
- Build: `npm run build`
- Run (dev): `npm run start:dev`
- Run (prod): `npm run start:prod`

## Build and run frontend
- Clone repo: `git clone "https://github.com/Edem2000/ledgerly-front"`
- Install dependencies: `npm install`
- Run (dev): `npm run dev`

# Ledgerly API Info

Ledgerly API is a NestJS-based backend for managing users, categories, transactions, category budgets, and audit logs. The project follows a layered architecture with domain models/services, application use cases, and infrastructure controllers/services.

## Basic API documentation

All endpoints are mounted under the root NestJS application. Unless marked as **Public**, routes require a `Bearer` access token. Role-protected endpoints are noted.

### Auth & users

- `POST /users/register` (**Public**)
  - Body: `{ firstName, lastName, email, phone, password, role, language }`
- `POST /users/login` (**Public**)
  - Body: `{ email, password }`
- `PATCH /users/:id/change-password`
  - Body: `{ currentPassword, newPassword, newPasswordConfirmation }`
- `GET /users` (**Public**)
  - Query: `page`, `limit`, `status?`, `sortBy?`, `sortOrder?`
- `GET /users/search` (**Public**)
  - Query: `page`, `limit`, `query`
- `GET /users/:id` (**Public**)
- `DELETE /users/:id`
- `PATCH /users/:id`
  - Body: `{ firstName?, lastName?, email?, phone?, language?, status? }`

### Categories

- `POST /categories` (role: `user`)
  - Body: `{ title, color, icon? }`
- `GET /categories` (role: `user`)
- `GET /categories/:id` (role: `user`)
- `PATCH /categories/:id` (role: `user`)
  - Body: `{ title?, color?, icon? }`
- `DELETE /categories/:id` (role: `user`)

### Category budgets

- `POST /category-budgets` (role: `user`)
  - Body: `{ categoryId, year, month, plannedAmount?, limitAmount?, currency?, note? }`
- `GET /category-budgets` (role: `user`)
  - Query: `year`, `month`

### Transactions

- `POST /transactions` (role: `user`)
  - Body: `{ categoryId, title, type, amount, currency?, occurredAt?, note? }`
- `GET /transactions` (role: `user`)
  - Query: `page`, `limit`, `from?`, `to?`, `categoryId?`, `type?`
- `DELETE /transactions/:id` (role: `user`)
- `POST /transactions/suggest-category` (role: `user`)
  - Body: `{ title }`
- `GET /transactions/expense-chart` (role: `user`)
  - Query: `year`, `month`

### Audit logs

- `GET /audit` (roles: `superadmin`, `admin`)
  - Query: `page`, `limit`, `sortBy?`, `sortOrder?`, `actorType?`, `actorUserId?`, `targetEntity?`, `targetId?`, `category?`, `type?`
- `GET /audit/:id` (roles: `superadmin`, `admin`)
