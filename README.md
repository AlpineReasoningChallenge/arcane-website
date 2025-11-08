# Arcane - Mystical Puzzle Hunt Competition

A Next.js/Supabase website for hosting virtual puzzle hunt competitions with a stylized magic/runic theme. Features user authentication, a countdown timer, and seven interactive puzzle challenges.

## Features

- 🎭 **Magic/Runic Theme**: Beautiful, responsive design with mystical aesthetics
- 🔐 **Secure Authentication**: Supabase-powered user accounts and login system
- ⏰ **Fantasy Countdown Timer**: DD/HH/MM/SS format with animated elements
- 🧩 **Seven Puzzle Seals**: Circular arrangement with interactive modals
- 📱 **Fully Responsive**: Optimized for phones, tablets, and computers
- 🛡️ **SQL Injection Protection**: Input sanitization and secure database operations
- 🎨 **Modern UI/UX**: Tailwind CSS with smooth animations and transitions

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel-ready
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd arcane-website
npm install
```

### 2. Supabase Database Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up Environment Variables**:
   Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Run Database Schema**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL to create all tables and policies

### 3. Configure Supabase Authentication

1. **Enable Email Auth**:
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable "Enable email confirmations" if you want email verification
   - Configure any additional auth settings as needed

2. **Set up Email Templates** (Optional):
   - Customize email templates in Authentication > Templates
   - Add your branding and messaging

### 4. Add Puzzle Images

1. **Create Image Structure**:
   ```
   public/
   └── puzzles/
       ├── puzzle1.jpg          # Circular thumbnail
       ├── puzzle1-modal.jpg    # Full-size modal image
       ├── puzzle2.jpg
       ├── puzzle2-modal.jpg
       └── ... (repeat for all 7 puzzles)
   ```

2. **Image Requirements**:
   - Thumbnails: 128x128px minimum (will be displayed as circles)
   - Modal images: 800x600px minimum (full-size display)
   - Format: JPG, PNG, or WebP
   - Theme: Magic, runes, mystical elements

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your website.

## Database Schema

The application uses the following main tables:

- **profiles**: Extended user information
- **puzzles**: Puzzle details and images
- **user_puzzle_attempts**: User submissions and progress
- **competition_settings**: Competition timing and configuration

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Customization

### Competition Timing

Update the competition start/end dates in the `competition_settings` table:

```sql
UPDATE competition_settings 
SET start_date = '2024-12-01 00:00:00+00', 
    end_date = '2024-12-31 23:59:59+00' 
WHERE id = 1;
```

### Puzzle Content

Modify puzzle details in the `puzzles` table:

```sql
UPDATE puzzles 
SET name = 'New Puzzle Name', 
    description = 'New description' 
WHERE id = 1;
```

### Answer Validation

Currently, all answers are marked as incorrect by default. To implement answer validation:

1. Create a separate table with correct answers
2. Modify the submission logic in `PuzzleModal.tsx`
3. Update the `is_correct` field based on validation

## Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Environment Variables**:
   - Add the same environment variables in Vercel dashboard
   - Ensure they match your `.env.local` file

3. **Deploy**:
   - Vercel will automatically deploy on git push
   - Your site will be live at `your-project.vercel.app`

### Custom Domain

1. **Add Domain**:
   - Go to Vercel dashboard > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Security Features

- **SQL Injection Protection**: Input sanitization on all user inputs
- **Row Level Security**: Database-level access control
- **Authentication**: Secure Supabase auth with JWT tokens
- **Input Validation**: Client and server-side validation
- **HTTPS**: Automatic SSL certificates with Vercel

## Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Optimized for static and dynamic content
- **CDN**: Global content delivery with Vercel Edge Network

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue in the GitHub repository
- Check the Supabase documentation
- Review Next.js documentation

## Roadmap

- [ ] Leaderboard system
- [ ] Real-time progress updates
- [ ] Puzzle hints system
- [ ] Achievement badges
- [ ] Social sharing

- [ ] Analytics and insights

---

**Happy puzzling! 🧙‍♂️✨**
