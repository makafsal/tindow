export interface ITab {
  id: string;
  name: string;
  config?: ITabConfig;
}

export interface ITabConfig {
  openInNewTab?: boolean;
}
