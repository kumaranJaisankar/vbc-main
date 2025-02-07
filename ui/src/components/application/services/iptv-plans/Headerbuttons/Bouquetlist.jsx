import React, { Fragment, useState, useEffect } from "react";

import { Container, Row, Col, Card, TabContent, TabPane } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Stack from "@mui/material/Stack";
import AddBouquet from "../addBouquet";
import { classes } from "../../../../../data/layouts";
import { ADD_SIDEBAR_TYPES } from "../../../../../redux/actionTypes";
import MUIButton from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
const BouquetlList = (props) => {
 
  const [activeTab1, setActiveTab1] = useState("1");
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );

  let history = useHistory();
  let DefaultLayout = {};
  const dispatch = useDispatch();
  useEffect(() => {
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === sidebar_type
    );

    const id =
      window.location.pathname === "/"
        ? history.push()
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);
  }, []);
  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  const openCustomizer = (type, id) => {

    setActiveTab1(type);
    document.querySelector(".customizer-contain").classList.add("open");
  };


  const closeCustomizer = () => {
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  
  return (
    <Fragment>
      <br />
      <Container fluid={true} style={{position:"absolute", marginTop:"-140px"}}>
        <div className="edit-profile">
          <Stack direction="row" spacing={2}>
            <button
              style={{
                whiteSpace: "nowrap",
                fontSize: "medium",
                marginLeft:"-10px",height:"45px"
              }}
              className="btn btn-primary openmodal"
              type="submit"
              onClick={() => openCustomizer("2")}
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
            < MUIButton
                variant="outlined"
                startIcon={<RefreshIcon />}
              >
                Refresh
              </MUIButton>
              <MUIButton  variant="outlined" startIcon = {<AddIcon/>} disabled={props.comboAdd.length ==0}
             >
                New Combo
              </MUIButton>

              <MUIButton  variant="outlined" startIcon = {<AddIcon/>} disabled={props.comboAdd.length ==0}>
                Existing Combo
              </MUIButton>

          </Stack>
        
          <Row>
            <Col md="12">
              <div
                className="customizer-contain openblade"
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
                    <br />
                    <i className="icon-close" onClick={closeCustomizer}></i>
                    <br />
                  </div>
                  <div className=" customizer-body custom-scrollbar">
                    <TabContent activeTab={activeTab1}>
                      <TabPane tabId="2">
                        <div id="headerheading"> Add Bouquet </div>
                        <ul
                          className="layout-grid layout-types"
                          style={{ border: "none" }}
                        >
                          <li
                            data-attr="compact-sidebar"
                            onClick={(e) => handlePageLayputs(classes[0])}
                          >
                            <div className="layout-img">
                              <AddBouquet />
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
  );
};

export default BouquetlList;
