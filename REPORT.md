# Project Report - Generic Data Adapter

## 1. Project overview
The Student Companion API now uses a Generic Data Adapter module. Right now it talks to Canvas with real data. The adapter turns each Canvas message into one common format and then sends it into the normal notification pipeline. We built it with NestJS, Prisma, and Redis, so it follows the project plan and keeps the same security and logging rules as the rest of the app. The code is ready for more systems in the future. Campus Solutions files with mock data already show how a second vendor can plug in later.

## 2. Where the new files live
- `src/genericadapter/generic-adapter.module.ts` – Sets up the adapter providers for NestJS.
- `src/genericadapter/generic-adapter.controller.ts` – Holds the secure preview, cache, and dispatch routes.
- `src/genericadapter/generic-adapter.service.ts` – Runs the main flow: load Canvas data, call the connector, save the cache, and send events.
- `src/genericadapter/generic-adapter.service.spec.ts` – Tests the preview and dispatch flow.
- `src/genericadapter/dto/generic-adapter-preview.dto.ts` – Checks the JSON body for preview and dispatch.
- `src/genericadapter/connectors/generic-adapter.connector.ts` – Gives the shared interface and helper methods for all connectors.
- `src/genericadapter/connectors/connector.registry.ts` – Matches the vendor name with the correct connector class.
- `src/genericadapter/connectors/canvas.connector.ts` – Validates Canvas payloads and normalizes them.
- `src/genericadapter/connectors/campus-solutions.mock.ts` – Stores mock Campus Solutions payloads for local tests.
- `src/genericadapter/connectors/campus-solutions.connector.ts` – Shows how Campus Solutions could work later by using the mock payloads.
- `src/genericadapter/connectors/campus-solutions.connector.spec.ts` – Unit tests for the Campus Solutions mock connector.
- `src/translation/translation.module.ts` – Exports the translation service for other modules.
- `src/translation/translation.providers.ts` – Lists the shared translation providers for dependency injection.
- `src/translation/translation.service.ts` – Uses the translator registry to build Teams cards.
- `src/translation/translation.service.spec.ts` – Covers the Canvas translation outputs.
- `src/translation/translators/translator.ts` – Base interface for every translator.
- `src/translation/translators/notification-translator.ts` – Adds notification helper logic used by the adapter.
- `src/translation/translators/translator.registry.ts` – Finds which translator can handle a response.
- `src/translation/translators/canvas.translator.ts` – Turns Canvas announcements, grades, submission reminders, submission comments, and welcome cards into Teams cards.
- `src/translation/translators/campus-solutions.translator.ts` – Turns the Campus Solutions mock payloads into cards for future use.
- `src/translation/translators/welcome.translator.ts` – Builds the generic welcome card.
- `prisma/seed.ts` – Seeds Canvas data plus placeholder Campus Solutions records for local demos.
- `test/generic-adapter.e2e-spec.ts` – Checks the adapter routes through an end-to-end test.

## 3. Reasons for the structure
1. **Separate module** (`generic-adapter.module.ts`) keeps all adapter providers together and easy to import into `AppModule`.
2. **Controller plus DTO** keep HTTP rules (version, guard, validation) away from business logic and protect every request body.
3. **Service layer** connects Prisma, connectors, translation, cache, and events so the flow stays in one place.
4. **Connector registry** lets the adapter stay generic: each vendor gets its own class without changing the service.
5. **Translation registry** follows the same idea, so each vendor owns its own card builder and mock logic when real credentials are missing.
6. **Seeds and tests** help every developer run Canvas and Campus Solutions locally and catch regressions.

## 4. How to add a new provider (with file locations and details)

**Connector**
👉 `src/genericadapter/connectors/<vendor>.connector.ts`
Copy the Canvas connector, change the vendor name, and write `normalizePayload` so the adapter gets clean data.

**Register connector**
👉 `src/genericadapter/connectors/connector.registry.ts`
Map the vendor key to the new connector class. Example: `this.registry.set('brightspace', BrightspaceConnector)`.
👉 `src/genericadapter/generic-adapter.module.ts`
Add the new connector class to the `connectorProviders` array so NestJS can inject it.

**Translator**
👉 `src/translation/translators/<vendor>.translator.ts`
Create a translator that knows how to build Teams cards for the vendor responses.

**Register translator**
👉 `src/translation/translation.providers.ts`
Add the translator class to `translatorClasses`.
👉 `src/translation/translation.module.ts`
Export the translator through the module so other modules can use it.

**Seed database**
👉 `prisma/seed.ts`
Add the vendor external system, configuration, responses, and event mappings. Run `pnpm prisma db seed`.

**Extend tests**
👉 `src/genericadapter/generic-adapter.service.spec.ts`
Cover preview and dispatch for the new vendor.
👉 `src/translation/translation.service.spec.ts`
Test the new translator output.
👉 `src/genericadapter/connectors/<vendor>.connector.spec.ts`
Add connector unit tests so normalization and validation stay correct.
👉 `test/generic-adapter.e2e-spec.ts`
Add an end-to-end check for the new flow.
