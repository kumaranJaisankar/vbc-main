import React, { Fragment, useState, useEffect } from "react";
import { Row } from "reactstrap";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../../../common/tab-panel";
import BasicInfo from "./basicinfo";
import InstallationBasicinfo from "./installtioninfo";
// import AdvanceInfo from "./contactinfo";
import DocumentsList from "./documents";
import { Box } from "@mui/material";
import StaticIpInfo from "./staticipinfo"
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
export const CustomerDetailss = (props) => {
  const [isDisabled, setIsdisabled] = useState(true);

  useEffect(() => {
    props.setActiveTab(1);
  }, [props.lead]);

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
    console.log("u clicked");
  };
  // Edit icon removed by Marieya
  return (
    <Fragment>
      {/* {token.permissions.includes(CUSTOMER_LIST.CUSTOMER_UPDATE) && (

       <EditIcon  className="icofont icofont-edit"  style={{ top: "8px", right:"64px"  }}id="edit_icon"   onClick={clicked}/>
      )} */}
      <Row>
        <Tabs
          value={props.activeTab}
          onChange={(_, value) => props.setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          TabIndicatorProps={{
            style: {
              display: "none",
            },
          }}
        >
          <Tab
            label="Basic Info"
            value={1}
            style={{ marginLeft: "28px" }}
            className="customer_tabslist"
          />
          <Tab
            label="Documents"
            value={3}
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          />
          <Tab
            label="Installation Address"
            value={2}
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          />
          <Tab
            label="Static IP"
            value={4}
            style={{ marginLeft: "10px" }}
            className="customer_tabslist"
          />


          {/* <Tab label="Radius Info" value={3} /> */}
          {/* <Tab label="Last Invoice Info" value={4} />
            <Tab label="Online Session Info" value={5} />
            <Tab label="CPE Info" value={6} />
            <Tab label="Complaints" value={7} />
            <Tab label="Additional Info" value={8} />
            <Tab label="Wallet Info" value={9} /> */}
        </Tabs>
      </Row>
      <Box sx={{ marginTop: "30px", padding: "20px" }}>
        <TabPanel index={1} value={props.activeTab}>
          <BasicInfo
            basicinfo={props.lead}
            onUpdate={(data) => {
              props.detailsUpdate(data);

              props.setProfileDetails((preState) => {
                return {
                  ...preState,
                  ...data,
                };
              });
            }}
            isDisabled={isDisabled}
            closeCustomizer={props.closeCustomizer}
            refresh={props.Refreshhandler}
            setIsdisabled={setIsdisabled}
          />
        </TabPanel>
        <TabPanel index={3} value={props.activeTab}>
          <DocumentsList
            lead={props.lead}
            fetchComplaints={props.fetchComplaints}
            isDisabled={isDisabled}
            setIsdisabled={setIsdisabled}
            onUpdate={(data) => {
              props.detailsUpdate(data);

              props.setProfileDetails((preState) => {
                return {
                  ...preState,
                  ...data,
                };
              });
            }}
          />
        </TabPanel>
        <TabPanel index={2} value={props.activeTab}>
          <InstallationBasicinfo
            basicinfo={props.lead}
            onUpdate={(data) => {
              props.detailsUpdate(data);

              props.setProfileDetails((preState) => {
                return {
                  ...preState,
                  ...data,
                };
              });
            }}
            isDisabled={isDisabled}
            closeCustomizer={props.closeCustomizer}
            refresh={props.Refreshhandler}
            setIsdisabled={setIsdisabled}
          />
        </TabPanel>
        <TabPanel index={4} value={props.activeTab}>
          <StaticIpInfo customerInfo={props.lead}  
          onUpdate={(data) => {
              props.detailsUpdate(data);

              props.setProfileDetails((preState) => {
                return {
                  ...preState,
                  ...data,
                };
              });
            }}/>
        </TabPanel>
        {/* <TabPanel index={3} value={props.activeTab}>
              <RadiusInfo
                lead={props.lead}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
            </TabPanel> */}
        {/* <TabPanel index={4} value={props.activeTab}>
              <LastInvoiceInfo
                lead={props.lead}
                renew={props.renew}
                setRenew={props.setRenew}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
            </TabPanel>
            <TabPanel index={5} value={props.activeTab}>
              <OnlineSessionInfo
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
            </TabPanel>
            <TabPanel index={6} value={props.activeTab}>
              <CpeInfo
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
            </TabPanel>
            <TabPanel index={7} value={props.activeTab}>
              <CustomerCompliant
                lead={props.lead}
              />
            </TabPanel>
            <TabPanel index={8} value={props.activeTab}>
              <AdvanceInfo
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
              />
            </TabPanel>
            <TabPanel index={9} value={props.activeTab}>
              <CustomerWalletInfo
                lead={props.lead}
                walletinformationupdate={walletinformationupdate}
                setWalletinformationupdated={setWalletinformationupdated}
              />
            </TabPanel> */}
      </Box>
    </Fragment>
  );
};
