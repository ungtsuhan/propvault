# PropVault Setup Notes

Personal reference for setting up the PropVault project.

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Repository Setup](#2-repository-setup)
3. [Scaffold Next.js](#3-scaffold-nextjs)
4. [Code Quality](#4-code-quality)
5. [Supabase Setup](#5-supabase-setup)
6. [Prisma Setup](#6-prisma-setup)
7. [Shadcn UI](#7-shadcn-ui)
8. [Environment Variables](#8-environment-variables)
9. [Deploy to Vercel](#9-deploy-to-vercel)

---

## 1. Prerequisites

| Tool        | Install                                     | Verify           |
| ----------- | ------------------------------------------- | ---------------- |
| nvm         | https://www.nvmnode.com/guide/download.html | `nvm --version`  |
| Node 24 LTS | `nvm install 24 && nvm use 24`              | `node --version` |
| pnpm        | `npm install -g pnpm`                       | `pnpm --version` |
| Git         | https://git-scm.com/install/                | `git --version`  |

### VS Code Extensions

Install from marketplace:

- `esbenp.prettier-vscode` — format on save
- `bradlc.vscode-tailwindcss` — Tailwind class autocomplete
- `Prisma.prisma` — schema syntax highlighting

---

## 2. Repository Setup

### 2.1 Create on GitHub

- Name: `propvault`
- Description: Track property investment

### 2.2 Clone locally

```bash
cd ~/Repo
git clone https://github.com/<your-username>/propvault
cd propvault
```

---

## 3. Scaffold Next.js

### 3.1 Create app

Run inside the project folder and scaffold into current directory.

```bash
pnpm create next-app@latest .
```

### 3.2 Configuration

Select the following options:

| Prompt                    | Answer                                |
| ------------------------- | ------------------------------------- |
| Use recommended defaults? | No, customize settings                |
| TypeScript?               | Yes                                   |
| Linter?                   | ESLint                                |
| React Compiler?           | No — experimental, skip for now       |
| Tailwind CSS?             | Yes                                   |
| src/ directory?           | Yes — keeps code separate from config |
| App Router?               | Yes                                   |
| Customize import alias?   | No — keep default `@/*`               |

### 3.3 Verify

```bash
pnpm dev
```

Open:

```
http://localhost:3000
```

✅ Expected:

- Next.js welcome page loads
- No errors in terminal

---

## 4. Code Quality

### 4.1 Install Prettier

```bash
pnpm add -D prettier eslint-config-prettier
```

### 4.2 Create `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "es5"
}
```

### 4.3 Create `.prettierignore`

```
node_modules
.next
public
pnpm-lock.yaml
pnpm-workspace.yaml
postcss.config.mjs
next-env.d.ts
next.config.ts
```

### 4.4 Update `eslint.config.mjs`

Add prettier as the last item to disable ESLint formatting rules:

```js
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
```

### 4.5 Update `package.json` scripts

Add formatting scripts:

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

### 4.6 VS Code settings

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

`.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "Prisma.prisma",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### 4.7 Verify

```bash
pnpm format
pnpm lint
```

✅ Expected:

- Code is formatted automatically
- No ESLint errors

---

## 5. Supabase Setup

### 5.1 Create project

1. Go to **supabase.com → New project**
2. Name: `propvault`
3. Region: **Southeast Asia (Singapore)**
4. Save database password somewhere safe
5. Wait for provisioning

### 5.2 Get your keys

**Connect to your project → API Keys:**

| Key                    | env var                         |
| ---------------------- | ------------------------------- |
| Project URL            | `NEXT_PUBLIC_SUPABASE_URL`      |
| Anon / Publishable key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

**Connect to your project → ORM:**

| Key                                       | env var        |
| ----------------------------------------- | -------------- |
| Transaction connection string (port 6543) | `DATABASE_URL` |
| Session connection string (port 5432)     | `DIRECT_URL`   |

Add variables to `.env`.

When deploying, add the same variables to Vercel under **Settings → Environment Variables**.

### 5.3 Create test user

Supabase Dashboard → Authentication → Users → Add user:

```
Email:    test@gmail.com
Password: test123456
```

### 5.4 Install packages

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

### 5.5 Create browser client

`src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase environment variables');
  return createBrowserClient(url, key);
}
```

### 5.6 Create server client

`src/lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

### 5.7 Route protection (proxy)

`src/proxy.ts`:

> Note: In Next.js 16, middleware is renamed to `proxy.ts`

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login'],
};
```

---

## 6. Prisma Setup

### 6.1 Install

```bash
pnpm add -D prisma
pnpm add @prisma/client
pnpm add @prisma/adapter-pg
```

### 6.2 Initialise

```bash
pnpm prisma init
```

**What gets created:**

| File                      | Description                               |
| ------------------------- | ----------------------------------------- |
| `prisma/schema.prisma`    | Data model definition (tables, relations) |
| `prisma/prisma.config.ts` | Prisma configuration                      |
| `.gitignore`              | Added `/src/generated/prisma`             |

#### Prisma 7 Configuration

In Prisma 7, datasource URLs are configured in `prisma.config.ts` instead of `schema.prisma`.

Update `prisma.config.ts` to use `DIRECT_URL` to avoid migration error:

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'],
  },
});
```

Notes:

- DIRECT_URL → used by Prisma CLI for migrations (direct DB connection)
- DATABASE_URL → used by Prisma Client (runtime, pooled connection)

### 6.3 Migration Workflow

```bash
# Create migration SQL script without applying
pnpm prisma migrate dev --name init --create-only

# Apply migration
pnpm prisma migrate dev

# Generate Prisma Client
pnpm prisma generate

# Open Prisma Studio
pnpm prisma studio --config ./prisma.config.ts
```

### 6.4 Instantiate Singleton Prisma Client

Create `src/lib/prisma.ts`:

```ts
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter, log: ['query'] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 6.5 Vercel Deployment Script

Update `package.json` to add:

```
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

#### Configure Vercel

In Vercel Dashboard → Project Settings → Build & Development Settings:

Configure Build Command:

```
pnpm vercel-build
```

It ensures:

- Prisma client is generated
- Database migrations are applied
- Next.js app is built

---

## 7. Shadcn UI

### 7.1 Initialise

```bash
pnpm dlx shadcn@latest init
```

### 7.2 Configuration

Select the following options:

| Prompt             | Answer                |
| ------------------ | --------------------- |
| Component library? | Radix                 |
| Preset?            | Nova - Lucide / Geist |
| Any other prompts  | Accept defaults       |

### 7.3 What changes after init

| File                           | Action   | Description                                 |
| ------------------------------ | -------- | ------------------------------------------- |
| `components.json`              | Created  | Shadcn config - style, paths, preset        |
| `src/lib/utils.ts`             | Created  | `cn()` helper - merges Tailwind classes     |
| `src/app/globals.css`          | Modified | CSS variables for colors and theme injected |
| `src/components/ui/button.tsx` | Created  | First component added by default            |

### 7.4 Add components

Add required components for the project:

```bash
pnpm dlx shadcn@latest add card input label
```

Each component is generated as a .tsx file inside:

```
src/components/ui/
```

---

## 8. Environment Variables

### 8.1 `.env` — never commit

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres.xxxx:password@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxx:password@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### 8.2 `.env.example` — always commit

Safe to commit (no real values):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=
```

### 8.3 Verify `.gitignore` contains

```
.env
!.env.example
```

### Notes

**NEXT*PUBLIC* prefix:**

- `NEXT_PUBLIC_*` vars are intentionally exposed to the browser - correct for Supabase URL and anon key

---

## 9. Deploy to Vercel

### 9.1 First deploy

1. Go to **vercel.com → Sign up with GitHub**
2. Click **Add New Project** → select `propvault` → Import
3. Vercel auto-detects Next.js

#### Build & Development Settings:

```
Build command:    pnpm vercel-build
Install command:  pnpm install
```

#### Environment Variable

Go to **Project → Settings → Environment Variables** and add:

| Variable                        | Note                               |
| ------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Safe to expose - used in browser   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Safe to expose - RLS protects data |
| `DATABASE_URL`                  | Prisma runtime (port 6543)         |
| `DIRECT_URL`                    | Prisma migrations (port 5432)      |

Check all three environments: Production ✅ Preview ✅ Development ✅
