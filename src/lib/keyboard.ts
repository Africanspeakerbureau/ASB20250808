export function isTypingTarget(el: any) {
  return !!el && (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    (el as any).isContentEditable
  );
}

export function ignoreWhenTyping(handler: (e: KeyboardEvent) => void) {
  return (e: KeyboardEvent) => {
    if (isTypingTarget(e.target as any)) return;
    handler(e);
  };
}
