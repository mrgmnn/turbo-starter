# Turborepo Starter with NestJS & Next.js

A modern full-stack monorepo starter featuring NestJS API with Vite for fast development and Next.js for the frontend.

![Turbo Starter](screenshot.png)

## Features

- 🚀 **Fast Development** - NestJS with Vite for instant hot reload
- ⚡ **Just-in-Time Compilation** - No build step needed during development
- 📦 **Turborepo** - Efficient build system with caching
- 🎨 **Next.js Apps** - Multiple frontend applications
- 🔧 **TypeScript** - Full type safety across the monorepo
- 🎯 **Shared Packages** - Reusable UI components and configurations

## Getting Started

### Prerequisites

- Node.js 18+ (we recommend using [nodenv](https://github.com/nodenv/nodenv) with version 24.1.0)
- npm (package manager)
- Docker and Docker Compose (for PostgreSQL database)
- Git (for cloning the repository)

### Installation & Setup

```sh
# Clone the repository
git clone https://github.com/mrgmnn/turbo-starter.git

# Navigate to the project
cd turbo-starter

# Run bootstrap (installs dependencies, builds Prisma client on first run, and sets up database)
npm run bootstrap
# or use the shell script: ./scripts/bootstrap.sh
```

The bootstrap process will:

1. Install all npm dependencies
2. Generate the Prisma client on first run (so dev doesn't fail if Prisma wasn't built yet)
3. Check if Docker is running and start PostgreSQL if needed
4. Prompt for a project name (default: "turbo-starter")
5. Update `package.json` with the project name
6. Create the database (derived from project name)
7. Generate and add `DATABASE_URL` to `.env` files in `apps/api/` and `packages/prisma/`

#### Next Steps

After setup completes:

1. **Define your database schema** in `packages/prisma/schema/schema.prisma`
2. **Create and apply migrations** when ready: `npx prisma migrate dev --name init`
3. **Start development**: `npm run dev`
4. **View your data**: `npx prisma studio`

> **Tip**: VS Code will prompt you to install recommended extensions for this project. Accept to get ESLint, Prettier, Prisma, Tailwind CSS IntelliSense, and more!

#### Manual Setup (Alternative)

If you prefer manual setup:

```sh
# Start PostgreSQL
docker compose up -d

# Create database
docker exec -it postgres psql -U postgres -c "CREATE DATABASE turbostarter;"

# Create .env files with DATABASE_URL in apps/api/ and packages/prisma/
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turbostarter?schema=public"

# First-time Prisma client build (if you didn't run bootstrap)
npm run -w @repo/prisma build

# Run migrations
npx prisma migrate dev --name init
```

#### Useful Commands

```sh
npx prisma studio          # Open Prisma Studio (Database GUI)
npx prisma migrate dev     # Create and apply migrations
docker-compose down        # Stop PostgreSQL
docker-compose down -v     # Stop and remove data
```

> **Note**: During development, Prisma automatically watches for schema changes and regenerates the client. The schema is in `packages/prisma/schema/schema.prisma`.

### Development

Run all apps in development mode (including Prisma watcher):

```sh
npm run dev
```

Run the API with Prisma watcher:

```sh
npm run dev:api
```

Run the web app:

```sh
npm run dev:web
```

#### Development Ports

The applications run on the following ports during development:

- **API** (NestJS): `http://localhost:3000`
- **Web** (Next.js): `http://localhost:8000`

> **Port Convention**: APIs use the `3xxx` port range, while frontend applications use the `8xxx` port range. This convention helps organize services and avoid port conflicts as your monorepo grows.

### Build

Build all apps and packages:

```sh
npm run build
```

Build specific apps:

```sh
npx turbo build --filter=api
npx turbo build --filter=web
```

### Production

Run the API in production mode:

```sh
npm run start:prod --filter=api
```

## Project Structure

```
├── apps/
│   ├── api/          # NestJS API with Vite
│   └── web/          # Next.js web application
├── packages/
│   ├── ui/           # Shared UI component library with shadcn/ui
│   ├── prisma/       # Prisma schema and database client
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
├── docker-compose.yml    # PostgreSQL container configuration
├── screenshot.png    # Project screenshot
└── turbo.json        # Turborepo configuration
```

### Apps and Packages

- **`api`**: [NestJS](https://nestjs.com/) REST API with Vite for development
- **`web`**: [Next.js](https://nextjs.org/) web application with React 19, Tailwind CSS v4, and shadcn/ui
- **`@repo/ui`**: Shared UI component library with shadcn/ui components
- **`@repo/prisma`**: Prisma schema and generated client
- **`@repo/eslint-config`**: ESLint configurations
- **`@repo/typescript-config`**: TypeScript configurations

## Tech Stack

### Backend (API)

- **NestJS** - Progressive Node.js framework
- **Vite** - Fast development server with HMR
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type safety

### Frontend (Web)

- **Next.js** - React framework with App Router
- **React 19** - Latest React with modern features
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **next-themes** - Dark mode support

### Shared Packages

- **`@repo/ui`** - Shared UI component library with shadcn/ui components
- **`@repo/prisma`** - Shared Prisma schema and client
- **`@repo/eslint-config`** - Shared ESLint configurations
- **`@repo/typescript-config`** - Shared TypeScript configurations

### Build System

- **Turborepo** - High-performance build system with caching
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Why Vite with NestJS?

Using Vite in this monorepo setup enables Just-in-Time (JIT) compilation for shared packages, eliminating the need to rebuild packages during development. This provides:

- ⚡ Instant hot module replacement across the monorepo
- 🎯 Fast startup times with JIT compilation
- 🔄 No build step needed for packages during development
- 📦 Seamless integration between apps and shared packages

## Fonts with Fontsource

This project uses [Fontsource](https://fontsource.org/) for self-hosted font management. Fontsource provides optimized, self-hosted fonts that don't require external CDN requests.

### Current Font

The web app uses **Source Sans Pro** in multiple weights (300, 400, 900).

### Adding a New Font

1. Install the font package:

   ```sh
   npm install @fontsource/<font-name> -w web
   ```

2. Import the font weights in `apps/web/app/globals.css`:

   ```css
   @import '@fontsource/source-sans-pro/300.css';
   @import '@fontsource/source-sans-pro/400.css';
   @import '@fontsource/source-sans-pro/900.css';
   ```

3. Update the font family:
   ```css
   body {
     font-family: 'Source Sans Pro', sans-serif;
   }
   ```

### Benefits

- **Performance**: Fonts are bundled and served from your domain
- **Privacy**: No third-party requests to Google Fonts or other CDNs
- **Reliability**: No dependency on external services
- **Optimization**: Only load the weights and subsets you need

## Scripts

```sh
# Development
npm run dev          # Start all apps
npm run dev --filter=api    # Start API only

# Build
npm run build        # Build all apps
npm run build --filter=api  # Build API only

# Lint
npm run lint         # Lint all packages

# Format
npm run format       # Format all code
```

## Testing

### Run Tests

```sh
# Run unit tests for API
npm run test --filter=api

# Run tests in watch mode
npm run test:watch --filter=api

# Run tests with coverage
npm run test:cov --filter=api

# Run e2e tests
npm run test:e2e --filter=api
```

## Troubleshooting

### Port Already in Use

If you see an error like `Error: listen EADDRINUSE: address already in use :::3000`:

```sh
# Find and kill the process using the port
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

If Prisma can't connect to the database:

1. **Check if PostgreSQL container is running**:

   ```sh
   docker ps
   ```

2. **Restart the container**:

   ```sh
   docker-compose down
   docker-compose up -d
   ```

3. **Verify the database exists**:

   ```sh
   docker exec -it postgres psql -U postgres -l
   ```

4. **Check your `.env` files** - Make sure both `apps/api/.env` and `packages/prisma/.env` have the correct `DATABASE_URL`

### Prisma Client Not Generated

If you see `Cannot find module '@prisma/client'`:

```sh
npx prisma generate
```

### Module Resolution Errors

If you encounter module resolution issues:

```sh
# Clean install
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

## Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Fontsource](https://fontsource.org/)
- [nodenv Documentation](https://github.com/nodenv/nodenv)

## License

MIT
