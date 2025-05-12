// utils/cookies.ts
// utils/cookies.ts
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined; // SSR safety
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()!
      .split(';')
      .shift()
      ?.trim();
  }
  return undefined;
}

export function setCookie(
  name: string, 
  value: string, 
  options: { days?: number; path?: string } = {}
) {
  const { days = 7, path = '/' } = options;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=${path}`;
}