import React, { useEffect, useRef } from "react";

export default function UploadPublic({ onUploaded, accept = "image/*", maxSizeMB = 5 }) {
  const widgetRef = useRef(null);
  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "dimtwmk1v",
          uploadPreset: "unsigned_speaker_upload",
          sources: ["local", "url", "camera"],
          multiple: false,
          clientAllowedFormats: accept.replace("*", ""),
          maxFileSize: maxSizeMB * 1024 * 1024,
          folder: "speakers",
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            onUploaded({ url: result.info.secure_url });
          }
        }
      );
    }
  }, [accept, maxSizeMB, onUploaded]);

  const open = () => {
    if (widgetRef.current) widgetRef.current.open();
  };

  return (
    <button type="button" className="btn btn--dark" onClick={open}>
      Upload
    </button>
  );
}
