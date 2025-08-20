# Creator Score Mini App Fork - Test Version

This is a fork of the Creator Score Mini App for testing purposes on Farcaster Mini App preview.

## 🚀 Quick Deploy to Vercel

1. **Fork this repository** to your GitHub account
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Vercel will automatically detect it's a Next.js app

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
```

## 🧪 Testing on Farcaster

1. **Deploy to Vercel** with the environment variables above
2. **Update your Farcaster Mini App configuration** with the new Vercel URL
3. **Test the integration** in Farcaster's preview environment

## 📝 Local Development

```bash
# Install dependencies
npm install

# Set environment variables in .env.local
# (use the same values as above but with localhost:3000 for NEXT_PUBLIC_URL)

# Run development server
npm run dev
```

## 🔧 Current Status

- ✅ Basic app functionality working
- ✅ Environment variables configured
- ⚠️ Some API endpoints may need Supabase configuration
- 🚀 Ready for Vercel deployment

## 📚 Original App Features

- Creator Score Display
- Leaderboard Rankings
- Rewards Calculations
- Profile Management
- Wallet Connections
- Farcaster Integration

---

**Note**: This is a test fork. For production use, refer to the original repository.
