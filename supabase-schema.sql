-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create puzzles table
CREATE TABLE public.puzzles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  modal_image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_puzzle_attempts table
CREATE TABLE public.user_puzzle_attempts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  puzzle_id INTEGER REFERENCES public.puzzles(id) ON DELETE CASCADE NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, puzzle_id)
);

-- Create competition_settings table
CREATE TABLE public.competition_settings (
  id SERIAL PRIMARY KEY,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_puzzle_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for puzzles
CREATE POLICY "Anyone can view active puzzles" ON public.puzzles
  FOR SELECT USING (is_active = true);

-- RLS Policies for user_puzzle_attempts
CREATE POLICY "Users can view their own attempts" ON public.user_puzzle_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts" ON public.user_puzzle_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts" ON public.user_puzzle_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for competition_settings
CREATE POLICY "Anyone can view competition settings" ON public.competition_settings
  FOR SELECT USING (true);

-- Insert sample data
INSERT INTO public.competition_settings (start_date, end_date) VALUES 
  (NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days');

INSERT INTO public.puzzles (name, description, image_url, modal_image_url) VALUES
  ('The Runic Gateway', 'Decipher the ancient runes to unlock the first challenge', '/puzzles/puzzle1.jpg', '/puzzles/puzzle1-modal.jpg'),
  ('Crystal Resonance', 'Find the harmonic frequency hidden in the crystal formations', '/puzzles/puzzle2.jpg', '/puzzles/puzzle2-modal.jpg'),
  ('Shadow Patterns', 'Follow the shadows to reveal the hidden path', '/puzzles/puzzle3.jpg', '/puzzles/puzzle3-modal.jpg'),
  ('Elemental Balance', 'Balance the four elements to proceed', '/puzzles/puzzle4.jpg', '/puzzles/puzzle4-modal.jpg'),
  ('Time Distortion', 'Navigate through the temporal anomalies', '/puzzles/puzzle5.jpg', '/puzzles/puzzle5-modal.jpg'),
  ('Arcane Geometry', 'Solve the geometric patterns of the ancients', '/puzzles/puzzle6.jpg', '/puzzles/puzzle6-modal.jpg'),
  ('The Final Seal', 'Break the seal to claim your victory', '/puzzles/puzzle7.jpg', '/puzzles/puzzle7-modal.jpg');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, ip_address)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'ip_address');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset is_correct when answer is updated
CREATE OR REPLACE FUNCTION public.reset_is_correct_on_answer_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If the answer has changed, set is_correct to NULL
  IF OLD.answer IS DISTINCT FROM NEW.answer THEN
    NEW.is_correct := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to reset is_correct when answer is updated
CREATE TRIGGER reset_is_correct_on_answer_update
  BEFORE UPDATE ON public.user_puzzle_attempts
  FOR EACH ROW
  WHEN (OLD.answer IS DISTINCT FROM NEW.answer)
  EXECUTE FUNCTION public.reset_is_correct_on_answer_update();

-- Create indexes for better performance
CREATE INDEX idx_user_puzzle_attempts_user_id ON public.user_puzzle_attempts(user_id);
CREATE INDEX idx_user_puzzle_attempts_puzzle_id ON public.user_puzzle_attempts(puzzle_id);
CREATE INDEX idx_puzzles_is_active ON public.puzzles(is_active);
