import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Layer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@carbon/react";

import "./App.scss";

function App() {
  const [date, setDate] = useState<string>();

  useEffect(() => {
    const updateDate = () => {
      const date = new Date();

      // Get day name
      const weekday = date.toLocaleString("en-US", { weekday: "long" });

      // Get month name
      const month = date.toLocaleString("en-US", { month: "long" });

      // Get day of month
      const day = date.getDate();

      // Get time in 12-hour format with AM/PM
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      // Determine AM or PM
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // convert 0 → 12

      // Final format
      const formatted = `${weekday} | ${month} ${day} | ${hours}:${minutes}:${seconds} ${ampm}`;

      setDate(formatted);
    };

    updateDate(); // Initial call to set date immediately
    setInterval(updateDate, 1000); // Update every second
  }, []);

  return (
    <>
      <Tabs>
        <div className="tabs-header">
          <TabList contained>
            <Tab>Dashboard</Tab>
            <Tab>Monitoring</Tab>
            <Tab>Activity</Tab>
            <Tab>Analyze</Tab>
            <Tab disabled>Settings</Tab>
          </TabList>
          <div className="date-time cds--type-light">{date}</div>
        </div>
        <TabPanels>
          <TabPanel>Tab Panel 1</TabPanel>
          <TabPanel>
            <Layer>
              <form
                style={{
                  margin: "2em"
                }}
              >
                <legend className={`cds--label`}>Validation example</legend>
                <Checkbox id="cb" labelText="Accept privacy policy" />
                <Button
                  style={{
                    marginTop: "1rem",
                    marginBottom: "1rem"
                  }}
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            </Layer>
          </TabPanel>
          <TabPanel>Tab Panel 3</TabPanel>
          <TabPanel>Tab Panel 4</TabPanel>
          <TabPanel>Tab Panel 5</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default App;
