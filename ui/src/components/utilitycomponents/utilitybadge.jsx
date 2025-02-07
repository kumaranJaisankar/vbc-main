import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const UtilityBadge = (props) => {
  // const [BasicLineTab, setBasicLineTab] = useState("1");
  const { handleTableDataFilter ,currentTab, rowlength, setSelectedtab} = props;

  const handleDataFilter = (status) => {
    handleTableDataFilter(status);
    // setBasicLineTab(tabId);
    setSelectedtab(status)
  }
  return (

    // <Box sx={{ padding: '20px', width: '100%' }}>
    <Box sx={{ borderBottom: '1px', borderColor: 'divider',marginTop:"2rem" }}>
      <Tabs
        value={currentTab}
        onChange={(_, value) => handleDataFilter(value)}
        aria-label="iptv plans section"
        TabIndicatorProps={{   
          style: {
              display: "none",
          },
        }}
      >
        <Tab label={`All (${rowlength.All || 0})`} value="All" className="customer_tabslist"/>
        <Tab label={`Feasible (${rowlength.qualified || 0})`} value="qualified"  style={{marginLeft:"10px"}} className="customer_tabslist"/>
        <Tab label={`Non Feasible (${rowlength.notqualified || 0})`} value="notqualified"  style={{marginLeft:"10px"}} className="customer_tabslist"/>
        <Tab label={`Conversion In progress (${rowlength.Conversion || 0})`} value="Conversion"  style={{marginLeft:"10px"}} className="customer_tabslist"/>
        <Tab label={`Converted (${rowlength.converted || 0})`} value="converted"  style={{marginLeft:"10px"}} className="customer_tabslist"/>
        <Tab label={`Today's Follow ups (${rowlength.todayfollowups || 0})`} value="todayfollowups"  style={{marginLeft:"10px"}} className="customer_tabslist"/>

      </Tabs>
    </Box>
  // {/* </Box> */}
 
  );
}

export default UtilityBadge;