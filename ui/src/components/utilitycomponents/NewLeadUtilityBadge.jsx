import React from "react";
import Box from '@mui/material/Box';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import moment from "moment"

const NewLeadUtilityBadge = (props) => {
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
          <Tab label={`Feasible (${tabCounts.ql || 0})`} value="QL" />
          <Tab label={`Non Feasible  (${tabCounts.uql || 0})`} value="UQL" />
          <Tab label={`Conversion In progress  (${tabCounts.lc || 0})`} value="LC" />
          <Tab label={`Converted (${tabCounts.cnc || 0})`} value="CNC" />
        <Tab label={`Today's Follow ups (${tabCounts.f_ups || 0})`} value={moment().format('YYYY-MM-DD')} />
        </Tabs>
      </Box>
    </Box>
  );
};

export default NewLeadUtilityBadge;
