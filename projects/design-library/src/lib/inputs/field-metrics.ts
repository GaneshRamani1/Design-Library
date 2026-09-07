/** One sizing scale for every text-like field, regardless of browser defaults. */
export const fieldMetrics = `
  :host { --field-height: 44px; --field-padding: 11px 12px; --field-inset: 12px; font-size: var(--dl-ui-font-size, 14px); }
  :host([data-size="sm"]) { --field-height: 36px; --field-padding: 7px 10px; --field-inset: 10px; font-size: var(--dl-ui-font-size, 12px); }
  :host([data-size="lg"]) { --field-height: 52px; --field-padding: 15px 16px; --field-inset: 16px; font-size: var(--dl-ui-font-size, 16px); }
`;
