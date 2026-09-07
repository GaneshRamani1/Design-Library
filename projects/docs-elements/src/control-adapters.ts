import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DropdownComponent, SegmentedButtonsComponent, TabComponent, TabContainerComponent, ToggleComponent } from "@arcwell/ui";

interface ControlOption { value: string; label: string; }

@Component({
  selector: "docs-toggle-adapter",
  standalone: true,
  imports: [FormsModule, ToggleComponent],
  template: `<dl-toggle [label]="label" [showLabel]="showLabel" [disabled]="disabled" [ngModel]="value" (ngModelChange)="update($event)" />`,
})
export class DocsToggleAdapter {
  @Input() label = "Toggle setting";
  @Input() showLabel = false;
  @Input() disabled = false;
  @Input() value = false;
  @Output() valueChange = new EventEmitter<boolean>();
  update(value: boolean): void { this.value = value; this.valueChange.emit(value); }
}

@Component({
  selector: "docs-dropdown-adapter",
  standalone: true,
  imports: [FormsModule, DropdownComponent],
  template: `<dl-dropdown [id]="id" [label]="label" [options]="options" [ngModel]="value" (ngModelChange)="update($event)" />`,
})
export class DocsDropdownAdapter {
  @Input() id = "docs-control";
  @Input() label = "Select value";
  @Input() options: ControlOption[] = [];
  @Input() value = "";
  @Output() valueChange = new EventEmitter<string>();
  update(value: string): void { this.value = value; this.valueChange.emit(value); }
}

@Component({
  selector: "docs-segmented-adapter",
  standalone: true,
  imports: [FormsModule, SegmentedButtonsComponent],
  template: `<dl-segmented-buttons [id]="id" [label]="label" [showLabel]="showLabel" [orientation]="orientation" [options]="options" [ngModel]="selection" (ngModelChange)="update($event)" />`,
})
export class DocsSegmentedAdapter {
  @Input() id = "docs-segmented";
  @Input() label = "Choose a value";
  @Input() showLabel = true;
  @Input() orientation: "horizontal" | "vertical" = "vertical";
  @Input() options: ControlOption[] = [];
  private currentValue = "";
  selection: string[] = [];
  @Input() set value(value: string) {
    this.currentValue = value;
    this.selection = value ? [value] : [];
  }
  get value(): string { return this.currentValue; }
  @Output() valueChange = new EventEmitter<string>();
  update(value: string[]): void {
    this.selection = value;
    this.currentValue = value[0] ?? "";
    this.valueChange.emit(this.currentValue);
  }
}

@Component({
  selector: "docs-tabs-adapter",
  standalone: true,
  imports: [TabComponent, TabContainerComponent],
  template: `<dl-tab-container label="Documentation sections" [value]="value" [stretch]="true" [panelPadding]="'0'" (valueChange)="update($event)">@for (option of options; track option.value) { <dl-tab [value]="option.value" [label]="option.label" /> }</dl-tab-container>`,
})
export class DocsTabsAdapter {
  @Input() options: ControlOption[] = [];
  @Input() value = "overview";
  @Output() valueChange = new EventEmitter<string>();
  update(value: string | null): void { if (value) { this.value = value; this.valueChange.emit(value); } }
}
