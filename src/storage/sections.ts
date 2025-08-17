import type { ISection } from "../types";

export const getSections = async (): Promise<ISection[]> => {
  const result = await chrome.storage.local.get("sections");
  return result.sections || [];
};

export const addSections = async (sections: ISection[]): Promise<void> => {
  await chrome.storage.local.set({ sections });
};

export const addSection = async (section: ISection): Promise<void> => {
  const sections = await getSections();
  sections.push(section);
  await addSections(sections);
};
