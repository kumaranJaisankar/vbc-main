import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const WalletBadge = (props) => {
    const { currentTab, tabCounts, setActiveTab } = props;
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: "none", borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={(_, value) => setActiveTab(value)}
          aria-label="iptv plans section"
          indicatorColor={""}
        >
          <Tab label={`All (${tabCounts.all || 0})`} value="all" className="customer_tabslist"/>
        <Tab label={`Credit(${tabCounts.credit || 0})`} value="credit"  style={{marginLeft:"10px"}} className="customer_tabslist"/>
        <Tab label={`Debit (${tabCounts.debit || 0})`} value="debit"  style={{marginLeft:"10px"}} className="customer_tabslist"/>


          </Tabs>
        </Box>
      </Box>
    </>
  );
};
export default WalletBadge;
