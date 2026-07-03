# File Manager Demo

A standalone extraction of the **file manager frontend** from the Screenlite client —
drag & drop, multi-select, context menus, breadcrumbs, folder navigation, file preview,
and chunked-style uploads — running entirely in the browser with **sample data in
`localStorage`**. No backend required.

## Run

Uses [Bun](https://bun.sh):

```bash
bun install
bun run dev      # http://localhost:5173
```

Other scripts:

```bash
bun run build    # type-check + production build
bun run preview  # preview the production build
```

## What's included

The UI is copied verbatim from the real app so behaviour matches 1:1:

- **Drag & drop** (`@dnd-kit`) — drag files/folders onto folders or breadcrumbs to move them
- **Selection** — click, ⌘/Ctrl-click, and shift-click range select (`useSelectionStore`)
- **Context menus** — right-click files/folders (delete is wired up; rename/move/download log to console, as in the original)
- **Folder navigation** — double-click to open, breadcrumbs to go back
- **File preview modal** — image/video preview + "used in playlists"
- **Uploads** — the upload page with active/completed sections, pause/resume/cancel/retry controls

## How the demo differs from the real app

Only the backend-facing edges were swapped; every component, hook, store, and style is
unchanged. The seams:

| Real app | Demo replacement |
|---|---|
| `axios` API calls (`modules/file/api/*`) | Read/write a `localStorage`-backed store — [`src/demo/db.ts`](src/demo/db.ts) |
| `StorageService` (backend file URLs) | Passes through placeholder image URLs / a sample video |
| `useWorkspace` (URL-resolved workspace) | A single fixed workspace — [`src/demo/workspace.ts`](src/demo/workspace.ts) |
| Chunked upload service (real network) | Timer-based progress simulation that persists a placeholder file — [`FileUploadService.ts`](src/modules/file/services/FileUploadService.ts) |

Sample data (folders + image/video files) is seeded into `localStorage` on first load.
Use the **Reset demo data** button in the header to restore it at any time.

> Thumbnails/previews use `picsum.photos` and a public sample MP4, so image/video
> previews need network access. Everything else works offline.

## Structure

```
src/
├── demo/                      # demo-only glue (mock DB, workspace, layout)
├── modules/
│   ├── file/                  # the extracted file manager (verbatim)
│   │   ├── api/               # rewritten to hit the mock DB
│   │   ├── components/        # FileManager, cards, uploading, modals, buttons
│   │   ├── hooks/             # drag handlers, move ops, selection, upload state
│   │   ├── pages/             # files, upload, single-file pages
│   │   └── services/          # simulated upload service
│   └── workspace/             # minimal fixed-workspace context + route helpers
├── shared/                    # UI kit + helpers used by the file manager
├── stores/                    # zustand: selection, context menu, confirmation
├── providers/ · config/       # confirmation dialog mount, react-query client
├── App.tsx · router.tsx · main.tsx
```
