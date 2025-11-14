# 🚀 CampusNest - Quick Start Guide

## Running the Application

```bash
cd frontend
npm install    # Only needed once
npm run dev    # Start development server
```

Visit: **http://localhost:3000**

## 🎯 Demo Accounts

### Student Account
```
Email: chidinma.okafor@unn.edu.ng
Password: (any password works)
```

### Landlord Account
```
Email: chukwuma.eze@gmail.com  
Password: (any password works)
```

## 📱 Test the Complete Flow

### As a Student:
1. **Home** → Click "Find a Lodge (Student)"
2. **Sign Up** → Create new account OR **Login** with demo account
3. **Dashboard** → View your stats and bookings
4. **Browse Lodges** → Filter by area, price, search
5. **Lodge Details** → View full information, contact landlord
6. **Book Now** → Complete booking flow (confirm → pay → success)
7. **My Bookings** → Inspect lodge, approve or request refund
8. **Edit Profile** → Update your information

### As a Landlord:
1. **Home** → Click "List Your Property (Landlord)"
2. **Sign Up** → Create new account OR **Login** with demo account
3. **Dashboard** → View revenue and booking stats
4. **Create Listing** → Add new property with details
5. **My Listings** → View all your properties
6. **Bookings** → See student bookings and payments

## 🎨 Key Features to Explore

✅ **Advanced Filtering** - Area, price, search on browse page
✅ **Direct Contact** - Call or WhatsApp landlords
✅ **Inspection Flow** - Approve or refund after viewing lodge
✅ **Responsive Design** - Try on mobile, tablet, desktop
✅ **Smooth Animations** - Modals, notifications, transitions
✅ **Profile Editing** - Update user information
✅ **Stats Dashboard** - Visual data for both user types

## 📍 Top 7 UNN Areas

Try filtering lodges by these areas:
- Odenigwe
- Hilltop
- Green House
- Abuja Building Area
- Faculty of Arts Area
- Onuiyi
- Zik's Flats Area

## 🎯 What's Working

✅ Full authentication flow
✅ Student and landlord dashboards
✅ Browse and filter lodges
✅ Booking with payment simulation
✅ Inspection approval/refund process
✅ Landlord listing management
✅ Profile editing
✅ Responsive mobile views
✅ Form validation
✅ Loading states
✅ Success/error notifications

## 🔄 Current State

- **Using dummy data** for demonstration
- **LocalStorage** for session management
- **Payment simulation** (Paystack integration ready)
- **All core features** functional

## 📝 Next: Backend Integration

When connecting to backend:
1. Replace dummy data with API calls
2. Implement real authentication with JWT
3. Add Paystack payment integration
4. Enable file uploads for photos/documents
5. Add real-time notifications

## 🎓 Project Structure

```
frontend/src/
├── app/              # Pages (Next.js App Router)
├── components/       # Reusable UI components
├── lib/             # Utils, constants, dummy data
└── types/           # TypeScript definitions
```

## 💡 Pro Tips

- Use browser DevTools to test responsive views
- Check console for any validation messages
- Try both student and landlord flows
- Test the inspection approval/refund feature
- Edit your profile to see modal animations

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
taskkill /F /PID <process_id>
# Then run npm run dev again
```

**Dependencies issues?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Enjoy exploring CampusNest!** 🏠✨
