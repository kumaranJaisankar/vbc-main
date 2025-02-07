import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const CommunicationTab = (props) => {
  const { selectedTab, setSelectedTab } = props;
  //Addded new component by Marieya
  // const handleDataFilter = (status) => setSelectedTab(status);
  return (
    <Box sx={{ padding: "20px", width: "100%" }}>
      <Box
        sx={{ borderBottom: "1px", borderColor: "divider", marginTop: "2rem" }}
      >
        <Tabs value={selectedTab} onChange={(_,value) => {

            console.log(value)
            setSelectedTab(value)
            }}
            className="communication_tabs"
            >
          <Tab label="EMAIL" value="email" />
          <Tab label="SMS" value="sms" />
          <Tab label="WHATSAPP" value="whatsapp" />
          <Tab label="NOTIFICATIONS" value="notification" />
        </Tabs>
      </Box>
    </Box>
  );
};
export default CommunicationTab;
