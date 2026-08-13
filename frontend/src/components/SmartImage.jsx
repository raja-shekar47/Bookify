import { useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * Image that fades in on load and degrades to a labelled placeholder
 * instead of a broken-image icon when the file is missing.
 */
const SmartImage = ({ src, alt, className = "", fallbackLabel }) => {
  const [status, setStatus] = useState(src ? "loading" : "error");

  if (status === "error") {
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
    <>
      {status === "loading" && (
        <div className={`animate-pulse bg-slate-200 ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`${className} ${status === "loading" ? "hidden" : ""}`}
      />
    </>
  );
};

export default SmartImage;
