# Creator Score Mini App Fork - Test Version

This is a fork of the Creator Score Mini App for testing purposes on Farcaster Mini App preview.

## 🚀 Quick Deploy to Vercel

1. **Fork this repository** to your GitHub account
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Vercel will automatically detect it's a Next.js app

## 🗄️ Supabase Database Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Sign up/Login with your GitHub account
- Click "New Project"
- Choose your organization
- Name: `creator-score-test`
- Set a database password (save this!)
- Choose a region close to you
- Click "Create new project"

### 2. Set Up Database Schema
- Go to **SQL Editor** in your Supabase dashboard
- Copy and paste the contents of `supabase-setup.sql`
- Click "Run" to execute the script
- This creates 3 tables: `user_preferences`, `perk_entries`, and `notification_runs`

### 3. Get Your Credentials
- Go to **Settings** → **API**
- Copy your:
  - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
  - **service_role key** (for server-side)

### 4. Test Database Connection
- Deploy to Vercel with your environment variables
- Visit `/test-db` on your deployed app to verify the database connection
- You should see sample data from your tables

## 🔑 Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

```bash
# Required
NEXT_PUBLIC_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_ONCHAINKIT_API_KEY=FBl8u3e0EHiICBkHpgyewyiCi43DJSTW
TALENT_API_KEY=aeb09f1f501e63041475037312deb1445aa84e2fcf0658b2d922dbcf712b

# Optional
NEYNAR_API_KEY=5B31A8EF-11B0-4AF8-816B-F23991CAC1A8
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=

# Privy App ID
NEXT_PUBLIC_PRIVY_APP_ID=cm8j6p8zy002i4028j9m9wg17

# Supabase (Required)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🧪 Testing on Farcaster

1. **Set up Supabase** database using the steps above
2. **Deploy to Vercel** with all environment variables
3. **Test database connection** by visiting `/test-db` on your deployed app
4. **Update your Farcaster Mini App configuration** with the new Vercel URL
5. **Test the integration** in Farcaster's preview environment

## 📝 Local Development

```bash
# Install dependencies
npm install

# Set environment variables in .env.local
# (use the same values as above but with localhost:3000 for NEXT_PUBLIC_URL)

# Run development server
npm run dev

# Test database connection locally at http://localhost:3000/test-db
```

## 🔧 Current Status

- ✅ Basic app functionality working
- ✅ Environment variables configured
- ✅ Supabase database setup script provided
- ✅ Database test page created
- 🚀 Ready for Vercel deployment with full database

## 📚 App Features

- Creator Score Display
- Leaderboard Rankings
- Rewards Calculations
- Profile Management
- Wallet Connections
- Farcaster Integration
- User Preferences (stored in Supabase)
- Perk Management (stored in Supabase)
- Notification System (stored in Supabase)

## 🗃️ Database Tables

- `user_preferences` - User settings and opt-out status
- `perk_entries` - User perk registrations
- `notification_runs` - System notification tracking

## 🧪 Testing

- **Database Test**: Visit `/test-db` to verify Supabase connection
- **Sample Data**: The setup script includes test data for immediate testing
- **RLS Policies**: Configured for public read access and authenticated user management

---

**Note**: This is a test fork with full database functionality. For production use, refer to the original repository.
