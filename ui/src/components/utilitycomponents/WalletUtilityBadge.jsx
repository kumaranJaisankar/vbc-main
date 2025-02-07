import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const WalletUtiltyBadge = (props) => {
  const { handleWalletTableDataFilter ,currentTab, walletRowlength, setSelectedWalletTab} = props;

  const handleDataFilter = (credit) => {
    handleWalletTableDataFilter(credit);
    // setBasicLineTab(tabId);
    setSelectedWalletTab(credit)
  }

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: "none", borderColor: "divider" }}>
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
          <Tab label={`All (${walletRowlength.All || 0})`} value="All" className="customer_tabslist"/>
        <Tab label={`Credit(${walletRowlength.credit || 0})`} value="credit"  style={{marginLeft:"10px"}} className="customer_tabslist"/>
        <Tab label={`Debit (${walletRowlength.debit || 0})`} value="debit"  style={{marginLeft:"10px"}} className="customer_tabslist"/>


          </Tabs>
        </Box>
      </Box>
    </>
  );
};
export default WalletUtiltyBadge;
