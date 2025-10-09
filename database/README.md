# Database

This directory contains database-related files for the Vectorly project.

## Migrations

All Supabase database migrations are stored in the `migrations/` directory:

- **[supabase-migration.sql](./migrations/supabase-migration.sql)** - Main database schema migration
- **[supabase-bookmarks-migration.sql](./migrations/supabase-bookmarks-migration.sql)** - Bookmarks feature migration

## Running Migrations

To run migrations in your Supabase project:

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the migration file contents
4. Execute the SQL

## Schema Overview

The database includes tables for:
- Users and authentication
- Practice problems and solutions
- User progress tracking
- Bookmarks
- Study sessions
