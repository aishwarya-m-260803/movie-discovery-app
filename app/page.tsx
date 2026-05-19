"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MovieCard from "./components/MovieCard";

export default function Home() {
  // STATE
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [popular, setPopular] = useState<any[]>([]);
  const popularRef = useRef<HTMLDivElement | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recent") || "[]");
    setRecent(data);
  }, []);


  useEffect(() => {
  if (!debouncedQuery || debouncedQuery.length < 2) {
    setMovies([]);
    return;
  }

  
  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const res = await axios.get("https://www.omdbapi.com/", {
        params: {
          s: debouncedQuery,
          apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        },
      });

      if (res.data.Response === "True") {
        setMovies(res.data.Search);
      } else {
        setMovies([]);
        setError("No movies found 😢");
      }
    } catch (err) {
      setError("Something went wrong.");
      setMovies([]);
    }

    setLoading(false);
  };

  fetchMovies();
}, [debouncedQuery]);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };


  useEffect(() => {
    const fetchCategory = async () => {
      const res = await axios.get("https://www.omdbapi.com/", {
        params: {
          s: "avengers",
          apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        },
      });

      if (res.data.Response === "True") {
        setPopular(res.data.Search);
      }
    };

    fetchCategory();
  }, []);


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(data);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <div className="flex items-center justify-between px-8 py-4 bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">

        <h1 className="text-2xl font-bold text-red-600">
          NETSEARCH
        </h1>

        <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">

          <input
            type="text"
            placeholder="Search movies..."
            className="bg-transparent text-white px-3 py-2 outline-none w-48"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className="bg-red-600 px-4 py-2 hover:bg-red-700">
            🔍
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="relative h-[70vh] flex items-center px-10">

        <img
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl font-bold mb-4">
            Discover Your Next Movie
          </h2>
          <p className="text-gray-300">
            Search and explore movies instantly
          </p>
        </div>
      </div>

      {/* STATES */}
      <div className="px-8 mt-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/*  SEARCH RESULTS */}
      {movies.length > 0 && (
        <div className="px-8 mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Search Results
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      )}


      {recent.length > 0 && (
        <div className="px-8 mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Recently Viewed
          </h2>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {recent.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      )}
      
      {/*  POPULAR PICKS */}
      <div className="relative px-8 mt-12 overflow-hidden">

        <h2 className="text-2xl font-semibold mb-4">
           Popular Picks
        </h2>

        {/* LEFT */}
        <button
          onClick={() => scroll(popularRef, "left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full"
        >
          ◀
        </button>

        {/* ROW */}
        <div
          ref={popularRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {popular.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>

        {/* RIGHT */}
        <button
          onClick={() => scroll(popularRef, "right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full"
        >
          ▶
        </button>

      </div>

    </div>
  );
}