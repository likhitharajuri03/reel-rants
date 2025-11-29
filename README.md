🎬 MovieReview
A modern movie review platform built with Lovable, featuring a sleek cinema-themed dark design with gold accents.
✨ Features

Browse Reviews: View all movie reviews from the community
Submit Reviews: Share your thoughts on movies you've watched
Star Ratings: Rate movies from 1 to 5 stars
Search & Filter: Find reviews by movie name and filter by ratings
Dark Theme: Cinema-inspired dark interface with gold accents

🛠️ Built With

Lovable - Visual web development platform
Supabase - Backend and database
React - Frontend framework

📋 Database Schema
The app uses a movie_reviews table with the following structure:

Movie name
Reviewer name (optional/anonymous)
Star rating (1-5)
Review text (optional)
Timestamp

🚀 Getting Started

Clone this repository
Open in Lovable platform
Configure your Supabase connection
Set up the database policies for public inserts:

sql-- Allow public inserts (no authentication required)
CREATE POLICY "Allow public inserts" ON public.movie_reviews
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON public.movie_reviews
FOR INSERT
WITH CHECK (true);
📱 Pages

Home (/) - Hero section with featured reviews
Reviews (/reviews) - All reviews sorted by newest
Submit (/submit) - Form to submit new movie reviews

🎨 Design Features

Dark cinema theme with gold (#F59E0B) accents
Responsive layout
Star rating system
Form validation
Navigation header with logo

📝 License
This project is built using Lovable platform.