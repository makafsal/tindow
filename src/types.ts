export interface ITab {
  id: string;
  name: string;
  config?: ITabConfig;
}

export interface ITabConfig {
  openInNewTab?: boolean;
}

export interface ILink {
  id: string;
  name: string;
  url: string;
}

export interface ISection {
  id: string;
  name: string;
  tabId: string;
  links?: ILink[];
}

export type ThemeType = "white" | "g10" | "g90" | "g100";
