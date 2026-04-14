"use client";

interface StarRatingProps {
  rating: number | null;
  onRate: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({ rating, onRate, disabled }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          disabled={disabled}
          className={`text-lg transition-colors ${
            rating && star <= rating
              ? "text-amber-400"
              : "text-zinc-600 hover:text-amber-400/60"
          } disabled:cursor-not-allowed`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
