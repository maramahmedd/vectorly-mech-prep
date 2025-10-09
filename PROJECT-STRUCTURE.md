# Project Structure

This document outlines the organization of the Vectorly project.

## Directory Structure

```
vectorly-mech-prep/
├── public/                  # Static assets served directly
├── src/                     # Source code
│   ├── assets/             # Images, fonts, and other assets
│   ├── components/         # React components
│   │   ├── auth/          # Authentication-related components
│   │   ├── figma/         # Figma-exported components
│   │   ├── legacy/        # Legacy/imported components (formerly imports/)
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries and helpers
│   ├── pages/             # Page components (routes)
│   ├── services/          # API and external service integrations
│   ├── styles/            # Global styles and CSS
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global CSS imports
├── database/              # Database-related files
│   ├── migrations/        # SQL migration files
│   └── README.md          # Database documentation
├── docs/                  # Project documentation
│   ├── Guidelines.md      # Development guidelines
│   ├── HOW-TO-ADD-PROBLEMS.md
│   ├── BOOKMARK-FEATURE.md
│   └── Attributions.md
├── dist/                  # Build output (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── .env                   # Environment variables (gitignored)
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite bundler configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Key Directories Explained

### `/src/components/`
All React components are organized here:
- **auth/** - Login, signup, and user menu components
- **ui/** - Reusable UI components following shadcn/ui patterns
- **figma/** - Components exported from Figma designs
- **legacy/** - Older components that may need refactoring (formerly in imports/)

### `/src/pages/`
Page-level components that correspond to routes:
- `LandingPage.tsx` - New landing page design
- `Index.tsx` - Original home page
- `Practice.tsx` - Problem browser
- `PracticeInterface.tsx` - Problem solving interface
- `Dashboard.tsx` - User dashboard
- Other pages (About, Privacy, Terms, etc.)

### `/src/services/`
External service integrations and API clients

### `/database/`
Database schema, migrations, and related documentation

### `/docs/`
All project documentation consolidated in one place

## Important Files

- **vite.config.ts** - Build configuration
- **tailwind.config.ts** - Styling configuration
- **tsconfig.json** - TypeScript compiler options
- **.env** - Environment variables (create from .env.example)

## Development Guidelines

See [docs/Guidelines.md](./docs/Guidelines.md) for coding standards and best practices.

## Adding New Features

1. Create components in appropriate subdirectory under `/src/components/`
2. Create pages in `/src/pages/` for new routes
3. Update routing in `/src/App.tsx`
4. Add any database changes to new migration files in `/database/migrations/`
5. Document significant features in `/docs/`
