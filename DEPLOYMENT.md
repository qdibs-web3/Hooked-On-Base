# 🚀 Deployment Guide for Hooked

This guide will walk you through deploying Hooked to Vercel with MongoDB Atlas.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas account (free tier works)
- WalletConnect Project ID

## Step 1: Set Up MongoDB Atlas

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select a region close to your users
   - Name your cluster (e.g., "hooked-cluster")

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Grant "Read and write to any database" role

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add Vercel's IP ranges or use 0.0.0.0/0

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `hooked`
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/hooked?retryWrites=true&w=majority`

## Step 2: Get WalletConnect Project ID

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

## Step 3: Push to GitHub

1. **Initialize Git** (if not already done)
```bash
cd hooked
git init
```

2. **Create Repository on GitHub**
   - Go to github.com
   - Click "New repository"
   - Name it "hooked" (or your preferred name)
   - Don't initialize with README (we already have one)

3. **Push Code**
```bash
git add .
git commit -m "Initial commit: Hooked fishing game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hooked.git
git push -u origin main
```

## Step 4: Deploy to Vercel

1. **Connect Vercel to GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with GitHub
   - Click "Add New Project"
   - Import your "hooked" repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: .next (auto-detected)

3. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   **MONGODB_URI**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hooked?retryWrites=true&w=majority
   ```
   
   **NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID**
   ```
   your_walletconnect_project_id_here
   ```
   
   Make sure to add these for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

## Step 5: Test Deployment

1. **Visit Your App**
   - Open the Vercel deployment URL
   - Test wallet connection
   - Try casting and catching fish
   - Check leaderboard

2. **Common Issues**
   
   **MongoDB Connection Error**
   - Verify your connection string is correct
   - Check that IP whitelist includes 0.0.0.0/0
   - Ensure database user has correct permissions
   
   **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check browser console for errors
   - Try different wallet providers
   
   **Build Errors**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json
   - Verify TypeScript has no errors

## Step 6: Custom Domain (Optional)

1. **Buy Domain**
   - Purchase from Vercel, Namecheap, GoDaddy, etc.

2. **Add to Vercel**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

3. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait a few minutes for propagation

## Step 7: Monitor & Maintain

### Vercel Dashboard
- Monitor deployments
- View analytics
- Check error logs
- Manage environment variables

### MongoDB Atlas
- Monitor database usage
- Set up alerts
- Create backups
- Optimize indexes

### Updates
```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main

# Vercel will automatically redeploy
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | `abc123...` |

## Troubleshooting

### Database Connection Fails
1. Check MongoDB Atlas network access
2. Verify connection string format
3. Test connection locally first
4. Check Vercel function logs

### Wallet Won't Connect
1. Verify WalletConnect Project ID
2. Check browser console for errors
3. Try incognito mode
4. Test with different wallets

### Build Fails on Vercel
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are installed
3. Verify TypeScript compiles locally
4. Check for environment variable issues

## Performance Optimization

### Database Indexes
Create indexes in MongoDB for better performance:
```javascript
// In MongoDB Atlas, go to Collections → Indexes
db.users.createIndex({ walletAddress: 1 })
db.users.createIndex({ xp: -1 })
db.users.createIndex({ level: -1 })
```

### Vercel Settings
- Enable Edge Functions for API routes
- Use Vercel Analytics
- Set up monitoring alerts

## Security Best Practices

1. **Never commit `.env.local`** to GitHub
2. **Rotate database passwords** regularly
3. **Use MongoDB Atlas IP whitelist** in production
4. **Enable 2FA** on Vercel and MongoDB accounts
5. **Monitor for suspicious activity**

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review MongoDB Atlas logs
3. Open an issue on GitHub
4. Contact support

---

**Congratulations! Your Hooked fishing game is now live! 🎣**
