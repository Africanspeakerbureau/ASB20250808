// Lightweight wrapper; mirrors the public form's uploader UX.
// Expects VITE_UPLOADCARE_PUBLIC_KEY to be set (already used on the site).
export default function UploadWidget({ value, onChange, note }) {
  const openNative = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      // For now, store the File object. In the save patch, we'll upload and persist URL.
      onChange({ name: file.name, size: file.size, type: file.type, _file: file });
    };
    input.click();
  };

  return (
    <div className="border border-dashed rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {value?.name ? <span className="font-medium">{value.name}</span> : <span>No file selected</span>}
          {note ? <div className="text-neutral-500">{note}</div> : null}
        </div>
        <div className="flex gap-2">
          {value ? (
            <button className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200"
              onClick={()=>onChange(null)}>Remove</button>
          ) : null}
          <button className="px-3 py-2 rounded-lg bg-neutral-900 text-white" onClick={openNative}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
