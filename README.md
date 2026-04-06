# Next Flow Schema

Flow/schema editor built with Next.js 16, React 19, Tailwind CSS 4, Radix UI, and @xyflow/react. Uses Feature‑Sliced Design (FSD) for maintainability.

## 🚀 Getting Started

- Prerequisites:
  - Node.js 18+ (20+ recommended)
  - pnpm 8+

- Install:

```bash
pnpm install
```

- Dev server:

```bash
pnpm dev
```

Open http://localhost:3000.

- Production:

```bash
pnpm build
pnpm start
```

- Lint:

```bash
pnpm lint
```

## 🛠️ Tech Stack

- Framework: Next.js 16 (App Router); [layout.tsx](./app/layout.tsx) loads providers and fonts.
- React 19 with TypeScript 5.
- Styling: Tailwind CSS v4 with @theme tokens; see [globals.css](./app/globals.css).
- Components: Radix UI primitives; shared UI kit in [shared/ui](./src/shared/ui).
- Graph editor: @xyflow/react; editor lives in [FlowEditor](./src/widgets/flow-editor/ui/FlowEditor.tsx).
- State: Zustand stores for chart and schema; see [chart-store.ts](./src/entities/chart/api/chart-store.ts) and [schema-store.ts](./src/entities/schema/api/schema-store.ts).
- Icons: lucide-react.
- Tooling: ESLint 9, Prettier, Tailwind PostCSS plugin.

## 📁 Project Structure

For more details about the project architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)

The project follows a feature-sliced design pattern:

- app/ — App Router, global styles and layout: [globals.css](./app/globals.css), [layout.tsx](./app/layout.tsx), [(home)/page.tsx](<./app/(home)/page.tsx>).
- src/assets — icons and assets: [icons.tsx](./src/assets/icons.tsx).
- src/shared — UI kit and utilities: [Button.tsx](./src/shared/ui/Button.tsx), [Dialog.tsx](./src/shared/ui/Dialog.tsx), [cn.ts](./src/shared/lib/cn.ts).
- src/entities — domain slices:
  - chart: node registry, node components, store; e.g., [node-registry.tsx](./src/entities/chart/model/node-registry.tsx), [NodePicker.tsx](./src/entities/chart/ui/NodePicker.tsx).
  - schema: types, store, autosave; e.g., [schema-store.ts](./src/entities/schema/api/schema-store.ts), [useFlowAutosave.ts](./src/entities/schema/lib/useFlowAutosave.ts).
- src/features — reusable interactions; e.g., schema list and dialogs: [features/schema](./src/features/schema).
- src/widgets — self-contained blocks:
  - flow-editor: [FlowEditor](./src/widgets/flow-editor/ui/FlowEditor.tsx)
  - app-sidebar: [AppSidebar](./src/widgets/app-sidebar/ui/AppSidebar.tsx)
- src/pages — page-level UI used by routes; e.g., [HomePage](./src/pages/home/ui/HomePage.tsx).

## 🏗️ Architecture & Stack Decisions

I chose Feature‑Sliced Design (FSD) to keep the project scalable and easy to maintain. Instead of grouping files by type, the codebase is organized by features and business logic, which makes it easier to evolve without breaking unrelated parts.

Examples:

- entities — core domain logic (chart, schema)
- features — user interactions (schema actions)
- widgets — composition of features into meaningful UI blocks (editor, sidebar)
- shared — reusable UI components and utilities

This separation keeps business logic independent from UI, meeting the project requirements.

**FSD** is well-documented with clear rules and guides that ease onboarding and help keep the codebase scalable. See https://fsd.how/ for documentation.

### Key Technology Choices

- Next.js 16 — modern App Router and solid DX; production‑ready defaults.
- @xyflow/react — flow editor for nodes/edges with drag & drop; avoids reinventing graph logic.
- Zustand — simple, lightweight state manager well‑suited for graph and schema state.
- Tailwind CSS — fast, consistent styling with tokens.
- Radix UI — accessible, flexible UI primitives.
- TypeScript — strong typing for nodes, edges, and schemas improves reliability.

## 🤖 AI Usage Report

AI tools were used to assist with routine tasks and speed up development. All generated code and assets were reviewed and adjusted manually.

### Where AI was used

- **Theme & Design**: Generated color tokens and palettes for the global theme in app/globals.css; helped maintain visual consistency across the app.
- **UI Components**: Assisted in generating shared UI components based on the chosen design style; components were refined and adapted to fit the project structure.
- **Custom Icons**: Generated missing icons (e.g., parallelogram and oval) that are not available in lucide-react.
- **Refactoring UI After Theme Changes**: Helped update shared UI components after modifying theme colors; ensured consistent styling across all components.
- **Utility Functions & Hooks**: Assisted in generating reusable helper functions and hooks (e.g., date formatting, flow snapshot utilities, URL parameter management, autosave logic).
- **Documentation**: Assisted in structuring and writing this README.md.

### Validation

All AI-generated code was:

- Reviewed manually.
- Tested in the application.
- Adjusted to match project architecture and TypeScript standards.

No code was used blindly — all implementations were understood before integration.
