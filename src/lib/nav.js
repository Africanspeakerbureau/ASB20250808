export function getAdminHref() {
  const raw = import.meta.env.VITE_ADMIN_URL?.trim();
  return raw && raw.length ? raw : '/admin';
}

export function adminLinkProps(href) {
  return /^https?:\/\//i.test(href)
    ? { target: '_blank', rel: 'noopener' }
    : {};
}
