import React from "react";

const videoLinks = [
  "https://www.youtube.com/watch?v=hfNuYlyCq2o",
  "https://www.youtube.com/watch?v=w0CNirsdFKs",
  "https://www.youtube.com/watch?v=2XhlshGwPLw&t=109s",
];

const getEmbedUrl = (url) => {
  const videoId = new URL(url).searchParams.get("v");
  return `https://www.youtube.com/embed/${videoId}`;
};

const ProductReviewVideos = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-15 text-center">
      <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
        Social Proof from YouTube Reviews
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm  sm:text-base">
        Hear directly from our satisfied customers through their YouTube
        reviews.
      </p>

      <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoLinks.map((link, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden border bg-white shadow-sm"
          >
            {/* Responsive YouTube iframe */}
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src={getEmbedUrl(link)}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={`YouTube video ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviewVideos;
