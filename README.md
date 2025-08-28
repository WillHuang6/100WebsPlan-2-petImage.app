# PetImage - AI Pet Art Generator

Transform your beloved pet photos into stunning AI-generated artwork in seconds.

## 🎨 Features

- **Lightning Fast**: Generate beautiful pet art in under 10 seconds
- **Google Nano Banana**: Powered by cutting-edge AI technology
- **4 Beautiful Templates**: Birthday celebrations, balloon parties, and 3D figurines
- **User Authentication**: Secure login with email or social providers
- **Generation History**: View and manage your creation history (7-day retention)
- **Share Functionality**: Share your favorite creations with others

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **AI**: Replicate API (Google Nano Banana model)
- **Deployment**: Vercel

## 🛠️ Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/petimage-app.git
cd petimage-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL commands in `supabase-setup.sql`
   - Create storage buckets: `user-uploads` (private) and `generated-images` (public)

6. Start the development server:
```bash
npm run dev
```

## 📋 Database Schema

- **profiles**: User profile information and credits
- **generations**: AI generation records and results
- **shares**: Share links and analytics

## 🔒 Security Features

- Row Level Security (RLS) policies
- Secure file uploads
- User data isolation
- Automatic cleanup of expired content

## 🚀 Deployment

This app is designed to be deployed on Vercel with Supabase integration:

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy!

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for pet parents worldwide