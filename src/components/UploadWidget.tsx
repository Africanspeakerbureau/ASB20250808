import React from "react";
import { CLOUDINARY } from "@/config/cloudinary";

type Props = {
  onUpload: (files: any[]) => void;
  children: React.ReactElement;
  onUploadingChange?: (uploading: boolean) => void;
};

// Uploads a file to Cloudinary and returns the attachment shape expected by Airtable
export default function UploadWidget({ onUpload, children, onUploadingChange }: Props) {
  const openNative = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        onUploadingChange?.(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY.uploadPreset);
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/auto/upload`;
        const res = await fetch(uploadUrl, { method: "POST", body: formData });
        const result = await res.json();
        const { secure_url, original_filename, bytes, resource_type, format } = result;
        const attachment = [{
          url: secure_url,
          filename: `${original_filename}.${format ?? ""}`.replace(/\.$/, ""),
          type: resource_type === "image" ? "image/*" : "application/octet-stream",
          size: bytes,
        }];
        onUpload(attachment);
      } catch (e) {
        console.error("Upload failed", e);
      } finally {
        onUploadingChange?.(false);
      }
    };
    input.click();
  };

  return React.cloneElement(children, { onClick: openNative });
}
