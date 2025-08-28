-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generations table
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id TEXT NOT NULL,
  original_image_url TEXT NOT NULL,
  generated_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  share_token TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create shares table
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID REFERENCES generations(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX idx_generations_expires_at ON generations(expires_at);
CREATE INDEX idx_generations_share_token ON generations(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_shares_share_token ON shares(share_token);
CREATE INDEX idx_shares_generation_id ON shares(generation_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for generations
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations" ON generations
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow public access to shared generations
CREATE POLICY "Public can view shared generations" ON generations
  FOR SELECT USING (is_public = TRUE AND share_token IS NOT NULL);

-- RLS Policies for shares
CREATE POLICY "Users can view own shares" ON shares
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM generations 
      WHERE generations.id = shares.generation_id 
      AND generations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own shares" ON shares
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM generations 
      WHERE generations.id = shares.generation_id 
      AND generations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own shares" ON shares
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM generations 
      WHERE generations.id = shares.generation_id 
      AND generations.user_id = auth.uid()
    )
  );

-- Allow public access to shares for public generations
CREATE POLICY "Public can view public shares" ON shares
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM generations 
      WHERE generations.id = shares.generation_id 
      AND generations.is_public = TRUE
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Function to clean up expired generations
CREATE OR REPLACE FUNCTION public.cleanup_expired_generations()
RETURNS void AS $$
BEGIN
  -- Delete expired generations and their related shares
  DELETE FROM generations WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup task to run daily at 2 AM
SELECT cron.schedule(
  'cleanup-expired-generations',
  '0 2 * * *',
  'SELECT public.cleanup_expired_generations();'
);

-- Create storage buckets (run these in Supabase Storage dashboard)
-- Bucket: user-uploads (private)
-- Bucket: generated-images (public)

-- Storage policies will be created via the dashboard