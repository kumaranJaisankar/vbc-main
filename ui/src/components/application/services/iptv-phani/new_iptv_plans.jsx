import React, { Fragment, useState, useEffect } from "react";

import { Container, TabContent, TabPane, Row, Col } from "reactstrap";
import BouquetForm from "./bouquetForm";
import Stack from "@mui/material/Stack";
import { classes } from "../../../../data/layouts";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import ChannelsForm from "./channelsForm";
import CategoryForm from "./categoriesForm";
import BroadcasterForm from "./broadCastersForm";
import MUIButton from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FilterIcon from "@mui/icons-material/FilterAlt";
import IptvBadge from "./iptvbadge";
import ChannelsTable from "./channelsTable";
import CategoriesTable from "./categoriesTable";
import BroadcastersTable from "./broadcastersTable";
import BouquetTable from "./bouquetsTable";
import BouquetEditForm from "./bouquetEditForm";

const OpenBouquet = () => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const [activeTab1, setActiveTab1] = useState("1");
  const [selectedTab, setSelectedTab] = useState("channel");
  const [refresh, setRefresh] = useState(false);

  const openCustomizer = (type) => {
    setActiveTab1(type);
    document.querySelector(".customizer-contain").classList.add("open");
  };
  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    if (window.location.search !== "") {
      key = key + window.location.search;
    }
    history.push(key);
  };

  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    if (window.location.search !== "") {
      history.replace({
        search: "",
      });
    }
  };

  const refreshHandler = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <Fragment>
        <br />
        <Container fluid={true}>
          <div className="edit-profile">
            <Stack direction="row" spacing={2}>
              <button
                onClick={() => openCustomizer("2")}
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "medium",
                }}
                className="btn btn-primary openmodal"
                type="submit"
              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; New{" "}
                </span>
                <i
                  className="icofont icofont-plus openmodal"
                  style={{
                    paddingLeft: "10px",
                    cursor: "pointer",
                  }}
                ></i>
              </button>
              <MUIButton
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refreshHandler}
              >
                Refresh
              </MUIButton>
              <MUIButton
                variant="outlined"
                startIcon={<FilterIcon />}
                endIcon={<ArrowDropDownIcon />}
              >
                More Filters
              </MUIButton>
            </Stack>
            <IptvBadge
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <br />
            {selectedTab == "channel" && <ChannelsTable refresh={refresh} />}
            {selectedTab == "category" && <CategoriesTable refresh={refresh} />}
            {selectedTab == "broadcaster" && <BroadcastersTable refresh={refresh} />}
            {selectedTab == "bouquet" && <BouquetTable refresh={refresh} openCustomizer={openCustomizer} />}
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
                        borderTopLeftRadius: "20px",
                      }}
                    >
                      <i className="icon-close" onClick={closeCustomizer}></i>
                      <br />
                      <br />
                    </div>
                    <div className=" customizer-body custom-scrollbar">
                      <TabContent activeTab={activeTab1}>
                        <TabPane tabId="2">
                          {selectedTab == "bouquet" && (
                            <div id="headerheading"> Add Bouquet </div>
                          )}
                          {selectedTab == "channel" && (
                            <div id="headerheading">Add Channel</div>
                          )}
                          {selectedTab == "category" && (
                            <div id="headerheading">Add Category</div>
                          )}
                          {selectedTab == "broadcaster" && (
                            <div id="headerheading">Add BroadCaster</div>
                          )}
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                {activeTab1 == "2" &&
                                  selectedTab == "bouquet" && (
                                    <BouquetForm close={closeCustomizer} />
                                  )}
                                {activeTab1 == "2" &&
                                  selectedTab == "channel" && (
                                    <ChannelsForm close={closeCustomizer} />
                                  )}
                                {activeTab1 == "2" &&
                                  selectedTab == "category" && (
                                    <CategoryForm close={closeCustomizer} />
                                  )}
                                {activeTab1 == "2" &&
                                  selectedTab == "broadcaster" && (
                                    <BroadcasterForm close={closeCustomizer} />
                                  )}
                              </div>
                            </li>
                          </ul>
                        </TabPane>

                        <TabPane tabId="3">
                          {selectedTab == "bouquet" && (
                            <div id="headerheading"> Bouquet Information</div>
                          )}
                          {selectedTab == "channel" && (
                            <div id="headerheading">Add Channel</div>
                          )}
                          {selectedTab == "category" && (
                            <div id="headerheading">Add Category</div>
                          )}
                          {selectedTab == "broadcaster" && (
                            <div id="headerheading">Add BroadCaster</div>
                          )}
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                {activeTab1 == "3" &&
                                  selectedTab == "bouquet" && <BouquetEditForm/>}
                                {activeTab1 == "2" &&
                                  selectedTab == "channel" && (
                                    <ChannelsForm close={closeCustomizer} />
                                  )}
                                {activeTab1 == "2" &&
                                  selectedTab == "category" && (
                                    <CategoryForm close={closeCustomizer} />
                                  )}
                                {activeTab1 == "2" &&
                                  selectedTab == "broadcaster" && (
                                    <BroadcasterForm close={closeCustomizer} />
                                  )}
                              </div>
                            </li>
                          </ul>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </Fragment>
    </div>
  );
};
export default OpenBouquet;
