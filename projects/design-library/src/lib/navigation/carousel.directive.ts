import {
  Directive,
  ElementRef,
  DestroyRef,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from "@angular/core";

export interface CarouselChange {
  index: number;
  previousIndex: number;
  total: number;
  source: "api" | "keyboard" | "scroll" | "autoplay" | "drag";
}
/** Apply to a container whose direct element children are slides. No clones or content replacement. */
@Directive({
  selector: "[dlCarousel]",
  exportAs: "dlCarousel",
  standalone: true,
  host: {
    role: "region",
    "aria-roledescription": "carousel",
    "[attr.aria-label]": "ariaLabel()",
    "[attr.aria-disabled]": "disabled() || !dlCarousel() || null",
    "[attr.tabindex]": "disabled() || !dlCarousel() ? -1 : 0",
    "[style.display]": 'dlCarousel() ? "flex" : null',
    "[style.flex-direction]": 'orientation() === "vertical" ? "column" : "row"',
    "[style.flex-wrap]": '"nowrap"',
    "[style.gap.px]": "safeGap()",
    "[style.width]": "width()",
    "[style.height]":
      'orientation() === "vertical" && height() === "auto" ? "320px" : height()',
    "[style.max-width]": '"100%"',
    "[style.min-width]": '"0"',
    "[style.box-sizing]": '"border-box"',
    "[style.overflow-x]":
      '!dlCarousel() ? "visible" : orientation() === "horizontal" && !disabled() ? "auto" : "hidden"',
    "[style.overflow-y]":
      '!dlCarousel() ? "visible" : orientation() === "vertical" && !disabled() ? "auto" : "hidden"',
    "[style.scroll-snap-type]":
      'dlCarousel() ? (orientation() === "vertical" ? "y mandatory" : "x mandatory") : "none"',
    "[style.scrollbar-width]": 'showScrollbar() ? "auto" : "none"',
    "[style.overscroll-behavior-x]": '"contain"',
    "[style.touch-action]":
      'draggable() ? (orientation() === "vertical" ? "pan-x" : "pan-y") : "auto"',
    "(keydown)": "onKey($event)",
    "(scroll)": "onScroll()",
    "(mouseenter)": "hovered.set(true)",
    "(mouseleave)": "hovered.set(false)",
    "(focusin)": "focusWithin.set(true)",
    "(focusout)": "onBlur($event)",
    "(pointerdown)": "startDrag($event)",
    "(pointermove)": "moveDrag($event)",
    "(pointerup)": "endDrag($event)",
    "(pointercancel)": "cancelDrag($event)",
  },
})
export class CarouselDirective {
  readonly dlCarousel = input(true, { transform: booleanAttribute });
  readonly index = model(0);
  readonly slidesPerView = input(1);
  /** Minimum container widths in pixels mapped to whole visible slide counts. */
  readonly breakpoints = input<Record<number, number>>({});
  readonly gap = input(16);
  readonly width = input("100%");
  /** Vertical carousels require a bounded height, e.g. 400px. */
  readonly height = input("auto");
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly step = input(1);
  readonly loop = input(false);
  readonly keyboard = input(true);
  readonly draggable = input(true);
  readonly dragThreshold = input(48);
  readonly disabled = input(false);
  readonly behavior = input<"smooth" | "instant">("smooth");
  readonly showScrollbar = input(false);
  readonly autoplay = input(false);
  readonly interval = input(5000);
  readonly pauseOnHover = input(true);
  readonly pauseOnFocus = input(true);
  readonly ariaLabel = input("Carousel");
  readonly slideLabel = input("Slide");
  readonly slideChange = output<CarouselChange>();
  readonly dragStarted = output<PointerEvent>();
  readonly dragEnded = output<{ event: PointerEvent; moved: boolean }>();
  readonly count = signal(0);
  readonly hovered = signal(false);
  readonly focusWithin = signal(false);
  readonly paused = signal(false);
  private readonly ready = signal(false);
  private readonly childrenRevision = signal(0);
  private readonly viewportWidth = signal(0);
  private readonly viewportHeight = signal(0);
  private readonly reducedMotion = signal(false);
  private readonly hidden = signal(false);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private slides: HTMLElement[] = [];
  private saved = new Map<
    HTMLElement,
    { styles: Map<string, string>; attrs: Map<string, string | null> }
  >();
  private current = 0;
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;
  private dragPointer: number | null = null;
  private dragOrigin = 0;
  private dragPosition = 0;
  readonly safeGap = computed(() => Math.max(0, Number(this.gap()) || 0));
  readonly visibleCount = computed(() => {
    let value = this.slidesPerView();
    for (const [min, amount] of Object.entries(this.breakpoints()).sort(
      (a, b) => Number(a[0]) - Number(b[0]),
    ))
      if (Number(min) <= this.viewportWidth()) value = amount;
    return Math.max(1, Math.floor(Number(value)) || 1);
  });
  readonly maxIndex = computed(() =>
    Math.max(0, this.count() - this.visibleCount()),
  );
  readonly canPrevious = computed(
    () =>
      !this.disabled() &&
      this.dlCarousel() &&
      (this.index() > 0 || (this.loop() && this.maxIndex() > 0)),
  );
  readonly canNext = computed(
    () =>
      !this.disabled() &&
      this.dlCarousel() &&
      (this.index() < this.maxIndex() || (this.loop() && this.maxIndex() > 0)),
  );
  readonly playing = computed(
    () =>
      this.autoplay() &&
      !this.paused() &&
      !this.disabled() &&
      this.dlCarousel() &&
      !this.reducedMotion() &&
      !this.hidden() &&
      !(this.pauseOnHover() && this.hovered()) &&
      !(this.pauseOnFocus() && this.focusWithin()) &&
      this.maxIndex() > 0,
  );

  constructor() {
    afterNextRender(() => {
      const host = this.element.nativeElement;
      const resize = new ResizeObserver(() => this.measure());
      resize.observe(host);
      const mutations = new MutationObserver(() => this.collect());
      mutations.observe(host, { childList: true });
      const motion = matchMedia("(prefers-reduced-motion: reduce)");
      const updateMotion = () => this.reducedMotion.set(motion.matches);
      const visibility = () => this.hidden.set(document.hidden);
      updateMotion();
      visibility();
      motion.addEventListener("change", updateMotion);
      document.addEventListener("visibilitychange", visibility);
      this.collect();
      this.measure();
      this.ready.set(true);
      this.destroyRef.onDestroy(() => {
        resize.disconnect();
        mutations.disconnect();
        motion.removeEventListener("change", updateMotion);
        document.removeEventListener("visibilitychange", visibility);
        clearTimeout(this.scrollTimer);
        for (const slide of this.saved.keys()) this.restore(slide);
      });
    });
    effect(() => {
      this.childrenRevision();
      const ready = this.ready(),
        enabled = this.dlCarousel(),
        count = this.count();
      const perView = this.visibleCount(),
        gap = this.safeGap(),
        vertical = this.orientation() === "vertical";
      const extent = vertical ? this.viewportHeight() : this.viewportWidth();
      const label = this.slideLabel();
      untracked(() => {
        if (!ready) return;
        for (const [i, slide] of this.slides.entries()) {
          if (!enabled) {
            this.restore(slide);
            continue;
          }
          this.remember(slide);
          const length = Math.max(0, (extent - gap * (perView - 1)) / perView);
          slide.style.setProperty("flex", `0 0 ${length}px`);
          slide.style.setProperty("min-width", "0");
          slide.style.setProperty("min-height", "0");
          slide.style.setProperty("box-sizing", "border-box");
          slide.style.setProperty("scroll-snap-align", "start");
          if (!this.saved.get(slide)!.attrs.get("role"))
            slide.setAttribute("role", "group");
          if (!this.saved.get(slide)!.attrs.get("aria-label"))
            slide.setAttribute("aria-label", `${label} ${i + 1} / ${count}`);
        }
        this.navigate(this.index(), "api", "instant");
      });
    });
    effect(() => {
      const index = this.index(),
        ready = this.ready();
      if (ready) untracked(() => this.navigate(index, "api"));
    });
    effect((onCleanup) => {
      const playing = this.playing(),
        delay = Math.max(250, Number(this.interval()) || 5000);
      if (!playing) return;
      const timer = setInterval(() => {
        if (this.current >= this.maxIndex() && !this.loop()) this.pause();
        else this.navigate(this.current + this.increment(), "autoplay");
      }, delay);
      onCleanup(() => clearInterval(timer));
    });
  }
  private remember(slide: HTMLElement): void {
    if (this.saved.has(slide)) return;
    this.saved.set(slide, {
      styles: new Map(
        [
          "flex",
          "min-width",
          "min-height",
          "box-sizing",
          "scroll-snap-align",
        ].map((key) => [key, slide.style.getPropertyValue(key)]),
      ),
      attrs: new Map(
        ["role", "aria-label"].map((key) => [key, slide.getAttribute(key)]),
      ),
    });
  }
  private restore(slide: HTMLElement): void {
    const original = this.saved.get(slide);
    if (!original) return;
    for (const [key, value] of original.styles)
      value
        ? slide.style.setProperty(key, value)
        : slide.style.removeProperty(key);
    for (const [key, value] of original.attrs)
      value === null
        ? slide.removeAttribute(key)
        : slide.setAttribute(key, value);
    this.saved.delete(slide);
  }
  private collect(): void {
    this.slides = Array.from(this.element.nativeElement.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    for (const slide of this.saved.keys())
      if (!this.slides.includes(slide)) this.restore(slide);
    this.count.set(this.slides.length);
    // Reordered or replaced children may have the same count.
    this.childrenRevision.update((value) => value + 1);
  }
  private measure(): void {
    const host = this.element.nativeElement;
    const style = getComputedStyle(host);
    this.viewportWidth.set(
      host.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight),
    );
    this.viewportHeight.set(
      host.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom),
    );
  }
  private increment(): number {
    return Math.max(1, Math.floor(Number(this.step())) || 1);
  }
  next(): void {
    if (this.canNext()) this.navigate(this.current + this.increment(), "api");
  }
  previous(): void {
    if (this.canPrevious())
      this.navigate(this.current - this.increment(), "api");
  }
  goTo(index: number): void {
    if (!this.disabled()) this.navigate(index, "api");
  }
  pause(): void {
    this.paused.set(true);
  }
  play(): void {
    this.paused.set(false);
  }
  private navigate(
    requested: number,
    source: CarouselChange["source"],
    behavior = this.behavior(),
  ): void {
    if (!this.dlCarousel()) return;
    const last = this.maxIndex();
    let next = Math.floor(Number(requested)) || 0;
    if (this.loop() && source !== "scroll")
      next = next > last ? 0 : next < 0 ? last : next;
    next = Math.max(0, Math.min(last, next));
    this.commit(next, source);
    const host = this.element.nativeElement;
    const slide = this.slides[next],
      first = this.slides[0];
    if (!slide || !first) return;
    const target = slide.getBoundingClientRect(),
      origin = first.getBoundingClientRect();
    const scrollBehavior = this.reducedMotion() ? "instant" : behavior;
    if (this.orientation() === "vertical")
      host.scrollTo({ top: target.top - origin.top, behavior: scrollBehavior });
    else
      host.scrollTo({
        left: target.left - origin.left,
        behavior: scrollBehavior,
      });
  }
  private commit(next: number, source: CarouselChange["source"]): void {
    const previousIndex = this.current;
    this.current = next;
    this.index.set(next);
    if (next !== previousIndex)
      this.slideChange.emit({
        index: next,
        previousIndex,
        total: this.count(),
        source,
      });
  }
  onScroll(): void {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if (!this.dlCarousel()) return;
      const host = this.element.nativeElement;
      const first = this.slides[0]?.getBoundingClientRect();
      if (!first) return;
      const vertical = this.orientation() === "vertical";
      const position = vertical ? host.scrollTop : host.scrollLeft;
      let closest = 0,
        distance = Infinity;
      for (let i = 0; i <= this.maxIndex(); i++) {
        const rect = this.slides[i]?.getBoundingClientRect();
        if (!rect) continue;
        const delta = Math.abs(
          (vertical ? rect.top - first.top : rect.left - first.left) - position,
        );
        if (delta < distance) {
          distance = delta;
          closest = i;
        }
      }
      this.commit(closest, "scroll");
    }, 140);
  }
  onKey(event: KeyboardEvent): void {
    if (
      !this.keyboard() ||
      this.disabled() ||
      !this.dlCarousel() ||
      event.target !== this.element.nativeElement ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    const vertical = this.orientation() === "vertical";
    const rtl =
      getComputedStyle(this.element.nativeElement).direction === "rtl";
    const nextKey = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
    let next: number;
    if (event.key === nextKey) next = this.current + this.increment();
    else if (event.key === prevKey) next = this.current - this.increment();
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = this.maxIndex();
    else return;
    event.preventDefault();
    this.navigate(next, "keyboard");
  }
  onBlur(event: FocusEvent): void {
    if (
      !this.element.nativeElement.contains(event.relatedTarget as Node | null)
    )
      this.focusWithin.set(false);
  }
  startDrag(event: PointerEvent): void {
    if (!this.draggable() || this.disabled() || event.button !== 0) return;
    this.dragPointer = event.pointerId;
    this.dragOrigin = this.orientation() === "vertical" ? event.clientY : event.clientX;
    this.dragPosition = this.dragOrigin;
    this.element.nativeElement.setPointerCapture(event.pointerId);
    this.dragStarted.emit(event);
  }
  moveDrag(event: PointerEvent): void {
    if (this.dragPointer !== event.pointerId) return;
    this.dragPosition = this.orientation() === "vertical" ? event.clientY : event.clientX;
  }
  endDrag(event: PointerEvent): void {
    if (this.dragPointer !== event.pointerId) return;
    const distance = this.dragPosition - this.dragOrigin;
    const moved = Math.abs(distance) >= Math.max(8, this.dragThreshold());
    if (moved) this.navigate(this.current + (distance < 0 ? this.increment() : -this.increment()), "drag");
    this.element.nativeElement.releasePointerCapture(event.pointerId);
    this.dragPointer = null;
    this.dragEnded.emit({ event, moved });
  }
  cancelDrag(event: PointerEvent): void {
    if (this.dragPointer !== event.pointerId) return;
    this.dragPointer = null;
    this.dragEnded.emit({ event, moved: false });
  }
}
