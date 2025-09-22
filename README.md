# PartyVilla e-commerce website

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kush-kathurias-projects/v0-party-villa-e-commerce-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/ESi2Y7X7ZIi)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Features

- 🛒 **E-commerce Platform**: Complete shopping experience with cart functionality
- 📱 **Mobile-First Design**: Responsive design optimized for all devices
- 🔐 **Authentication**: User authentication and admin dashboard
- 💳 **Payment Ready**: Integrated with payment processing
- 🌍 **Indian Localization**: Prices in Indian Rupees (₹)
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and keys
3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Run the SQL schema in your Supabase SQL editor (see `SUPABASE_SETUP.md`)

5. Seed the database with initial data:

```bash
npx tsx scripts/seed-database.ts
```

### 3. Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

## Database Schema

The application uses the following main tables:

- `products`: Product catalog with pricing, images, and categories
- `orders`: Customer orders with status tracking
- `order_items`: Individual items within orders
- `profiles`: User profiles (extends Supabase auth.users)

## Authentication

- Admin routes are protected with Supabase authentication
- Access `/admin` to manage products and orders
- User authentication for order history and account management

## Deployment

Your project is live at:

**[https://vercel.com/kush-kathurias-projects/v0-party-villa-e-commerce-website](https://vercel.com/kush-kathurias-projects/v0-party-villa-e-commerce-website)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/ESi2Y7X7ZIi](https://v0.app/chat/projects/ESi2Y7X7ZIi)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository