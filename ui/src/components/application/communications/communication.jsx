import React, { useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Tab1 from "./email";
import Addemail from "./addemail";
import Tab2 from "./sms";
import Tab3 from "./whatsapp";
import Tab4 from "./notification";
import Addsms from "./addsms";
import { campaignaxios } from "../../../axios";

// import NewCustomerLists from "../customermanagement/NewCustomerLists"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  TabContent,
  TabPane,
} from "reactstrap";
import Box from "@mui/material/Box";
import Addwhatsapp from "./addwhatsapp";
import CommunicationTab from "./CommTab";
import Addnotification from "./addnotification";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}
const Communications = (props) => {
  const [activeTab, setActiveTab] = useState("1");
  const [gridView, setgridView] = useState(true);
  const mybookmarklist = useSelector(
    (content) => content.Bookmarkapp.mybookmarkdata
  );

  const [rightSidebar, setRightSidebar] = useState(true);
  const [activeSideTab, setActiveSideTab] = useState("1");
  const [selectedTab, setSelectedTab] = useState("email");

  // states for notification api call
  const [networkdata, setNetworkdata] = useState({});
  const [loading, setLoading] = useState(false);

  const openCustomizer = (type) => {
    setActiveSideTab(type);
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const [value, setValue] = React.useState(0);



  //added communications by Marieya
  const update = (type) => {
    setLoading(true);
    if(type === 'notifications'){
      campaignaxios.get(`notifications`).then((res) => {
        setNetworkdata(res.data);
        // setFiltereddata(res.data);
        setLoading(false);
      });
     }else{
      campaignaxios.get(`notifications/${type}`).then((res) => {
        setNetworkdata(res.data);
        // setFiltereddata(res.data);
        setLoading(false);
      });
     }
    closeCustomizer();
  };
  
const getData =(type)=>{
  setLoading(true);
  console.log(type);
  if(type === 'notifications'){
    campaignaxios.get(`notifications`).then((res) => {
      setNetworkdata(res.data);
      // setFiltereddata(res.data);
      setLoading(false);
    });
   }else{
    campaignaxios.get(`notifications/${type}`).then((res) => {
      setNetworkdata(res.data);
      // setFiltereddata(res.data);
      setLoading(false);
    });
   }
  closeCustomizer();
}
  // useEffect(() => {
  //   setLoading(true);
  //   campaignaxios.get(`notifications`).then((response) => {
  //     setNetworkdata(response.data);
  //     setLoading(false);
  //   });
  // }, []);
  return (
    <>
      <Container fluid={true}>
        <Grid item md="12" id="breadcrumb_margin_com">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={
              <NavigateNextIcon fontSize="small" className="navigate_icon" />
            }
          >
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
              App Settings
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="#00000 !important"
              fontSize="14px"
              className="last_typography"
            >
              Communication
            </Typography>
          </Breadcrumbs>
        </Grid>
        <br />
        <div className="comm_main">
          <Row>
          
            <Col xl="12" md="12" className="box-col-12">
              <div className="email-right-aside bookmark-tabcontent">
                <Card className="email-body radius-left">
                  <div>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <Card className="mb-0">
                          <CardBody>
                            <div>
                                  <CommunicationTab
                                    selectedTab={selectedTab}
                                    setSelectedTab={setSelectedTab}
                                  />
                                  {selectedTab == "email" && <Tab1  onClick={() => getData("email")} networkdata={networkdata} setNetworkdata={setNetworkdata} loading={loading}
                                      setLoading={setLoading} />}
                                  {selectedTab == "sms" && <Tab2  onClick={() => getData("sms")} networkdata={networkdata} setNetworkdata={setNetworkdata} loading={loading}
                                      setLoading={setLoading}/>}
                                  {selectedTab == "whatsapp" && <Tab3 onClick={() => getData("whatsapp")} networkdata={networkdata}  setNetworkdata={setNetworkdata} loading={loading}
                                      setLoading={setLoading} />}
                                  {selectedTab == "notification" && (
                                    <Tab4
                                      networkdata={networkdata}
                                      setNetworkdata={setNetworkdata}
                                      loading={loading}
                                      setLoading={setLoading}
                                    />
                                  )}
                                     <button
                                    onClick={() => openCustomizer("2")}
                                    id="addingbutton_tab"
                                   
                                    className="btn btn-primary openmodal"
                                    type="submit"
                                  >
                                    <span
                                      style={{ marginLeft: "-10px" }}
                                      className="openmodal"
                                    >
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
                              
                            </div>
                          </CardBody>
                        </Card>
                      </TabPane>
                      <TabPane tabId="3">
                        <Card className="mb-0">
                          <CardHeader className="d-flex">
                            <h6 className="mb-0">{"Broadcasting"}</h6>
                          </CardHeader>
                          <CardBody>
                            <div className="details-bookmark text-center">
                              <Row></Row>
                            </div>
                          </CardBody>
                        </Card>
                      </TabPane>
                    </TabContent>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
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
                    <TabContent activeTab={activeSideTab}>
                      <TabPane tabId="2">
                        {selectedTab == "email" && (
                          <div id="headerheading">Add Email</div>
                        )}
                        {selectedTab == "sms" && (
                          <div id="headerheading">Add SMS</div>
                        )}
                        {selectedTab == "whatsapp" && (
                          <div id="headerheading">Add WhatsApp</div>
                        )}
                        {selectedTab == "notification" && (
                          <div id="headerheading">Add Notification</div>
                        )}
                        <ul
                          className="layout-grid layout-types"
                          style={{ border: "none" }}
                        >
                          <li
                            data-attr="compact-sidebar"
                            //   onClick={(e) => handlePageLayputs(classes[0])}
                          >
                            <div className="layout-img">
                              {activeSideTab == "2" &&
                                selectedTab == "whatsapp" && <Addwhatsapp dataClose={closeCustomizer}
                                onUpdate={(networkdata) =>
                                  update(networkdata)
                                }/>}
                              {activeSideTab == "2" &&
                                selectedTab == "email" && <Addemail dataClose={closeCustomizer}
                                onUpdate={(networkdata) =>
                                  update(networkdata)
                                }/>}
                              {activeSideTab == "2" && selectedTab == "sms" && (
                                <Addsms dataClose={closeCustomizer}
                                    onUpdate={(networkdata) =>
                                      update(networkdata)
                                    }/>
                              )}
                              {activeSideTab == "2" &&
                                selectedTab == "notification" && (
                                  <Addnotification
                                    dataClose={closeCustomizer}
                                    onUpdate={(networkdata) =>
                                      update(networkdata)
                                    }
                                  />
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
    </>
  );
};
//made changes by marieya

export default Communications;
