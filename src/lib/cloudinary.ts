// Centralized Cloudinary config + upload helper with fallbacks to match frontend vars
export function getCloudinaryEnv() {
  const CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ||
    import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME ||
    import.meta.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
    import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    import.meta.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET ||
    import.meta.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return { CLOUD_NAME, UPLOAD_PRESET };
}

export async function uploadToCloudinary(file: File) {
  const { CLOUD_NAME, UPLOAD_PRESET } = getCloudinaryEnv();
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary env missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET (or compatible fallbacks)."
    );
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}). ${text}`);
  }
  const json = await res.json();
  // Normalize to the Airtable attachment shape we send later
  return {
    url: json.secure_url as string,
    filename: (json.original_filename || file.name) + (json.format ? `.${json.format}` : ""),
    bytes: json.bytes,
    publicId: json.public_id,
  };
}

