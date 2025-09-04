export async function validateAdmin(_username: string, password: string): Promise<boolean> {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD;
  // username is ignored (as before); only the password matters
  return Boolean(expected) && password === expected;
}
