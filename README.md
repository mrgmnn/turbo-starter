# Turborepo Starter with NestJS & Next.js

A modern full-stack monorepo starter featuring NestJS API with Vite for fast development and Next.js for the frontend.

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
- npm/pnpm/yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/mrgmnn/turbo-starter.git

# Install dependencies
npm install
```

### Database Setup

This project uses PostgreSQL with Prisma ORM.

#### Start PostgreSQL with Docker

```sh
# Start PostgreSQL container
docker-compose up -d

# Stop PostgreSQL container
docker-compose down

# Stop and remove data
docker-compose down -v
```

The PostgreSQL container runs on `localhost:5432` with:

- **Database**: postgres
- **User**: postgres
- **Password**: postgres

#### Create Demo Database

For demo purposes, create a database called `turbostarter`:

```sh
# Connect to PostgreSQL container
docker exec -it turbo-starter-postgres-1 psql -U postgres

# Create the database
CREATE DATABASE turbostarter;

# Exit psql
\q
```

#### Prisma Setup

```sh
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Open Prisma Studio (Database GUI)
npx prisma studio
```

The Prisma schema is located in `packages/prisma/schema/schema.prisma`.

### Development

Run all apps in development mode:

```sh
npm run dev
```

Run the API:

```sh
npm run dev --filter=api
```

Run the web app:

```sh
npm run dev --filter=web
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

Build the API:

```sh
npm run build --filter=api
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
│   ├── docs/         # Next.js documentation site
│   └── web/          # Next.js web application
├── packages/
│   ├── ui/           # Shared React component library
│   ├── prisma/       # Prisma schema and database client
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
├── docker-compose.yml    # PostgreSQL container configuration
└── turbo.json        # Turborepo configuration
```

### Apps and Packages

- **`api`**: [NestJS](https://nestjs.com/) REST API with Vite for development
- **`web`**: [Next.js](https://nextjs.org/) web application with React 19 and Tailwind CSS
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

### Build System

- **Turborepo** - High-performance build system
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Why Vite with NestJS?

Traditional NestJS development requires rebuilding on every change. This starter uses Vite to provide:

- ⚡ Instant hot module replacement
- 🎯 Fast startup times
- 🔄 No build step during development
- 📦 Optimized production builds

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

## Environment Variables

Create a `.env` file in `apps/api/`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turbostarter?schema=public"
```

**Important**: You also need to create a `.env` file in `packages/prisma/` with the same `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turbostarter?schema=public"
```

The `DATABASE_URL` connects to the PostgreSQL container started with Docker Compose.

## Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [nodenv Documentation](https://github.com/nodenv/nodenv)

## License

MIT
