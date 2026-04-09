# Interactive Calendar Component 📅

A modern, interactive, and highly customizable calendar component built with React, Vite, TypeScript, and Tailwind CSS. The UI is powered by Shadcn UI and Radix primitives for an accessible, beautiful, and responsive experience.

## ✨ Features

- **Interactive Date Selection:** Seamlessly select and interact with dates using `react-day-picker` and `date-fns`.
- **Modern UI Components:** Accessible components built on top of Radix UI and styled with Tailwind CSS (via Shadcn UI).
- **Dark/Light Mode Support:** Fully integrated theming with `next-themes`.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Fast & Lightweight:** Built on Vite for lightning-fast HMR and optimized production builds.
- **Data Visualization:** Integrated with `recharts` for charting and analytics display.
- **Form Handling & Validation:** Built-in forms using `react-hook-form` and schema validation via `zod`.

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Date Utilities:** `date-fns` & `react-day-picker`
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** React Router v6

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js and npm (or bun/yarn) installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd Interactive_Calendar_Component
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

### Running Locally

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
# or
bun run dev
```

The app will start at `http://localhost:8080/`.

## 📦 Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the app for production.
- `npm run preview` - Previews the production build locally.
- `npm run lint` - Runs ESLint to catch minor issues.
- `npm run test` - Runs tests using Vitest.
