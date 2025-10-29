[![Continuous Integration](https://github.com/cy2hq/sca-api/actions/workflows/ci.yml/badge.svg)](https://github.com/cy2hq/sca-api/actions/workflows/ci.yml) [![Deployment to Azure Web App](https://github.com/cy2hq/sca-api/actions/workflows/main_sca-api.yml/badge.svg)](https://github.com/cy2hq/sca-api/actions/workflows/main_sca-api.yml)

# Student Companion App (SCA) API

## Description

TBD...

## Project setup

Install node modules

```bash
$ pnpm install
```

Make sure that Azure CLI is installed. This is a prerequisite for retrieving secrets from Azure Key Vault on your local machine.

If Azure CLI is installed, make sure you're logged in and select the correct resource group.

```bash
$ az login
```

## Database preparation

Setup a local PostgreSQL database and update your local `.env` file with the correct connection string.
example `.env` file:

```
DATABASE_URL=postgres://postgres:root@localhost:5432/sca
```

Run the migrations to create the database schema. Make sure that the database is running.

```bash
pnpm exec prisma migrate dev
```

## Changing the prisma schema

If you want to change the prisma schema, you can do so in the `prisma/schema.prisma` file.
After changing the schema, run the following command to generate the new interfaces.

> [!IMPORTANT]
> Make sure to run this command after every change to the schema.
> This will generate the new interfaces and make sure that the database is in sync with the schema.

> [!WARNING]
> You will get an error if you run this command while the application is running.

```bash
pnpm exec prisma generate
```

If you want to push the changes to the database without creating a migration, you can run the following command:

```bash
pnpm exec prisma db push
```

Changes to the schema will need a to be added as a migration. You can do this by running the following command:

```bash
pnpm exec prisma migrate dev --name <migration-name>
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov

```
