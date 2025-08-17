import React, { useEffect, useRef } from "react";
import { CLOUDINARY } from "@/config/cloudinary";

export function UploadPublic({
  onUploaded,
  onError,
  clientAllowedFormats = ["jpg", "jpeg", "png"],
  maxSizeMB = 5,
  buttonClassName = "btn btn--dark",
  buttonLabel = "Upload",
}) {
  const widgetRef = useRef(null);
  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY.cloudName,
          uploadPreset: CLOUDINARY.uploadPreset,
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
            onUploaded(result.info);
          }
        }
      );
    }
  }, [clientAllowedFormats, maxSizeMB, onUploaded, onError]);

  const open = () => {
    if (widgetRef.current) widgetRef.current.open();
  };

  return (
    <button type="button" className={buttonClassName} onClick={open}>
      {buttonLabel}
    </button>
  );
}

export default UploadPublic;
