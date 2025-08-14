import React from "react";
import { UploadPublic } from "@/components/upload/UploadPublic.jsx"; // same uploader as apply-v2

export default function ImageUploadField({
  label = "Image",
  valueUrl,
  onChange, // (url, meta) => void
  help = "JPG/PNG, max 5MB",
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full text-left font-medium text-slate-800">{label}</div>

      {/* Preview (square thumb) */}
      {valueUrl ? (
        <img
          src={valueUrl}
          alt="Uploaded"
          className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200"
        />
      ) : (
        <div className="h-16 w-16 rounded-lg bg-slate-100 ring-1 ring-slate-200" />
      )}

      {/* Centered Upload button */}
      <UploadPublic
        accept="image/*"
        clientAllowedFormats={["jpg", "jpeg", "png"]}
        maxSizeMB={5}
        buttonClassName="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80"
        onUploaded={({ url, width, height, format, originalFilename }) => {
          onChange(url, { width, height, format, name: originalFilename });
        }}
      />

      <div className="text-xs text-slate-500">{help}</div>
      {valueUrl && (
        <div className="text-xs text-emerald-600 font-medium">Uploaded ✓</div>
      )}
    </div>
  );
}

