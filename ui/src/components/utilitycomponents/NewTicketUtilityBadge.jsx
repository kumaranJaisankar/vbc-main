import React from "react";
import Box from '@mui/material/Box';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import moment from "moment"

const NewTicketUtilityBadge = (props) => {
  const { currentTab, tabCounts, setActiveTab } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: '1px', borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={(_, value) => setActiveTab(value)}
          aria-label="iptv plans section"
        >
          <Tab label={`All (${tabCounts.all || 0})`} value="all" />
          <Tab label={`Provisioning (${tabCounts.Provisioning || 0})`} value="Provisioning" />
          <Tab label={`Installation (${tabCounts.Installation || 0})`} value="Installation" />
        </Tabs>
      </Box>
    </Box>
  );
};

export default NewTicketUtilityBadge;
