🩺 MedBridge – Smart Appointments Made Easy

💾 Database Hosting: NeonDB / PlanetScale / Supabase

Seamlessly book appointments, manage schedules, and connect with doctors via video consultation.

📖 Problem Statement

Booking doctor appointments traditionally can be frustrating:

Long waiting times ⏳

Multiple phone calls 📞

Scheduling conflicts ❌

Patients struggle to find available doctors for their specialization, while doctors face challenges managing appointments efficiently.

MedBridge bridges this gap with an easy-to-use online platform where patients can instantly search, view availability, and book appointments, while doctors can manage schedules and patient records effectively.

💡 Solution

MedBridge provides:

📅 Doctor Search & Availability: Find doctors by specialization, city, or available slots.

🏥 Appointment Management: Book, reschedule, or cancel appointments.

🎥 Video Consultation: Real-time video calls between patients and doctors.

👨‍⚕️ Doctor Dashboard: Manage schedules, appointments, and patient notes.

🛠️ Admin Dashboard: Approve doctors, manage users, and view reports.

🔔 Notifications: Email & in-app alerts for appointments.

🏗️ System Architecture
Frontend → Backend (API) → Database


Authentication: Clerk + JWT

Video/Call Integration: Vonage API

Frontend: Next.js 15 + React 19 + TailwindCSS + Shadcn UI

Backend: Next.js API Routes (Node.js style)

Database: NeonDB (PostgreSQL) via Prisma ORM

Hosting: Vercel (Fullstack)

✨ Key Features
Category	Features
🔐 Authentication & Authorization	User registration, login, logout, role-based access (Patient / Doctor / Admin) using Clerk + JWT
📝 CRUD Operations	Manage Users, Doctors, Appointments, Notes, Availability Slots
🌐 Frontend Routing	Pages: Home, Login, Dashboard, Doctor Profile, Appointment Details, Admin Panel, Video Call Page
👩‍⚕️ Doctor & Patient Management	Patients search doctors by specialization & availability; Doctors manage schedules & appointments
📅 Appointment Management	Book, reschedule, cancel appointments; mark complete; add notes
🏢 Doctor/Admin Dashboard	Set availability, manage appointments, approve doctors, view reports
🎥 Video Consultation	Real-time doctor-patient calls using Vonage API
🔔 Notifications	Email & in-app notifications for updates
📱 Responsive UI	Fully mobile-friendly with TailwindCSS + Shadcn UI
☁️ Hosting	Frontend + Backend deployed on Vercel, Database on NeonDB / PlanetScale / Supabase
🛠️ Tech Stack

Frontend: Next.js 15, React 19, TailwindCSS, Shadcn UI, Axios
Backend: Next.js API Routes (Node.js style)
Database: NeonDB (PostgreSQL) via Prisma ORM
Authentication: Clerk + JWT
Video Call: Vonage API
Hosting: Vercel (Fullstack), NeonDB / PlanetScale / Supabase


🧩 API Overview
Endpoint	Method	Description	Access
/api/auth/signup	POST	Register a new user (Patient / Doctor)	🌐 Public
/api/auth/login	POST	Authenticate user and return JWT / session	🌐 Public
/api/doctors	GET	Get list of all registered doctors	🔒 Authenticated
/api/doctors/:id	GET	Get details of a specific doctor	🔒 Authenticated
/api/appointments	POST	Book a new appointment	🔒 Authenticated
/api/appointments/:id	GET	View appointment details	🔒 Authenticated
/api/appointments/:id	PUT	Update or reschedule an appointment	🔒 Authenticated
/api/appointments/:id	DELETE	Cancel an appointment	🔒 Authenticated
/api/doctors/availability	POST	Set doctor availability slots	👨‍⚕️ Doctor only
/api/admin/doctors	POST	Add or approve doctor profiles	🛠️ Admin only
/api/admin/users	GET	Manage all users	🛠️ Admin only
/api/video/token	POST	Generate Vonage token for video call	🔒 Authenticated
