import React from "react";
import { uploadImage } from "@/lib/uploadCloudinary";

type Props = {
  value?: Array<{ url: string; filename?: string }> | null;
  onChange?: (v: Array<{ url: string; filename?: string }> | null) => void;
  label?: string;
  accept?: string;
  maxSizeMb?: number;
  onBusy?: (busy: boolean) => void;
};

export default function UploadWidget({ value, onChange, label = "Upload", accept = "image/*", maxSizeMb = 5, onBusy }: Props) {
  const [busy, setBusy] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File too large. Max ${maxSizeMb}MB.`);
      e.currentTarget.value = "";
      return;
    }
    try {
      setBusy(true);
      onBusy?.(true);
      const uploaded = await uploadImage(file);
      onChange?.([{ url: uploaded.url, filename: uploaded.filename }]);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Upload failed");
      onChange?.(value ?? null);
    } finally {
      setBusy(false);
      onBusy?.(false);
      e.currentTarget.value = "";
    }
  }

  return (
    <div className="upload-widget">
      {fileName && <div className="upload-widget__file">{fileName}</div>}
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={handlePick}
        style={{ display: "none" }}
      />
      <button type="button" className="btn" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? "Uploading…" : label}
      </button>
    </div>
  );
}
