# Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Quick Start

1. **Install dependencies**: `npm install`
2. **Set up environment variables** (see above)
3. **Run database schema**: Copy `supabase-schema.sql` to your Supabase SQL editor
4. **Start development server**: `npm run dev`

## Database Setup Steps

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to SQL Editor
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and execute the SQL
5. Go to Authentication > Settings and configure email auth as needed

## Image Setup

Create the following folder structure in your `public` directory:

```
public/
└── puzzles/
    ├── puzzle1.jpg          # Circular thumbnail (128x128px min)
    ├── puzzle1-modal.jpg    # Full-size modal image (800x600px min)
    ├── puzzle2.jpg
    ├── puzzle2-modal.jpg
    ├── puzzle3.jpg
    ├── puzzle3-modal.jpg
    ├── puzzle4.jpg
    ├── puzzle4-modal.jpg
    ├── puzzle5.jpg
    ├── puzzle5-modal.jpg
    ├── puzzle6.jpg
    ├── puzzle6-modal.jpg
    ├── puzzle7.jpg
    └── puzzle7-modal.jpg
```

## Testing

1. Create a test account
2. Navigate to `/dashboard`
3. Verify the countdown timer works
4. Test puzzle modal interactions
5. Submit test answers
6. Check database entries

## Common Issues

- **Authentication errors**: Verify your Supabase URL and keys
- **Database errors**: Ensure RLS policies are properly set up
- **Image loading**: Check file paths and image formats
- **Build errors**: Run `npm run type-check` to verify TypeScript

## Next Steps

After setup, consider:
- Customizing puzzle content and images
- Setting competition dates
- Implementing answer validation logic

- Setting up monitoring and analytics
