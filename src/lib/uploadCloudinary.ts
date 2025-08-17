import { CLOUDINARY } from "@/config/cloudinary";

export async function uploadImage(file: File) {
  const { cloudName, uploadPreset } = CLOUDINARY;
  if (!cloudName || !uploadPreset || uploadPreset === "REPLACE_WITH_YOUR_EXISTING_PRESET") {
    throw new Error("Cloudinary config missing. Set uploadPreset in src/config/cloudinary.ts to the SAME one the public form uses.");
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
  const json = await res.json();
  return { url: json.secure_url as string, filename: `${json.public_id}.${json.format}` };
}
