"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function MovieDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    axios
      .get("https://www.omdbapi.com/", {
        params: {
          i: id,
          apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        },
      })
      .then((res) => setMovie(res.data));
  }, [id]);

  if (!movie)
    return <p className="text-white p-10">Loading...</p>;

  const openTrailer = () => {
  const query = `${movie.Title} trailer`;
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank"
    );
  };

  return (
  <div className="min-h-screen bg-black text-white">

    {/* NAVBAR */}
    <div className="flex items-center justify-between px-8 py-4 bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      
      <h1
        onClick={() => router.push("/")}
        className="text-2xl font-bold text-red-600 cursor-pointer"
      >
        NETSEARCH
      </h1>

      <button
        onClick={() => router.push("/")}
        className="text-sm bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        ⬅ Back
      </button>
    </div>

    {/* HERO BACKGROUND */}
    <div className="relative h-[80vh] flex items-center px-10">

      {/* BACKGROUND IMAGE */}
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-lg"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">

        {/* POSTER */}
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-[260px] md:w-[320px] rounded-lg shadow-lg"
        />

        {/* DETAILS */}
        <div className="max-w-2xl">

          <h1 className="text-5xl font-extrabold mb-4">
            {movie.Title}
          </h1>

          <p className="text-gray-400 mb-2">
            {movie.Year} • {movie.Genre} • {movie.Runtime}
          </p>

          <p className="text-lg mb-4">
            ⭐ {movie.imdbRating} / 10
          </p>

          <p className="text-sm text-gray-400 mb-2">
            Director: {movie.Director}
          </p>

          <p className="text-sm text-gray-400 mb-4">
            Actors: {movie.Actors}
          </p>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {movie.Plot}
          </p>
          <div className="mt-6">
            <button
              onClick={openTrailer}
              className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              ▶ Watch Trailer
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}