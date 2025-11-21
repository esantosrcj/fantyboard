# Fantyboard

A modern, interactive fantasy draft board application built with **SvelteKit 2**, **TypeScript**, and **Tailwind CSS**. Perfect for fantasy football draft parties - just connect your laptop or tablet to a big screen and run your draft like the pros!

## 🎯 Features

### Core Functionality

- **Interactive Draft Board** - Visual grid-based draft board with real-time updates
- **Snake & Linear Drafts** - Support for both draft formats
- **Customizable League Settings** - Configure teams (6-8), rounds (10-15), and team names
- **Player Database** - Pre-loaded with top fantasy players (QB, RB, WR, TE, K, DEF)
- **Live Draft Tracking** - Current pick highlighting and turn-by-turn progression
- **Draft History** - Track all drafted players with round, pick, and team information
- **Add Custom Players** - Manually add players not in the database during the draft

### User Experience

- **Responsive Design** - Optimized for tablets and laptops (mobile warning for phones)
- **Touch-Optimized** - Smooth touch interactions for tablet devices
- **Orientation Detection** - Landscape mode hints for better tablet viewing
- **Screen Size Guards** - Minimum resolution requirements for optimal experience
- **Celebration Animations** - Confetti effects for completed drafts
- **Toast Notifications** - User-friendly feedback system

### Technical Features

- **Persistent State** - LocalStorage-based state management for draft continuity
- **Static Site Generation (SSG)** - Pre-rendered for fast loading and hosting
- **TypeScript** - Fully typed for better developer experience
- **Component Architecture** - Modular, reusable Svelte components
- **Reactive Stores** - Svelte stores for state management
- **SEO Optimized** - Proper meta tags, sitemap generation, and 404 handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fantyboard

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Development server with host exposure
npm run dev -- --host
```

Visit `http://localhost:5173` to view the app.

## 🔧 Configuration

### Tailwind CSS

Custom color palette with primary (green), secondary (orange), accent (cyan), and dark mode support. Extended with custom fonts and breakpoints for tablet optimization.

### SvelteKit Adapter

Configured with `@sveltejs/adapter-static` for static site generation:

- Pages output: `build/`
- Assets output: `build/`
- Prerendering enabled globally
- Strict mode enabled

### TypeScript

Strict type checking enabled with comprehensive type definitions for all draft-related entities.
