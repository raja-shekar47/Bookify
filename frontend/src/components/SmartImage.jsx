import { useCallback, useState } from "react";
import { ImageOff } from "lucide-react";
import { resolveImageUrl } from "../services/api";

/**
 * Image that fades in on load and degrades to a labelled placeholder
 * instead of a broken-image icon when the file is missing.
 *
 * The <img> is never display:none — a lazily-loaded image with no layout box
 * never intersects the viewport, so the browser would never fetch it and
 * neither onLoad nor onError would fire. While loading it is transparent and
 * carries the skeleton as its own background instead.
 */
const SmartImage = ({ src: rawSrc, alt, className = "", fallbackLabel }) => {
  // Uploaded files are stored as "/uploads/x.jpg" and served by the backend,
  // so they need its origin prefixed before an <img> can load them.
  const src = resolveImageUrl(rawSrc);
  const [status, setStatus] = useState(src ? "loading" : "error");

  // Reset when the src changes (e.g. picking a gallery thumbnail) without an
  // effect — the documented "adjust state during render" pattern.
  const [renderedSrc, setRenderedSrc] = useState(src);
  if (src !== renderedSrc) {
    setRenderedSrc(src);
    setStatus(src ? "loading" : "error");
  }

  // A cached image can finish before React attaches onLoad, in which case no
  // load event ever fires. Check the element directly when it mounts.
  const measure = useCallback((node) => {
    if (node?.complete) {
      setStatus(node.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  if (!src || status === "error") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 ${className}`}
      >
        <ImageOff className="h-6 w-6" />
        <span className="px-3 text-center text-xs font-medium">
          {fallbackLabel || alt || "Photo coming soon"}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={measure}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setStatus("loaded")}
      onError={() => setStatus("error")}
      className={`${className} transition-opacity duration-300 ${
        status === "loading"
          ? "animate-pulse bg-slate-200 opacity-0"
          : "opacity-100"
      }`}
    />
  );
};

export default SmartImage;
