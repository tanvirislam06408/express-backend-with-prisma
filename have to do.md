# Have To Do — Checklist from req.md

Progress scan against `req.md` requirements (as of Aug 9, 2026).

## 1. Project Setup ✅
- [x] Express.js
- [x] TypeScript
- [x] PostgreSQL
- [x] Prisma ORM
- [x] JWT Authentication
- [x] bcrypt
- [x] dotenv
- [x] CORS

## 2. Project Structure ✅ (partially)
- [x] `prisma/schema.prisma`
- [x] `src/app.ts`, `src/server.ts`
- [x] `src/routes/`
- [x] `src/services/user|category|product|order|review|auth`
- [x] `src/lib/`
- [ ] **Refactor `src/routes/user.routes.ts`** — it is raw/inline Prisma code, not following the modular `service/controller` pattern used by category, product, order, review.

## 3. Database Design ✅
- [x] 5 models (User, Category, Product, Review, Order) — meets "minimum 4 services"
- [x] 3 enums (UserRole, ProductStatus, OrderStatus) — meets "at least 2 enums"
- [x] Proper relationships (one-to-many, foreign keys)
- [x] Soft delete (`isDeleted`)
- [x] `createdAt` / `updatedAt` timestamps
- [x] `@@map()` table mapping
- [x] Indexes (`@@index`)
- [x] Primary keys (UUID)

## 4. Authentication System 🔶 (incomplete)
- [x] User Registration
- [x] Login
- [x] Password hashing (bcrypt, salt rounds 10)
- [x] JWT token generation (`createToken`, 7d expiry)
- [ ] **JWT verification middleware (auth guard)** — no middleware verifies the token or protects routes yet. "JWT Authentication" is only half done (token is issued, never validated).
- [ ] **Input validation** — `src/services/auth/auth.validation.ts` is empty. Registration/login payloads are not validated (zod or manual checks).

## 5. CRUD API Development 🔶 (mostly done)
Required for every module: Create, Get All, Get By ID, Update, Delete (Soft).

- [x] `/api/auth` — register + login
- [ ] `/api/users` — **INCOMPLETE**: only POST (create) and GET (all) exist. Missing Get By ID, Update, Soft Delete. Also: doesn't filter `isDeleted`, stores raw password (no hashing), returns password in responses, response shape is inconsistent with the rest.
- [x] `/api/categories`
- [x] `/api/products`
- [x] `/api/orders`
- [x] `/api/reviews`
- [x] Consistent response structure `{ success, message, data }` — except user routes.
- [ ] Consider adding an `Order` route/status update is fine, but make sure all responses include `data` key everywhere (category controller omits `data` on some errors).

## 6. Prisma Features 🔶
- [x] Prisma Client (generated, driver adapter)
- [x] Relations
- [x] Enums
- [x] Indexes
- [ ] **Prisma Migrate** — `prisma/migrations/` folder does NOT exist. Run `npx prisma migrate dev --name init` to create tracked migration files (instead of just `db push`).
- [ ] Prisma Studio — nothing to code, but verify it opens during dev (`npx prisma studio`).

## 7. Code Quality 🔶
- [x] Modular architecture (mostly)
- [x] Meaningful naming
- [x] Type safety
- [ ] **No duplicate code** — `user.routes.ts` duplicates auth logic and doesn't reuse the pattern.
- [ ] **Middleware / global error handler** — none exists; every controller re-writes try/catch. Could add a reusable async wrapper + centralized error middleware.
- [ ] Clean up dead/empty files (`auth.validation.ts`).

## 8. API Documentation ❌ NOT DONE
- [ ] Create `API_DOCUMENTATION.md` listing for each endpoint: Endpoint, Method, Description, Request Body, Response, Status Codes.

## 9. Frontend Integration ❌ NOT DONE (separate project)
- [ ] Frontend consumes all backend APIs
- [ ] Auth works end-to-end
- [ ] CRUD updates UI in real time

## 17. Final Submission Requirements ❌ NOT DONE
- [ ] Live Backend API URL (deploy backend)
- [ ] GitHub Repository Link (already a git repo — push to GitHub)
- [ ] API Documentation (see item 8)

---

## Summary — Priority TODOs
1. Refactor `user.routes.ts` to full CRUD + hashing + soft delete, matching the category/product pattern.
2. Add JWT verification middleware (auth guard) and protect routes.
3. Implement input validation (fill `auth.validation.ts`).
4. Run Prisma Migrate to create `prisma/migrations/`.
5. Write `API_DOCUMENTATION.md`.
6. Add global error-handling middleware (optional polish).
7. Deploy backend (live URL) + push GitHub repo.
