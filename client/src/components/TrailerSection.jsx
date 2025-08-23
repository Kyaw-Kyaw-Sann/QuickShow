import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

// Detect and render the right player for the URL.
function Player({ url }) {
  const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(url);

  if (isYouTube) {
    const id = getYouTubeId(url);
    const embed = `https://www.youtube.com/embed/${id}`;
    return (
      <iframe
        src={embed}
        title="Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full max-w-[960px] aspect-video mx-auto rounded-lg"
      />
    );
  }

  // Fallback to native video player for MP4/WebM/etc.
  return (
    <video
      src={url}
      controls
      className="w-full max-w-[960px] aspect-video mx-auto rounded-lg"
    />
  );
}

// Robust YouTube ID extractor (handles watch, youtu.be, and embed links)
function getYouTubeId(u) {
  try {
    const url = new URL(u);
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    const v = url.searchParams.get("v");
    if (v) return v;
    const m = url.pathname.match(/\/embed\/([^/?]+)/);
    return m ? m[1] : "";
  } catch {
    return "";
  }
}

//we only need to understand this main component
const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>
        {/* this is a big one */}
      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        <Player url={currentTrailer.videoUrl} />
      </div>

        {/* This is small ones */}
      <div className="group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.slice(0, 4).map((trailer) => (
          <div
            key={trailer.image}
            className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer"
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt="trailer"
              className="rounded-lg w-full h-full object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-5 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
