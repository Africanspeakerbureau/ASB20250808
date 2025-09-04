import { useEffect } from "react";

export default function AdminHashRedirect() {
  useEffect(() => {
    window.location.replace("/#/admin");
  }, []);
  return null;
}
