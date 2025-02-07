import React, { Fragment, useEffect, useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Row,
} from "reactstrap";
import BasicInfo from "./basicinfo";
import AssignedPackage from "./assignedpackage";
import FranchiseWallet from "./franchisewallet";
import DownloadLedgerNew from "./downloadleadernew";
import EditIcon from "@mui/icons-material/Edit";
import { FRANCHISE } from "../../../../utils/permissions";
import { servicesaxios } from "../../../../axios";
import { toast } from "react-toastify";

import EditStaticIp from "./Editstaticip";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const tokenInfo = JSON.parse(localStorage.getItem("token"));
let Franchiseedit = true;
if (tokenInfo && tokenInfo.user_type === "Franchise Owner") {
  Franchiseedit = false;
}

export const AllFranchiseDetails = (props) => {
  const [BasicLineTab, setBasicLineTab] = useState("1");
  const [isDisabled, setIsdisabled] = useState(true);
  const [rightSidebar, setRightSidebar] = useState(true);
  //state for showing area field on click of edit button
  const [showarea, setShowarea] = useState(false);
  const [walletinformationupdate, setWalletinformationupdated] = useState([]);
  const [leadUser, setLeadUser] = useState(props.lead);

  //new states
  const [selectserviceobj, setSelectServiceobj] = useState();
  const [selectserviceobjnew, setSelectServiceobjnew] = useState();

  const [formData, setFormData] = useState({});
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [servicelist, setServicelist] = useState({});
  const [allserviceplanobj, setAllServiceplanobj] = useState([]);
  const [allServicePlanObjCopy, setAllServicePlanObjCopy] = useState([]);

  const [staticIp, setStaticIP] = useState([]);
  // get static ip's list
  // const staticIpList = (value) => {
  //   networkaxios.get(`network/ippool/used_ips/${value}`).then((res) => {
  //     let { available_ips } = res.data;
  //     setStaticIP([...available_ips]);
  //   });
  // };

  // pool list
  // const getIpPools = () => {
  //   let value = leadUser && leadUser.branch && leadUser.branch.id;
  //   networkaxios
  //     .get(`network/ippool/filter?nas_branch=${value}`)
  //     .then((res) => {
  //       setIpPool([...res.data]);
  //     });
  // };

  const Allplanstoggle = () => {
    setSelectServiceobj(!selectserviceobj);
  };
  const AnotherToggle = () => {
    setSelectServiceobjnew(!selectserviceobjnew);
  };
  useEffect(() => {
    console.log(servicelist, "servicelist");
    setServicelist(servicelist);
  }, [servicelist]);

  const datasubmit = (e) => {
    console.log("inside get call", props?.lead?.plans);
    console.log("form data in submit", formData);
    // e.preventDefault();
    setLoaderSpinner(true);
    servicesaxios
      .get("/plans/list")
      .then((res) => {
        console.log(res);
        console.log(res.data);
        let curServiceList = {};
        // if (
        //   formData.leadDetailsForInputs &&
        //   formData.leadDetailsForInputs.plans
        // ) {
        //   for (let i = 0; i < formData.leadDetailsForInputs.plans.length; i++) {
        //     curServiceList[formData.leadDetailsForInputs.plans[i].plan] = {
        //       ...formData.leadDetailsForInputs.plans[i],
        //       id: formData.leadDetailsForInputs.plans[i].plan,
        //       selected: true,
        //       disabled: true,
        //       existing: "selected",
        //     };
        //   }
        //   setServicelist({ ...curServiceList });
        // }
        if (props?.lead && props?.lead?.plans) {
          for (let i = 0; i < props?.lead?.plans.length; i++) {
            curServiceList[props?.lead?.plans[i].plan] = {
              ...props?.lead?.plans[i],
              id: props?.lead?.plans[i].plan,
              selected: true,
              disabled: true,
              existing: "selected",
            };
          }
          setServicelist({ ...curServiceList });

          console.log();
        } else {
          console.log(curServiceList, "curServiceList in franchise");
          setServicelist({ ...curServiceList });
        }
        setAllServiceplanobj(res.data);
        setAllServicePlanObjCopy(res.data);
        setLoaderSpinner(false);
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
    setShowarea(true);
    if (BasicLineTab === "2") {
      datasubmit();
      AnotherToggle();
    }
  };
  //setting from date and to date to empty
  useEffect(() => {
    setBasicLineTab("1");
    // setBasicLineTab(props.rightSidebar? "1": null);
  }, [props.rightSidebar]);

  // useEffect(() => {
  //   staticIpList();
  // }, []);
  const closeCustomizer = () => {
    setRightSidebar(false);

    document.querySelector(".customizer-contain").classList.remove("open");
  };

  return (
    <Fragment>
      {token.permissions.includes(FRANCHISE.UPDATE) && (
        <>
          {Franchiseedit ? (
            <EditIcon
              className="icofont icofont-edit"
              style={{ top: "8px", right: "64px" }}
              onClick={clicked}
              disabled={isDisabled}
            />
          ) : (
            ""
          )}
        </>
      )}

      <Container fluid={true}>
        <Row>
          <Nav className="border-tab" tabs>
            {token.permissions.includes(FRANCHISE.BASICINFO) && (
              <NavItem className="custlist">
                <NavLink
                  href="#javascript"
                  className={BasicLineTab === "1" ? "active" : ""}
                  onClick={() => setBasicLineTab("1")}
                >
                  Basic Info
                </NavLink>
              </NavItem>
            )}
            {token.permissions.includes(FRANCHISE.ASSIGNEDPACK) && (
              <>
                <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                  <NavLink
                    href="#javascript"
                    className={BasicLineTab === "2" ? "active" : ""}
                    onClick={() => setBasicLineTab("2")}
                  >
                    Assigned Packages
                  </NavLink>
                </NavItem>
              </>
            )}
            <>
              <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                <NavLink
                  href="#javascript"
                  className={BasicLineTab === "3" ? "active" : ""}
                  onClick={() => setBasicLineTab("3")}
                >
                  Static IP
                </NavLink>
              </NavItem>
            </>
            {token.permissions.includes(FRANCHISE.WALLET) && (
              <>
                <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                  <NavLink
                    href="#javascript"
                    className={BasicLineTab === "4" ? "active" : ""}
                    onClick={() => setBasicLineTab("4")}
                  >
                    Franchise Wallet
                  </NavLink>
                </NavItem>
              </>
            )}

            {token.permissions.includes(FRANCHISE.LEDGER) && (
              <>
                <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                  <NavLink
                    href="#javascript"
                    className={BasicLineTab === "5" ? "active" : ""}
                    onClick={() => setBasicLineTab("5")}
                  >
                    Ledger
                  </NavLink>
                </NavItem>
              </>
            )}

            {/* <NavItem className="custlist">
              <NavLink
                style={{ backgroundColor: "#ffd9b3", borderRadius: "5px" }}
                href="#javascript"
                className={BasicLineTab === "6" ? "active" : ""}
                onClick={() => setBasicLineTab("6")}
              >
                Switch login
              </NavLink>
            </NavItem> */}
          </Nav>
        </Row>

        <>
          <TabContent activeTab={BasicLineTab}>
            <TabPane className="fade show" tabId="1">
              <BasicInfo
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
                showarea={showarea}
                dataClose={closeCustomizer}
                rightSidebar={props.rightSidebar}
                openCustomizer={props.openCustomizer}
                franchisestatus={props.franchisestatus}
                Refreshhandler={props.Refreshhandler}
              />
            </TabPane>
            <TabPane tabId="2">
              <AssignedPackage
                formData={formData}
                setFormData={setFormData}
                loaderSpinneer={loaderSpinneer}
                setLoaderSpinner={setLoaderSpinner}
                servicelist={servicelist}
                setServicelist={setServicelist}
                allserviceplanobj={allserviceplanobj}
                setAllServiceplanobj={setAllServiceplanobj}
                allServicePlanObjCopy={allServicePlanObjCopy}
                setAllServicePlanObjCopy={setAllServicePlanObjCopy}
                selectserviceobj={selectserviceobj}
                setSelectServiceobj={setSelectServiceobj}
                Allplanstoggle={Allplanstoggle}
                AnotherToggle={AnotherToggle}
                setSelectServiceobjnew={setSelectServiceobjnew}
                selectserviceobjnew={selectserviceobjnew}
                datasubmit={datasubmit}
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setLead={props.setLead}
                setIsdisabled={setIsdisabled}
                leadUser={leadUser}
                setLeadUser={setLeadUser}
                clicked={clicked}
              />
            </TabPane>
            <TabPane tabId="3">
              <EditStaticIp
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                lead={props.lead}
                setStaticIP={setStaticIP}
                setIsdisabled={setIsdisabled}
                staticIp={staticIp}
                leadUser={leadUser}
                setLeadUser={setLeadUser}
              />
            </TabPane>

            <TabPane tabId="4">
              <FranchiseWallet
                lead={props.lead}
                setLead={props.setLead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
                walletinformationupdate={walletinformationupdate}
                setWalletinformationupdated={setWalletinformationupdated}
                // rightSidebar={props.rightSidebar}
                dataClose={closeCustomizer}
                Refreshhandler={props.Refreshhandler}
              />
            </TabPane>
            <TabPane tabId="5">
              {/* <DownloadLedger
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                walletinformationupdate={walletinformationupdate}
                setIsdisabled={setIsdisabled}
                rightSidebar={props.rightSidebar}
                setWalletinformationupdated={setWalletinformationupdated}
              /> */}
              {BasicLineTab === "5" && (
                <DownloadLedgerNew
                  BasicLineTab={BasicLineTab}
                  lead={props.lead}
                  onUpdate={(data) => props.detailsUpdate(data)}
                  isDisabled={isDisabled}
                  walletinformationupdate={walletinformationupdate}
                  setIsdisabled={setIsdisabled}
                  rightSidebar={props.rightSidebar}
                  setWalletinformationupdated={setWalletinformationupdated}
                />
              )}
            </TabPane>
            {/* <TabPane tabId="6">
              <SwitchLogin
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
              
            </TabPane> */}
          </TabContent>
        </>
      </Container>
    </Fragment>
  );
};
