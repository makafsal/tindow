import { useEffect, useState } from "react";
import {
  Button,
  ComposedModal,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Section,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TextInput,
  Tile,
  Toggle
} from "@carbon/react";
import { Add, Edit, TrashCan } from "@carbon/react/icons";
import { Grid, Column } from "@carbon/react";

import "./App.scss";
import { getFormattedDate } from "./utils/getFormattedDate";
import { addTab, addTabs, getTabs } from "./storage/tabs";
import { type ISection, type ITab } from "./types";
import { addSection, addSections, getSections } from "./storage/sections";

function App() {
  const [date, setDate] = useState<string>();
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);
  const [openTabModal, setOpenTabModal] = useState(false);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [tabName, setTabName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [tabNameInputValid, setTabNameInputValid] = useState(true);
  const [sectionNameInputValid, setSectionNameInputValid] = useState(true);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [tabToAction, setTabToAction] = useState<ITab | null>();
  const [sectionToAction, setSectionToAction] = useState<ISection | null>();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Date update effect
  useEffect(() => {
    const updateDate = () => {
      const date = getFormattedDate();

      setDate(date);
    };

    updateDate(); // Initial call to set date immediately
    setInterval(updateDate, 1000); // Update every second
  }, []);

  const fetchTabs = async () => {
    const tabs = await getTabs();

    setTabs(tabs);
  };

  const fetchSections = async () => {
    const sections = await getSections();
    setSections(sections);
  };

  // Data fetching effect
  useEffect(() => {
    fetchTabs();
    fetchSections();
  }, []);

  const onSubmitTabForm = async () => {
    if (!tabName?.trim()?.length) {
      setTabNameInputValid(false);
      return;
    }

    setTabNameInputValid(true);

    if (tabToAction?.id && tabToAction?.name?.trim() !== tabName.trim()) {
      // Update existing tab
      const updatedTabs = tabs.map((tab) =>
        tab.id === tabToAction?.id ? { ...tab, name: tabName.trim() } : tab
      );
      await addTabs(updatedTabs);
      setTabs(updatedTabs);
      setTabToAction(null);
    } else {
      // Create new tab

      const newTab: ITab = {
        id: crypto.randomUUID(),
        name: tabName.trim()
      };

      addTab(newTab);
      setTabs((prevTabs) => [...prevTabs, newTab]);
    }

    setOpenTabModal(false);
    setTabName("");
    setTimeout(() => fetchTabs(), 1000); // Refresh tabs from storage
  };

  const onSubmitSectionForm = async () => {
    if (!sectionName?.trim()?.length) {
      setSectionNameInputValid(false);
      return;
    }

    setSectionNameInputValid(true);

    if (
      sectionToAction?.id &&
      sectionToAction?.name?.trim() !== sectionName.trim()
    ) {
      // Update existing tab
      const updatedSections = sections.map((section) =>
        section.id === sectionToAction?.id
          ? { ...section, name: sectionName.trim() }
          : section
      );
      await addSections(updatedSections);
      setSections(updatedSections);
      setSectionToAction(null);
    } else {
      // Create new tab

      const newSection: ISection = {
        id: crypto.randomUUID(),
        name: sectionName.trim(),
        tabId: tabs[activeTabIndex]?.id || ""
      };

      addSection(newSection);
      setSections((prevSections) => [...prevSections, newSection]);
    }

    setOpenSectionModal(false);
    setSectionName("");
    setTimeout(() => fetchSections(), 1000); // Refresh tabs from storage
  };

  const onDeleteTab = async (tabId: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(updatedTabs);
    await addTabs(updatedTabs); // Update storage
    setTimeout(() => fetchTabs(), 1000); // Refresh tabs from storage
  };

  const onDeleteSection = async (sectionId: string) => {
    const updatedSections = sections.filter(
      (section) => section.id !== sectionId
    );
    setSections(updatedSections);
    await addSections(updatedSections); // Update storage
    setTimeout(() => fetchSections(), 1000); // Refresh tabs from storage
  };

  const handleTabChange = (evt: { selectedIndex: number }) => {
    setActiveTabIndex(evt?.selectedIndex);
  };

  const updateOpenInNewTab = async (tab: ITab, checked: boolean) => {
    const updatedTabs = tabs.map((_tab) =>
      _tab.id === tab?.id
        ? {
            ..._tab,
            config: {
              ..._tab.config,
              openInNewTab: checked
            }
          }
        : _tab
    );

    await addTabs(updatedTabs);
    setTabs(updatedTabs);
    setTimeout(() => fetchTabs(), 1000); // Refresh tabs from storage
  };

  return (
    <>
      {/* Tab modal */}
      <ComposedModal
        open={openTabModal}
        onClose={() => {
          setOpenTabModal(false);
        }}
      >
        <ModalHeader title={tabToAction?.id ? "Edit tab" : "Create new tab"} />
        <ModalBody>
          <TextInput
            data-modal-primary-focus
            id="tab-name-input"
            labelText="Tab name"
            placeholder="Enter tab name"
            required={true}
            value={tabName}
            onChange={(e) => setTabName(e.target.value)}
            invalid={!tabNameInputValid}
            invalidText={!tabNameInputValid ? "Tab name is required" : ""}
          />
        </ModalBody>
        <ModalFooter
          primaryButtonText={tabToAction?.id ? "Update" : "Create"}
          secondaryButtonText="Cancel"
          onRequestSubmit={onSubmitTabForm}
          children={undefined}
        />
      </ComposedModal>
      {/* Section modal */}
      <ComposedModal
        open={openSectionModal}
        onClose={() => {
          setOpenSectionModal(false);
        }}
      >
        <ModalHeader
          title={sectionToAction?.id ? "Edit section" : "Create new section"}
        />
        <ModalBody>
          <TextInput
            data-modal-primary-focus
            id="section-name-input"
            labelText="Section name"
            placeholder="Enter section name"
            required={true}
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            invalid={!sectionNameInputValid}
            invalidText={
              !sectionNameInputValid ? "Section name is required" : ""
            }
          />
        </ModalBody>
        <ModalFooter
          primaryButtonText={sectionToAction?.id ? "Update" : "Create"}
          secondaryButtonText="Cancel"
          onRequestSubmit={onSubmitSectionForm}
          children={undefined}
        />
      </ComposedModal>
      {/* Delete confirmation modal */}
      <Modal
        danger={true}
        // launcherButtonRef={button}
        modalHeading="Delete tab"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        open={deleteConfirmModalOpen}
        onRequestSubmit={() => {
          if (!tabToAction) return;

          onDeleteTab(tabToAction?.id);
          setDeleteConfirmModalOpen(false);
          setTabToAction(null);
          setActiveTabIndex(0);
        }}
        onRequestClose={() => {
          setTabToAction(null);
          setDeleteConfirmModalOpen(false);
        }}
      >
        <p
          style={{
            marginBottom: "1rem"
          }}
        >
          Are you sure you want to delete this{" "}
          <strong>{tabToAction?.name}</strong> tab?
        </p>
      </Modal>
      <Tabs
        dismissable={true}
        onTabCloseRequest={(tabIndex) => {
          const _tab = tabs[tabIndex];
          setTabToAction(_tab);
          setDeleteConfirmModalOpen(true);
        }}
        selectedIndex={activeTabIndex}
        onChange={handleTabChange}
      >
        <div className="tabs-header">
          <div className="tab-list">
            <TabList contained>
              {tabs.map((tab: ITab) => (
                <Tab key={tab.id}>{tab.name}</Tab>
              ))}
            </TabList>
            <IconButton
              label="Add tab"
              kind="ghost"
              onClick={() => setOpenTabModal(true)}
            >
              <Add />
            </IconButton>
          </div>
          <div className="date-time cds--type-light">{date}</div>
        </div>
        <div className="tabs-content">
          <TabPanels>
            {tabs.map((tab: ITab) => (
              <TabPanel className="mh-100 o-hidden" key={`panel-${tab.id}`}>
                <Grid as="div" className="pt-1 mh-100 o-auto">
                  <Column className="p-relative h-85vh o-auto" xlg={4} lg={4}>
                    <Heading>{tab.name}</Heading>
                    <div className="edit-tab-section">
                      <Button
                        size="sm"
                        kind="tertiary"
                        onClick={() => {
                          setTabToAction(tab);
                          setTabName(tab.name);
                          setOpenTabModal(true);
                        }}
                        renderIcon={Edit}
                      >
                        Edit
                      </Button>
                    </div>
                  </Column>
                  <Column xlg={8} lg={8} className="h-85vh o-auto">
                    <div className="section-header">
                      <Button
                        size="sm"
                        kind="tertiary"
                        renderIcon={Add}
                        onClick={() => setOpenSectionModal(true)}
                      >
                        Add section
                      </Button>
                    </div>
                    {sections
                      .filter((section) => section.tabId === tab.id)
                      .map((section) => (
                        <Tile className="mt-1">
                          <Section level={3}>
                            <Heading className="cds--type-light">
                              {section.name}
                            </Heading>
                            <footer className="tile-footer">
                              <div>
                                <Button
                                  size="sm"
                                  kind="ghost"
                                  renderIcon={Add}
                                >
                                  Add link
                                </Button>
                              </div>
                              <div>
                                <IconButton
                                  label="Edit section"
                                  autoAlign
                                  size="sm"
                                  kind="ghost"
                                  onClick={() => {
                                    setSectionToAction(section);
                                    setSectionName(section.name);
                                    setOpenSectionModal(true);
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  label="Delete section"
                                  autoAlign
                                  size="sm"
                                  kind="ghost"
                                  onClick={() => {
                                    onDeleteSection(section.id);
                                  }}
                                >
                                  <TrashCan />
                                </IconButton>
                              </div>
                            </footer>
                          </Section>
                        </Tile>
                      ))}
                  </Column>
                  <Column xlg={4} lg={4}>
                    <Tile id="tile-1">
                      <Section level={4}>
                        <Heading>Configure</Heading>
                        <br />
                        <Toggle
                          toggled={!!tab.config?.openInNewTab}
                          id={tab.id}
                          labelA="Off"
                          labelB="On"
                          labelText="Open links in new tab"
                          onToggle={async (checked: boolean) => {
                            updateOpenInNewTab(tab, checked);
                          }}
                        />
                      </Section>
                    </Tile>
                  </Column>
                </Grid>
              </TabPanel>
            ))}
          </TabPanels>
        </div>
      </Tabs>
    </>
  );
}

export default App;
