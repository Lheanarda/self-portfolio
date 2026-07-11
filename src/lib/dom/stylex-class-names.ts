export function classTokens(className: string) {
  return className.split(/\s+/).filter(Boolean);
}

export function addClassNames(element: Element, className: string) {
  const tokens = classTokens(className);
  if (tokens.length > 0) element.classList.add(...tokens);
}

export function removeClassNames(element: Element, className: string) {
  const tokens = classTokens(className);
  if (tokens.length > 0) element.classList.remove(...tokens);
}
