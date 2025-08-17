import type { ITab } from "../types";

export const getTabs = async (): Promise<ITab[]> => {
  const result = await chrome.storage.local.get("tabs");
  return result.tabs || [];
};

export const addTabs = async (tabs: ITab[]): Promise<void> => {
  await chrome.storage.local.set({ tabs });
};

export const addTab = async (tab: ITab): Promise<void> => {
  const tabs = await getTabs();
  tabs.push(tab);
  await addTabs(tabs);
};
