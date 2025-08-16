export default function UploadWidget(props: {
  onUploaded?: (att: { url: string; filename?: string } | null) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  label?: string;
  accept?: string;
  className?: string;
  initialUrl?: string;
}): JSX.Element;
