import type { ReactNode } from "react";

export interface ApiItem {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ComponentExample {
  id: string;
  title: string;
  description: string;
  preview: ReactNode;
  source: string;
}

export interface ComponentApi {
  inputs: ApiItem[];
  outputs: ApiItem[];
}

export interface ComponentDoc {
  slug: string;
  title: string;
  category: string;
  className: string;
  selector: string;
  kind: string;
  description: string;
  integration: string[];
  inputs: Array<ApiItem & { kind: string; declaredIn: string }>;
  outputs: Array<ApiItem & { kind: string; declaredIn: string }>;
  slots: string[];
  methods: string[];
  behavioralExamples: DocLink[];
  configuration: ConfigurationExample[];
  patterns: DocLink[];
  defaults: string;
  relatedTypes: string;
}

export interface DocLink {
  label: string;
  href: string;
  description: string;
}

export interface ConfigurationExample extends DocLink {
  property: string;
  kind: "configuration" | "variation" | "appearance" | "event";
}
