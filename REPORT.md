#                  Generic Data Adapter

## 1. Project overview
The Generic Data Adapter was added to the Student Companion API to connect Microsoft Teams
with educational systems such as Canvas, Brightspace, Blackboard, and Campus Solutions.
The adapter transforms data from these systems into the Edu-API standard format.
The project uses modules for each main feature.
**Prisma** talks to the database.
**Redis** stores fast cache data.
**Azure** for cloud services.
## 2. Where the new files live
- `src/genericadapter/genericadapter.module.ts` – NestJS module wiring for the adapter.
- `src/genericadapter/genericadapter.controller.ts` – Secured REST endpoints for preview, cache read, and dispatch.
- `src/genericadapter/genericadapter.service.ts` – Core workflow that loads Canvas data, calls connectors, caches previews, and enqueues events.
- `src/genericadapter/genericadapter.service.spec.ts` – Unit coverage for preview/dispatch logic.
- `src/genericadapter/dto/genericadapter-preview.dto.ts` – Validated request body shared by preview and dispatch routes.
- `src/genericadapter/connectors/genericadapter.connector.ts` – Shared interface and base helpers for every vendor connector.
- `src/genericadapter/connectors/connector.registry.ts` – Resolver that maps vendor names to connector instances.
- `src/genericadapter/connectors/canvas.connector.ts` – Canvas-specific normalization rules and payload validation.
- `src/translation/translation.module.ts` – Exposes the translation service and registers translator providers.
- `src/translation/translation.providers.ts` – Reusable provider list for the translation service and registry.
- `src/translation/translation.service.ts` – Uses the translator registry to build Teams cards for adapter payloads.
- `src/translation/translation.service.spec.ts` – Tests that Canvas payloads become valid notification cards.
- `src/translation/translators/translator.ts` – Base interface for every translator strategy.
- `src/translation/translators/notification-translator.ts` – Notification-specific translator interface used by the adapter.
- `src/translation/translators/translator.registry.ts` – Registry that selects the right translator based on vendor response names.
- `src/translation/translators/canvas.translator.ts` – Handles Canvas announcements, grades, submission reminders, submission comments, and welcome cards.
- `src/translation/translators/welcome.translator.ts` – Shared translator for generic welcome notifications.
- `prisma/seed.ts` – Seeds Canvas external system data, configurations, responses, and event mappings for local testing.
- `test/generic-adapter.e2e-spec.ts` – End-to-end smoke test that exercises the secured adapter routes.

## 3. The structure
1. **Module** – keeps all adapter files in one place and easy to import.
2. **Controller and DTO** – handle security, versioning, and validation separately from logic.
3. **Service** – connects all parts: database, connectors, cache, events, and translation.
4. **Connector registry** –makes it easy to add new systems without changing the main service.
5. **Translation registry** – each system can have its own translation rules.
6. **Seeds and tests** – help the developers to run the adapter locally and catch regressions.


## 4. How to add a new provider

**Add Connector**  
`src/genericadapter/connectors/<vendor>.connector.ts` 

Copy the Canvas connector, change the vendor name, and write `normalizePayload`
so the adapter gets clean data.

**Register connector** `src/genericadapter/connectors/connector.registry.ts`  
Map the vendor key to the new connector class. Example: 
`this.registry.set('brightspace', BrightspaceConnector)`.  
 `src/genericadapter/genericadapter.module.ts`  
Add the new connector class to the `connectorProviders` array so NestJS can inject it.

**Add Translator**  
`src/translation/translators/<vendor>.translator.ts`  
Create a translator that knows how to build Teams cards for the vendor responses.

**Register translator**  
 `src/translation/translation.providers.ts`  
Add the translator class to `translatorClasses`.  
 `src/translation/translation.module.ts`  
Export the translator through the module so other modules can use it.

**Seed database**  
 `prisma/seed.ts`  
Add the vendor external system, configuration, responses, and event mappings. Run `pnpm prisma db seed`.

**Extend tests**  
 `src/genericadapter/genericadapter.service.spec.ts`  
Cover preview and dispatch for the new vendor.  
 `src/translation/translation.service.spec.ts`  
Test the new translator output.  
 `test/genericadapter.e2e-spec.ts`  
Add an end-to-end check for the new flow.

