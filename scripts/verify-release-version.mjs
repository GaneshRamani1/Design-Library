import { readFileSync } from "node:fs";

const packageJson = JSON.parse(
  readFileSync("projects/design-library/package.json", "utf8"),
);
const tag = process.env.GITHUB_REF_NAME;
if (!tag) {
  console.log(
    `Package version ${packageJson.version} is valid; no release tag was supplied.`,
  );
  process.exit(0);
}
if (tag !== `v${packageJson.version}`) {
  throw new Error(
    `Release tag ${tag} must match package version v${packageJson.version}.`,
  );
}
console.log(`Release tag ${tag} matches @arcwell/ui ${packageJson.version}.`);
