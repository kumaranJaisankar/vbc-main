import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const IptvBadge = (props) => {
  const { selectedTab, setSelectedTab } = props;
  // const handleDataFilter = (status) => setSelectedTab(status);
  return (
    <Box sx={{ padding: "20px", width: "100%" }}>
      <Box
        sx={{ borderBottom: "1px", borderColor: "divider", marginTop: "2rem" }}
      >
        <Tabs value={selectedTab} onChange={(_,value) => {
            setSelectedTab(value)
            }}>
          <Tab label="CHANNELS" value="channel" />
          <Tab label="CATEGORIES" value="category" />
          <Tab label="BOUQUETS" value="bouquet" />
          <Tab label="BROADCASTERS" value="broadcaster" />
        </Tabs>
      </Box>
    </Box>
  );
};
export default IptvBadge;
