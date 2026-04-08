import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const reviewSchema = z.object({
  movieName: z.string().trim().min(1, "Movie name is required").max(200, "Movie name too long"),
  reviewerName: z.string().trim().min(1, "Your name is required").max(100, "Name too long"),
  reviewText: z.string().trim().min(10, "Review must be at least 10 characters").max(2000, "Review too long"),
  rating: z.number().min(1).max(5),
});

const SubmitReview = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    movieName: "",
    reviewerName: "",
    reviewText: "",
    rating: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to submit a review");
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = reviewSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase.from("movie_reviews").insert({
        movie_name: validatedData.movieName,
        reviewer_name: validatedData.reviewerName,
        review_text: validatedData.reviewText,
        rating: validatedData.rating,
      });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reviews
        </Button>

        <div className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#f5c518]">Write a review</p>
              <h1 className="mt-3 text-4xl font-black text-white">Submit your movie review</h1>
              <p className="mt-3 text-slate-400 max-w-2xl">
                Add your opinion, rating, and recommendation so others can discover the best films.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-center border border-slate-800">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tip</p>
              <p className="mt-2 text-lg font-semibold text-white">Keep it honest and concise.</p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/95 shadow-2xl shadow-slate-950/40">
          <CardHeader className="bg-slate-950/95 px-8 py-8 border-b border-slate-800">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">Review Details</h2>
              <p className="text-slate-400 max-w-2xl">
                Fill in the details below to publish your review to the CineReviews feed.
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="movieName" className="text-slate-300">Movie Name *</Label>
                <Input
                  id="movieName"
                  placeholder="Enter movie name"
                  value={formData.movieName}
                  onChange={(e) => setFormData({ ...formData, movieName: e.target.value })}
                  required
                  className="bg-slate-950 text-white border-slate-800 placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewerName" className="text-slate-300">Your Name *</Label>
                <Input
                  id="reviewerName"
                  placeholder="Enter your name"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                  required
                  className="bg-slate-950 text-white border-slate-800 placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Rating *</Label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:-translate-y-1"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= formData.rating
                            ? "fill-[#f5c518] text-[#f5c518]"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-300">
                    {formData.rating ? `${formData.rating}.0 / 5` : "Select a rating"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewText" className="text-slate-300">Your Review *</Label>
                <Textarea
                  id="reviewText"
                  placeholder="Share your thoughts about the movie..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  rows={7}
                  required
                  className="bg-slate-950 text-white border-slate-800 placeholder:text-slate-600"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#f5c518] text-slate-950 hover:bg-yellow-400"
                disabled={loading || formData.rating === 0}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitReview;
