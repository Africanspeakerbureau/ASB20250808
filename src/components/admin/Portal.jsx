import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children, rootId = "asb-admin-portal" }) {
  const [host, setHost] = useState(null);

  useEffect(() => {
    let node = document.getElementById(rootId);
    if (!node) {
      node = document.createElement("div");
      node.id = rootId;
      document.body.appendChild(node);
    }
    setHost(node);
    return () => {
      // leave the node in place so subsequent modals reuse it
      // remove if you prefer cleanup:
      // if (node && node.childNodes.length === 0) node.remove();
    };
  }, [rootId]);

  if (!host) return null;
  return createPortal(children, host);
}
