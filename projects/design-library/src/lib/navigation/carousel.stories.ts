import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { CarouselDirective } from "./carousel.directive";
import { CardComponent } from "../card.component";
import { TilesComponent } from "../data-display/tiles.component";
import { InputComponent } from "../input.component";
import { ButtonComponent } from "../button.component";
const controls = `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:20px"><button dlButton variant="secondary" [disabled]="!carousel.canPrevious()" (click)="carousel.previous()">Previous</button><span role="status" [attr.aria-live]="carousel.playing()?'off':'polite'">@if(carousel.count()){Position {{carousel.index()+1}} of {{carousel.maxIndex()+1}}} @else {No slides}</span><button dlButton variant="secondary" [disabled]="!carousel.canNext()" (click)="carousel.next()">Next</button><button dlButton variant="ghost" (click)="carousel.goTo(0)">First</button>@if(carousel.autoplay()){<button dlButton (click)="carousel.paused()?carousel.play():carousel.pause()">{{carousel.paused()?'Resume rotation':'Pause rotation'}}</button>}</div>`;
const cards = `@for (item of items; track item) {<dl-card [heading]="'Project '+item" description="A reusable card inside the carousel."><p>Compose your own content and actions.</p><button dlButton variant="secondary">Open project {{item}}</button></dl-card>}`;
const meta: Meta<CarouselDirective> = {
  id: "navigation-carousel-directive",
  title: "Navigation/Carousel directive/Variations",
  component: CarouselDirective,
  decorators: [
    moduleMetadata({
      imports: [
        CarouselDirective,
        CardComponent,
        TilesComponent,
        ButtonComponent,
        InputComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  args: {
    dlCarousel: true,
    ariaLabel: "Featured projects",
    slidesPerView: 1,
    gap: 16,
    behavior: "smooth",
    index: 0,
    breakpoints: {},
    width: "100%",
    height: "auto",
    orientation: "horizontal",
    step: 1,
    loop: false,
    keyboard: true,
    disabled: false,
    showScrollbar: false,
    autoplay: false,
    interval: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    slideLabel: "Slide",
  },
  render: (args) => ({
    props: { ...args, items: [1, 2, 3, 4, 5] },
    template: `<div style="width:min(760px,100%);min-width:0"><div #carousel="dlCarousel" ${argsToTemplate(args)}>${cards}</div>${controls}</div>`,
  }),
};
export default meta;
type Story = StoryObj<CarouselDirective>;
export const Default: Story = {
  parameters: {
    storyNote:
      "Every direct child is a slide. Swipe or scroll the cards, use Previous/Next, or focus the carousel and press arrow keys, Home or End. Buttons inside each card keep their normal behavior.",
  },
};
export const Responsive: Story = {
  args: { breakpoints: { 0: 1, 540: 2, 720: 3 } },
  parameters: {
    storyNote:
      "The number of visible cards follows the container width: one below 540px, two from 540px and three from 720px. Resize the preview to try it.",
  },
};
export const Tiles: Story = {
  args: {
    breakpoints: { 0: 1, 540: 2, 720: 3 },
    ariaLabel: "Dashboard metrics",
  },
  render: (args) => ({
    props: {
      ...args,
      items: [
        { label: "Revenue", value: "$24,800" },
        { label: "Customers", value: "1,284" },
        { label: "Conversion", value: "4.8%" },
        { label: "Retention", value: "92%" },
      ],
    },
    template: `<div style="width:min(760px,100%);min-width:0"><div #carousel="dlCarousel" ${argsToTemplate(args)}> @for(item of items;track item.label){<dl-tiles prefix="" [label]="item.label" [value]="item.value" trend="12.4%" [series]="[2,4,3,6,8]"/>}</div>${controls}</div>`,
  }),
  parameters: {
    storyNote:
      "Existing analytics tiles become slides without changes to their markup. Use the same directive with cards, panels, images, or wrappers containing several components.",
  },
};
export const Vertical: Story = {
  args: { orientation: "vertical", height: "440px", slidesPerView: 2 },
  parameters: {
    storyNote:
      "A bounded vertical carousel with two cards visible. Scroll vertically or focus the container and use Arrow Up/Down. Height defaults to 320px when vertical and otherwise unspecified.",
  },
};
export const Loop: Story = {
  args: { loop: true },
  parameters: {
    storyNote:
      "Previous at the first position wraps to the last; Next at the last wraps to the first. Slides are never cloned, preserving component state and unique IDs.",
  },
};
export const Autoplay: Story = {
  args: { autoplay: true, interval: 2500, loop: true },
  render: (args) => ({
    props: { ...args, items: [1, 2, 3, 4, 5] },
    template: `<div style="width:min(760px,100%);min-width:0"><div #carousel="dlCarousel" ${argsToTemplate(args)}>${cards}</div>${controls}</div>`,
  }),
  parameters: {
    storyNote:
      "Opt-in autoplay advances every 2.5 seconds. Pause/resume with the button; hovering or focusing slide content pauses by default. Reduced-motion preferences and hidden tabs always pause rotation.",
  },
};
export const RightToLeft: Story = {
  render: (args) => ({
    props: { ...args, items: [1, 2, 3, 4, 5] },
    template: `<div dir="rtl" style="width:min(760px,100%);min-width:0"><div #carousel="dlCarousel" ${argsToTemplate(args)}>${cards}</div>${controls}</div>`,
  }),
  parameters: {
    storyNote:
      "Native RTL scrolling reverses the horizontal direction. Arrow Left advances and Arrow Right goes back when the carousel itself is focused.",
  },
};
export const DynamicSlides: Story = {
  render: (args) => ({
    props: { ...args, items: [1, 2, 3] },
    template: `<div style="width:min(760px,100%);min-width:0"><div #carousel="dlCarousel" ${argsToTemplate(args)}>${cards}</div>${controls}<div style="display:flex;gap:12px;margin-top:16px"><button dlButton (click)="items=[...items,items.length+1]">Add slide</button><button dlButton (click)="items=items.slice(0,-1)">Remove slide</button></div><p>Slide count: {{carousel.count()}}</p></div>`,
  }),
  parameters: {
    storyNote:
      "Add and remove projected components. The directive observes direct children, recalculates positions, and clamps the active index when the current slide is removed.",
  },
};
export const CustomPagination: Story = {
  render: (args) => ({
    props: { ...args, items: [1, 2, 3, 4, 5] },
    template: `<div style="width:min(760px,100%);min-width:0"><div #carousel="dlCarousel" ${argsToTemplate(args)}>${cards}</div><nav aria-label="Carousel pagination" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:20px">@for(item of items;track item;let i=$index){<button dlButton [variant]="carousel.index()===i?'primary':'secondary'" [attr.aria-current]="carousel.index()===i?'true':null" [attr.aria-label]="'Go to slide '+item" (click)="carousel.goTo(i)">{{item}}</button>}</nav></div>`,
  }),
  parameters: {
    storyNote:
      "Build your own pagination with the exported directive. goTo(index), next(), previous(), pause() and play() work with the library’s buttons or your own controls.",
  },
};

export const MixedContent: Story = {
  render: (args) => ({
    props: { ...args },
    template: `<div style="width:min(760px,100%);min-width:0"><div #carousel="dlCarousel" ${argsToTemplate(args)}><dl-card heading="Editable content"><dl-input id="carousel-project-name" label="Project name" placeholder="Your edits stay on this slide"/></dl-card><figure style="margin:0"><svg viewBox="0 0 640 300" role="img" aria-label="Abstract mountain landscape" style="display:block;width:100%;height:100%;max-height:300px;background:#18181b;border-radius:16px"><path d="M0 300 230 50 410 300Z" fill="#a78bfa"/><path d="M220 300 440 110 640 300Z" fill="#6d28d9"/><circle cx="530" cy="60" r="25" fill="#fafafa"/></svg></figure><dl-tiles prefix="" label="Completion" value="82%" [showProgress]="true" [progress]="82"/></div>${controls}</div>`,
  }),
  parameters: {
    storyNote:
      "A form card, an illustration, and an analytics tile share one carousel. Existing components stay mounted as you navigate, preserving typed values and component state.",
  },
};
