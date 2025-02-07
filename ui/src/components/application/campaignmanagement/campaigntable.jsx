import React, { Fragment, useState, useLayoutEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Label,
  TabContent,
  TabPane,
  CardBody,
  Input,
  CardHeader,
  Collapse,
} from "reactstrap";
import { Search } from "react-feather";

import DataTable from "react-data-table-component";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";

const collapsableSidepane = {
  transition: "width 0.5s"
}

const width200 = {
  width: "300px"
}

const width100 = {
  width: "0px",
  overflow: "hidden"
}

const CampaignTable = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const width = useWindowSize();

  const [modal, setModal] = useState();
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);

  const configDB = useSelector((content) => content.Customizer.customizer);

  const [isFilter, setIsFilter] = useState(true);

  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    searchInputField.current.value = "";
  };

  const searchInputField = useRef(null);

  //imports

  const columns = [
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "State",
      selector: "state",
      sortable: true,
    },
    {
      name: "Sender",
      selector: "sender",
      sortable: true,
    },
    {
      name: "Content Type",
      selector: "content",
      sortable: true,
    },
    {
      name: "Sent",
      selector: "sent",
      sortable: true,
    },
    {
      name: "Reached",
      selector: "reached",
      sortable: true,
    },
  ];

  const dataa = [
    {
      title: "Welcome Message",
      state: <Button color="light">Draft</Button>,
      sender: "Agent name",
      content: "SMS",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="success">Live</Button>,
      sender: "Agent name",
      content: "Mobile push",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="warning">Hold</Button>,
      sender: "Agent name",
      content: "E-mail",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="light">Draft</Button>,
      sender: "Agent name",
      content: "Ads",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="light">Draft</Button>,
      sender: "Agent name",
      content: "SMS",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="light">Draft</Button>,
      sender: "Agent name",
      content: "E-mail",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="light">Draft</Button>,
      sender: "Mobile push",
      content: "18-10-2021",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="success">Live</Button>,
      sender: "Agent name",
      content: "SMS",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="light">Draft</Button>,
      sender: "Agent name",
      content: "SMS",
      sent: "696",
      reached: "600",
    },
    {
      title: "Welcome Message",
      state: <Button color="light">Draft</Button>,
      sender: "Agent name",
      content: "E-mail",
      sent: "696",
      reached: "600",
    },
  ];

  const [expandCollapse, toggleExpandCollapse] = useState(true);

  const handleSidePaneExpandCollapse = (e) => {
    toggleExpandCollapse(!expandCollapse);
  }
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <div style={{ backgroundColor: "#FAFAFA", maxWidth:"none", ...collapsableSidepane,  ...(expandCollapse ? width200 : width100)}}>
              <div
                className="default-according style-1 faq-accordion job-accordion"
                id="accordionoc"
              >
                <Row>
                  <Col xl="12">
                    <div>
                      <div>
                        <h5 className="mb-0">
                          <Button
                            color="link pl-0"
                            data-toggle="collapse"
                            onClick={() => setIsFilter(!isFilter)}
                            data-target="#collapseicon"
                            aria-expanded={isFilter}
                            aria-controls="collapseicon"
                          >
                            {"Filters"}
                          </Button>
                        </h5>
                      </div>
                      <Collapse isOpen={isFilter}>
                        <div className="filter-cards-view animate-chk">
                          <div className="checkbox-animated">
                            <Label className="d-block" htmlFor="chk-ani">
                              <Input
                                className="checkbox_animated"
                                id="chk-ani"
                                type="checkbox"
                              />
                              {"Full-time (8688)"}
                            </Label>
                            <Label className="d-block" htmlFor="chk-ani1">
                              <Input
                                className="checkbox_animated"
                                id="chk-ani1"
                                type="checkbox"
                              />
                              {"Contract (503)"}
                            </Label>
                            <Label className="d-block" htmlFor="chk-ani2">
                              <Input
                                className="checkbox_animated"
                                id="chk-ani2"
                                type="checkbox"
                              />
                              {"Part-time (288)"}
                            </Label>
                            <Label className="d-block" htmlFor="chk-ani3">
                              <Input
                                className="checkbox_animated"
                                id="chk-ani3"
                                type="checkbox"
                              />
                              {"Internship (236)"}
                            </Label>
                            <Label className="d-block" htmlFor="chk-ani4">
                              <Input
                                className="checkbox_animated"
                                id="chk-ani4"
                                type="checkbox"
                              />
                              {"Temporary (146)"}
                            </Label>
                            <Label className="d-block" htmlFor="chk-ani5">
                              <Input
                                className="checkbox_animated"
                                id="chk-ani5"
                                type="checkbox"
                              />
                              {"Commission (25)"}
                            </Label>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <Col
              xl="12 xl-60"
              style={{ paddingBottom: "70px", borderRadius: "10%" }}
            >
              <Row>
                <Col xl="3 xl-40">
                  <i onClick={handleSidePaneExpandCollapse} style={{cursor:"pointer"}}>Button here</i>
                  <p className="ongoing">Ongoing</p>
                  <p
                    className="ongoing"
                    style={{ color: "black", border: "none" }}
                  >
                    256 messages
                  </p>
                </Col>
               
                <Col xl="9 xl-60">
                  <button
                    style={{
                      whiteSpace: "nowrap",
                      marginRight: "15px",
                      fontSize: "medium",
                      float: "right",
                    }}
                    class="btn btn-primary"
                    type="submit"
                  >
                    <span style={{ marginLeft: "-10px" }}>
                      &nbsp;&nbsp; New{" "}
                    </span>
                    <i
                      className="icofont icofont-plus"
                      style={{
                        paddingLeft: "10px",
                        cursor: "pointer",
                      }}
                    ></i>
                  </button>
                </Col>
              </Row>

              <Card style={{ borderRadius: "0", marginTop: "100px" }}>
                <Col xl="12" style={{ padding: "0" }}>
                  <nav aria-label="Page navigation example">
                    {loading ? (
                      <Skeleton count={11} height={30} />
                    ) : (
                      <div className="data-table-wrapper">
                        <DataTable
                          columns={columns}
                          data={dataa}
                          selectableRows
                          pagination
                          noHeader
                          noDataComponent={"No Data"}
                        />
                      </div>
                    )}
                  </nav>
                </Col>
                <br />
              </Card>
            </Col>
            <Row>
              <Col md="12">
                <div
                  className="customizer-contain"
                  style={{
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                  }}
                >
                  <div className="tab-content" id="c-pills-tabContent">
                    <div
                      className="customizer-header"
                      style={{
                        border: "none",
                        backgroundColor: "#FFE1D0",
                        borderTopLeftRadius: "20px",
                      }}
                    ></div>
                    <div className=" customizer-body custom-scrollbar">
                      <TabContent activeTab={activeTab1}>
                        <TabPane tabId="2">
                          <div id="headerheading"> Add Franchise Role</div>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img"></div>
                            </li>
                          </ul>
                        </TabPane>
                        <TabPane tabId="3"></TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default CampaignTable;
