# 🏥 MedBridge – Smart Appointments Made Easy

**MedBridge** is a comprehensive healthcare platform designed to bridge the gap between patients and doctors. It simplifies the appointment booking process, manages patient records, and facilitates seamless communication.

---

## 1. 🎯 Problem Statement

Booking doctor appointments in traditional ways often involves long waiting times, phone calls, and scheduling conflicts. Patients struggle to find available doctors for specific specializations, while doctors find it hard to manage appointments efficiently.

**MedBridge** aims to bridge this gap by providing an easy-to-use online platform where:
*   **Patients** can seamlessly search for doctors, view their availability, and book appointments instantly.
*   **Doctors** can manage their schedules, appointments, and patient records effectively.

---

## 2. 🏗️ System Architecture

**Project Structure:**
`Frontend` → `Backend (API)` → `Database`

**Core Components:**
*   **Authentication:** Custom JWT (Secure & Scalable)
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Hosting:** Render / Vercel

**Example Stack:**
*   **Frontend:** Next.js 15, React 19, TailwindCSS, Shadcn UI
*   **Backend:** Next.js API Routes (Node.js style)
*   **Database:** PostgreSQL (NeonDB / Render Managed DB) via Prisma ORM
*   **Authentication:** Custom JWT + Bcrypt (Replaced Clerk for full control)
*   **Video/Call Integration:** Vonage API (Architecture Ready)

---

## 3. 🚀 Key Features

| Category | Features |
| :--- | :--- |
| **🔐 Authentication** | User registration, login, logout, role-based access (Patient / Doctor / Admin) using **Custom JWT**. |
| **�️ CRUD Operations** | Create, read, update, delete core entities: Users, Doctors, Appointments, Medical Records. |
| **📱 Frontend Routing** | Pages: Home, Login, Dashboard, Doctor Profile, Appointment Details, Settings. |
| **�‍⚕️ Doctor Management** | Doctors can set availability, manage schedules, view appointments, and update profiles. |
| **📅 Appointment Management** | Book, reschedule, cancel appointments; Real-time status updates. |
| **📊 Dashboards** | **Doctor Dashboard:** Manage patients & records.<br>**Patient Dashboard:** View history & upcoming visits. |
| **📹 Video Consultation** | Architecture ready for doctor-patient video calls using Vonage API. |
| **🔔 Notifications** | In-app updates for appointment confirmations and cancellations. |
| **🎨 Responsive UI** | Fully mobile-friendly interface using **TailwindCSS** and **Shadcn UI**. |
| **☁️ Hosting** | Deployed on **Render** (or Vercel) with PostgreSQL cloud database. |

---

## 4. � Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15, React 19, TailwindCSS, Shadcn UI, Lucide Icons |
| **Backend** | Next.js API Routes (Node.js), Prisma ORM |
| **Database** | PostgreSQL (NeonDB / Render) |
| **Authentication** | Custom JWT (Jose + Bcrypt) |
| **Video Integration** | Vonage API (Ready) |
| **Hosting** | Render (Web Service), Vercel |

---

## 5. 🔌 API Overview

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | Register a new user (Patient / Doctor) | Public |
| `/api/auth/login` | `POST` | Authenticate user and return JWT | Public |
| `/api/doctors` | `GET` | Get list of all registered doctors | Authenticated |
| `/api/doctors/:id` | `GET` | Get details of a specific doctor | Authenticated |
| `/api/appointments` | `POST` | Book a new appointment | Authenticated |
| `/api/appointments/:id` | `GET` | View appointment details | Authenticated |
| `/api/appointments/:id` | `DELETE` | Cancel an appointment | Authenticated |
| `/api/doctor/profile` | `PATCH` | Update doctor profile & availability | Doctor only |
| `/api/patient/profile` | `PATCH` | Update patient profile | Patient only |
| `/api/medical-records` | `POST` | Create medical record for patient | Doctor only |
| `/api/video/token` | `POST` | Generate Vonage token for video call | Authenticated |

---
📜 License

MIT License © EdgeWorks Team
---
*Generated with ❤️ by MedBridge Team*
