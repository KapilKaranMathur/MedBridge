This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


1. Project Title
MedBridge – Smart Appointments Made Easy
2. Problem Statement
Booking doctor appointments in traditional ways often involves long waiting times, phone calls,
and scheduling conflicts. Patients struggle to find available doctors for specific specializations,
while doctors find it hard to manage appointments efficiently.
MedBridge aims to bridge this gap by providing an easy-to-use online platform where patients
can seamlessly search for doctors, view their availability, and book appointments instantly —
while doctors can manage their schedules and patient records effectively.
3. System Architecture
Project Structure:
Frontend → Backend (API) → Database
Authentication: Clerk + JWT
Video/Call Integration: Vonage API
Example Stack:
●
Frontend: Next.js 15, React 19, TailwindCSS, Shadcn UI
●
Backend: Next.js API Routes (Node.js style)
●
Database: NeonDB (PostgreSQL) via Prisma ORM
●
Authentication: Clerk + JWT
●
Video/Call Integration: Vonage API for doctor-patient video consultations
●
Hosting:
○
○
Frontend + Backend → Vercel (fullstack deployment)
Database → NeonDB / PlanetScale / Supabase
5. Key Features
Category Features
Authentication &
Authorization
CRUD Operations Frontend Routing Doctor & Patient
Management
Appointment
Management
Doctor Dashboard Admin Dashboard Video Consultation Notifications Responsive UI Hosting User registration, login, logout, role-based access (Patient / Doctor
/ Admin) using Clerk + JWT
Create, read, update, delete core entities such as Users, Doctors,
Appointments, Notes, and Availability Slots
Pages: Home, Login, Dashboard, Doctor Profile, Appointment
Details, Admin Panel, Video Call Page
Patients can search doctors by specialization, availability, city;
Doctors can manage schedules and appointments
Book, reschedule, cancel appointments; Mark appointments
complete; Add notes
Set availability, view appointments, manage notes and
consultations
Approve doctors, manage users, view reports
Real-time doctor-patient video calls using Vonage API
Email and in-app notifications for appointment confirmations,
cancellations, and updates
Fully mobile-friendly interface using TailwindCSS and Shadcn UI
Frontend and backend deployed on Vercel with NeonDB as cloud
database
6. Tech Stack
Layer Technologies
Frontend Next.js 15, React 19, TailwindCSS, Shadcn UI, Axios
Backend Next.js API Routes (Node.js style)
Database NeonDB (PostgreSQL) via Prisma ORM
Authentication Clerk + JWT
Video Call Integration Vonage API
Hosting Vercel (Fullstack), NeonDB / PlanetScale / Supabase
7. API Overview
Endpoint Method Description Access
/api/auth/signup POST Register a new user (Patient / Doctor) Public
/api/auth/login POST Authenticate user and return JWT /
session
Public
/api/doctors GET Get list of all registered doctors Authenticated
/api/doctors/:id GET Get details of a specific doctor Authenticated
/api/appointments POST Book a new appointment Authenticated
/api/appointments/:id GET View appointment details Authenticated
/api/appointments/:id PUT Update or reschedule an appointment Authenticated
/api/appointments/:id DELETE Cancel an appointment Authenticated
/api/doctors/availabil
POST Set doctor availability slots Doctor only
ity
/api/admin/doctors POST Add or approve doctor profiles Admin only
/api/admin/users GET Manage all users Admin only
/api/video/token POST Generate Vonage token for video call Authenticated
