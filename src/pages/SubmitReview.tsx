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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reviews
        </Button>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Submit a Review</CardTitle>
            <CardDescription>Share your thoughts on a movie with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="movieName">Movie Name *</Label>
                <Input
                  id="movieName"
                  placeholder="Enter movie name"
                  value={formData.movieName}
                  onChange={(e) => setFormData({ ...formData, movieName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewerName">Your Name *</Label>
                <Input
                  id="reviewerName"
                  placeholder="Enter your name"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewText">Your Review *</Label>
                <Textarea
                  id="reviewText"
                  placeholder="Share your thoughts about the movie..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
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
