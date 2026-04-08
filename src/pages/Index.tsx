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
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-sm shadow-slate-950/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#f5c518] p-3 shadow-inner shadow-slate-900/20">
                <Film className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">CineReviews</h1>
                <p className="text-sm text-slate-400">IMDb-inspired movie review community</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
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

      <main className="container mx-auto px-4 py-10">
        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30">
            <span className="inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.32em] text-slate-400">
              Top rated reviews
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-100">Discover movie reviews like IMDb.</h2>
            <p className="mt-4 max-w-2xl text-slate-300 text-base leading-7">
              Browse curated community ratings, read honest reviews, and find the next film everyone’s talking about.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Reviews</p>
                <p className="mt-3 text-3xl font-semibold text-white">{reviews.length}</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Sort</p>
                <p className="mt-3 text-3xl font-semibold text-white">{sortBy === "date" ? "Newest first" : "Highest rated"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Need a review?</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Your audience is ready.</h3>
            <p className="mt-3 text-slate-400 leading-7">
              Sign in to submit reviews and help others discover their next favorite movie.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.75rem] bg-slate-950/80 p-5 border border-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest review</p>
                <p className="mt-2 text-lg font-semibold text-white">A dramatic action masterpiece.</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-950/80 p-5 border border-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pro tip</p>
                <p className="mt-2 text-slate-400">Short reviews feel more memorable — keep it sharp and honest.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#f5c518]">Browse</p>
              <h3 className="mt-2 text-3xl font-bold text-white">Search reviews and filter the feed</h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] border-slate-800 bg-slate-900 text-slate-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              placeholder="Search by movie name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-950 text-slate-100 border-slate-800 placeholder:text-slate-500"
            />
          </div>
        </section>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-[1.75rem] bg-slate-900/80 animate-pulse" />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-12 text-center shadow-2xl shadow-slate-950/30">
            <Film className="mx-auto h-14 w-14 text-[#f5c518]" />
            <h3 className="mt-6 text-2xl font-semibold text-white">No reviews found</h3>
            <p className="mt-3 text-slate-400 mb-6">
              {searchTerm ? "Try a different search term" : "Be the first to add a review!"}
            </p>
            {user && (
              <Button onClick={() => navigate("/submit")} className="bg-[#f5c518] text-slate-950 hover:bg-yellow-400">
                Add First Review
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
