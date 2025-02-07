import React, { Fragment, useState, useEffect } from "react";
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
import BranchWallet from "./branchwallet";
import DownloadLedger from "./downloadledger";
import EditIcon from "@mui/icons-material/Edit";
import { BRANCH } from "../../../../utils/permissions";
import { adminaxios } from "../../../../axios";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

export const AllBranchDetails = (props) => {
  const [BasicLineTab, setBasicLineTab] = useState("1");
  const [isDisabled, setIsdisabled] = useState(true);
  const [rightSidebar, setRightSidebar] = useState(true);

  //state for showing area field on click of edit button
  const [showarea, setShowarea] = useState(false);

  const [walletinformationupdate, setWalletinformationupdated] = useState([]);

  // // useEffect(() => {
  //   const owner = () =>{
  //     adminaxios
  //     .get("accounts/options/branchowner")
  //     .then((res) => {
  //       console.log("API Response: ", res.data);
  //       let { role_wise_users } = res.data;
  //       //   setOwnerlist([...role_wise_users.branch_owners]);
  //       // Sailaja sorting the Branch Module -> New Panel-> User * Dropdown data as alphabetical order on 28th March 2023
  //       setOwnerlist([...role_wise_users.branch_owners]);
  //     })
  //     .catch((error) => console.log(error));
  //   }
   
  // // }, []);

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
    setShowarea(true);
    // owner();
  };
  // commented off line 60 by Marieya for displaying branch info
  useEffect(() => {
    setBasicLineTab("1");
    // setBasicLineTab(props.rightSidebar ? "1" : null);
  }, [props.rightSidebar])

  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  // Sailaja Fixed Edit icon by giving Style id="edit_icon" Position on 2nd August
  return (
    <Fragment>
        {token.permissions.includes(BRANCH.UPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          id="branchEdit"
          // style={{ position:"absolute", left: "7%",top:"7px" }}
          onClick={clicked}
        // disabled={isDisabled}

        />
      )}
      <Container fluid={true}>
        <Row>
          <Nav className="border-tab" tabs>
            {token.permissions.includes(BRANCH.BASICINFO) && (
              <NavItem className="custlist" >

                <NavLink
                  href="#javascript"
                  className={BasicLineTab === "1" ? "active" : ""}
                  onClick={() => setBasicLineTab("1")}
                >
                  Basic Information
                </NavLink>
              </NavItem>
            )}
            {token.permissions.includes(BRANCH.BRANCHWALLET) && (
              <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                <NavLink
                  href="#javascript"
                  className={BasicLineTab === "4" ? "active" : ""}
                  onClick={() => setBasicLineTab("4")}
                >
                  Branch Wallet
                </NavLink>
              </NavItem>
            )}
            {token.permissions.includes(BRANCH.BRANCHLEDGER) && (

              <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                <NavLink
                  href="#javascript"
                  className={BasicLineTab === "5" ? "active" : ""}
                  onClick={() => setBasicLineTab("5")}
                >
                  Ledger
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Row>

        <Row>
          <TabContent activeTab={BasicLineTab} style={{ width: "100%" }}>
            <TabPane className="fade show" tabId="1">
              {BasicLineTab &&
                <BasicInfo
                  lead={props.lead}
                  clicked={clicked}
                  onUpdate={(data) => props.onUpdate(data)}
                  isDisabled={isDisabled}
                  setIsdisabled={setIsdisabled}
                  showarea={showarea}
                  dataClose={closeCustomizer}
                  openCustomizer={props.openCustomizer}
                  // ownerlist={ownerlist}
                  // setOwnerlist={setOwnerlist}
                />}
            </TabPane>
            <TabPane tabId="4">
              <BranchWallet
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
                walletinformationupdate={walletinformationupdate}
                setWalletinformationupdated={setWalletinformationupdated}
                dataClose={props.dataClose}
              />
            </TabPane>

            <TabPane tabId="5">
              <DownloadLedger
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
                walletinformationupdate={walletinformationupdate}
                setWalletinformationupdated={setWalletinformationupdated}
                rightSidebar={props.rightSidebar}
                setRefresh={props.setRefresh}
              />
            </TabPane>

          </TabContent>
        </Row>
     
      </Container>
    </Fragment>
  );
};
