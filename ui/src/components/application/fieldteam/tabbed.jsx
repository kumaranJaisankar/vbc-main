import React, { useState, Fragment } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";

import {
  Users,
  ShoppingBag,
  User,
  Activity,
  Clipboard,
  MessageCircle,
} from "react-feather";

import ApexCharts from "react-apexcharts";
// import { columnCharts } from "./apex-charts-data";
import Chart from "react-apexcharts";
// import { Chart } from "react-google-charts";

import configDB from "../../../data/customizer/config";
import Fieldteam from "./fieldteams";
const primary =
  localStorage.getItem("default_color") || configDB.data.color.primary_color;
const secondary =
  localStorage.getItem("secondary_color") ||
  configDB.data.color.secondary_color;

const Tabbed = (props) => {
  const [BasicLineTab, setBasicLineTab] = useState("1");

  return (
    <Fragment>
      <Container fluid={true}>
        <br />

        <Card>
          <CardBody>
            <Nav className="border-tab" tabs>
              <NavItem>
                <NavLink
                  href="#javascript"
                  className={BasicLineTab === "1" ? "active" : ""}
                  onClick={() => setBasicLineTab("1")}
                >
                  {" "}
                  Field Staff
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="#javascript"
                  className={BasicLineTab === "2" ? "active" : ""}
                  onClick={() => setBasicLineTab("2")}
                >
                  {" "}
                  Tracking Analytics
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={BasicLineTab}>
              <TabPane className="fade show" tabId="1">
                <Fieldteam />
              </TabPane>

              <TabPane tabId="2">
                <h1>Hi</h1>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>
    </Fragment>
  );
};

export default Tabbed;
