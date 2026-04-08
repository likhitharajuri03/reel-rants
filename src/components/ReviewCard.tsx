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
    <Card className="rounded-[1.75rem] border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <CardHeader className="space-y-4 px-6 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white line-clamp-2">{review.movie_name}</h3>
            <p className="mt-2 text-sm text-slate-400">Review by {review.reviewer_name}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5c518] px-3 py-1 text-sm font-semibold text-slate-950">
            {review.rating.toFixed(1)} / 5
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(review.date_submitted), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-1 text-[#f5c518]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-700"}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="border-t border-slate-800 px-6 pb-6 pt-4">
        <p className="text-slate-300 leading-relaxed line-clamp-5">{review.review_text}</p>
      </CardContent>
    </Card>
  );
};
