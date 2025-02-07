import React, { useEffect, useState, useLayoutEffect, useRef,useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import {
  Row,
  Col,
  Card,
  Modal,
  ModalHeader,
  ModalFooter,
  Button,
  TabContent,
  ModalBody,
  TabPane,
  CardBody,
} from "reactstrap";
import NasLocation from "./locations/Naslocation"
import { classes } from "../../../../data/layouts";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ModalTitle, Cancel, CopyText } from "../../../../constant";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";
import DataTable from "react-data-table-component";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import Cpedetails from "../devicemanagement/opticalnetwork/cpedetails";
import { NETWORK } from "../../../../utils/permissions";
import PlaceIcon from '@mui/icons-material/Place';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Grid } from "@mui/material";
import "rc-steps/assets/index.css";
import Steps from "rc-steps";
import { networkaxios } from "../../../../axios";
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const CpeTable = (props) => {
  console.log(props.networkState, "checknework");
  let CPEText = "CPE is not configured for this Customer";
  const [showStepperListFromAddHardware, setShowStepperListFromAddHardware] =
    useState([]);
  const [availableHardware, setAvailableHardware] = useState({});
  const [parent, setParent] = useState([]);
  const [showText, setShowText] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [clearSelection, setClearSelection] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  //no delete state
  const [nomoredelete, setNomoredelete] = useState();

  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );

  const searchInputField = useRef(null);

  const Verticalcentermodaltoggle = () => {
    if (Verticalcenter == true) {
      setIsChecked([]);
      props.setIsChecked([]);
      setClearSelection(true);
    }

    if (isChecked.length > 0) {
      setVerticalcenter(!Verticalcenter);
    } else {
      toast.error("Please select any record", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  //search functionality
  const handlesearchChange = (v) => {
    let value = v && v.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      if (data.mobile_no?.toLowerCase().search(value) != -1) 
      return data
     if (data.customer_id?.toLowerCase().search(value) != -1)
      return data
      ;
    });
    setFiltereddata(result);
    props.setFiltereddata(result);
  };

  useEffect(() => {
    handlesearchChange(props.searchString);
  }, [props.searchString]);
  useEffect(() => {
    let showStepperListNew = [];
    if (!!availableHardware && availableHardware.available_hardware) {
      const available_hardwareKeys = Object.keys(
        availableHardware.available_hardware
      );
      let available_hardwareKeysFinal = [];

      if (available_hardwareKeys.includes("parentnas_info")) {
        available_hardwareKeysFinal.push("parentnas_info");
      } else if (available_hardwareKeys.includes("nas_info")) {
        available_hardwareKeysFinal.push("nas_info");
      }
      if (available_hardwareKeys.includes("parentolt_info")) {
        available_hardwareKeysFinal.push("parentolt_info");
      } else if (available_hardwareKeys.includes("olt_info")) {
        available_hardwareKeysFinal.push("olt_info");
      }
      if (available_hardwareKeys.includes("parentdp2_info")) {
        available_hardwareKeysFinal.push("parentdp2_info");
      }
      if (available_hardwareKeys.includes("parentdp1_info")) {
        available_hardwareKeysFinal.push("parentdp1_info");
      }
      if (available_hardwareKeys.includes("childdp_info")) {
        available_hardwareKeysFinal.push("childdp_info");
      }

      const availableHardwareObject = {
        ...availableHardware.available_hardware,
      };

      showStepperListNew = available_hardwareKeysFinal.map((hardware) => {
        return {
          title: availableHardwareObject[hardware].device_type,
          name: availableHardwareObject[hardware].name,
          total_ports: availableHardwareObject[hardware].total_ports,
          available_ports: availableHardwareObject[hardware].available_ports,
          zone: availableHardwareObject[hardware].zone,
          connection_port: availableHardwareObject[hardware].connection_port,
          branch: availableHardwareObject[hardware].branch,
        };
      });
    }
    setShowStepperListFromAddHardware(showStepperListNew);
  }, [availableHardware]);
  const parentnas = async (val, name) => {
    if (val) {
      setShowText(false);
      networkaxios
        .get(`network/search/${val}`)
        .then((res) => {
          if (!Array.isArray(res.data)) {
            setParent([]);
          }

          let is_parent_oltport = null;
          if (Array.isArray(res.data) && name == "parent_slno") {
            let parentSlNoList = [...res.data];
            let lastObj = parentSlNoList[parentSlNoList.length - 1];
            let stepperList = [];

            if (lastObj["category"] == "ChildDp") {
              //search in parent sl no based in childdp entered
              stepperList.push({
                title: lastObj["parentnas"] != null ? lastObj["parentnas"] : "",
              });
              stepperList.push({
                title: lastObj["parentolt"] != null ? lastObj["parentolt"] : "",
              });
              stepperList.push({
                title:
                  lastObj["parentdp1"] != null ? lastObj["parentdp1"] : "none",
              });
              stepperList.push({
                title:
                  lastObj["parentdp2"] != null ? lastObj["parentdp2"] : "none",
              });
              stepperList.push({
                title:
                  lastObj["device_name"] != null ? lastObj["device_name"] : "",
              });
            }

            setAvailableHardware(lastObj);
            setShowStepperListFromAddHardware(stepperList);
            //end

            if (parentSlNoList[parentSlNoList.length - 1].category == "Olt") {
              is_parent_oltport = true;
            } else if (
              parentSlNoList[parentSlNoList.length - 1].category == "ParentDp"
            ) {
              is_parent_oltport = false;
            }
            if (Array.isArray(res.data)) {
              if (lastObj["usable"] == true) {
                setParent(res.data);
              }
            }
          }
          // else if (name = "parent_slno") {
          //   let stepperList = [...showStepperListFromAddHardware]
          //   stepperList[0].title = "";
          //   stepperList[1].title = "";
          //   stepperList[2].title = "";
          //   stepperList[3].title = "";
          //   stepperList[4].title = "";
          //   setAvailableHardware({})
          //   setShowStepperListFromAddHardware(stepperList);

          // }
        })
        .catch(function (error) {
          setAvailableHardware({});
          setShowStepperListFromAddHardware({});
        });
    } else {
      setShowText(true);
      setAvailableHardware({});
      setShowStepperListFromAddHardware([]);
    }
  };
  //imports
  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  };
  const columns = [
    // {
    //   name: "",
    //   selector: "action",
    //   width: "80px",
    //   center: true,
    //   cell: (row) => (
    //     <MoreActions
    //     />
    //   ),
    // },
    {
      name: (
        <b className="Table_columns" id="columns_alignment">
          {"ID"}
        </b>
      ),
      selector: "id",
      cell: (row) => (
        <>
          {token.permissions.includes(NETWORK.OPTICALCPEREAD) ? (
            <a
              onClick={() => openCustomizer("4", row)}
              id="columns_alignment"
              className="openmodal"
            >
              CPE{row.id}
            </a>
          ) : (
            <a id="columns_alignment" className="openmodal">
              CPE{row.id}
            </a>
          )}
        </>
      ),
      sortable: true,
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
    },

    {
      name: <b className="Table_columns">{"Serial Number"}</b>,
      selector: "serial_no",
      sortable: true,
      style: {
        ...stickyColumnStyles,
        left: "165px !important",
      },
    },
    
    {
      name: <b className="Table_columns">{"Network Hierarchy"}</b>,
      cell: (row) => {
        return (
          <a style={{ marginLeft: "10px" }}
            onClick={() => openCustomizer1("3", row)}
            // id="columns_alignment"
            className="openmodal"
          >
            <RemoveRedEyeIcon />
          </a>
        );
      },
      sortable: false,
      style: {
        ...stickyColumnStyles,
        left: "271px !important",
        // borderRight: "1px solid #CECCCC",
      },
    },
    {
      name:<b className="Table_columns">{"View"}</b>,
      cell: (row) => {
       return (
         <a
           onClick={() => openCustomizer("5", row)}
           className="openmodal"
         >
          <PlaceIcon/>
         </a>
       );
     },
     style: {
      ...stickyColumnStyles,
      left: "370px !important",
      borderRight: "1px solid #CECCCC",
    },
     },
     {
      name: <b className="Table_columns">{"Customer ID"}</b>,
      selector: "customer_id",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.customer_id}>
          {row.customer_id}
        </div>
      ),
      //      style: {
      //   ...stickyColumnStyles,
      //   left: "275px !important",
      //   // borderRight: "1px solid #CECCCC",
      // },
    },
    {
      name: <b className="Table_columns">{"Branch"}</b>,
      selector: "branch",
      cell: (row) => (
        <div className="ellipsis" title={row.branch}>
          {row.branch ? row.branch : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Franchise"}</b>,
      selector: "franchise",
      cell: (row) => (
        <div className="ellipsis" title={row.franchise}>
          {row.franchise ? row.franchise : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Zone"}</b>,
      selector: "zone",
      cell: (row) => (
        <div className="ellipsis" title={row.zone}>
          {row.zone ? row.zone : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Area"}</b>,
      selector: "area",
      cell: (row) => (
        <div className="ellipsis" title={row.area}>
          {row.area ? row.area : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Mobile No"}</b>,
      selector: "mobile_no",
      sortable: true,
    },
    {
      name: <b className="CPETable_columns">{"Parent Child DP Port"}</b>,
      selector: "parent_child_dpport",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Address"}</b>,
      sortable: true,
      cell: (row) => (
        <div
          className="ellipsis First_Letter"
          title={`${row.house_no ? row.house_no : ""}${
            row?.house_no ? "," : ""
          }${row.street},${row.landmark},${row.city},${row.pincode},${
            row.district
          },${row.state},${row.country}`}
        >
          {`${row.house_no ? row.house_no : ""}${row?.house_no ? "," : ""}${
            row.street
          },${row.landmark},${row.city},${row.pincode},${row.district},${
            row.state
          },${row.country}`}
        </div>
      ),
      // cell: (row) => {
      //   return (
      //     <div
      //       style={{
      //         whiteSpace: "nowrap",
      //         overflow: "hidden",
      //         textOverflow: "ellipsis",
      //       }}
      //     >{`${row.house_no},${row.landmark},${row.street},${row.city},${row.pincode},${row.district},${row.state},${row.country}`}</div>
      //   );
      // },
    },
 //Sailaja changed created at as created on 19th July
 // Sailaja Modified Year Format As YYYY  for Network-> Optical Network(CPE) -> Created column on 20th March 2023

    {
      name: <b className="Table_columns">{"Created"}</b>,
      selector: "created_at",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.created_at).format("DD MMM YYYY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Make"}</b>,
      selector: "make",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Mac ID"}</b>,
      selector: "mac_bind",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Model"}</b>,
      selector: "model",
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Specification"}</b>,
      selector: "specification",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Notes"}</b>,
      selector: "notes",
      sortable: true,
    },

    // {
    //   name: <b className="Table_columns">{"Created By"}</b>,
    //   selector: "created_by",

    //   sortable: true,
    // },
    {
      name: <b className="Table_columns">{"Created By"}</b>,
      selector: row => row.created_by ? row.created_by :  "---",
      sortable: true,
    },
    {
      name: "",
      selector: "",
    },
  ];

  const deleteRows = (selected) => {
    props.setClearSelection(false);
    let rows = selected.map((ele) => ele.id);
    let ser = selected?.map((ele) => ele.serial_no);
    if (rows.length > 1) {
      notMoreThanone();
    } else {
      setIsChecked([...rows]);
      props.setSerialNo([...ser])
      //new
      props.setIsChecked([...rows]);
      props.setRowdeleterecord(selected[0]);
    }
  };
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
    let queryParams = "";

    if (!isNaN(props.searchString) && props.searchString.trim() !== "") {
      queryParams += `mobile_no=${props.searchString}`;
    } else if (props.searchString) {
      queryParams += `username=${props.searchString}`;
    }
    
    if (props.inputs && props.inputs.branch === "ALL1") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.branch) {
      queryParams += `&branch=${props.inputs.branch}`;
    }
    
    if (props.inputs && props.inputs.franchise === "ALL2") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.franchise) {
      queryParams += `&franchise=${props.inputs.franchise}`;
    }
    
    if (props.inputs && props.inputs.zone === "ALL3") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.zone) {
      queryParams += `&zone=${props.inputs.zone}`;
    }
    
    if (props.inputs && props.inputs.area === "ALL4") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.area) {
      queryParams += `&area=${props.inputs.area}`;
    }
    
    // Remove the first '&' character if it exists and serial_no is not present
    if (queryParams.startsWith("&")) {
      queryParams = queryParams.slice(1);
    }
    
    // networkaxios
    //   .get(`network/v2/cpe/display${queryParams ? `?${queryParams}` : ""}`)
    //   .then((res) => {
    //     props.setRowlength((prevState) => {
    //       return {
    //         ...prevState,
    //         ["cpe"]: res?.data?.length,
    //       };
    //     });
    //     setData(res?.data);
    //     setFiltereddata(res?.data);
    //     setLoading(false);
    //     props.setFiltereddata(res?.data);
    //     props.setData(res?.data);
    //     props.setFiltereddataBkp(res?.data);
    //     props.setCpeRefresh(0);
    //   });
    props.fetchCpeNetworkLists()
    
  }, [
    props.cperefresh,
    props.searchString  ,
    props.selectedTab,
    props.branchid,
    props.franchiseid,
    props.zoneid,
    props.areaid,
  ]);

  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      setFiltereddataBkp(data);
    }
  }, [data]);

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain-cpe").classList.add("open");

    // }
  };
  const openCustomizer1 = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain-cpe").classList.add("open");
    parentnas(id.serial_no, "parent_slno");
    // }
  };
  const toggle = () => {
    setModal(!modal);
  };
  //details update
  const detailsUpdate = (updatedata) => {
    setData([...data, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer();
    props.Refreshhandler();
  };
  // added refresh after edit by Marieya on 12/8/22
  //close customizer functionlaity
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain-cpe").classList.remove("open");
  };
  //model if user selects more than one id
  const notMoreThanone = () => {
    props.setClearSelectedRows(!props.clearSelectedRows);
    props.setClearSelection(!props.clearSelection);
    setNomoredelete(!nomoredelete);
  };

  //bg color while selecting id for delete
  const handleSelectedRows = (selectedRows) => {
    const tempFilteredData =
      filteredData.map((item) => ({ ...item, selected: false })) || [];
    const selectedIds = selectedRows.map((item) => item.id);
    const temp = tempFilteredData.map((item) => {
      if (selectedIds.includes(item.id)) return { ...item, selected: true };
      else return { ...item, selected: false };
    });
    setFiltereddata(temp);
  };

  //onside click hide sidebar
  const box = useRef(null);
  useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (
            rightSidebar &&
            !event.target.className.includes("openmodal") &&
            !event.target.className.includes("rbt-menu dropdown-menu show")
            //  && !event.target.className.includes("reactFlowdpe")
          ) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="check" />
    </div>
  ));

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  //end

  return (
    <div>
      <Card style={{ borderRadius: "0", boxShadow: "none" }}>
        <Col xl="12" style={{ padding: "0" }}>
          <nav aria-label="Page navigation example">
            {/* {loading ? (
              <Skeleton
                count={11}
                height={30}
                style={{ marginBottom: "10px", marginTop: "15px" }}
              />
            ) : ( */}
              <div className="data-table-wrapper">
                <Col md="8"></Col>
                <DataTable
                   onChangeRowsPerPage={props.handleCpePerRowsChange}
                   onChangePage={props.handleCpePageChange}
                  className="nastable-list"
                  columns={columns}
                  // data={filteredData}
                  noHeader
                  // selectableRows
                  // onSelectedRowsChange={({ selectedRows }) =>
                  //   deleteRows(selectedRows)
                  // }
                  // clearSelectedRows={clearSelectedRows}
                  data={props.cpeLists?.pageLoadData || []}
                  progressPending={props.cpeLists?.uiState?.loading}
                  progressComponent={
                    <SkeletonLoader loading={props.cpeLists?.uiState.loading} />
                  }
                  pagination
                  paginationServer
                  paginationTotalRows={props.cpeLists.totalRows} 
                  noDataComponent={"No Data"}
                  // clearSelectedRows={props.clearSelectedRows}
                  clearSelectedRows={props.clearSelection}
                  // conditionalRowStyles={props.conditionalRowStyles}
                  // // selectableRows
                  // onSelectedRowsChange={({ selectedRows }) => (
                  //   handleSelectedRows(selectedRows),
                  //   deleteRows(selectedRows)
                  // )}
                  conditionalRowStyles={conditionalRowStyles}
                  selectableRows
                  onSelectedRowsChange={({ selectedRows }) => (
                    handleSelectedRows(selectedRows), deleteRows(selectedRows)
                  )}
                  // selectableRowsComponent={NewCheckbox}
                />
              </div>
            {/* )} */}
          </nav>
        </Col>
        <br />
      </Card>
      {/* edit functionlaity */}
      <Row>
        <Col md="12">
          <div
            className="customizer-contain customizer-contain-cpe"
            ref={box}
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
                {/* pop up for not more than one delete */}
                <Modal isOpen={nomoredelete} toggle={notMoreThanone} centered>
                  {/* <ModalHeader toggle={noDelete}></ModalHeader> */}
                  <ModalBody>
                    <p>Please select only one record</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={notMoreThanone}>
                      Ok
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* end */}
              </div>
              <div className=" customizer-body custom-scrollbar">
                <TabContent activeTab={activeTab1}>
                  <TabPane tabId="3">
                    <div id="headerheading"> Network Hierarchy </div>
                    {!showText ? (
          <Card
            style={{
              height:"fit-content",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="custom-scrollbar "
          >
            <CardBody style={{ padding: "15px" }}>
              <div className="customizer-contain-alloptical-expand-stepper-section-info" style={{marginLeft:"100px"}}>
                <Steps
                  current={showStepperListFromAddHardware.length}
                  direction="vertical"
                  labelPlacement="vertical"
                >
                  {showStepperListFromAddHardware.map((step) => {
                    return (
                      <Steps.Step
                        title={step.title}
                        description={
                          <div className="step-description">
                            <span>
                              Harware Device Name:
                              <span className="btn btn-primary btn-xs step-span">
                                {" "}
                                {step.name}
                              </span>
                            </span>
                            <br />
                            {step.branch && (
                              <>
                                <span>
                                  Current Device's Branch:
                                  <span className="btn btn-primary btn-xs step-span">
                                    {" "}
                                    {step.branch}
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                            {step.total_ports && (
                              <>
                                <span>
                                  Total ports & Available ports:
                                  <span className="btn btn-primary btn-xs step-span">
                                    {" "}
                                    ( {step.total_ports}/ {step.available_ports}
                                    )
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                            {step.zone && (
                              <>
                                <span>
                                  Current Device Zone:{" "}
                                  <span className="btn btn-primary btn-xs step-span">
                                    {" "}
                                    {step.zone}
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                            {step.connection_port && (
                              <>
                                {" "}
                                <span>
                                  Connection Port:
                                  <span className="btn btn-primary btn-xs step-span">
                                    {step.connection_port}
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                          </div>
                        }
                      />
                    );
                  })}
                </Steps>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Grid spacing={1} container sx={{ mb: "5px" }}>
            <Grid item md="12">
              <span className="cust_details" style={{ marginLeft: "60px" }}>
                {" "}
                {CPEText}
              </span>
            </Grid>
          </Grid>
        )}
                    {/* <NasDeviceDetails
                     detailsname={props.detailsname}
                    setDeatilsname={props.setDeatilsname}
                    cpedata={data}
                      dataClose={closeCustomizer}
                      lead={lead}
                      setParentdpDetails={setParentdpDetails}
                      parentdpDetails={parentdpDetails}
                      setChilddpDetails={setChilddpDetails}
                      childdpDetails={childdpDetails}
                      setCpeDetails={setCpeDetails}
                      cpeDetails={cpeDetails}
                    /> */}
                  </TabPane>
                </TabContent>
              </div>
              <div className=" customizer-body custom-scrollbar">
                <TabContent activeTab={activeTab1}>
                  <TabPane tabId="4">
                    <div id="headerheading" style={{ marginTop: "-86px" }}>
                      CPE Information : CPE{lead.id}{" "}
                    </div>

                    <Cpedetails
                    networkState={props.networkState}
                      lead={lead}
                      onUpdate={(data) => detailsUpdate(data)}
                      dataClose={closeCustomizer}
                      rightSidebar={rightSidebar}
                      openCustomizer={openCustomizer}
                      Refreshhandler={props.Refreshhandler}
                    />
                  </TabPane>
                  <TabPane tabId="5">
                        <div id="headerheading" style={{ marginTop: "-85px" }}>
                          {" "}
                          CPE Information : CPE{lead.id}{" "}
                        </div>
                        <NasLocation lead ={lead}/>
                      </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* end */}
    </div>
  );
};

const SkeletonLoader = ({ loading }) => {
  const tableData = useMemo(
    () => (loading ? Array(10).fill({}) : []),
    [loading]
  );

  return (
    <Box sx={{ width: "100%", pl: 2, pr: 2 }}>
      {tableData.map((_) => (
        <Skeleton height={50} />
      ))}
    </Box>
  );
};
export default CpeTable;
