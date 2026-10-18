export function findElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`#${id} element not found`);
  return element;
}
