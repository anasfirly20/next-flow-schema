# Next Flow Schema Architecture

This project implements a flow/schema editor on top of Next.js 16 using Feature‑Sliced Design (FSD). It organizes UI, state, and domain logic into clear slices for scalability.

## 🧭 Overview

- Purpose: Build and visualize directed graphs (nodes/edges), with autosave and schema management.
- Core Libraries:
  - Next.js 16 (App Router)
  - React 19 + TypeScript 5
  - @xyflow/react for the graph editor
  - Tailwind CSS v4 (+ PostCSS plugin)
  - Radix UI primitives for accessible components
  - Zustand for state management
  - lucide-react icons

## 📚 Layers (FSD)

- app
  - Root layout and global styles: [layout.tsx](./app/layout.tsx), [globals.css](./app/globals.css)
  - Route: [(home)/page.tsx](<./app/(home)/page.tsx>)
- src/assets
  - Icons and assets: [icons.tsx](./src/assets/icons.tsx)
- src/shared
  - UI kit and utilities: [Button.tsx](./src/shared/ui/Button.tsx), [Dialog.tsx](./src/shared/ui/Dialog.tsx), [Sidebar.tsx](./src/shared/ui/Sidebar.tsx), [cn.ts](./src/shared/lib/cn.ts)
- src/entities
  - chart
    - Store and domain: [chart-store.ts](./src/entities/chart/api/chart-store.ts)
    - Model and registry: [create-node.ts](./src/entities/chart/model/create-node.ts), [node-registry.tsx](./src/entities/chart/model/node-registry.tsx)
    - Nodes and handles: [nodes/](./src/entities/chart/ui/nodes), [handles/](./src/entities/chart/ui/handles)
    - Picker: [NodePicker.tsx](./src/entities/chart/ui/NodePicker.tsx)
  - schema
    - Store and persistence: [schema-store.ts](./src/entities/schema/api/schema-store.ts)
    - Types and mock: [types.ts](./src/entities/schema/model/types.ts), [mock.ts](./src/entities/schema/model/mock.ts)
    - Autosave: [useFlowAutosave.ts](./src/entities/schema/lib/useFlowAutosave.ts)
- src/features
  - Schema interactions (list, dialogs): [features/schema](./src/features/schema)
- src/widgets
  - Flow editor: [FlowEditor](./src/widgets/flow-editor/ui/FlowEditor.tsx)
  - App sidebar: [AppSidebar](./src/widgets/app-sidebar/ui/AppSidebar.tsx)
- src/pages
  - Page-level UI consumed by App Router: [HomePage](./src/pages/home/ui/HomePage.tsx)

## 🧩 Application State Flow

- The editor: [FlowEditor](./src/widgets/flow-editor/ui/FlowEditor.tsx)
  - Reads/writes nodes and edges via Zustand: [chart-store.ts](./src/entities/chart/api/chart-store.ts)
  - Applies node/edge changes with @xyflow/react helpers
  - Connects edges on user actions and updates store state
  - Opens [NodePicker](./src/entities/chart/ui/NodePicker.tsx) to add new nodes either standalone or connected
  - Saves active schema via [schema-store.ts](./src/entities/schema/api/schema-store.ts)
  - Triggers autosave using [useFlowAutosave.ts](./src/entities/schema/lib/useFlowAutosave.ts) with a delay

## 🎨 Styling & UI

- Tailwind CSS v4 with @theme tokens defined in [globals.css](./app/globals.css) for color, spacing, and surfaces
- Radix UI primitives are wrapped into the shared UI kit (e.g., [Dialog.tsx](./src/shared/ui/Dialog.tsx))
- Icons via lucide-react
- XYFlow styles imported globally for consistent graph visuals
