import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation } from "react-router-dom";


const tabsToDisplay = ["Open", "In-Progress", "Assigned", "Resolved", "Closed"];

const Ticketutilitybadge = (props) => {
  const { setSelectedtab, currentTab, tabCounts } = props;
  const location = useLocation();
  // const tabsDataConvertedToObjectFromArray = useMemo(
  //   () =>
  //     tabCounts?.reduce((acc, curr) => {
  //       acc = { ...acc, ...curr };
  //       return acc;
  //     }, {}),
  //   [tabCounts]
  // );
  // console.log(
  //   tabsDataConvertedToObjectFromArray,
  //   catogeryFilters,
  //   "inside tab"
  // );
  // const updatedTabs = useMemo(
  //   () =>
  //     catogeryFilters?.filter((item) => tabsToDisplay.includes(item.name)),
  //   [tabsDataConvertedToObjectFromArray]
  // );
  // console.log(updatedTabs, "inside tab reara");
  // return updatedTabs?.length > 0 ? (
  //   <Box sx={{ marginTop: "10px" }}>
  //     <Tabs
  //       value={currentTab}
  //       onChange={(_, value) => setSelectedtab(value)}
  //       aria-label="help desk tabs"
  //       TabIndicatorProps={{
  //         style: {
  //           display: "none",
  //         },
  //       }}
  //     >
  //       {[{ id: 0, name: "all" }, ...updatedTabs].map((item) => (
  //         <Tab
  //           label={`${item.name} (${
  //             tabsDataConvertedToObjectFromArray?.[item.category] || 0
  //           })`}
  //           value={item.id}
  //           style={{ marginLeft: "10px" }}
  //           className="customer_tabslist"
  //         />
  //       ))}
  //     </Tabs>
  //   </Box>
  // ) : null;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box >
          <Tabs
            value={currentTab}
            onChange={(_, value) => setSelectedtab(value)}
            aria-label="iptv plans section"
            className="report-tabs"

          >
            {/* {location?.state?.billingDateRange ? (
              <Tab
                label={`All (${tabCounts.all || 0})`}
                value=""
                className="customer_tabslist"
              />
            ) : (
              <Tab
                label={`All (${tabCounts.all || 0})`}
                value="all"
                className="customer_tabslist"
              />
            )} */}
            {/* <Tab label={`All (${tabCounts.all || 0})`} value="all"  className="customer_tabslist"  style={{ marginLeft: "10px" }}/> */}

            {/* {location?.state?.billingDateRange === "opn" ? (
              <Tab
                label={`Open (${tabCounts.opn || 0})`}
                value="all"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : location?.state?.billingDateRange === "opn" ? (
              <Tab
                label={`Open (${tabCounts.opn || 0})`}
                value="opn"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : (
              <Tab
                label={`Open (${tabCounts.opn || 0})`}
                value="opn"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            )
            } */}


            {/* {location?.state?.billingDateRange === "ASN" ? (
              <Tab
                label={`Assigned (${tabCounts.asn || 0})`}
                value="all"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : location?.state?.billingDateRange === "ASN" ? (
              <Tab
                label={`Assigned  (${tabCounts.asn || 0})`}
                value="asn"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : (
              <Tab
                label={`Assigned  (${tabCounts.asn || 0})`}
                value="asn"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            )
            } */}
            {/* {location?.state?.billingDateRange === "INP" ? (
              <Tab
                label={`In-progress  (${tabCounts.inp || 0})`}
                value="all"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : location?.state?.billingDateRange === "INP" ? (
              <Tab
                label={`In-progress  (${tabCounts.inp || 0})`}
                value="INP"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : (
              <Tab
                label={`In-progress  (${tabCounts.inp || 0})`}
                value="INP"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            )
            } */}


            {/* {location?.state?.billingDateRange === "RSL" ? (
              <Tab
                label={`Resolved  (${tabCounts.rsl || 0})`}
                value="all"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : location?.state?.billingDateRange === "RSL" ? (
              <Tab
                label={`Resolved (${tabCounts.rsl || 0})`}
                value="RSL"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : (
              <Tab
                label={`Resolved  (${tabCounts.rsl || 0})`}
                value="RSL"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            )
            } */}


            {/* {location?.state?.billingDateRange === "CLD" ? (
              <Tab
                label={`Closed  (${tabCounts.cld || 0})`}
                value="all"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : location?.state?.billingDateRange === "CLD" ? (
              <Tab
                label={`Closed (${tabCounts.cld || 0})`}
                value="cld"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            ) : (
              <Tab
                label={`Closed  (${tabCounts.cld || 0})`}
                value="cld"
                style={{ marginLeft: "10px" }}
                className="customer_tabslist"
              />
            )
            } */}
            <Tab label={`All (${tabCounts?.all || 0})`} value="all" className="customer_tabslist" style={{ marginLeft: "10px" }} />
            <Tab label={`Open (${tabCounts?.opn || 0})`} value="opn" className="customer_tabslist" style={{ marginLeft: "10px" }} />
            <Tab label={`In-progress (${tabCounts?.inp || 0})`} value="inp" className="customer_tabslist" style={{ marginLeft: "10px" }} />
            <Tab label={`Assigned (${tabCounts?.asn || 0})`} value="asn" className="customer_tabslist" style={{ marginLeft: "10px" }} />
            <Tab label={`Resolved (${tabCounts?.rsl || 0})`} value="rsl" className="customer_tabslist" style={{ marginLeft: "10px" }} />
            <Tab label={`Closed (${tabCounts?.cld || 0})`} value="cld" className="customer_tabslist" style={{ marginLeft: "10px" }} />


          </Tabs>
        </Box>
      </Box>
    </>
  )
};

export default Ticketutilitybadge;
