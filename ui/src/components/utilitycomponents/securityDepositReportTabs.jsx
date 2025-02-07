import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import moment from "moment";
import { useLocation } from "react-router-dom";
import SecutiryDepositTotal from "../application/Reports/billingreports/securityDepositTotal";
var startDate = moment().format("YYYY-MM-DD");
var endDate = moment().format("YYYY-MM-DD");

const SecurityDepositReports = (props) => {
  const { currentTab, tabCounts, setActiveTab, ledgerLists } = props;
  const location = useLocation();
  //commented off tab counts by marieya
  return (
    <>
      <Box sx={{ width: "100%", marginTop: "10px" }}>
        <Box>
          <Tabs
            value={currentTab}
            onChange={(_, value) => setActiveTab(value)}
            aria-label="iptv plans section"
            indicatorColor={""}
          >
            <Tab
              // label={`All`}
              label={`All`}
              value="All"
              className="customer_tabslist"
            />

            <Tab
              // label={`Expired`}
              label={`Security Deposit`}
              value="False"
              style={{ marginLeft: "10px" }}
              className="customer_tabslist"
            />

            <Tab
              // label={`Active `}
              label={`Security Deposit Refund`}
              value="True"
              style={{ marginLeft: "10px" }}
              className="customer_tabslist"
            />

            {/* <Tab
            label={`Online (${tabCounts.online || 0})`}
            value="online"
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          /> */}
          </Tabs>
        </Box>
      </Box>
      <SecutiryDepositTotal activeTab={currentTab} ledgerLists={ledgerLists} />
    </>
  );
};

export default SecurityDepositReports;
