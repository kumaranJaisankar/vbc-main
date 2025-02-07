import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
export const CustomerReports = (props) => {
  const {
    currentTab,
    currentTabAct,
    currentTabSpd,
    currentTabAlll,
    currentTabAbtExp,
    tabCounts,
    setActiveTab,
    setActiveTabAct,
    setActiveTabSpd,
    setActiveTabAbtExp,
    setActiveTabAll
  } = props;
  return (
    <Box sx={{ width: "100%" }}>
      {" "}
      <Box>
        {props?.accoutstatus != "EXP" &&
          props?.accoutstatus != "ACT" &&
          props?.accoutstatus != "SPD" &&
          props?.accoutstatus != "act" &&
          (
            <Tabs
              value={currentTabAlll}
              onChange={(_, value) => setActiveTabAll(value)}
              aria-label="iptv plans section"
              className="report-tabs"
            >
              <Tab label={`all (${tabCounts.all || 0})`} value="all" className="customer_tabslist" style={{ marginLeft: "10px" }} />

            </Tabs>
          )}

        {props?.accoutstatus === "EXP" && (
          <Tabs
            value={currentTab}
            onChange={(_, value) => setActiveTab(value)}
            aria-label="iptv plans section"
            className="report-tabs"
          >
            <Tab
              label={`Expired (${tabCounts.exp || 0})`}
              value="exp"
              className="customer_tabslist"
              style={{ marginLeft: "10px" }}
            />
            {/* <Tab label={`All (${tabCounts.all || 0})`} value="all"  className="customer_tabslist"  style={{ marginLeft: "10px" }}/> */}
          </Tabs>
        )}
        {props?.accoutstatus === "act" && (
          <Tabs
            value={currentTabAbtExp}
            onChange={(_, value) => setActiveTabAbtExp(value)}
            aria-label="iptv plans section"
            className="report-tabs"
          >            <Tab
              label={`About to Expiry (${tabCounts.act || 0})`}
              value="act"
              className="customer_tabslist"
              style={{ marginLeft: "10px" }}
            />          </Tabs>)}
        {props?.accoutstatus === "ACT" && (
          <Tabs
            value={currentTabAct}
            onChange={(_, value) => setActiveTabAct(value)}
            aria-label="iptv plans section"
            className="report-tabs"
          >
            <Tab
              label={`Active (${tabCounts.act || 0})`}
              value="act"
              className="customer_tabslist"
              style={{ marginLeft: "10px" }}
            />
          </Tabs>
        )}
        {props?.accoutstatus === "SPD" && (
          <Tabs
            value={currentTabSpd}
            onChange={(_, value) => setActiveTabSpd(value)}
            aria-label="iptv plans section"
            className="report-tabs"
          >
            <Tab
              label={`Suspended (${tabCounts.spd || 0})`}
              value="spd"
              className="customer_tabslist"
              style={{ marginLeft: "10px" }}
            />{" "}
          </Tabs>
        )}

      </Box>
    </Box>
  );
};
