# SDLC Plan
Selected SDLC model with brief justification and timeline

## Selected model
**Time-boxed Iterative (Agile-inspired)** with a hard MVP cut. This fits a short academic window and allows prioritizing core backend flows first while acknowledging UI scope risk.

## Justification
- The schedule is tight, so an iterative, MVP-first approach is the most realistic.
- Core backend usecases and API stability are higher priority than full UI polish for a demo.
- The model supports partial delivery (API + key screens) and a clear path to finish UI later.

## Timeline (3-week plan and delivery)
### Planned (3 weeks)
- **Week 1: Discovery + Architecture**
  - Define entities, repositories, and services
  - Set up NestJS structure and DI
  - Basic auth and core domain models
- **Week 2: Core features**
  - Categories, transactions, budgets, audit logging
  - Usecases, validations, and error handling
  - Initial UI scaffold and navigation
- **Week 3: UI completion + QA**
  - Finish UI flows
  - Integrate API + frontend
  - Manual testing, bug fixes, demo readiness

### Delivery (3 weeks)
- **Week 1: Setup + Domain foundation**
  - Project structure, base domain types, DI scaffolding
- **Week 2: Core API usecases**
  - Categories, transactions, budgets, auth flows
  - Suggest category + audit logging
- **Week 3: Integration + UI + QA**
  - Controllers/DTOs/presenters wired
  - UI flows completed
  - Manual testing, bug fixes, demo readiness

## Scope adjustment for demo
- Focus on API-backed flows and essential screens.
- Prioritize a stable demo at ledgerly.uz with tested API paths.

## Next steps (post-demo)
- Add regression tests for key endpoints and UI paths.
- Improve visual consistency and error states in the frontend.
