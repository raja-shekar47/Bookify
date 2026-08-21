import { useRef, useState } from "react";
import { Link2, Loader2, Trash2, Upload } from "lucide-react";
import API, { getErrorMessage } from "../services/api";
import SmartImage from "./SmartImage";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Image picker offering both ways of supplying a photo:
 *   - Upload  → POSTs the file to /api/uploads, stores "/uploads/name.jpg"
 *   - Link    → stores the pasted https:// URL as-is
 *
 * Either way the parent just receives a string through onChange.
 */
const ImageField = ({ value, onChange, label = "Photo", hint }) => {
  // Start on whichever tab matches the value we already have.
  const [mode, setMode] = useState(
    value && !/^https?:/i.test(value) ? "upload" : "url",
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is larger than 5 MB. Please pick a smaller one.");
      return;
    }

    const body = new FormData();
    body.append("image", file);

    try {
      setUploading(true);
      setError("");

      // Let the browser set the multipart boundary itself.
      const { data } = await API.post("/uploads", body, {
        headers: { "Content-Type": undefined },
      });

      onChange(data.url);
    } catch (err) {
      setError(getErrorMessage(err, "Upload failed. Please try again."));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const tabClass = (key) =>
    `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
      mode === key
        ? "bg-white text-slate-900 shadow-sm"
        : "text-slate-500 hover:text-slate-800"
    }`;

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>

        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={tabClass("upload")}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload file
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={tabClass("url")}
          >
            <Link2 className="h-3.5 w-3.5" />
            Paste URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFile}
            disabled={uploading}
            className="block w-full text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700 disabled:opacity-50"
          />
          <p className="mt-2 text-xs text-slate-500">
            {uploading ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-brand-700">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading…
              </span>
            ) : (
              "JPG, PNG, WebP or AVIF · up to 5 MB"
            )}
          </p>
        </div>
      ) : (
        <input
          type="url"
          value={/^https?:/i.test(value || "") ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          className="field-input"
        />
      )}

      {hint && mode === "url" && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}

      {error && (
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {error}
        </p>
      )}

      {/* Preview of whatever is currently set */}
      {value && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
          <SmartImage
            src={value}
            alt="Selected"
            fallbackLabel="Can't load"
            className="h-16 w-24 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-700">
              {value.startsWith("/uploads/") ? "Uploaded file" : "Linked image"}
            </p>
            <p className="truncate text-xs text-slate-500" title={value}>
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label="Remove image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageField;
