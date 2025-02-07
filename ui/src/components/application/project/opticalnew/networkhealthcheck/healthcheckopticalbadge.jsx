import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
const HealthCheckUtilityBadge = (props) => {
  // const [BasicLineTab, setBasicLineTab] = useState("1");
  const { handleTableDataFilter , rowlength,selectedTab,setSelectedTab} = props;

  const handleDataFilter = (status, tabId) => {
    // handleTableDataFilter(status);
    setSelectedTab(status);
  }
  return (

    <Box sx={{ padding: '20px', width: '100%' }}>
    <Box sx={{ borderBottom: '1px', borderColor: 'divider'}}>
      <Tabs
        value={selectedTab}
        onChange={(_, value) => handleDataFilter(value)}
        aria-label="iptv plans section"
        TabIndicatorProps={{   
          style: {
              display: "none",
          },
        }}
      >
        <Tab label={`Radius (${rowlength.Radius || 0})`} value="Radius" className="customer_tabslist"/>

      </Tabs>
    </Box>
  </Box>
    // // <Nav className="border-tab" tabs style={{ backgroundColor: "transparent", marginBottom: "3rem", marginTop:"3rem"}}>
    //         {/* <NavItem style={{backgroundColor: "transparent"}}>
    //             <NavLink
    //               href="#javascript"
    //               className={BasicLineTab === "1" ? "badge-active active" : ""}
    //               onClick={() => handleDataFilter("Radius", "1")}
    //             >
    //               <span className={BasicLineTab === "1" ? "utility-badge-text-active" : "utility-badge-text"}>Radius</span> 
    //               <span className={BasicLineTab === "1" ? "utility-badge-numbers-active" : "utility-badge-numbers"}>{rowlength.Radius}</span>
    //             </NavLink>
    //           </NavItem> */}
    //           {/* <NavItem style={{backgroundColor: "transparent"}}>
    //             <NavLink
    //               href="#javascript"
    //               className={BasicLineTab === "2" ? "badge-active active" : ""}
    //               onClick={(event) => handleDataFilter("Nas", "2")}
    //             >
    //               <span className={BasicLineTab === "2" ? "utility-badge-text-active" : "utility-badge-text"}>Nas</span> 
    //               <span className={BasicLineTab === "2" ? "utility-badge-numbers-active" : "utility-badge-numbers"}>{rowlength.Nas}</span>
    //             </NavLink>
    //           </NavItem> */}
              
    //         // </Nav>
  );
}

export default HealthCheckUtilityBadge;