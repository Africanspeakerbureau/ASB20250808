import React from "react";

interface EditingContextValue {
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
}

const EditingContext = React.createContext<EditingContextValue | undefined>(undefined);

export function EditingProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const startEditing = React.useCallback(() => setIsEditing(true), []);
  const stopEditing = React.useCallback(() => setIsEditing(false), []);
  const value = React.useMemo(
    () => ({ isEditing, startEditing, stopEditing }),
    [isEditing, startEditing, stopEditing]
  );
  return <EditingContext.Provider value={value}>{children}</EditingContext.Provider>;
}

export function useEditing() {
  const ctx = React.useContext(EditingContext);
  if (!ctx) throw new Error("useEditing must be used within an EditingProvider");
  return ctx;
}
