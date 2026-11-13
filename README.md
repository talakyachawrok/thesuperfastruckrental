# SuperFast – Truck Rental & Logistics Marketplace

> **Next-generation digital freight exchange connecting shippers with verified truck owners and drivers travelling matching corridors. Designed to eliminate empty return trips and slash shipping costs by up to 40%.**

![SuperFast Hero](https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Key Highlights & Concept

SuperFast solves the biggest inefficiency in commercial road logistics: **deadhead empty miles**. 
Over 30% of commercial trucks return empty after dropping off their outbound haul. SuperFast matches these return routes with cargo owners needing freight transport along the exact same path:
- **For Shippers:** Compare truck prices, book verified vehicles instantly, or post cargo to receive competitive discounted bids (up to 40% OFF standard rates).
- **For Truck Drivers & Fleets:** Discover matching loads along planned corridors, submit quotes, eliminate empty return trips, and maximize route revenue.
- **For Logistics Operations:** Real-time telematics tracking, milestone lifecycles, and escrow payment protection.

---

## 🎨 Design & Branding
- **Color Theme:** Premium Navy Blue (`#0B192C`, `#1E3E62`), Crisp Neutrals, and Energy Logistics Orange (`#FF6500`).
- **Typography:** Modern typography using *Plus Jakarta Sans* & *Inter*.
- **Theming:** Full native **Light and Dark mode** with automatic persistence.
- **Responsiveness:** 100% fluid responsive design for Mobile, Tablet, and Desktop screens.
- **Images:** High-resolution realistic logistics and truck fleet photography.

---

## 🛠️ Technology Stack
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS (custom logistics color palette and animations)
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Celebration Effects:** Canvas Confetti
- **State & Storage:** Context API with `localStorage` persistence

---

## 📄 Platform Pages & Features

### 1. Landing Page (`/`)
- Professional sticky navbar with quick demo role switcher, theme toggle, and mobile drawer.
- High-impact Hero section with interactive Pickup & Destination search, loading date, and vehicle selector.
- Live platform stats ticker (Active Trucks, On-Time Rate, Cost Savings, Miles Saved).
- **Empty Return Trip Spotlight:** Explaining the backhaul optimization advantage.
- Fleet categories showcase (Heavy Semi-Trailer, Medium Box, Reefer, Flatbed, Mini Truck, Container Carrier).
- Dual "How SuperFast Works" interactive tab (Shippers vs Fleets).
- Interactive Route Cost Estimator with dynamic sliders for distance and cargo tonnage.
- Testimonials from logistics directors and owner-operators.
- Comprehensive footer with quick corridors and demo sandbox reset.

### 2. Truck Listing & Booking (`/trucks`)
- Multi-dimensional filters: City search, Vehicle type, Max rate per km, Min payload tonnage, Instant Booking, and **"Empty Return Deals Only (-35%)"**.
- Grid & List view switcher.
- Detailed Truck Modal with complete vehicle specifications (payload, dimensions, features, carrier credentials).
- **Direct Vehicle Reservation Modal:** Calculates guaranteed line-haul rates with instant backhaul discount computation.

### 3. Load Posting Wizard (`/post-load`)
- Step 1: Origin, Destination, pickup date, and urgent dispatch tag.
- Step 2: Cargo classification, goods description, weight (kg/tons), volume (m³), and special handling tags (Liftgate, Pallet jack, Temp controlled, Fragile).
- Step 3: Vehicle classification requirement and maximum ceiling budget.
- AI Route Intelligence sidebar calculating recommended vehicle and expected bid savings.
- Broadcasts load request directly to driver dashboards.

### 4. Customer Dashboard (`/customer-dashboard`)
- KPI summary: Active in-transit shipments, total posted loads, backhaul savings, and total freight volume.
- **Active Bookings:** Direct links to live tracking telematics.
- **My Freight Requests:** Review incoming bids from drivers with the **Offers Comparison Modal** to inspect driver ratings, proposed truck, and accept the winning quote.
- **Delivery History & PODs:** Historical shipments with delivery confirmation signatures and feedback.

### 5. Driver Dashboard (`/driver-dashboard`)
- Driver & vehicle profile with FMCSA CDL verification status.
- Availability toggle (**Accepting Loads** vs **Off Duty / Paused**).
- **Deadhead Return Trip Optimizer widget:** Broadcast planned empty route to rank at the top of shipper searches.
- **Available Cargo Loads:** Real-time freight board matching driver routes with "Submit Competitive Bid" modal.
- **Active Assigned Trips:** Advance trip milestone lifecycle (*Confirmed ➔ Loaded ➔ In Transit ➔ Out for Delivery ➔ Delivered*).
- Vehicle specs directory and "Add Fleet Vehicle" modal.
- Earnings & payout analytics breakdown.

### 6. Admin Command Center (`/admin-dashboard`)
- High-level marketplace oversight: Gross Merchandise Value (GMV), 8% platform fee revenue, active fleets.
- **Carrier Compliance Queue:** Review and approve pending Assam RTO commercial transport permits (Demo).
- Freight corridor volume analytics (Tinsukia-Guwahati, Dibrugarh-Jorhat, Digboi-Sivasagar, Guwahati-Tezpur).
- Platform supervisor view of all live bookings and system telematics.

### 7. Authentication & 1-Click Demo (`/auth`)
- Separate login and registration forms for Shippers and Drivers.
- Form validation, password visibility toggle, and terms agreement.
- **1-Click Instant Demo Evaluation Buttons:**
  - `Shipper / Customer` (Priyanka Barua - Brahmaputra Tea & Trading Co., Guwahati)
  - `Truck Driver / Fleet` (Rahul Gogoi - Tata Signa 4825.TK Heavy Carrier, Tinsukia)
  - `Logistics Admin` (Pankaj Hazarika - SuperFast Assam Operations HQ, Guwahati)

---

## ⚡ Quick Start & Development

### 1. Configure MongoDB Atlas (.env)
Create or edit `.env` in the project root:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mgsd0db.mongodb.net/superfast?retryWrites=true&w=majority
JWT_SECRET=superfast_secure_assam_secret_key_2026
PORT=5000
```
> **Note:** If `MONGODB_URI` is not yet configured, the system operates in fallback demo mode without crashing. Once your URI is pasted, the backend automatically establishes connection and auto-seeds the Assam logistics dataset.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend & Backend Concurrently
```bash
npm run dev
```
- Frontend client: `http://localhost:3000`
- Express API server: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

### 4. Build for Production
```bash
npm run build
```
Generates an optimized production bundle in `dist/`.

---

## ☁️ Deployment to Vercel (Full-Stack)

The repository includes `vercel.json` and `api/index.ts` configured for full-stack serverless deployment on Vercel:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Vercel Environment Variables:
In your **Vercel Project Dashboard** ➔ **Settings** ➔ **Environment Variables**, add:
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A secure secret string for signing JWT tokens.

---

## 🛠️ Backend Architecture & Endpoints

- **Database Models (`server/models/`)**:
  - `User`: Customers, Drivers, Fleet Owners, Admins with hashed passwords and roles.
  - `Truck`: Assam-registered vehicles (`AS-23-...`), capacity specs, return-route deals.
  - `LoadRequest`: Freight consignments with categories, weights, and urgency.
  - `DriverOffer`: Competitive bids submitted by drivers on open corridor loads.
  - `Booking`: Confirmed trips with 5 tracking milestones (*Confirmed ➔ Loaded ➔ In Transit ➔ Out for Delivery ➔ Delivered*).
  - `Payment`: Escrow payment tracking records.
  - `Notification`: User dispatch notifications.
  - `Review`: Driver and vehicle ratings.

- **API Routes (`/api`)**:
  - `POST /api/auth/register` & `POST /api/auth/login`: Authentication.
  - `POST /api/auth/demo/:role`: 1-click instant access (Customer, Driver, Admin).
  - `GET /api/trucks` & `POST /api/trucks`: Fleet catalog and vehicle registration.
  - `PATCH /api/trucks/:id/availability`: Toggle accepting loads / off duty.
  - `GET /api/loads` & `POST /api/loads`: Cargo marketplace board.
  - `POST /api/offers`: Submit competitive quote.
  - `PATCH /api/offers/:id/accept`: Accept quote and create confirmed booking.
  - `GET /api/bookings` & `POST /api/bookings/direct`: Bookings & reservations.
  - `PATCH /api/bookings/:id/milestone`: Advance milestone step.
  - `GET /api/admin/stats` & `GET /api/admin/pending-drivers`: Admin command center.
  - `GET /api/health`: Database connection status and cluster diagnostics.

---

## 🔒 Notes on Sandbox Data
All data is initialized in mock state and saved in your browser's `localStorage`. You can reset all sample trucks, loads, bids, and bookings anytime by clicking **"Reset Demo Sandbox"** in the navigation bar or footer.

---

© 2026 SuperFast Logistics Technologies Inc.

