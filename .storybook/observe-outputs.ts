import { DestroyRef, ElementRef, inject } from "@angular/core";
import { action } from "storybook/actions";

/** Observe real emissions without replacing the demo's own event handlers. Storybook only. */
export function observeOutputs(
  instance: unknown,
  component: string,
  outputs: Record<string, string>,
): void {
  const destroyRef = inject(DestroyRef);
  const properties = instance as Record<
    string,
    { subscribe: (next: (value: unknown) => void) => { unsubscribe(): void } }
  >;
  for (const [event, property] of Object.entries(outputs)) {
    const subscription = properties[property].subscribe(
      action(component + "." + event),
    );
    destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
export function observeNativeClick(component: string): void {
  const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const handler = action(component + ".click");
  element.addEventListener("click", handler);
  inject(DestroyRef).onDestroy(() =>
    element.removeEventListener("click", handler),
  );
}
