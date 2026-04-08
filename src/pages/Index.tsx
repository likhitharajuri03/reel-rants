import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Film, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Review {
  id: string;
  movie_name: string;
  reviewer_name: string;
  review_text: string;
  rating: number;
  date_submitted: string;
}

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadReviews();
  }, [sortBy]);

  const loadReviews = async () => {
    try {
      let query = supabase
        .from("movie_reviews")
        .select("*");

      if (sortBy === "date") {
        query = query.order("date_submitted", { ascending: false });
      } else if (sortBy === "rating") {
        query = query.order("rating", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#f5c518] rounded-sm px-3 py-2">
                <Film className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#f5c518]">
                  CineReviews
                </h1>
                <p className="text-sm text-slate-400">Community movie reviews in IMDb style</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={() => navigate("/submit")} className="gap-2 bg-[#f5c518] text-slate-950 hover:bg-yellow-400">
                <Plus className="w-4 h-4" />
                Add Review
              </Button>
              {user ? (
                <Button variant="outline" onClick={() => supabase.auth.signOut()}>
                  Logout
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-[#f5c518]">Top rated reviews</p>
              <h2 className="text-5xl font-black tracking-tight text-white">Discover Movie Reviews</h2>
              <p className="max-w-2xl text-slate-400 text-lg">
                Read verified community reviews, browse top ratings, and explore the latest movie opinions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl bg-slate-800/90 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Reviews</p>
                <p className="text-3xl font-bold text-white">{reviews.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-800/90 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sorted by</p>
                <p className="text-3xl font-bold text-white">{sortBy === "date" ? "Newest" : "Highest Rated"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <Input
            placeholder="Search by movie name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-900 text-slate-100 border-slate-800 placeholder:text-slate-500"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] border-slate-800 bg-slate-900 text-slate-100">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <Film className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Try a different search term" : "Be the first to add a review!"}
            </p>
            {user && (
              <Button onClick={() => navigate("/submit")}>
                Add First Review
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
