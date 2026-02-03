# 🌊 Bongshai (বংশাই) - Modern E-commerce Platform

Bongshai is a full-featured, high-performance e-commerce web application built for the Bangladeshi market. Named after the historic Bongshai River, this platform provides a seamless shopping experience with a focus on localized delivery logic and secure payment integration.

## 🚀 Live Demo
**Website:** [https://bongshai.web.app](https://bongshai.web.app)

---

## ✨ Features

- **User Authentication**: Secure email signup/login with mandatory email verification via Supabase Auth.
- **Dynamic Product Catalog**: Browse products with advanced search, category filtering, and detailed product views.
- **Shopping Cart & Wishlist**: Persistent cart and wishlist management using local state and database syncing.
- **Smart Delivery Logic**: 
  - Automated shipping rates: ৳70 within Dhaka, ৳120 outside Dhaka.
  - Manual admin override for specific product shipping fees.
- **Payment Integration**:
  - **Cash on Delivery (COD)**: Default option with automated "Paid" status upon delivery.
  - **Online Payment**: Integrated with **SSLCOMMERZ** (Sandbox) for secure credit/debit card and MFS (bKash, Nagad) transactions.
- **Promo System**: Real-time coupon code validation and discount application (e.g., `SAVE20`).
- **Admin Dashboard**: Comprehensive management of orders, products, stock levels, and transaction history.
- **Mobile Responsive**: Fully optimized for mobile, tablet, and desktop views.

---

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **CI/CD**: GitHub Actions
- **Payment Gateway**: [SSLCOMMERZ](https://www.sslcommerz.com/)

---

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file or GitHub Secrets:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
SSLCOMMERZ_STORE_ID=your_sandbox_id
SSLCOMMERZ_STORE_PASSWORD=your_sandbox_password
```

## 📖 Installation & Setup

 * Clone the repository:

```bash
   git clone [https://github.com/raselshikdar/bongshai.git](https://github.com/raselshikdar/bongshai.git)
cd bongshai
```

 * Install dependencies:
```bash
   npm install
```

 * Start the development server:
   ```bash
   npm run dev
   ```

 * Build for production:
   ```bash
   npm run build
   ```

🛡️ Security
 * Row Level Security (RLS): All Supabase tables are protected by strict RLS policies ensuring users can only access their own data.
 * Environment Protection: Sensitive keys (Service Role Keys) are stored in secure backend environments and never exposed to the frontend.

© 2026 Bongshai. Built with ❤️ for Bangladesh.

***

### How to add this on your phone:
1.  Go to your **New Public Repository** on GitHub.
2.  Click **Add file** > **Create new file**.
3.  Name the file `README.md`.
4.  Paste the content from the box above.
5.  Click **Commit changes**.
