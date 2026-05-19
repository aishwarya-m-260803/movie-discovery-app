import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MovieCard({ movie }: { movie: any }) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = () => {
    const existing = JSON.parse(localStorage.getItem("recent") || "[]");

    // remove if already exists (to avoid duplicates)
    const filtered = existing.filter(
      (m: any) => m.imdbID !== movie.imdbID
    );

    // add to top
    const updated = [movie, ...filtered].slice(0, 10); // limit 10

    localStorage.setItem("recent", JSON.stringify(updated));

    router.push(`/movie/${movie.imdbID}`);
  };

  const toggleWatchlist = (movie: any) => {
    const existing = JSON.parse(localStorage.getItem("watchlist") || "[]");

    const isAlreadySaved = existing.find(
      (m: any) => m.imdbID === movie.imdbID
    );

    let updated;

    if (isAlreadySaved) {
      updated = existing.filter(
        (m: any) => m.imdbID !== movie.imdbID
      );
      setIsSaved(false);
    } else {
      updated = [...existing, movie];
      setIsSaved(true);
    }

    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("watchlist") || "[]");

    const found = existing.find(
      (m: any) => m.imdbID === movie.imdbID
    );

    setIsSaved(!!found);
  }, [movie.imdbID]);

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer w-[160px] flex-shrink-0 transform hover:scale-105 transition duration-300"
    >
      {/* ❤️ BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWatchlist(movie);
        }}
        className="absolute top-2 right-2 bg-black/70 p-1 rounded-full"
      >
        {isSaved ? "❤️" : "🤍"}
      </button>

      {/* IMAGE */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450"
          }
          alt={movie.Title}
          className="w-full h-[240px] object-cover rounded-lg"
        />
      </div>

      {/* DETAILS */}
      <div className="mt-2 px-1">
        <h3 className="text-sm font-semibold line-clamp-2">
          {movie.Title}
        </h3>

        <span className="text-xs text-gray-400">
          {movie.Year}
        </span>
      </div>
    </div>
  );
}