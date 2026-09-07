export async function setCustomElementProperties(element: HTMLElement | null, properties: Record<string, unknown>) {
  if (!element) return;
  await customElements.whenDefined(element.localName);
  for (const [name, value] of Object.entries(properties)) {
    if (Object.prototype.hasOwnProperty.call(element, name)) delete (element as unknown as Record<string, unknown>)[name];
    (element as unknown as Record<string, unknown>)[name] = value;
  }
}
