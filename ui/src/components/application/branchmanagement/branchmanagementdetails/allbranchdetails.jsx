import React, { Fragment, useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Row,
} from "reactstrap";

import DownloadLedger from "./downloadledger";
import BranchWallet from "./branchwallet";

export const AllBranchDetails = (props) => {
  
  const [BasicLineTab, setBasicLineTab] = useState("4");
  const [expanded1, setexpanded1] = useState(true);
  const [expanded2, setexpanded2] = useState(false);
  const [expanded3, setexpanded3] = useState(false);
  const [isDisabled, setIsdisabled] = useState(true);
  //state for showing area field on click of edit button
  const [showarea, setShowarea] = useState(false);

  const Accordion1 = () => {
    setexpanded1(!expanded1);
    setexpanded2(false);
    setexpanded3(false);
  };
  const Accordion2 = () => {
    setexpanded2(!expanded2);
    setexpanded1(false);
    setexpanded3(false);
  };
  const Accordion3 = () => {
    setexpanded3(!expanded3);
    setexpanded2(false);
    setexpanded1(false);
  };

  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
    setShowarea(true);
  };

  return (
    <Fragment>
      {/* <i
        className="icofont icofont-edit"
        // disabled={isDisabled}
        onClick={clicked}
      ></i> */}
      <Container fluid={true}>
        <Row>
          <Nav className="border-tab" tabs>
            {/* <NavItem className="custlist">
              <NavLink
                style={{ backgroundColor: "#ffd9b3", borderRadius: "5px" }}
                href="#javascript"
                className={BasicLineTab === "1" ? "active" : ""}
                onClick={() => setBasicLineTab("1")}
              >
                Basic Information
              </NavLink>
            </NavItem>

            <NavItem className="custlist">
              <NavLink
                style={{ backgroundColor: "#ffd9b3", borderRadius: "5px" }}
                href="#javascript"
                className={BasicLineTab === "2" ? "active" : ""}
                onClick={() => setBasicLineTab("2")}
              >
                Assigned Packages
              </NavLink>
            </NavItem> */}

            <NavItem className="custlist">
              <NavLink
                style={{ backgroundColor: "#ffd9b3", borderRadius: "5px" }}
                href="#javascript"
                className={BasicLineTab === "4" ? "active" : ""}
                onClick={() => setBasicLineTab("4")}
              >
                Branch Wallet
              </NavLink>
            </NavItem>

            <NavItem className="custlist">
              <NavLink
                style={{ backgroundColor: "#ffd9b3", borderRadius: "5px" }}
                href="#javascript"
                className={BasicLineTab === "5" ? "active" : ""}
                onClick={() => setBasicLineTab("5")}
              >
                Download Ledger
              </NavLink>
            </NavItem>

          </Nav>
        </Row>

        <Row>
          <TabContent activeTab={BasicLineTab}>
            {/* <TabPane className="fade show" tabId="1">
              <BasicInfo
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
                showarea={showarea}
              />
            </TabPane> */}
            {/* <TabPane tabId="2">
              <AssignedPackage
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
            </TabPane> */}
            <TabPane tabId="4">
              <BranchWallet
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
            </TabPane>
            <TabPane tabId="5">
              <DownloadLedger
                lead={props.lead}
                onUpdate={(data) => props.detailsUpdate(data)}
                isDisabled={isDisabled}
                setIsdisabled={setIsdisabled}
              />
            </TabPane>
           
          </TabContent>
        </Row>
      </Container>
    </Fragment>
  );
};
