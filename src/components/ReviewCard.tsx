import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ReviewCardProps {
  review: {
    id: string;
    movie_name: string;
    reviewer_name: string;
    review_text: string;
    rating: number;
    date_submitted: string;
  };
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="rounded-3xl border border-slate-800 bg-white/95 shadow-xl shadow-slate-950/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950 line-clamp-2">
              {review.movie_name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">Review by {review.reviewer_name}</p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <span className="inline-flex items-center rounded-full bg-[#f5c518] px-3 py-1 text-sm font-semibold text-slate-950">
              {review.rating.toFixed(1)} / 5
            </span>
            <div className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(review.date_submitted), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#f5c518]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-300"}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="border-t border-slate-200/80 p-6">
        <p className="text-slate-700 leading-relaxed line-clamp-5">
          {review.review_text}
        </p>
      </CardContent>
    </Card>
  );
};
