import React from "react";
import Box from '@mui/material/Box';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const NewServiceUtilityBadge = (props) => {
  const { currentTab, tabCounts, setActiveTab } = props;

  return (
    <Box sx={{ width: '100%', marginTop:"28px" }}>
      <Box sx={{ borderBottom: '1px', borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={(_, value) => setActiveTab(value)}
          aria-label="iptv plans section"
          TabIndicatorProps={{   
            style: {
                display: "none",
            },
          }}
        >
          <Tab label={`Active (${tabCounts.active || 0})`} value="ACT" className="customer_tabslist"/>
          <Tab label={`Inactive (${tabCounts.inactive || 0})`} value="IN" style={{marginLeft:"10px"}} className="customer_tabslist"/>
          {/* <Tab label={`Offer (${tabCounts.offer || 0})`} value="OFFER" /> */}
        </Tabs>
      </Box>
    </Box>
  );
};

export default NewServiceUtilityBadge;
