export const chevron = `<svg class="chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const selectionStyles = `
  .trigger { display: flex; justify-content: space-between; align-items: center; gap: var(--dl-ui-gap, 12px); text-align: left; cursor: pointer; }
  .trigger > span:first-child { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .chevron { width: 20px; height: 20px; flex: 0 0 20px; color: var(--dl-ui-color, var(--dl-muted)); transition: transform 150ms; }
  .trigger[aria-expanded="true"] .chevron { transform: rotate(180deg); }
  .panel { position: fixed; inset: auto; margin: 0; overflow: auto; color: var(--dl-ui-color, var(--dl-text)); font: inherit; padding: var(--dl-ui-padding, 8px); border:var(--dl-ui-border-width, 1px) solid var(--dl-ui-border-color, var(--dl-card-border)); border-radius: var(--dl-ui-radius, 12px); background: var(--dl-ui-background, var(--dl-surface)); background-image: var(--dl-card-sheen); box-shadow: var(--dl-ui-shadow, 0 16px 40px #0005); }
  @media(prefers-reduced-motion: reduce) { .chevron { transition: none; } }
`;
