import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wellness Tracker",
    short_name: "Wellness",
    description: "Track daily health habits and improve lifestyle",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#14b8a6",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
