import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Save the Date · Diego & Andrea",
    short_name: "Diego & Andrea",
    description: "Nos casamos el 1 de agosto de 2027 en Medellín, Colombia.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0806",
    theme_color: "#0a0806",
    icons: [
      { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
