import React, { useEffect, useRef } from "react";

export function UploadPublic({
  onUploaded,
  onError,
  clientAllowedFormats = ["jpg", "jpeg", "png"],
  maxSizeMB = 5,
}) {
  const widgetRef = useRef(null);
  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "dimtwmk1v",
          uploadPreset: "unsigned_speaker_upload",
          sources: ["local", "url", "camera"],
          multiple: false,
          clientAllowedFormats,
          maxFileSize: maxSizeMB * 1024 * 1024,
          folder: "speakers",
        },
        (error, result) => {
          if (error) {
            onError?.(error);
          } else if (result && result.event === "success") {
            onUploaded({
              url: result.info.secure_url,
              width: result.info.width,
              height: result.info.height,
              format: result.info.format,
              originalFilename: result.info.original_filename,
            });
          }
        }
      );
    }
  }, [clientAllowedFormats, maxSizeMB, onUploaded, onError]);

  const open = () => {
    if (widgetRef.current) widgetRef.current.open();
  };

  return (
    <button type="button" className="btn btn--dark" onClick={open}>
      Upload
    </button>
  );
}

export default UploadPublic;
