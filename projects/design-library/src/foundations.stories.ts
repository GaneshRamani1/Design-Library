import type { Meta, StoryObj } from "@storybook/angular";
const meta: Meta = {
  title: "Foundations/Getting started",
  parameters: { layout: "padded" },
};
export default meta;
export const Installation: StoryObj = {
  render: () => ({
    template: `<article style="max-width:760px;margin:40px auto;line-height:1.8"><p style="font-size:11px;letter-spacing:2px;color:#647068">ARCWELL UI / DEVELOPER GUIDE</p><h1 style="font-size:40px;letter-spacing:-1.5px">Make it yours.</h1><p>Eight standalone Angular 22 components, ready to import into your application.</p><h2>1. Build and package</h2><pre>npm install
npm run pack:library</pre><p>Install the generated tarball in your consuming Angular application:</p><pre>npm install /path/to/design-library/dist/arcwell-ui-0.1.0.tgz</pre><h2>2. Add the shared tokens</h2><p>Add this import to your global stylesheet:</p><pre>&#64;import '&#64;arcwell/ui/styles.css';</pre><h2>3. Import a component</h2><pre>import &#123; ButtonComponent &#125; from '&#64;arcwell/ui';

&#64;Component(&#123;
  imports: [ButtonComponent],
  template: '&lt;button dlButton&gt;Continue&lt;/button&gt;'
&#125;)</pre><h2>Forms that fit your workflow</h2><p>InputComponent and ToggleComponent support ngModel and formControl. Import FormsModule or ReactiveFormsModule alongside the components. Give each input a unique id and a visible label.</p><h2>A system, with room for you</h2><p>Override the CSS custom properties in your global :root selector to match your product.</p><pre>:root &#123;
  --dl-primary: #285b45;
  --dl-radius: 10px;
  --dl-font: 'Inter', sans-serif;
&#125;</pre><h2>Publish the catalog</h2><p>The included GitHub Actions workflow builds and deploys Storybook to GitHub Pages on pushes to main. Select GitHub Actions as the Pages source in your repository settings.</p></article>`,
  }),
};
export const Tokens: StoryObj = {
  render: () => ({
    template: `<section style="max-width:800px;margin:40px auto"><p style="font-size:11px;letter-spacing:2px;color:#647068">ARCWELL UI / FOUNDATIONS</p><h1 style="font-size:40px">A naturally balanced palette.</h1><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px">${[
      ["Forest", "#285b45", "primary"],
      ["Sage", "#edf4ee", "primary-soft"],
      ["Ink", "#202a24", "text"],
      ["Stone", "#647068", "muted"],
      ["Canvas", "#f7f8f5", "background"],
      ["Border", "#dce2da", "border"],
      ["Focus", "#3577b9", "focus"],
      ["Danger", "#ab3434", "danger"],
    ]
      .map(
        ([name, color, token]) =>
          `<div style="border:1px solid #dce2da;border-radius:10px;overflow:hidden"><div style="height:100px;background:${color}"></div><div style="padding:16px"><strong>${name}</strong><p style="font:12px monospace">${color}<br>--dl-${token}</p></div></div>`,
      )
      .join("")}</div></section>`,
  }),
};
