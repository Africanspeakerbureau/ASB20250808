// Centralized so public + admin use the same values.
// The cloud name is already hard-coded elsewhere as "dimtwmk1v". Put the SAME upload preset you use on the public form here.
export const CLOUDINARY = {
  cloudName: "dimtwmk1v",
  uploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
    (window as any).__ASB_UPLOAD_PRESET ||  // if you set it globally
    "REPLACE_WITH_YOUR_EXISTING_PRESET",    // <-- set once, both sides will work
};
