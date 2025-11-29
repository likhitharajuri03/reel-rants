-- Create movie_reviews table
CREATE TABLE IF NOT EXISTS public.movie_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_name TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date_submitted TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for movie name searches
CREATE INDEX IF NOT EXISTS idx_movie_name ON public.movie_reviews (movie_name);

-- Enable Row Level Security
ALTER TABLE public.movie_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Anyone can view reviews"
  ON public.movie_reviews
  FOR SELECT
  USING (true);

-- Only authenticated users can insert reviews
CREATE POLICY "Authenticated users can submit reviews"
  ON public.movie_reviews
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);