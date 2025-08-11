import React from "react";

type Props = {
  onUpload: (files: any[]) => void;
  children: React.ReactElement;
};

// Lightweight wrapper around a native file input. Invokes onUpload with an
// array of selected files (each containing a preview URL and metadata).
export default function UploadWidget({ onUpload, children }: Props) {
  const openNative = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const files = Array.from(input.files || []).map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      }));
      if (files.length) onUpload(files);
    };
    input.click();
  };

  return React.cloneElement(children, { onClick: openNative });
}
