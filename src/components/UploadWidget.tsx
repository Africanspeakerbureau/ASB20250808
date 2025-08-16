import React from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";

type Props = {
  value?: Array<{ url: string; filename?: string }> | null;
  onChange?: (v: Array<{ url: string; filename?: string }> | null) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  label?: string;
  accept?: string;
  maxSizeMb?: number;
};

export default function UploadWidget({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  label = "Upload",
  accept = "image/*",
  maxSizeMb = 5,
}: Props) {
  const [uploading, setUploading] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File too large. Max ${maxSizeMb}MB.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    try {
      setUploading(true);
      onUploadStart?.();
      const uploaded = await uploadToCloudinary(file);
      onChange?.([{ url: uploaded.url, filename: uploaded.filename }]);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Upload failed.");
      onChange?.(value ?? null);
    } finally {
      setUploading(false);
      onUploadEnd?.();
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const current = Array.isArray(value) ? value[0] : null;

  return (
    <div className="upload-widget">
      <input ref={inputRef} type="file" accept={accept} onChange={handlePick} hidden />
      <div className="upload-widget__preview">
        {current?.url ? (
          <img
            src={current.url}
            alt={current.filename || "upload"}
            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
          />
        ) : fileName ? (
          <span>{fileName}</span>
        ) : (
          <span>No file selected</span>
        )}
      </div>
      <button
        type="button"
        className="btn"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Uploading…" : label}
      </button>
    </div>
  );
}

