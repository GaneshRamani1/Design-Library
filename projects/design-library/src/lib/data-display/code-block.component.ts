import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { Appearance } from "../shared/appearance";

export interface CodeToken {
  value: string;
  kind:
    | "plain"
    | "comment"
    | "string"
    | "tag"
    | "binding"
    | "keyword"
    | "punctuation";
}

const tokenPattern =
  /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[A-Za-z][\w-]*|\[[\w.-]+\]|\([\w.-]+\)|\b(?:true|false|null|undefined|const|let|import|from|export|class|return|new)\b|[{}=<>])/g;

function tokenKind(value: string): CodeToken["kind"] {
  if (
    value.startsWith("<!--") ||
    value.startsWith("/*") ||
    value.startsWith("//")
  )
    return "comment";
  if (value.startsWith('"') || value.startsWith("'")) return "string";
  if (value.startsWith("<")) return "tag";
  if (value.startsWith("[") || value.startsWith("(")) return "binding";
  if (
    /^(true|false|null|undefined|const|let|import|from|export|class|return|new)$/.test(
      value,
    )
  )
    return "keyword";
  return "punctuation";
}

function tokenize(line: string): CodeToken[] {
  const result: CodeToken[] = [];
  let cursor = 0;
  for (const match of line.matchAll(tokenPattern)) {
    const index = match.index ?? 0;
    if (index > cursor)
      result.push({ value: line.slice(cursor, index), kind: "plain" });
    result.push({ value: match[0], kind: tokenKind(match[0]) });
    cursor = index + match[0].length;
  }
  if (cursor < line.length)
    result.push({ value: line.slice(cursor), kind: "plain" });
  return result.length ? result : [{ value: " ", kind: "plain" }];
}

/** A responsive, copyable code surface with lightweight syntax highlighting. */
@Component({
  selector: "dl-code-block",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-theme]": "theme()",
    "[attr.data-wrap]": "wrap()",
    "[style.--dl-code-max-height]": "maxHeight()",
    "[attr.data-collapsed]": "collapsible() && !expanded() || null",
  },
  template: `
    @if (showHeader()) {
      <header>
        <span>{{ filename() || label() || language() }}</span>
        <nav aria-label="Code actions">
          @if (collapsible()) {
            <button
              type="button"
              (click)="toggleExpanded()"
              [attr.aria-expanded]="expanded()"
            >
              {{ expanded() ? collapseLabel() : expandLabel() }}
            </button>
          }
          @if (downloadable()) {
            <button type="button" (click)="download()">
              {{ downloadLabel() }}
            </button>
          }
          @if (playgroundLink()) {
            <button type="button" (click)="openPlayground()">
              {{ playgroundLabel() }}
            </button>
          }
          @if (copyable()) {
            <button
              type="button"
              (click)="copy()"
              [attr.aria-label]="copyAriaLabel()"
            >
              {{ copiedState() ? copiedLabel() : copyLabel() }}
            </button>
          }
        </nav>
      </header>
    }
    @if (!collapsible() || expanded()) {
      <pre
        [attr.aria-label]="ariaLabel()"
        [class.line-numbers]="lineNumbers()"
      ><code>@for (line of lines(); track $index) {<span class="line">@if (lineNumbers()) {<span class="number" aria-hidden="true">{{ $index + 1 }}</span>}<span class="source">@for (token of line; track $index) {<span [class]="'token ' + token.kind">{{ token.value }}</span>}</span></span>}</code></pre>
    }
    <span class="copy-status" aria-live="polite">{{ status() }}</span>
  `,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, 14px);
        background: var(--dl-ui-background, #090909);
        color: var(--dl-ui-color, #d4d4d8);
        box-shadow: var(--dl-ui-shadow, none);
        font-family: var(
          --dl-code-font,
          ui-monospace,
          SFMono-Regular,
          Menlo,
          Monaco,
          Consolas,
          monospace
        );
      }
      header {
        min-height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 0 14px;
        border-bottom: 1px solid var(--dl-ui-border-color, var(--dl-border));
        font: 600 10px/1 var(--dl-font, sans-serif);
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--dl-muted, #a1a1aa);
      }
      nav {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      button {
        min-height: 30px;
        padding: 0 4px;
        border: 0;
        background: transparent;
        color: inherit;
        font: 600 11px var(--dl-font, sans-serif);
        cursor: pointer;
        text-transform: none;
        letter-spacing: 0;
      }
      button:hover {
        color: var(--dl-text, #fff);
      }
      button:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: 2px;
        border-radius: 4px;
      }
      pre {
        max-height: var(--dl-code-max-height, none);
        margin: 0;
        padding: var(--dl-ui-padding, 18px);
        overflow: auto;
        font: var(--dl-ui-font-size, 13px)/1.65
          var(
            --dl-code-font,
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace
          );
        tab-size: 2;
      }
      .line {
        display: flex;
        min-width: max-content;
      }
      .source {
        white-space: pre;
      }
      .number {
        position: sticky;
        left: 0;
        flex: 0 0 3ch;
        margin-right: 16px;
        color: #52525b;
        text-align: right;
        user-select: none;
        background: var(--dl-ui-background, #090909);
      }
      :host([data-wrap="true"]) .line {
        min-width: 0;
      }
      :host([data-wrap="true"]) .source {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      .comment {
        color: #71717a;
      }
      .string {
        color: #86efac;
      }
      .tag {
        color: #7dd3fc;
      }
      .binding {
        color: #c4b5fd;
      }
      .keyword {
        color: #f0abfc;
      }
      .punctuation {
        color: #a1a1aa;
      }
      :host([data-theme="light"]) {
        --dl-ui-background: #f8fafc;
        --dl-ui-color: #27272a;
        --dl-ui-border-color: #d4d4d8;
      }
      .copy-status {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
      }
      @media (max-width: 600px) {
        header {
          padding-inline: 12px;
        }
        pre {
          padding: 14px;
          font-size: 12px;
        }
      }
    `,
  ],
})
export class CodeBlockComponent extends Appearance {
  readonly code = input("");
  readonly language = input("Angular");
  readonly label = input("");
  readonly filename = input("");
  readonly ariaLabel = input("Code example");
  readonly showHeader = input(true);
  readonly copyable = input(true);
  readonly lineNumbers = input(false);
  readonly wrap = input(false);
  readonly maxHeight = input("none");
  readonly theme = input<"dark" | "light">("dark");
  readonly copyLabel = input("Copy");
  readonly copiedLabel = input("Copied");
  readonly copyAriaLabel = input("Copy code");
  readonly downloadable = input(false);
  readonly downloadLabel = input("Download");
  readonly collapsible = input(false);
  readonly initiallyExpanded = input(true);
  readonly collapseLabel = input("Collapse");
  readonly expandLabel = input("Expand");
  readonly playgroundLink = input("");
  readonly playgroundLabel = input("Open playground");
  readonly copied = output<string>();
  readonly copyFailed = output<unknown>();
  readonly downloaded = output<string>();
  readonly expandedChange = output<boolean>();
  readonly playgroundRequested = output<string>();
  readonly copiedState = signal(false);
  readonly expanded = signal(true);
  readonly status = signal("");
  readonly lines = computed(() => this.code().split("\n").map(tokenize));

  ngOnInit(): void {
    this.expanded.set(this.initiallyExpanded());
  }

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
    this.expandedChange.emit(this.expanded());
  }

  download(): void {
    const extension =
      this.language().toLowerCase() === "angular"
        ? "html"
        : this.language().toLowerCase();
    const name = this.filename() || `example.${extension}`;
    const url = URL.createObjectURL(
      new Blob([this.code()], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
    this.downloaded.emit(name);
  }

  openPlayground(): void {
    this.playgroundRequested.emit(this.playgroundLink());
    window.open(this.playgroundLink(), "_blank", "noopener,noreferrer");
  }

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copiedState.set(true);
      this.status.set(this.copiedLabel());
      this.copied.emit(this.code());
      window.setTimeout(() => this.copiedState.set(false), 1200);
    } catch (error) {
      this.status.set("Unable to copy code");
      this.copyFailed.emit(error);
    }
  }
}
