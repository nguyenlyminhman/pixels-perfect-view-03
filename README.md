# NosyAgentic — AI Code Review Dashboard

NosyAgentic automatically reviews Bitbucket and GitLab pull requests with AI agents, surfacing findings by severity and tracking every review run.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pixels-perfect-view-03.lovable.app

## Tech Stack

| Concern | Library |
|---|---|
| UI components | **Ant Design** (`antd` v5) + `@ant-design/icons` |
| State management | **Zustand** v5 |
| Routing | **TanStack Router** (file-based, SPA-style — `ssr: false` on all app routes) |
| Data fetching | **TanStack Query** v5 |
| Charts | **Recharts** v2 |
| Build / SSR shell | TanStack Start + Vite + Nitro (via `@lovable.dev/vite-tanstack-config`) |
| Language | TypeScript 5 |

> **shadcn/ui and Tailwind utility classes are intentionally NOT used.**  
> `tailwindcss` and `@tailwindcss/vite` remain in `package.json` only because  
> `@lovable.dev/vite-tanstack-config` injects the Tailwind Vite plugin automatically;  
> the single `@import "tailwindcss" source(none);` line in `src/styles.css` disables  
> all source scanning so no utility classes are generated.

## Project Structure

```
src/
├── routes/                  # File-based TanStack Router pages
│   ├── __root.tsx           # HTML shell, QueryClient, AntdProvider
│   ├── index.tsx            # Redirects / → /dashboard
│   ├── login.tsx            # Login page
│   └── _authenticated/      # Protected layout (auth guard + AppLayout)
│       ├── dashboard.tsx    # Stats, recharts area/pie, recent runs table
│       ├── reviews/         # Pull Requests, Review Runs, Findings
│       ├── config/          # Prompt Templates (admin only), Repositories
│       └── admin/           # Users & Roles (admin only)
├── components/
│   ├── layout/              # AppLayout (Sider, Header, Breadcrumb, modals)
│   └── common/              # PageHeader, PlaceholderPage, RoleGuard,
│                            #   ProfileModal, ChangePasswordModal
├── stores/                  # Zustand stores (authStore, uiStore)
├── services/                # Mock API layer (authService, userService, mockData)
├── theme/                   # AntdProvider, design tokens, global.css (na-* classes)
└── types/                   # Shared TypeScript types
```

## Conventions

1. **Use Ant Design components only.** Do not introduce shadcn/ui, Radix UI, Headless UI, or any other component library.
2. **Design tokens live in `src/theme/`.** Colours, gradients and Ant Design `ThemeConfig` objects go in `src/theme/tokens.ts`. Custom CSS-only styles (animations, login backdrop, `na-*` utility classes) go in `src/theme/global.css`.
3. **No Tailwind utility classes in JSX/TSX.** Only the custom `na-*` classes defined in `global.css` may appear in `className` props.
4. **No new UI libraries.** If a component is needed, build it with `antd` primitives or plain HTML + inline styles.
5. **Role-based access** is enforced client-side via `<RoleGuard roles={[...]}>` and server-side menu filtering in `menuForRole()`. Roles: `admin`, `approver`, `viewer`.
6. **Mock data only** — `src/services/mockData.ts` is the single source of truth until a real backend is wired up.

## Demo Accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | admin |
| `approver` | `approver123` | approver |
| `viewer` | `viewer123` | viewer |

## Development

Requires Node.js ≥ 18 and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/08e0cb5c-2064-4d33-92f8-e0cfd04f35d5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.
