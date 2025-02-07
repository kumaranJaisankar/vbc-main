import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavLink,
  ModalBody,
} from "reactstrap";

import {
  Search,
  ModalTitle,
  CopyText,
  Cancel,
  Close,
} from "../../../constant";
import {customeraxios} from "../../../axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { DefaultLayout as DefaultLayoutTheme} from '../../../layout/theme-customizer';
// import {FilterContainer} from './FilterContainer';

const ConsolidatedOnline = (props, initialValues) => {
  const id = window.location.pathname.split('/').pop()
  const defaultLayout= Object.keys(DefaultLayoutTheme);
  const layout= id ? id : defaultLayout

  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  // const [exportData, setExportData] = useState({ columns: columns,exportHeaders:[]})
  // const [exportData, setExportData] = useState({ columns: columns, data: [] });
  const [lead, setLead] = useState([]);
  const width = useWindowSize();

  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [levelMenu, setLevelMenu] = useState(false)
  const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu)
  }

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

  useEffect(() => {
    setLoading(true);
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === sidebar_type
    );
    const modifyURL =
      process.env.PUBLIC_URL +
      "/dashboard/default/" +
      Object.keys(defaultLayoutObj).pop();
    const id =
      window.location.pathname === "/"
        ? history.push(modifyURL)
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);

    customeraxios
      .get(`customer_list`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  }, [refresh]);

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  const update = (newRecord) => {
    console.log(newRecord);
    setData([...data, newRecord]);
    // setFiltereddata([...data, newRecord]);
    setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    closeCustomizer();
  };

  const filterUpdate = (filteredData) => {
    console.log(filteredData);
    setData([...filteredData]);
    setFiltereddata([...filteredData]);
    closeCustomizer();
  };

  const detailsUpdate = (updatedata) => {
    console.log(updatedata);
    setData([...data, updatedata]);
    // setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer();
  };

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      console.log(data);
      if (
        data.mobile_no.search(value) != -1 ||
        data.first_name.search(value) != -1 ||
        data.email.search(value) !== -1
      )
        return data;
    });
    setFiltereddata(result);
  };

  // delete api
  // const onDelete = () => {
  //   axiosBaseURL.delete("/radius/lead/delete/multiple", {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ ids: isChecked }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       var difference = [];
  //       if (data.length > 0) {
  //         difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
  //         setFailed([...data]);
  //       } else {
  //         difference = [...isChecked];
  //       }
  //       setFiltereddata((prevState) => {
  //         var newdata = prevState.filter(
  //           (el) => difference.indexOf(el.id) === -1
  //         );
  //         return newdata;
  //       });
  //       Verticalcentermodaltoggle();
  //       setClearSelectedRows(true);
  //       console.log(filteredData);

  //       setIsChecked([]);
  //       if (data.length > 0) {
  //       }
  //     });
  // };

  //delete
  const deleteRows = (selected) => {
    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);

    console.log(rows);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  const openCustomizer = (type, id) => {
    console.log(id);
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    if (rightSidebar) {
      document.querySelector(".customizer-contain").classList.add("open");

      // document.querySelector(".customizer-links").classList.add('open');
    }
  };

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

 

  const columns = [
    {
      name: "S.No",
      selector: "",
      sortable: true,
    },
    // {
    //   name: "ID",
    //   selector:"id",
    //   cell: (row) => (
    //     <a
    //       onClick={() => openCustomizer("3", row)}
    //       style={{ cursor: "pointer", color: "blue" }}
    //     >
    //       L00{row.id}
    //     </a>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Live Graph",
      // selector: "account_status",
      sortable: true,
    },
    {
      name: "NAS IP",
      selector: "radius_info.nasport_bind",
      sortable: true,
    },
   
    {
      name: "Online Users",
      selector: "",
      sortable: true,
    },
    {
      name: "No. of Ports",
      selector: "",
      sortable: true,
    },
    {
      name: "Download",
      selector: "",
      sortable: true,
    },
    {
      name: "Upload",
      selector: "",
      sortable: true,
    },
    {
      name: "Total",
      selector: "",
      sortable: true,
    },
   
   
   
   
   
  
  ];
  const [exportData, setExportData] = useState({ columns: columns, exportHeaders:[]});

  return (
    <Fragment>
      <div className="customizer-links" style={{ top: "22%" }}>
        <Nav
          className="flex-column nac-pills"
          style={{
            backgroundColor: "#7366ff ",
            borderRadius: "8px 0px 0px 8px",
          }}
        >
          <NavLink onClick={() => openCustomizer("1")}>
            <div className="settings">
              <i
                className="icon-panel shadow-lg"
                style={{
                  transform: "rotate(90deg)",
                  color: "white",
                  fontSize: "35px",
                  padding: "2px 5px",
                }}
              ></i>
            </div>
            <span> Filters </span>
          </NavLink>
        </Nav>
      </div>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col md="8" style={{ paddingBottom: "20px", paddingLeft: "34px" }}>
              <div role="group" class="btn-group">
                
                <button
                  class="btn btn-primary"
                  onClick={Verticalcentermodaltoggle}
                  //  onClick={() => onDelete()}
                >
                  <i
                    // onClick={Verticalcentermodaltoggle}
                    className="icofont icofont-ui-delete"
                    style={{
                      color: "white",
                      fontSize: "21px",
                      cursor: "pointer",
                    }}
                    // {VerticallyCentered}
                  ></i>
                  &nbsp;&nbsp; Delete
                </button>
                {/* modal */}
                <Modal
                  isOpen={Verticalcenter}
                  toggle={Verticalcentermodaltoggle}
                  centered
                >
                  <ModalHeader toggle={Verticalcentermodaltoggle}>
                    Confirmation
                  </ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to delete?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="secondary"
                      onClick={Verticalcentermodaltoggle}
                    >
                      {Close}
                    </Button>
                    <Button color="primary" 
                    // onClick={() => onDelete()}
                    >
                      Yes
                    </Button>
                  </ModalFooter>
                </Modal>
                <button class="btn btn-primary" onClick={Refreshhandler}>
                  <i
                    className="icofont icofont-refresh"
                    style={{
                      color: "white",
                      fontSize: "22px",
                      cursor: "pointer",
                    }}
                  ></i>
                  &nbsp;&nbsp;Refresh
                </button>

              

               
                <Col className="left-header horizontal-wrapper pl-0" style={{display:"contents"}}>
                <li className="level-menu outside" style={{display:"block"}}>   
                 <button class="btn btn-primary nav-link" onClick={() => OnLevelMenu(levelMenu)} style={{marginLeft:0,borderRadius:0,color:"white"}}>
                  <i
                    className="icon-filter"
                    style={{
                      color: "white",
                      fontSize: "22px",
                      cursor: "pointer",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0
                    }}
                  ></i>
                  &nbsp;&nbsp;Filter
                </button>

                {/* <FilterContainer levelMenu={levelMenu}/> */}
          </li>
          </Col>
              </div>
            </Col>

            <Col md="4">
              <Form>
                {/* <Col sm="12"> */}
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search With name , code or email..."
                  onChange={(event) => handlesearchChange(event)}
                  ref={searchInputField}
                  style={{
                    border: "none",
                    backgroundColor: "white",
                  }}
                />
                <Search className="search-icon" />
                {/* </Col> */}
              </Form>
            </Col>

            <Col md="12">
              <Card style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <Col xl="12">
                  <nav aria-label="Page navigation example">
                    {loading ? (
                      <Skeleton
                        count={11}
                        height={30}
                        style={{ marginBottom: "10px", marginTop: "15px" }}
                      />
                    ) : (
                      <div>
                       
                          <DataTable
                            columns={columns}
                            data={filteredData}
                            noHeader
                            // striped={true}
                            // center={true}
                            // clearSelectedRows={clearSelectedRows}
                            
                            selectableRows
                            onSelectedRowsChange={({ selectedRows }) =>
                              deleteRows(selectedRows)
                            }
                            clearSelectedRows={clearSelectedRows}
                            pagination
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
                <div className="customizer-contain">
                  <div className="tab-content" id="c-pills-tabContent">
                    <div
                      className="customizer-header"
                      style={{ padding: "0px", border: "none" }}
                    >
                      <br />
                      <i className="icon-close" onClick={closeCustomizer}></i>
                      <br />
                      <Modal
                        isOpen={modal}
                        toggle={toggle}
                        className="modal-body"
                        centered={true}
                      >
                        <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
                        <ModalFooter>
                          <CopyToClipboard text={JSON.stringify(configDB)}>
                            <Button
                              color="primary"
                              className="notification"
                              onClick={() =>
                                toast.success("Code Copied to clipboard !", {
                                  position: toast.POSITION.BOTTOM_RIGHT,
                                })
                              }
                            >
                              {CopyText}
                            </Button>
                          </CopyToClipboard>
                          <Button color="secondary" onClick={toggle}>
                            {Cancel}
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </div>
                    <div className=" customizer-body custom-scrollbar">
                      <TabContent activeTab={activeTab1}>
                        <TabPane tabId="1">
                          <h6 style={{ textAlign: "center" }}>Filters</h6>
                          {/* <MyLeads
                            onUpdate={(data) => filterUpdate(data)}
                            ref={searchInputField}
                          /> */}
                        </TabPane>
                        <TabPane tabId="2">
                          <h6 style={{ textAlign: "center" }}> Add Lead </h6>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                {/* <AddLeads
                                  dataClose={closeCustomizer}
                                  onUpdate={(data) => update(data)}
                                /> */}
                              </div>
                            </li>
                          </ul>
                        </TabPane>
                        <TabPane tabId="3">
                          {/* <LeadDetails
                            lead={lead}
                            onUpdate={(data) => detailsUpdate(data)}
                          /> */}
                        </TabPane>
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

export default ConsolidatedOnline;


















// import React, { Fragment, useEffect, useState } from "react";
// // import Breadcrumb from "../../layout/breadcrumb";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Media,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
// } from "reactstrap";
// import axios from "axios";
// import { user, userconsolidate, consolidateonline } from "../../../constant";

// const ConsolidatedOnline = (props, initialValues) => {
//   const [data, setData] = useState([]);
//   const [startDate, setstartDate] = useState(new Date());
//   const [endDate, setendDate] = useState(new Date());
//   const [inputs, setInputs] = useState(initialValues);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     axios
//       .get(`${process.env.PUBLIC_URL}/api/user-edit-table.json`)
//       .then((res) => setData(res.data));
//   }, []);

//   const handleChange = (date) => {
//     setstartDate(date);
//   };
//   const addDays = (date) => {
//     setstartDate(date, 4);
//   };

//   const setEndDate = (date) => {
//     setendDate(date);
//   };

//   const handleSearchform = (e) => {
//     e.persist();
//     setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
//   };

//   const validate = (inputs) => {
//     const errors = {};
//     //mobilenumber error
//     if (inputs.filtermobilenumber) {
//       var pattern = new RegExp(/^[6789]\d{9}$/);
//       if (
//         !pattern.test(inputs.filtermobilenumber) ||
//         inputs.filtermobilenumber.length != 10
//       ) {
//         // errors.onlynumber='Please enter only number';
//         errors.filtermobilenumber = (
//           <i
//             style={{ color: "#FB6059", fontSize: "23px" }}
//             className="icofont icofont-exclamation-circle"
//           ></i>
//         );
//       }
//     }
//     //email
//     if (inputs.filteremail) {
//       var pattern = new RegExp(
//         /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
//       );
//       if (!pattern.test(inputs.filteremail)) {
//         // errors.validemail = 'Please enter valid email';
//         errors.filteremail = (
//           <i
//             style={{ color: "#FB6059", fontSize: "23px" }}
//             className="icofont icofont-exclamation-circle"
//           ></i>
//         );
//       }
//     }
//     return errors;
//   };
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const validationErrors = validate(inputs);
//     const noErrors = Object.keys(validationErrors).length === 0;
//     setErrors(validationErrors);
//     if (noErrors) {
//       console.log(inputs);
//     } else {
//       console.log("errors try again", validationErrors);
//     }
//   };

//   return (
//     <Fragment>
//       <br />
//       <Container fluid={true}>
//         <div className="edit-profile">
//           <Row>
//             <Col sm="12">
//               <Form className="card" onSubmit={handleSubmit}>
//                 <CardHeader>
//                   <Col sm="12">
//                     <div className="header-top">
//                       <h6 className="m-0">Filter</h6>
//                       <div className="card-header-right-icon">
//                         <i
//                           className="icofont icofont-fire"
//                           style={{ fontSize: "21px" }}
//                         ></i>
//                         <i
//                           className="icofont icofont-minus"
//                           style={{ fontSize: "21px" }}
//                         ></i>
//                       </div>
//                     </div>
//                   </Col>
//                 </CardHeader>

//                 <CardBody>
//                   <Row>
//                     <Col sm="2">
//                       <FormGroup>
//                         <Label className="form-label">Select Franchise</Label>
//                         <Input type="select" name="status">
//                           <option selected>All</option>
//                           <option value="25">VBC ON FIBER</option>
//                           <option value="50">VBC RAJAHMUNDRY</option>
//                           <option value="70">VBCMDP</option>
//                           <option value="100">vbcsrmt</option>
//                           <option value="100">VBC_ONFIBER</option>
//                           <option value="100">
//                             VIZAG BROADCASTING COMPANY PVT LTD
//                           </option>
//                         </Input>
//                       </FormGroup>
//                     </Col>

//                     <Col sm="2">
//                       <FormGroup>
//                         <Label className="form-label">Branch</Label>
//                         <Input type="select" name="status">
//                           <option selected>All</option>
//                           <option value="25">demotest</option>
//                           <option value="50">VEPAGUNTA</option>
//                         </Input>
//                       </FormGroup>
//                     </Col>
//                     <Col sm="2">
//                       <FormGroup>
//                         <Label className="form-label">NAS</Label>
//                         <Input type="select" name="status">
//                           <option selected>All</option>
//                           <option value="25">
//                             VBC-City-POP-103.40.48.14(328 Online)
//                           </option>
//                           <option value="50">
//                             MURALINAGAR-103.40.48.26(258 Online)
//                           </option>
//                           <option value="70">
//                             YENDADA 2ND NAS-123.108.200.102(142 Online)
//                           </option>
//                         </Input>
//                       </FormGroup>
//                     </Col>

//                     <Col sm="2">
//                       <FormGroup>
//                         <Label className="form-label">Base Package</Label>
//                         <Input type="select" name="status">
//                           <option selected>All</option>
//                           <option value="25">CMR100MB-2000GB</option>
//                           <option value="50">COMBO-100MB-HDTP</option>
//                           <option value="70">COMBO-100MB-SDTP</option>
//                           <option value="50">COMBO-50MB-HDTP</option>
//                           <option value="70">COMBO-50MB-SDTP</option>
//                           <option value="70">COMBO-150MB(CABLETV)</option>
//                           <option value="70">COMBO-30MB(CABLETV)</option>
//                           <option value="70">DEMO-100MB</option>
//                           <option value="70">DEMO-10MB(CABLETV)</option>
//                         </Input>
//                       </FormGroup>
//                     </Col>
//                     <Col sm="2">
//                       <FormGroup>
//                         <Label className="form-label">Running Package</Label>
//                         <Input type="select" name="status">
//                           <option selected>All</option>
//                           <option value="25">CMR100MB-2000GB</option>
//                           <option value="50">COMBO-100MB-HDTP</option>
//                           <option value="70">COMBO-100MB-SDTP</option>
//                           <option value="50">COMBO-50MB-HDTP</option>
//                           <option value="70">COMBO-50MB-SDTP</option>
//                           <option value="70">COMBO-150MB(CABLETV)</option>
//                           <option value="70">COMBO-30MB(CABLETV)</option>
//                           <option value="70">DEMO-100MB</option>
//                           <option value="70">DEMO-10MB(CABLETV)</option>
//                         </Input>
//                       </FormGroup>
//                     </Col>
//                     <Col sm="2">
//                       <FormGroup>
//                         <Label className="form-label">Protocal</Label>
//                         <Input type="select" name="status">
//                           <option selected>All</option>
//                           <option value="25">IPOE</option>
//                           <option value="50">PPPOE</option>
//                         </Input>
//                       </FormGroup>
//                     </Col>

//                     <Col sm="2">
//                       <FormGroup>
//                         <Label className="form-label">Account Status</Label>
//                         <Input type="select" name="status">
//                           <option selected>All</option>
//                           <option value="25">Active</option>
//                           <option value="50">Expired/Disabled</option>
//                         </Input>
//                       </FormGroup>
//                     </Col>
//                   </Row>

//                   <div className="text-right">
//                     <button className="btn btn-primary" type="submit">
//                       Search
//                     </button>
//                   </div>
//                 </CardBody>
//                 {/* </Card> */}
//               </Form>
//             </Col>

//             <Col md="12">
//               <Card>
//                 <div className="table-responsive">
//                   <table className="table card-table table-vcenter text-nowrap">
//                     <thead>
//                       <tr>
//                         {userconsolidate.map((items, i) => (
//                           <th key={i}>{items}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {data.map((items, i) => (
//                         <tr key={i}>
//                           <td>4963</td>
//                           <td>68.08TB</td>
//                           <td>9.93TB</td>
//                           <td>78.01TB</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </Card>
//             </Col>

//             <Col md="12">
//               <Card>
//                 <div className="table-responsive">
//                   <table className="table card-table table-vcenter text-nowrap">
//                     <thead>
//                       <tr>
//                         {consolidateonline.map((items, i) => (
//                           <th key={i}>{items}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {data.map((items, i) => (
//                         <tr key={i}>
//                           <td>1</td>
//                           <td></td>
//                           <td>123.108.200.34</td>
//                           <td>537</td>
//                           <td>2</td>
//                           <td>6.02TB</td>
//                           <td>595.96GB</td>
//                           <td>6.60TB</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </Container>
//     </Fragment>
//   );
// };

// export default ConsolidatedOnline;
