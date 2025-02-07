import React from "react";
import Box from '@mui/material/Box';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { NETWORK } from "../../../../utils/permissions";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const OpticalBadge = (props) => {
  const { handleTableDataFilter ,rowlength,selectedTab,setSelectedtab} = props;

  const handleDataFilter = (status, tabId) => {
    handleTableDataFilter(status);
    setSelectedtab(status);
  };

  return (

    <Box sx={{  width: '100%' }}>
    <Box sx={{ borderBottom: '1px', borderColor: 'divider',marginTop:"1.3rem" }}>
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
        
{token.permissions.includes(NETWORK.NAS_LIST) && (
      <Tab label={`NAS (${rowlength.nas || 0})`} value="nas" className="customer_tabslist"/>
)}
{token.permissions.includes(NETWORK.OLT_LIST) && (
        <Tab label={`OLT (${rowlength.olt || 0})`} value="olt"style={{marginLeft:"10px"}} className="customer_tabslist"/>
)}
{token.permissions.includes(NETWORK.DP_LIST) && (
        <Tab label={`DP (${rowlength.dp || 0})`} value="dp" style={{marginLeft:"10px"}} className="customer_tabslist"/>
)}
{token.permissions.includes(NETWORK.CPE_LIST) && (
        <Tab label={`CPE (${rowlength.cpe || 0})`} value="cpe"style={{marginLeft:"10px"}} className="customer_tabslist"/>
)}
      </Tabs>
    </Box>
  </Box>
    // <Nav
    //   className="border-tab"
    //   tabs
    //   style={{ backgroundColor: "transparent", marginBottom: "3rem",marginTop:"2rem" }}
    // >
    //   <NavItem style={{ marginRight:"16px",fontSize:"medium",borderRadius:"0.25rem",height: "39px",width: "119px"}}>
    //     <NavLink
    //       href="#javascript"
    //       className={BasicLineTab === "1" ? "badge-active active" : ""}
    //       onClick={() => handleDataFilter("nas", "1")}
    //       style={{display:"flex"}}
    //     >
    //       <span
    //         className={
    //           BasicLineTab === "1"
    //             ? "utility-badge-text-active"
    //             : "utility-badge-text"
    //         }
    //       >
    //         NAS
    //       </span>
    //       <span className={BasicLineTab === "1" ? "utility-badge-numbers-active" : "utility-badge-numbers"}>{rowlength.nas}</span>

    //     </NavLink>
    //   </NavItem>
    //   <NavItem style={{ marginRight:"16px",fontSize:"medium",borderRadius:"0.25rem",height: "39px",width: "119px"}}>
    //     <NavLink
    //       href="#javascript"
    //       className={BasicLineTab === "2" ? "badge-active active" : ""}
    //       onClick={(event) => handleDataFilter("olt", "2")}
    //       style={{display:"flex"}}
    //     >
    //       <span
    //         className={
    //           BasicLineTab === "2"
    //             ? "utility-badge-text-active"
    //             : "utility-badge-text"
    //         }
    //       >
    //         OLT
    //       </span>
    //       <span className={BasicLineTab === "2" ? "utility-badge-numbers-active" : "utility-badge-numbers"}>{rowlength.olt}</span>

    //     </NavLink>
    //   </NavItem>

    //   <NavItem style={{ marginRight:"16px",fontSize:"medium",borderRadius:"0.25rem",height: "39px",width: "119px" }}>
    //     <NavLink
    //       href="#javascript"
    //       className={BasicLineTab === "3" ? "badge-active active" : ""}
    //       onClick={(event) => handleDataFilter("dp", "3")}
    //       style={{display:"flex"}}
    //     >
    //       <span
    //         className={
    //           BasicLineTab === "3"
    //             ? "utility-badge-text-active"
    //             : "utility-badge-text"
    //         }
    //       >
    //         DP
    //       </span>
    //       <span className={BasicLineTab === "3" ? "utility-badge-numbers-active" : "utility-badge-numbers"}>{rowlength.dp}</span>

    //     </NavLink>
    //   </NavItem>
    //   <NavItem style={{ marginRight:"16px",fontSize:"medium",borderRadius:"0.25rem",height: "39px",width: "119px"}}>
    //     <NavLink
    //       href="#javascript"
    //       className={BasicLineTab === "4" ? "badge-active active" : ""}
    //       onClick={(event) => handleDataFilter("cpe", "4")}
    //       style={{display:"flex"}}
    //     >
    //       <span
    //         className={
    //           BasicLineTab === "4"
    //             ? "utility-badge-text-active"
    //             : "utility-badge-text"
    //         }
    //       >
    //         CPE
    //       </span>
    //       <span className={BasicLineTab === "4" ? "utility-badge-numbers-active" : "utility-badge-numbers"}>{rowlength.cpe}</span>

    //     </NavLink>
    //   </NavItem>
    // </Nav>
  );
};

export default OpticalBadge;
