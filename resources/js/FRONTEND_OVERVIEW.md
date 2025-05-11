# Frontend Overview for WealthApp Laravel Project

## Overview
The frontend of this Laravel project is a React Single Page Application (SPA) powered by [Inertia.js](https://inertiajs.com/) and TypeScript. It is integrated with Laravel backend using Inertia.js adapters and served via a Laravel Blade template.

## Entry Point
- `resources/js/app.tsx` is the main entry point.
- It bootstraps the React app using `createInertiaApp` from `@inertiajs/react`.
- Dynamically loads page components from `resources/js/pages/`.
- Uses React 18's `createRoot` to render the app.
- Initializes light/dark theme on load via a custom hook.

## Pages
- Located in `resources/js/pages/`.
- Each page is a React component, e.g. `welcome.tsx`, `dashboard.tsx`.
- Pages use Inertia.js hooks like `usePage` to access shared props (e.g. auth).
- Pages use the `Head` component from Inertia to manage document head.
- Pages are styled using Tailwind CSS with dark mode support.

## Layouts
- Located in `resources/js/layouts/`.
- `app-layout.tsx` is the main app layout wrapper.
- It uses `app-sidebar-layout.tsx` which structures the UI into:
  - `AppShell`: main container managing sidebar state.
  - `AppSidebar`: sidebar navigation with links and user info.
  - `AppContent`: main content area where page content is rendered.
  - `AppSidebarHeader`: header inside the sidebar showing breadcrumbs.
- Layouts wrap pages to provide consistent UI structure.

## Components
- Located in `resources/js/components/`.
- Include UI building blocks like sidebar, header, navigation menus, buttons, icons, etc.
- Sidebar contains navigation links to Dashboard, external links to repo and docs, and user menu.
- Components use Tailwind CSS for styling and support dark mode.

## Theme and Styling
- Global styles are in `resources/css/app.css`.
- Dark mode is supported and initialized on app load.
- The Laravel blade template `resources/views/app.blade.php` sets the initial HTML structure and loads the React app.
- It also manages the dark mode class on the `<html>` element based on user preference or system settings.

## Integration with Laravel
- The Laravel backend serves the React app via the blade template.
- Routes are managed by Laravel and Inertia.js handles frontend routing seamlessly.
- Shared data like authentication info is passed from Laravel to React via Inertia.

## How to Modify or Extend Frontend
- Add new pages in `resources/js/pages/` as React components.
- Use or create layouts in `resources/js/layouts/` to wrap pages.
- Create reusable UI components in `resources/js/components/`.
- Use Tailwind CSS classes for styling.
- Use Inertia.js hooks and components for routing and page props.
- Modify `resources/js/app.tsx` if you need to change app bootstrapping or global settings.

---

This overview should help you understand the frontend structure, flow, and how to modify or create new frontend files in this Laravel project.
