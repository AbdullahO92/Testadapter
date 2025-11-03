# Project Report - Generic Data Adapter

## 1. Project overview
The backend is a NestJS service for the Student Companion App. It gets data from many school systems and sends it to Microsoft Teams. The project uses modules for every big feature. Prisma talks to the database. Redis keeps fast cache data. Azure services give cloud tools.

## 2. Why we added a generic data adapter
Many schools use more than one learning system. The old code focused on Canvas. We added a generic adapter to read data from any vendor. The new module should reuse the services that already exist. This keeps the code simple and safe.

## 3. Where the new files live
- `src/genericadapter/generic-adapter.module.ts` sets up the NestJS module. It imports external system, translation, and storage modules. It also shares the adapter service with other parts of the app.
- `src/genericadapter/generic-adapter.service.ts` holds the main logic. It loads vendor data from the database, maps the payload to the Student App format, and saves a preview in Redis cache. It also reads cached previews.
- `src/genericadapter/generic-adapter.controller.ts` gives HTTP endpoints. One route builds a preview for a vendor. Another route reads a cached preview by key.
- `src/genericadapter/dto/generic-adapter-preview.dto.ts` defines the request body for previews. It carries the user id, the response template name, and the payload data.
- `src/app.module.ts` imports `GenericAdapterModule` so the adapter works in the main app.

## 4. Reasons for each step
1. **Create a module**: NestJS uses modules to group features. Making `GenericAdapterModule` keeps the adapter code together and easy to import.
2. **Add a service**: Business logic belongs in a service. It can talk to repositories, translators, and storage without mixing with HTTP code.
3. **Add a controller**: Controllers handle requests. We need a simple API to test the adapter preview and cache.
4. **Define a DTO**: DTOs describe request data. This makes the preview endpoint easy to use and validate.
5. **Update AppModule**: The root module must list every feature. Importing `GenericAdapterModule` lets the rest of the app find the adapter service.

## 5. Next learning steps
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

