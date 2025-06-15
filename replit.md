# SmartCity Complaint Management Platform

## Overview

This is a full-stack SmartCity complaint management system built for Gujarat cities. The platform enables citizens to report civic issues, allows administrators to manage complaints and employees, and provides field workers with tools to resolve assigned cases. The application is designed as a Progressive Web App (PWA) with offline capabilities and mobile-first design.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with role-based access control
- **File Storage**: Local file system for image uploads
- **Deployment**: Configured for Replit with autoscale deployment

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Components**: Radix UI with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Maps**: React Leaflet for interactive map features
- **Forms**: React Hook Form with Zod validation
- **PWA Features**: Service Worker, Web App Manifest, offline support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT tokens with middleware-based protection
- **File Uploads**: Multer for handling image uploads
- **API Structure**: RESTful API with versioned endpoints (/api/v1/)
- **Database Connection**: Neon serverless PostgreSQL

### Database Schema
The application uses three main entities:

1. **Users Table**: Stores citizen, employee, and admin information
   - Support for role-based access (citizen, employee, admin)
   - Location-based fields (state, district, city)
   - Points system for citizen rewards

2. **Cases Table**: Manages complaint/issue reports
   - Comprehensive case tracking with status management
   - Geographic coordinates for location mapping
   - Assignment system linking cases to employees
   - Priority levels and category classification

3. **User Roles**:
   - Citizens: Can create and track their own cases
   - Employees: Can view and update assigned cases
   - Admins: Can manage all cases, create employees, and assign work

## Data Flow

1. **Case Creation**: Citizens submit complaints with location data and optional images
2. **Case Assignment**: Admins assign cases to field employees
3. **Case Resolution**: Employees update case status and provide resolution details
4. **Tracking**: All users can track case progress through status updates
5. **Rewards**: Citizens earn points for reporting verified issues

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, Vite, TypeScript
- **UI Components**: Radix UI primitives, Tailwind CSS
- **Data Fetching**: TanStack Query, Axios
- **Forms**: React Hook Form, Zod validation
- **Maps**: Leaflet, React Leaflet
- **PWA**: Service Worker registration and caching

### Backend Dependencies
- **Server**: Express.js, CORS middleware
- **Database**: Drizzle ORM, Neon PostgreSQL driver
- **Authentication**: JWT, bcrypt for password hashing
- **File Handling**: Multer for uploads
- **Validation**: Zod for schema validation

### Development Tools
- **Build**: Vite, esbuild for server bundling
- **TypeScript**: Full type safety across the stack
- **Database Management**: Drizzle Kit for migrations

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development**: `npm run dev` starts both frontend and backend with hot reload
2. **Build Process**: 
   - Frontend built with Vite to `dist/public`
   - Backend bundled with esbuild to `dist/index.js`
3. **Production**: `npm run start` serves the production build
4. **Database**: PostgreSQL module configured for Replit environment
5. **Port Configuration**: Application runs on port 5000 with proxy setup

The deployment uses Replit's autoscale feature and includes proper environment variable management for database connections.

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```