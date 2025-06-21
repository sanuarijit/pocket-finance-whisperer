# MoneyWise - Personal Finance Manager

## Overview

MoneyWise is a full-stack personal finance management application built with React, TypeScript, Express.js, and PostgreSQL. The application provides comprehensive tools for expense tracking, debt management, investment monitoring, and financial forecasting. It's designed as a progressive web app (PWA) with mobile-first responsive design and offline capabilities through local SQLite storage.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system for financial applications
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: React Router for client-side navigation
- **Mobile Support**: Capacitor for hybrid mobile app capabilities with native platform detection

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configurable, initially using in-memory storage)
- **API Design**: RESTful API architecture with `/api` prefix
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

### Build System
- **Bundler**: Vite for frontend, esbuild for backend production builds
- **TypeScript**: Strict type checking across the entire stack
- **Module System**: ESM modules throughout the application
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`)

## Key Components

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Local Storage**: SQLite for offline mobile functionality via Capacitor SQLite
- **Session Storage**: PostgreSQL-backed sessions for user authentication
- **Schema Management**: Centralized schema definitions in `shared/schema.ts`

### Authentication & User Management
- **User Schema**: Basic username/password authentication ready
- **Session Management**: Express sessions with PostgreSQL storage
- **Password Security**: Prepared for bcrypt hashing implementation
- **Type Safety**: Zod validation schemas for user input

### Financial Data Models
The application handles four main financial entities:
- **Expenses**: Categorized spending with type classification (fixed/variable/discretionary)
- **Debts**: Loan management with EMI calculations and progress tracking  
- **Investments**: Portfolio tracking with current value monitoring
- **Financial Forecasting**: Predictive analysis based on spending patterns

### Mobile-First Design
- **Progressive Web App**: Full PWA capabilities with manifest and service worker ready
- **Responsive Layout**: Mobile-optimized UI with touch-friendly interactions
- **Offline Support**: Local SQLite database for offline functionality
- **Native Features**: Capacitor integration for platform-specific features

## Data Flow

### Client-Side Data Flow
1. React components use custom hooks (`useExpenses`, `useDebts`, `useInvestments`)
2. Hooks interact with React Query for caching and synchronization
3. Local SQLite database provides offline-first data persistence
4. Data automatically syncs with server when connection is available

### Server-Side Data Flow
1. Express.js routes handle API requests with proper error handling
2. Drizzle ORM provides type-safe database operations
3. PostgreSQL stores production data with session management
4. In-memory storage (`MemStorage`) provides development fallback

### Database Schema
- **Users Table**: Basic authentication with username/password
- **Financial Tables**: Ready for expenses, debts, and investments schema
- **Type Safety**: Drizzle-generated types ensure end-to-end type safety
- **Validation**: Zod schemas for runtime validation

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Router, React Query for modern React patterns
- **UI Components**: Comprehensive Radix UI component library with Shadcn/ui
- **Styling**: Tailwind CSS with custom finance-focused design tokens
- **Forms**: React Hook Form with Hookform Resolvers for validation

### Database & Backend
- **Database**: Drizzle ORM with PostgreSQL adapter and Neon serverless support
- **Validation**: Zod schema validation with Drizzle integration
- **Session**: Connect-pg-simple for PostgreSQL session storage
- **Development**: TSX for TypeScript execution and hot reloading

### Mobile & PWA
- **Capacitor**: Core Capacitor with SQLite plugin for hybrid app development
- **SQLite**: Jeep-sqlite for web-based SQLite with native compatibility
- **Mobile Utils**: Custom utilities for platform detection and mobile optimization

### Development Tools
- **Build Tools**: Vite with React plugin and esbuild for production
- **TypeScript**: Strict configuration with path aliases
- **Replit Integration**: Custom plugins for Replit development environment

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` runs both frontend and backend with HMR
- **Database Setup**: `npm run db:push` applies Drizzle schema migrations
- **Type Checking**: `npm run check` validates TypeScript across the stack

### Production Build
- **Frontend Build**: Vite builds optimized React application to `dist/public`
- **Backend Build**: esbuild bundles Node.js server to `dist/index.js`
- **Environment**: Production mode with `NODE_ENV=production`
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL

### Replit Configuration
- **Modules**: Node.js 20, Web, and PostgreSQL 16 for complete development environment
- **Port Configuration**: Express server on port 5000, mapped to external port 80
- **Auto-scaling**: Configured for automatic deployment scaling
- **Development Tools**: Cartographer integration for enhanced debugging

### Database Deployment
- **Migration Strategy**: Drizzle Kit handles schema migrations
- **Connection Pooling**: Neon serverless PostgreSQL for scalable connections  
- **Environment Variables**: Secure database URL configuration
- **Backup Strategy**: PostgreSQL-native backup and recovery procedures

## Changelog
- June 21, 2025. Initial setup - migrated from Lovable to Replit
- June 21, 2025. Added PostgreSQL database integration with full API backend
- June 21, 2025. Enhanced for personal finance use - added Income and Bank Balance tracking
- June 21, 2025. Removed unnecessary features (Pay Bill, Transfer) for offline personal use

## User Preferences

Preferred communication style: Simple, everyday language.