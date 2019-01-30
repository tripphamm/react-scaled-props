export function getViewPortWidth() {
  if (typeof window !== "undefined" && window.innerWidth !== undefined) {
    return window.innerWidth;
  }

  return null;
}

export function getViewPortHeight() {
  if (typeof window !== "undefined" && window.innerHeight !== undefined) {
    return window.innerHeight;
  }

  return null;
}
