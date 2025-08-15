import { createContext, useContext, useState } from "react";

const Ctx = createContext<{ isEditing: boolean; setEditing: (v: boolean) => void } | null>(null);

export function EditingProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setEditing] = useState(false);
  return <Ctx.Provider value={{ isEditing, setEditing }}>{children}</Ctx.Provider>;
}

export function useEditing() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEditing outside provider");
  return ctx;
}
