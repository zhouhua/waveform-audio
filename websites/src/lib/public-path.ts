export function normalizeBasePath(basePath = import.meta.env.BASE_URL) {
  const trimmed = basePath.trim();

  if (!trimmed || trimmed === '/') {
    return '/';
  }

  const prefixed = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return prefixed.endsWith('/') ? prefixed : `${prefixed}/`;
}

export function withBasePath(pathname: string, basePath = import.meta.env.BASE_URL) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const cleanPathname = pathname.replace(/^\/+/, '');

  return `${normalizedBasePath}${cleanPathname}`;
}
