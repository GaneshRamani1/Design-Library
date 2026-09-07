import {
  inject,
  Injectable,
  InjectionToken,
  type Provider,
} from "@angular/core";
import {
  Check,
  X,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Info,
  CircleCheck,
  TriangleAlert,
  CircleX,
  Bell,
  Search,
  Settings,
  Heart,
  Menu,
  LoaderCircle,
  Ellipsis,
  ArrowRight,
  Star,
  CircleHelp,
  type LucideIconData,
} from "@lucide/icons";
export type IconData = LucideIconData;
export type IconCollection = Readonly<Record<string, IconData>>;
export const DEFAULT_ICONS: IconCollection = {
  check: Check,
  x: X,
  plus: Plus,
  minus: Minus,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  calendar: Calendar,
  info: Info,
  "circle-check": CircleCheck,
  "triangle-alert": TriangleAlert,
  "circle-x": CircleX,
  bell: Bell,
  search: Search,
  settings: Settings,
  heart: Heart,
  menu: Menu,
  "loader-circle": LoaderCircle,
  ellipsis: Ellipsis,
  "arrow-right": ArrowRight,
  star: Star,
  "circle-help": CircleHelp,
};
export const DL_ICONS = new InjectionToken<IconCollection[]>(
  "Arcwell icon collections",
);
export function provideIcons(...collections: IconCollection[]): Provider[] {
  return collections.map((useValue) => ({
    provide: DL_ICONS,
    multi: true,
    useValue,
  }));
}
@Injectable({ providedIn: "root" })
export class IconRegistry {
  private readonly icons = Object.assign(
    {},
    DEFAULT_ICONS,
    ...(inject(DL_ICONS, { optional: true }) ?? []),
  ) as Record<string, IconData>;
  get(name: string): IconData | undefined {
    return this.icons[name];
  }
  get names(): string[] {
    return Object.keys(this.icons).sort();
  }
}
