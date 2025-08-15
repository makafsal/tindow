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
import { Add } from "@carbon/react/icons";
import { Grid, Column } from "@carbon/react";

import "./App.scss";
import { getFormattedDate } from "./utils/getFormattedDate";
import { addTab, addTabs, getTabs } from "./storage/tabs";
import type { ITab } from "./types";

function App() {
  const [date, setDate] = useState<string>();
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [openTabModal, setOpenTabModal] = useState(false);
  const [tabName, setTabName] = useState("");
  const [tabNameInputValid, setTabNameInputValid] = useState(true);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [tabToAction, setTabToAction] = useState<ITab | null>();
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

  const fetchData = async () => {
    const tabs = await getTabs();

    setTabs(tabs);
  };

  // Data fetching effect
  useEffect(() => {
    fetchData();
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
    setTimeout(() => fetchData(), 1000); // Refresh tabs from storage
  };

  const onDeleteTab = async (tabId: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(updatedTabs);
    await addTabs(updatedTabs); // Update storage
    setTimeout(() => fetchData(), 1000); // Refresh tabs from storage
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
    setTimeout(() => fetchData(), 1000); // Refresh tabs from storage
  };

  return (
    <>
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
                      >
                        Edit
                      </Button>
                    </div>
                  </Column>
                  <Column xlg={8} lg={8} className="h-85vh o-auto">
                    <p>First</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>

                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>sdfsd</p>
                    <p>Last</p>
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
