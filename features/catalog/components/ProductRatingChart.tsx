import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatingStats {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface ProductRatingChartProps {
  stats: RatingStats;
}

/**
 * Renders a visual rating chart with a star distribution progress bar
 * @param props.stats - The compiled rating statistics (average, total, distribution)
 * @returns The rendered product rating chart component
 */
export default function ProductRatingChart({ stats }: ProductRatingChartProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Left side: Average Rating */}
      <div className="flex flex-col items-center justify-center min-w-[150px]">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold font-montserrat">
            {stats.average.toFixed(1)}
          </span>
          <span className="text-muted-foreground text-lg">out of 5</span>
        </div>

        <div className="flex text-[#FFB800] mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(stats.average)
                  ? "fill-current"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <span className="text-muted-foreground text-sm">
          ({stats.total} Review{stats.total !== 1 ? "s" : ""})
        </span>
      </div>

      {/* Right side: Distribution Bars */}
      <div className="flex-1 w-full flex flex-col gap-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count =
            stats.distribution[star as keyof typeof stats.distribution];
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3 w-full max-w-sm">
              <span className="text-sm font-medium w-12 shrink-0">
                {star} Star
              </span>
              {/* Force the progress indicator color to match the mockup yellow */}
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-muted">
                <div
                  className="h-full bg-[#FFB800] rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
