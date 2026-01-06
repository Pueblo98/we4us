# We4Us-GBM

A patient-driven data-sharing platform for GBM (Glioblastoma) patients and caregivers.

## Overview

We4Us is a warm, supportive community where GBM patients and caregivers can:
- Share their treatment experiences
- Track symptoms, medications, and biomarkers
- Connect with "patients like me" based on clinical characteristics
- Find strength in each other's stories

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Tremor
- **Backend**: NestJS + TypeScript + TypeORM
- **Database**: PostgreSQL
- **Monorepo**: Turborepo + pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### Installation

1. Clone the repository:
```bash
cd We4us
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the database:
```bash
docker-compose up -d postgres
```

4. Create environment file:
```bash
cp apps/api/.env.example apps/api/.env
```

5. Start development servers:
```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- API: http://localhost:4000/api

## Project Structure

```
we4us-gbm/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── pages/       # Page components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   └── styles/      # Global styles
│   │   └── ...
│   └── api/                 # NestJS backend
│       └── src/
│           ├── modules/     # Feature modules
│           │   ├── auth/    # Authentication
│           │   ├── users/   # User management
│           │   ├── onboarding/
│           │   ├── journal/ # Tracking features
│           │   └── community/
│           └── database/    # Database config
├── packages/
│   └── shared-types/        # Shared TypeScript types
├── docker-compose.yml       # PostgreSQL setup
└── turbo.json              # Turborepo config
```

## Features

### Landing Page
- Warm & Hopeful design with soft blues and lavenders
- Star Constellation memorial for deceased community members
- Privacy commitment section

### Authentication
- Magic link (passwordless) authentication
- No CAPTCHAs (cognitive accessibility)

### Onboarding
- Patient/Caregiver classification
- Diagnosis timeline
- Archetype classification (Information Seeker, Connection Seeker, Action-Oriented, Newly Diagnosed)
- MGMT status and treatment phase

### Dashboard
- **Journal Tab**: Symptom tracking, treatment timeline, medication log, biomarker visualization
- **Community Tab**: Feed, posts, patient matching, discussion forums

## Cognitive Accessibility

Built with W3C COGA guidelines for GBM patients who may experience cognitive challenges:
- 18px+ body text
- WCAG AAA contrast (7:1 ratio)
- 44px+ touch targets
- Auto-save on all forms
- Single question per screen in onboarding
- No CAPTCHAs

## License

Private - All rights reserved
