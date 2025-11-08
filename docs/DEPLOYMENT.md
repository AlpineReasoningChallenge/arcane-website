# Deployment Guide

## Vercel Deployment

### 1. Prepare Your Repository

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit: Arcane puzzle hunt website"
   git push origin main
   ```

2. **Ensure Environment Variables**:
   - Create `.env.local` with your Supabase credentials
   - **DO NOT commit this file** (it should be in `.gitignore`)

### 2. Deploy to Vercel

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `arcane-website` repository

2. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Environment Variables**:
   - Add the same variables from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically

### 3. Post-Deployment

1. **Verify Functionality**:
   - Test authentication (sign up/sign in)
   - Verify dashboard loads
   - Check puzzle interactions

2. **Custom Domain** (Optional):
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS as instructed

## Production Checklist

### Before Deployment

- [ ] Environment variables configured
- [ ] Database schema deployed to Supabase
- [ ] Puzzle images uploaded to `public/puzzles/`
- [ ] Competition dates set in database
- [ ] Authentication settings configured

### After Deployment

- [ ] Test all user flows
- [ ] Verify image loading
- [ ] Check mobile responsiveness
- [ ] Test authentication flows
- [ ] Monitor error logs

## Environment Variables Reference

```env
# Required for production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables
   - Verify TypeScript compilation
   - Check for missing dependencies

2. **Runtime Errors**:
   - Verify Supabase connection
   - Check database permissions
   - Monitor Vercel function logs

3. **Image Loading Issues**:
   - Verify image paths
   - Check file permissions
   - Ensure proper image formats

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Performance Optimization

### Vercel Features

- **Edge Functions**: Automatic global deployment
- **Image Optimization**: Built-in Next.js optimization
- **CDN**: Global content delivery
- **Analytics**: Built-in performance monitoring

### Monitoring

- **Vercel Analytics**: Track performance metrics
- **Error Tracking**: Monitor runtime errors
- **Performance**: Core Web Vitals tracking

## Security Considerations

1. **Environment Variables**: Never expose in client-side code
2. **Database Access**: Use RLS policies
3. **Authentication**: Leverage Supabase security features
4. **HTTPS**: Automatic with Vercel

## Backup & Recovery

1. **Database**: Regular Supabase backups
2. **Code**: GitHub repository
3. **Environment**: Document all configurations
4. **Images**: Store in version control or CDN

---

**Your Arcane website is now ready for the world! 🚀**
