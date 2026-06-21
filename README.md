# Docs — Document Management App

A lightweight, browser-based document management application built with Next.js. Documents and uploaded files are stored entirely on the client side using IndexedDB, requiring no external database or server infrastructure.

## Features

### Dashboard
The home page provides an overview of your document library. It displays total document count, favorites, recent activity, and a breakdown of documents by tag colour. A list of recently accessed documents is shown for quick navigation.

### Document Board
A dedicated view for browsing all documents. Supports two layout modes:
- **Grid View** — Documents displayed as cards in a responsive grid.
- **Canvas View** — Documents positioned on a dot-grid canvas for spatial organisation.

Includes a real-time search bar and status-based filtering (Important, Draft, Review, Internal).

### Document Detail
Each document has its own detail page showing full metadata, description, status, and timestamps. Uploaded files can be previewed inline (images and PDFs) and downloaded directly. Documents can be edited, favourited, or deleted from this view.

### Favorites
A filtered view showing only documents that have been starred. Provides quick access to frequently referenced files.

### Recent Activity
A timeline view of documents grouped chronologically — Today, Yesterday, This Week, This Month, and Older. Useful for tracking what was recently created or accessed.

### File Uploads
Documents support real file attachments via drag-and-drop or file picker. Files are stored as binary blobs in the browser's IndexedDB using localforage. The system supports images, PDFs, Word documents, and other common file types. Downloads generate temporary object URLs from the stored blobs.

### Navigation
- A collapsible sidebar on desktop with route links and document count badges.
- A floating bottom navigation bar on mobile with animated route indicators.

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | Next.js 16 (App Router, Turbopack)  |
| Language      | TypeScript 5                        |
| UI Library    | React 19                            |
| Styling       | Tailwind CSS 4                      |
| Animations    | Framer Motion                       |
| Icons         | Lucide React, Huge Icons            |
| Storage       | IndexedDB via localforage           |
| Fonts         | Geist Sans, Geist Mono              |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
git clone <repository-url>
cd docs
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
docs/
├── app/
│   ├── component/
│   │   ├── BottomNav.tsx          # Mobile bottom navigation bar
│   │   ├── CanvasBackground.tsx   # Dot grid background for canvas view
│   │   ├── Card.tsx               # Document card with drag, favourite, download
│   │   ├── CreateDocModal.tsx     # Modal for creating documents with file upload
│   │   ├── DocumentContext.tsx    # React context and IndexedDB persistence layer
│   │   ├── SearchBar.tsx          # Search input and status filter controls
│   │   ├── Sidebar.tsx            # Collapsible desktop sidebar navigation
│   │   └── theme-provider.tsx     # Theme context wrapper
│   ├── documents/
│   │   ├── page.tsx               # Document board with grid and canvas views
│   │   └── [id]/
│   │       └── page.tsx           # Individual document detail page
│   ├── favorites/
│   │   └── page.tsx               # Starred documents list
│   ├── recent/
│   │   └── page.tsx               # Chronological activity timeline
│   ├── globals.css                # Design tokens and global styles
│   ├── layout.tsx                 # Root layout with header, sidebar, bottom nav
│   └── page.tsx                   # Dashboard with stats and recent documents
├── public/                        # Static assets
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

## Design System

The application uses a white-tone design with a warm orange accent colour. All colours are defined as CSS custom properties in `globals.css`:

| Token               | Value     | Usage                        |
|----------------------|-----------|------------------------------|
| `--color-bg`         | `#F4F4F5` | Page background              |
| `--color-surface`    | `#FFFFFF` | Card and panel backgrounds   |
| `--color-brand`      | `#F97316` | Primary accent colour        |
| `--color-text`       | `#18181B` | Primary text                 |
| `--color-text-muted` | `#71717A` | Secondary text               |
| `--color-border`     | `#E4E4E7` | Borders and dividers         |

## Data Storage

All document data and file attachments are stored in the browser's IndexedDB under the key `mini-docs-v2`. This means:

- Data persists across browser sessions.
- No server or database setup is required.
- Data is local to the browser and device being used.
- Clearing browser data will remove all stored documents.

## License

This project is private and not currently published under an open-source licence.
