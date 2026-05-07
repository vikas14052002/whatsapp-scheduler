# BookKar - WhatsApp Appointment Scheduler for India

A WhatsApp-first appointment scheduling tool built for Indian small businesses — salons, clinics, tuition centers, consultants, and more. Customers book entirely inside WhatsApp. Business owners manage everything from a simple dashboard.

## Features

- **WhatsApp Booking Bot** — Customers book appointments via WhatsApp without downloading any app
- **Simple Dashboard** — See today's appointments, manage services, track customers
- **Auto Reminders** — Automated 24-hour and 1-hour WhatsApp reminders
- **UPI Deposit Collection** — Collect booking deposits via Razorpay/UPI
- **Multi-profession Support** — Works for salons, clinics, tuition, consultants, spas
- **Hindi + English** — WhatsApp messages in local languages
- **Zero Staff Training** — If your staff knows WhatsApp, they know BookKar

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** JSON file (demo) → PostgreSQL/Supabase (production)
- **Auth:** Cookie-based sessions (demo) → Supabase Auth (production)
- **WhatsApp:** Twilio WhatsApp Business API
- **Payments:** Razorpay

## Quick Start

### 1. Install Dependencies

```bash
cd whatsapp-scheduler
npm install
```

### 2. Setup Environment

```bash
cp .env.local.example .env.local
```

For demo mode, no changes needed. For production, add your Twilio and Razorpay credentials.

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Try the Demo

- Visit the landing page
- Click "View Demo Dashboard" or go to `/login`
- Use demo credentials:
  - **Email:** `demo@glowsalon.in`
  - **Password:** any password works in demo mode

### 5. Test WhatsApp Booking Flow

In demo mode, WhatsApp messages are logged to the server console. To test the webhook:

```bash
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "From": "whatsapp:+919988776655",
    "To": "whatsapp:+919876543210",
    "Body": "hi"
  }'
```

Then follow the conversation flow by sending subsequent messages like `1`, `1`, `1`, `Priya Sharma`, `yes`.

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Connect Real WhatsApp (Twilio)

1. Create a Twilio account at [twilio.com](https://twilio.com)
2. Get a WhatsApp-enabled number
3. Add your credentials to `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   DEMO_MODE=false
   ```
4. Set the webhook URL in Twilio to: `https://yourdomain.com/api/whatsapp/webhook`

### Connect Razorpay (UPI Payments)

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Add your keys to `.env.local`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    login/page.tsx        # Auth page
    dashboard/
      page.tsx            # Main dashboard
      appointments/       # All appointments
      services/           # Manage services
      patients/           # Customer database
      settings/           # Business settings
    api/
      auth/route.ts       # Login/register/logout
      whatsapp/webhook/   # WhatsApp bot handler
      appointments/       # CRUD appointments
      services/           # CRUD services
      patients/           # CRUD patients
  components/
    Sidebar.tsx           # Dashboard navigation
    DashboardStats.tsx    # Stats cards
    AppointmentList.tsx   # Appointment cards
  lib/
    db.ts                 # Database layer
    auth.ts               # Session management
    whatsapp.ts           # WhatsApp messaging
  types/
    index.ts              # TypeScript types
```

## Roadmap

- [ ] Supabase integration for production database
- [ ] Razorpay payment link generation
- [ ] SMS fallback reminders
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Staff scheduling and calendar view
- [ ] Customer feedback collection
- [ ] Analytics and reporting

## License

MIT — Built for Indian small businesses.
