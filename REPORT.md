# Project Report - Generic Data Adapter

## 1. Project overview
The backend is a NestJS service for the Student Companion App. It gets data from many school systems and sends it to Microsoft Teams. The project uses modules for every big feature. Prisma talks to the database. Redis keeps fast cache data. Azure services give cloud tools.

## 2. Why we added a generic data adapter
Many schools use more than one learning system. The old code focused on Canvas. We added a generic adapter to follow the same workflow for Canvas now and keep the door open for more vendors later. The module reuses services that already exist so the code stays simple and safe.

## 3. Where the new files live
- `src/genericadapter/generic-adapter.module.ts` sets up the NestJS module. It imports external system, configuration, translation, storage, and event modules. It also shares the adapter service with other parts of the app.
- `src/genericadapter/generic-adapter.service.ts` holds the main logic. It loads vendor data from the database, maps the payload to the Student App format, writes the preview to Redis, and can dispatch notifications.
- `src/genericadapter/generic-adapter.controller.ts` gives HTTP endpoints for preview, cache read, and dispatch actions. Guards keep the routes secure and versioned.
- `src/genericadapter/dto/generic-adapter-preview.dto.ts` defines and validates the request body for previews and dispatch calls.
- `src/genericadapter/connectors/*.ts` holds the base class, the registry, and the Canvas connector. Each connector converts vendor data into the shared format.
- `prisma/seed.ts` seeds the demo vendors, configurations, responses, and mappings so the adapter works in local environments.
- `src/genericadapter/generic-adapter.service.spec.ts` contains unit tests for preview and dispatch flows.

## 4. Reasons for the core structure
1. **Create a module**: NestJS groups features inside modules. Putting the adapter in `GenericAdapterModule` keeps all parts together and makes import into the main app easy.
2. **Add a service**: Business rules live in services. The adapter service can work with repositories, translation, cache, and events without mixing with HTTP concerns.
3. **Add a controller**: We need REST endpoints to preview and send notifications. The controller handles HTTP and forwards safe data to the service.
4. **Define a DTO**: DTO classes describe and validate request data. This prevents bad payloads from entering the service logic.
5. **Update AppModule**: The root module must list every feature. Importing the adapter module makes the feature available for the whole backend.

## 5. Detailed steps with justifications
### Step 1 – Register the module and connectors
We created `GenericAdapterModule` to import the repositories, translation, cache, and event modules, and to register the connector registry with the Canvas implementation. This lets the adapter reuse existing data sources and pick the right connector automatically for Canvas today while keeping the structure ready for more vendors later.【F:src/genericadapter/generic-adapter.module.ts†L1-L55】

### Step 2 – Protect and document the controller
The controller now uses API versioning, Azure AD guards, Swagger tags, and a strict validation pipe. These additions keep the preview, cache, and dispatch endpoints secure and consistent with other modules while giving clear API docs for the company team.【F:src/genericadapter/generic-adapter.controller.ts†L1-L69】

### Step 3 – Validate incoming requests
`GenericAdapterPreviewDto` adds Swagger hints and `class-validator` rules for user IDs, response names, configuration IDs, and optional payload fields. Validation blocks invalid payloads early and gives predictable shapes for the service.【F:src/genericadapter/dto/generic-adapter-preview.dto.ts†L1-L54】

### Step 4 – Build preview and dispatch flows
The service loads the user and external system, resolves the right response template, and calls the connector to normalize the payload. It translates the payload into a Teams card, stores the preview in Redis for 15 minutes, and can dispatch the message through the event service using configuration and event mapping data. These steps make sure every vendor follows the same workflow from request to notification.【F:src/genericadapter/generic-adapter.service.ts†L1-L195】【F:src/genericadapter/generic-adapter.service.ts†L196-L276】

### Step 5 – Implement vendor connectors
Each connector extends a shared base class and focuses on translating vendor-specific fields. Right now only the Canvas connector is active. It converts announcements, grades, and other payloads into the normalized structure the translator expects. This keeps vendor rules separate from the main service and makes new vendors easy to add later.【F:src/genericadapter/connectors/generic-adapter.connector.ts†L1-L38】【F:src/genericadapter/connectors/canvas.connector.ts†L1-L61】

### Step 6 – Split translation logic per vendor
The translation module now keeps a small registry of translator classes. For now it only exposes the Canvas translator and the shared welcome translator, so the adapter stays focused on Canvas while still matching the pattern we will reuse for more vendors.【F:src/translation/translation.module.ts†L1-L38】【F:src/translation/providers/canvas-notification.translator.ts†L1-L61】

### Step 7 – Seed shared configuration data
`prisma/seed.ts` creates fixed IDs for Canvas, its configuration, response templates, and event mappings. Seeding gives developers a ready database so the adapter can run end-to-end without manual setup, matching the project plan request for quick onboarding.【F:prisma/seed.ts†L1-L165】

### Step 8 – Cover the service with tests
The unit test verifies that preview caching, payload translation, and event dispatch behave correctly when the service talks to mocked dependencies. This safety net helps the team refactor or add vendors without breaking the main flow.【F:src/genericadapter/generic-adapter.service.spec.ts†L1-L123】

## 6. Next learning steps
1. **Read other modules**
   - Open `src/canvas/` and `src/integration/`.
   - Look at each `*.module.ts`, `*.service.ts`, and `*.controller.ts` file.
   - Compare the imports and providers with the generic adapter so you see the common NestJS pattern.

2. **Try the preview API**
   - Run the backend with `pnpm start:dev`.
   - Send a POST request: `curl -X POST http://localhost:3000/generic-adapter/canvas/preview -H "Content-Type: application/json" -d '{"userId":"<USER_ID>","responseInternalName":"<RESPONSE>","payload":{}}'`.
   - Copy the `cacheKey` from the answer and call `curl "http://localhost:3000/generic-adapter/cache?key=<CACHE_KEY>"` to see the saved notification.

3. **Study the translation service**
   - Open `src/translation/translation.service.ts`.
   - Read methods like `translateBodyToCard` and note which helpers they use.
   - Check how translators in `src/translation/providers/` shape the final Teams cards.

4. **Check Prisma data**
   - Look at `prisma/schema.prisma` to see the `ExternalSystem` model.
   - Open `src/externalsystem/externalsystem.repository.ts` to understand how the data is loaded.
   - Use Prisma Studio (`pnpm prisma studio`) to inspect rows during development.
