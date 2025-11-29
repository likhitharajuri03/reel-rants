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
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
            {review.movie_name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">{review.reviewer_name}</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(review.date_submitted), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 leading-relaxed line-clamp-4">
          {review.review_text}
        </p>
      </CardContent>
    </Card>
  );
};
