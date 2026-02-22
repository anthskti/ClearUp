# ClearUp - Skincare Organizer Application

A monolithic skincare organizer application built with Node.js, Express, TypeScript, and PostgreSQL. This application helps users organize their skincare products and create personalized routines.

## Table of Contents

- [Overview](#Overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Development](#development)

## Overview

ClearUp is a skincare organizer application that allows users to:

- Manage their skincare product collection
- Organize products by category (Cleanser, Toner, Essence, Serum, Eye Cream, Moisturizer, Sunscreen, Other)
- Filter products by skin type (oily, dry, combination, sensitive, normal, acne-prone)
- Create personalized skincare routines
- Track product details including benefits, ingredients, country of origin, and images

## Architecture

This application follows a **monolithic architecture** with a layered structure:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer
- **Repositories**: Data access layer (translates between database models and application types)
- **Models**: Sequelize ORM models for database interaction
- **Routes**: Express route definitions
- **Types**: TypeScript type definitions and DTOs

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.9.2
- **ORM**: Sequelize 6.37.7
- **Database**: PostgreSQL 15
- **Environment**: dotenv 17.2.1

### Development Tools

- **TypeScript Compiler**: tsc
- **Development Server**: ts-node 10.9.2
- **Linting**: ESLint with TypeScript support
- **Containerization**: Docker & Docker Compose

## 🔧 Configuration

### TypeScript Configuration

- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps and declaration files enabled
- Output directory: `dist/`

### Database Configuration

- Dialect: PostgreSQL
- Connection pooling handled by Sequelize
- Logging disabled in production

## Dependencies

### Production Dependencies

- `express`: ^5.1.0 - Web framework
- `sequelize`: ^6.37.7 - ORM
- `pg`: ^8.16.3 - PostgreSQL client
- `pg-hstore`: ^2.3.4 - PostgreSQL hstore support
- `dotenv`: ^17.2.1 - Environment variable management

### Development Dependencies

- `typescript`: ^5.9.2
- `ts-node`: ^10.9.2
- `@types/express`: ^5.0.3
- `@types/node`: ^24.3.0
- `eslint`: ^9.34.0
- `@typescript-eslint/eslint-plugin`: ^8.41.0
- `@typescript-eslint/parser`: ^8.41.0

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Routine CRUD operations
- [ ] Product search and filtering
- [ ] Image upload functionality
- [ ] Product reviews and ratings
- [ ] Routine scheduling and reminders
- [ ] Frontend application

## Author

## Anthony Pham - phamanthony47@gmail.com
