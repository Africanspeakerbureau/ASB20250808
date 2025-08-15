export function ignoreWhenTyping(handler: (e: KeyboardEvent) => void) {
  return function (e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    handler(e);
  };
}
