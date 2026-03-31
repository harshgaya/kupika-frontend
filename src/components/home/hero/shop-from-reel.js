"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { BsPlayFill, BsPauseFill, BsCart3 } from "react-icons/bs";

const reels = [
  {
    id: 1,
    video: "/home/reels/reel-1.mp4",
    poster: "/home/reels/poster-1.jpg",
    title: "Kupika Kaam Creator",
    price: "₹1799",
    link: "/product/kaam-creator",
  },
  {
    id: 2,
    video: "/home/reels/reel-2.mp4",
    poster: "/home/reels/poster-2.jpg",
    title: "Kupika Kaam Creator",
    price: "₹1799",
    link: "/product/kaam-creator",
  },
  {
    id: 3,
    video: "/home/reels/reel-3.mp4",
    poster: "/home/reels/poster-3.jpg",
    title: "Kupika Kaam Creator",
    price: "₹1799",
    link: "/product/kaam-creator",
  },
  {
    id: 4,
    video: "/home/reels/reel-4.mp4",
    poster: "/home/reels/poster-4.jpg",
    title: "Kupika Kaam Creator",
    price: "₹1799",
    link: "/product/kaam-creator",
  },
  {
    id: 5,
    video: "/home/reels/reel-5.mp4",
    poster: "/home/reels/poster-5.jpg",
    title: "Kupika Kaam Creator",
    price: "₹1799",
    link: "/product/kaam-creator",
  },
];

function ReelCard({
  reel,
  isPlaying,
  isMuted,
  onPlayPause,
  onToggleMute,
  videoRef,
}) {
  return (
    <div className="flex-none flex flex-col rounded-2xl overflow-hidden shadow-md bg-white w-[200px] md:w-[260px]">
      <div className="relative w-full aspect-[3/4] bg-[#b5ada4] overflow-hidden">
        <video
          ref={videoRef}
          src={reel.video}
          poster={reel.poster}
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={onToggleMute}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-all duration-200"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <FiVolumeX className="text-gray-800 text-base" />
            ) : (
              <FiVolume2 className="text-gray-800 text-base" />
            )}
          </button>
          <button
            onClick={onPlayPause}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-all duration-200"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <BsPauseFill className="text-gray-800 text-base" />
            ) : (
              <BsPlayFill className="text-gray-800 text-base" />
            )}
          </button>
        </div>
      </div>
      <div className="bg-[#1a3d2b] px-4 pt-3 pb-4 flex flex-col gap-3">
        <div>
          <p className="text-white text-sm font-medium leading-tight">
            {reel.title}
          </p>
          <p className="text-white/80 text-sm mt-0.5">{reel.price}</p>
        </div>
        <Link
          href={reel.link}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-gray-100 text-[#1a3d2b] text-sm font-semibold rounded-lg transition-colors duration-200"
        >
          <BsCart3 className="text-base" />
          Buy Now
        </Link>
      </div>
    </div>
  );
}

export default function ShopFromReels() {
  const videoRefs = useRef({});
  const [playingIds, setPlayingIds] = useState(
    () => new Set(reels.map((r) => r.id)),
  );
  const [mutedIds, setMutedIds] = useState(
    () => new Set(reels.map((r) => r.id)),
  );

  useEffect(() => {
    reels.forEach((reel) => {
      const video = videoRefs.current[reel.id];
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  }, []);

  const handlePlayPause = useCallback(
    (id) => {
      const video = videoRefs.current[id];
      if (!video) return;
      if (playingIds.has(id)) {
        video.pause();
        setPlayingIds((prev) => {
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
      } else {
        video.play().catch(() => {});
        setPlayingIds((prev) => new Set(prev).add(id));
      }
    },
    [playingIds],
  );

  const handleToggleMute = useCallback(
    (id) => {
      const video = videoRefs.current[id];
      if (!video) return;
      if (mutedIds.has(id)) {
        reels.forEach((reel) => {
          const v = videoRefs.current[reel.id];
          if (v) v.muted = reel.id !== id;
        });
        setMutedIds(new Set(reels.filter((r) => r.id !== id).map((r) => r.id)));
      } else {
        video.muted = true;
        setMutedIds((prev) => new Set(prev).add(id));
      }
    },
    [mutedIds],
  );

  return (
    <section id="reels" className="w-full py-10 md:py-16 bg-white">
      <div className="text-center mb-8 md:mb-7 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a3d2b] leading-tight font-serif">
          Shop From Our Reels
        </h2>
        <p className="text-gray-500 text-base md:text-lg">
          Swipe through our Latest Products
        </p>
      </div>

      <div
        className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-2
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {reels.map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            isPlaying={playingIds.has(reel.id)}
            isMuted={mutedIds.has(reel.id)}
            onPlayPause={() => handlePlayPause(reel.id)}
            onToggleMute={() => handleToggleMute(reel.id)}
            videoRef={(el) => {
              if (el) videoRefs.current[reel.id] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
