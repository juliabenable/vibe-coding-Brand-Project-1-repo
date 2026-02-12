# Vibecode Template (Vite)

A starter template for building modern web applications with Vite, React, TypeScript, and shadcn/ui.

## Features

- **Vite** - Fast build tool with HMR
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Lucide Icons** - Modern icon library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/
│   └── globals.css      # Global styles and Tailwind config
├── components/
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── App.tsx              # Main App component
└── main.tsx             # Application entry point
```

## Adding Components

Use the shadcn CLI to add new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## License

MIT
