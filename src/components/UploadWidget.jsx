import React from "react";
import { toast } from "@/lib/toast";

/**
 * UploadWidget
 * - Uploads to Cloudinary (unsigned) using env config
 * - Calls `onUploaded({ url, filename, width, height })`
 * - Shows a tiny preview and “Uploading…” state
 */
export default function UploadWidget({
  onUploaded,
  label = "Upload",
  accept = "image/*",
  className = "",
  onUploadStart,
  onUploadEnd,
  initialUrl = "",
}) {
  const inputRef = React.useRef(null);
  const [preview, setPreview] = React.useState(initialUrl);
  React.useEffect(() => {
    setPreview(initialUrl);
  }, [initialUrl]);
  const [uploading, setUploading] = React.useState(false);

  const handlePick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  async function uploadToCloudinary(file) {
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) {
      throw new Error(
        "Cloudinary env missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
      );
    }
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`, {
      method: "POST",
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json?.secure_url) {
      throw new Error(json?.error?.message || "Cloudinary upload failed");
    }
    return json;
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local preview right away
    const local = URL.createObjectURL(file);
    setPreview(local);
    setUploading(true);
    onUploadStart?.();
    try {
      const uploaded = await uploadToCloudinary(file);
      // Hand back a proper attachment-like object
      onUploaded?.({
        url: uploaded.secure_url,
        filename: file.name,
        width: uploaded.width,
        height: uploaded.height,
        public_id: uploaded.public_id,
        format: uploaded.format,
      });
      // Swap preview to real URL to avoid confusion
      setPreview(uploaded.secure_url);
      toast("Image uploaded");
    } catch (err) {
      console.error("[UploadWidget] upload failed", err);
      toast(err?.message || "Upload failed");
      // Reset value on failure so form won't try to save a blob:
      onUploaded?.(null);
      setPreview("");
    } finally {
      setUploading(false);
      onUploadEnd?.();
      // Reset input so same file can be selected again if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`upload ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onFile}
        hidden
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              background: "#f1f3f5",
              display: "inline-block",
            }}
          />
        )}
        <button
          type="button"
          className="btn"
          onClick={handlePick}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : label}
        </button>
      </div>
    </div>
  );
}

