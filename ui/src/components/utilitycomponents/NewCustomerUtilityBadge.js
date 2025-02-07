import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import moment from "moment";
import { useLocation } from "react-router-dom";
var startDate = moment().format("YYYY-MM-DD");
var endDate = moment().format("YYYY-MM-DD");

const NewCustomerUtilityBadge = (props) => {
  const { currentTab, tabCounts, setActiveTab } = props;
  const location = useLocation();
  //commented off tab counts by marieya
  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={currentTab}
          onChange={(_, value) => setActiveTab(value)}
          aria-label="iptv plans section"
          indicatorColor={""}
        >
          <Tab
            // label={`All`}
            label={`All (${tabCounts.all || 0})`}
            value="all"
            className="customer_tabslist"
          />





          <Tab
            // label={`Active `}
            label={`Active (${tabCounts.act || 0})`}
            value="act"
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          />


          {/* <Tab
            label={`Online (${tabCounts.online || 0})`}
            value="online"
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          /> */}

          <Tab
            // label={`Expired`}
            label={`Expired (${tabCounts.exp || 0})`}
            value="exp"
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          />



          {/* <Tab
            label={`Offline (${tabCounts.offline || 0})`}
            value={`act&line_status=offline`}
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          /> */}


          <Tab
            // label={`Suspended`}
            label={`Suspended (${tabCounts.spd || 0})`}
            value="spd"
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          />
          {location?.state?.billingDateRange != 'hld' && location?.state?.billingDateRange != 'dct' &&

            <Tab
              // label={`Provisioning`}
              label={`Provisioning (${tabCounts.prov || 0})`}
              value="prov"
              style={{ marginLeft: "10px" }}
              className="customer_tabslist"
            />}
          {location?.state?.billingDateRange === 'hld' &&
            <Tab
              // label={`Provisioning`}
              label={`Hold (${tabCounts.hld || 0})`}
              value="hld"
              style={{ marginLeft: "10px" }}
              className="customer_tabslist"
            />}

          {location?.state?.billingDateRange === 'dct' &&
            <Tab
              // label={`Provisioning`}
              label={`Deactive (${tabCounts.dct || 0})`}
              value="dct"
              style={{ marginLeft: "10px" }}
              className="customer_tabslist"
            />}


          <Tab
            // label={`New Connections`}
            label={`New Connections (${tabCounts.new_customers || 0})`}
            value={`&created=${startDate}&created_end=${endDate}`}
            style={{ marginLeft: "10px", marginRight: "11px" }}
            className="customer_tabslist"
          />
          <Tab
            // label={`Static_IP `}
            label={`Static_IP (${tabCounts.static_ip_customers || 0})`}
            value={`&static_ip=0`}
            className="customer_tabslist"
          />
          <Tab
            label={`Temporary Renewal(${tabCounts.buffer || 0})`}
            value={`act&payment_status=UPD`}
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default NewCustomerUtilityBadge;
