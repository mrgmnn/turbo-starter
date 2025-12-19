# GitHub Copilot Instructions for Turbo Starter

## Project Overview

This is a modern full-stack monorepo starter built with Turborepo. It features:

- **Backend**: NestJS API with Vite for fast HMR
- **Frontend**: Next.js 15+ with App Router, React 19, and Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui component library in shared package
- **Package Manager**: npm with workspaces

## Architecture Principles

### Monorepo Structure

- All apps are in `apps/` directory
- All shared packages are in `packages/` directory
- Use workspace references (`@repo/*`) for internal packages

### Code Style

- **TypeScript**: Use strict mode, prefer explicit types
- **Imports**: Use `.js` extensions in imports for ESM compatibility with NodeNext
- **Formatting**: Prettier is configured, use it for all files
- **Linting**: ESLint v9+ with flat config (eslint.config.mjs)

### Technology-Specific Guidelines

#### NestJS (API)

- Use Vite for development with `nodemon` for watch mode
- Development command: `npm run dev --filter=api`
- Main entry: `apps/api/src/main.ts`
- Use dependency injection and decorators following NestJS patterns
- Prisma client is imported from `@repo/prisma`

#### Next.js (Web)

- Use App Router (not Pages Router)
- Server Components by default, mark with `'use client'` when needed
- Runs on port 8000 (not default 3000)
- Uses Fontsource for self-hosted fonts (not next/font)
- Import shadcn components from `@repo/ui/components/*`

#### Prisma

- Schema location: `packages/prisma/schema/schema.prisma`
- The package exports a configured Prisma client
- Run migrations from root: `npx prisma migrate dev`
- Prisma Studio: `npx prisma studio`
- Prisma runs in watch mode during development

#### Tailwind CSS v4

- Import with: `@import 'tailwindcss';`
- Uses CSS variables and `@theme` directive (not traditional config)
- Color tokens use oklch format
- Dark mode with `class` strategy via next-themes

#### shadcn/ui

- Installed in `packages/ui/` as a shared package
- Add new components: `cd packages/ui && npx shadcn@latest add <component>`
- Components are exported from `@repo/ui/components/*`
- Uses Radix UI primitives and CVA for variants
- Styled with Tailwind CSS

### Development Workflow

#### Running the Project

```bash
npm install              # Install all dependencies
docker compose up -d     # Start PostgreSQL
npm run dev              # Run all apps in dev mode
```

#### Port Convention

- API apps use `3xxx` ports (api: 3000)
- Web apps use `8xxx` ports (web: 8000)

#### Environment Variables

- API: `apps/api/.env`
- Prisma: `packages/prisma/.env`
- Both need `DATABASE_URL` connection string

#### Common Commands

```bash
npm run dev --filter=api      # Run API only
npm run dev --filter=web      # Run web only
npm run build                 # Build all apps
npm run lint                  # Lint all packages
npm run test --filter=api     # Run API tests
```

### File Organization

#### Apps

- Each app has its own `package.json`
- Use workspace dependencies: `"@repo/prisma": "*"`
- Apps should be independent but can share packages

#### Packages

- Export types and utilities clearly
- Use `exports` field in package.json for explicit exports
- Shared UI components in `@repo/ui`
- Shared configs in `@repo/eslint-config` and `@repo/typescript-config`

### Common Patterns

#### Adding a New Shared Component

1. Create in `packages/ui/src/components/`
2. Export in `packages/ui/src/index.ts`
3. Add to `exports` in `packages/ui/package.json`
4. Import in apps: `import { Component } from '@repo/ui/components/component'`

#### Adding a New Prisma Model

1. Edit `packages/prisma/schema/schema.prisma`
2. Run `npx prisma migrate dev --name <migration-name>`
3. Prisma Client auto-regenerates in watch mode
4. Import in apps: `import { prisma } from '@repo/prisma'`

#### Creating a New API Endpoint

1. Create controller in `apps/api/src/`
2. Add to module imports
3. Use NestJS decorators (@Get, @Post, etc.)
4. Inject PrismaService for database access

### Best Practices

- **Type Safety**: Always define proper TypeScript types
- **Error Handling**: Use try-catch and proper error responses
- **Validation**: Use Zod or class-validator for input validation
- **Testing**: Write tests for critical business logic
- **Commits**: Use conventional commits format
- **Dependencies**: Keep shared dependencies in root when possible

### Avoid

- Don't use `any` type unless absolutely necessary
- Don't create circular dependencies between packages
- Don't bypass TypeScript strict mode
- Don't commit `.env` files or secrets
- Don't use Pages Router patterns in Next.js App Router
- Don't import from internal package paths, use exports

### Database

- PostgreSQL runs in Docker (port 5432)
- Database name: `turbostarter`
- Connection managed through Prisma
- Use migrations for schema changes, never modify DB directly

### Theme Support

- Dark/light mode via `next-themes`
- Theme toggle component available in `apps/web/components/mode-toggle.tsx`
- CSS variables defined in `apps/web/app/globals.css`
- Use semantic color tokens (primary, secondary, muted, etc.)

## Quick Reference

### Important Files

- `turbo.json` - Turborepo pipeline configuration
- `package.json` - Root workspace configuration
- `docker-compose.yml` - PostgreSQL container setup
- `.node-version` - Node.js version (24.1.0)

### Key Dependencies

- React 19
- Next.js 15+
- NestJS 11+
- Prisma 7+
- Tailwind CSS 4+
- Turborepo 2.6+
