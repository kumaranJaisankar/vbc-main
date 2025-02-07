import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Input,
  Label,
} from "reactstrap";
import { adminaxios } from "../../../../axios";
import ModalNetworkData from "./modalNetworkdata";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DpTable from "./dptable"
import CPETable from "./cpetable"
import ChildDpTable from "./childdp"

const NetworkFields = (props) => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const [modal, setModal] = useState();

  const [inputs, setInputs] = useState({});

  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);

  // padding dates filters

  useEffect(() => {
    if (
      props.customstartdate !== undefined ||
      props.customenddate !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.filterbranch !== undefined
    ) {
      setSearchbuttondisable(false);
    }
  }, [props.customstartdate, props.customenddate, inputs]);

  // modal onclick open

  const toggle = () => {
    setModal(!modal);
  };

  // close function
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  //end

  //handle change event
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    let val = event.target.value;

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (name == "filterbranch") {
      getlistoffranchises(val);
    }
  };

  // coming up labels

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const box = useRef(null);

 
  //get franchise options based on branch selection
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        console.log(response.data);
        setOnfilterbranch(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //end
  const [networkTabList, setNetworkTabList] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setNetworkTabList(newValue);
  };

  const [dpList, setDpList] = useState("parentdp")
  return (
    <>
      <Box sx={{ padding: 4 }}>
        <Grid container spacing={1} >
          <Grid item md="12">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={<NavigateNextIcon fontSize="small" className="navigate_icon" />}
            >
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color=" #377DF6"
                fontSize="14px"
              >
                Dashboard
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color=" #377DF6"
                fontSize="14px"
              ><Link
                to={`${process.env.PUBLIC_URL}/app/Reports/Reports/allreports/${process.env.REACT_APP_API_URL_Layout_Name}`}
              >
                  Reports</Link>
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                fontSize="14px"
                className="last_typography"

              >
                Network Reports
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Box>
      <Container fluid={true}>
        <div className="edit-profile data_table">
          {/* <Row>
         
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="franchiselistt"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.franchiselistt}
                  >
                    <option style={{ display: "none" }}></option>

                    {onfilterbranch.map((reportonfranchise) => (
                      <option
                        key={reportonfranchise.id}
                        value={reportonfranchise.id}
                      >
                        {reportonfranchise.name}
                      </option>
                    ))}
                  </Input>

                  <Label className="placeholder_styling">OLT</Label>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "medium",
                  height: "37px",
                }}
                className="btn btn-primary openmodal"
                type="submit"
                disabled={searchbuttondisable}
                onClick={() => setSearchbuttondisable(!searchbuttondisable)}
              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col>
          </Row> */}

          {/* {searchbuttondisable? ( */}


          {/* ):""} */}

          {/* end */}
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={networkTabList}>
              <Box >
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="OLT" value="1" className="customer_tabslist" />
                  <Tab label="DP" value="2" className="customer_tabslist" style={{ marginLeft: "10px" }} />
                  <Tab label="CPE" value="3" className="customer_tabslist" style={{ marginLeft: "10px" }} />
                </TabList>
              </Box>
              <TabPanel value="1"> <ModalNetworkData
                customstartdate={props.customstartdate}
                customenddate={props.customenddate}
                inputs={inputs}
              /></TabPanel>
              <TabPanel value="2">
                <div style={{display:"flex"}} >
                  <div>
                    <Input
                      className="radio_animated"
                      id="radioinlinerenew"
                      type="radio"
                      name="parentdp"
                      value="parentdp"
                      checked={dpList === "parentdp"}
                      onClick={() => setDpList("parentdp")}
                    />

                    <Label className="mb-0" for="radioinlinerenew">
                      {Option}
                      <span className="digits"> {"Parent DP"}</span>
                    </Label>
                  </div>
                  &nbsp; &nbsp; &nbsp;
                  <div>
                    <Input
                      className="radio_animated"
                      id="radioinlinerenew"
                      type="radio"
                      name="childdp"
                      value="childdp"
                      checked={dpList === "childdp"}
                      onClick={() => setDpList("childdp")}
                    />

                    <Label className="mb-0" for="radioinlinerenew">
                      {Option}
                      <span className="digits"> {"Child DP"}</span>
                    </Label>
                  </div>
                </div>
                {dpList === "parentdp" ? (

                  <>
                    <DpTable />
                  </>
                )
                  : dpList === "childdp" ? <><ChildDpTable /></> : ""
                }
              </TabPanel>
              <TabPanel value="3"><CPETable /></TabPanel>
            </TabContext>
          </Box>

        </div>
      </Container>
    </>
  );
};

export default NetworkFields;
