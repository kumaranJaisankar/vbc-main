import React, { useEffect, useState, useLayoutEffect, useRef, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
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
} from "reactstrap";
import PlaceIcon from '@mui/icons-material/Place';
import { networkaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { classes } from "../../../../data/layouts";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ModalTitle, Cancel, CopyText } from "../../../../constant";
import { nasType } from "../nas/nasdropdown";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DataTable from "react-data-table-component";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import NasDetails from "../nas/nasdetails";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NETWORK } from "../../../../utils/permissions";
import EXPCIRCLE from "../../../../assets/images/Customer-Circle-img/ExpiredCircle.png";
import ACTCIRCLE from "../../../../assets/images/Customer-Circle-img/ActiveCircle.png";
import Typography from "@mui/material/Typography";
import NasDeviceDetails from "../nas/nasdevicedetails";
import NasLocation from "./locations/Naslocation"
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const NasTable = (props) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [modal, setModal] = useState();
  const [activeTab1, setActiveTab1] = useState("1");

  const [rightSidebar, setRightSidebar] = useState(true);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  //no delete state
  const [noDeletee, setNoDelete] = useState();
  //end
  //no delete state
  const [nomoredelete, setNomoredelete] = useState();
  const width = useWindowSize();

  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type] = useState(configDB.settings.sidebar.type);

  const searchInputField = useRef(null);
  //added reset of states for parent and childdp
  //state for storing parentdp api details
  const [parentdpDetails, setParentdpDetails] = useState();
  const [parentdpInfo, setParentdpInfo] = useState();
  //end
  const [childdpDetails, setChilddpDetails] = useState();
  const [defaultchilddpDetails, setDefaultchilddpDetails] = useState();

  const [cpeDetails, setCpeDetails] = useState();
  const [oltDetails, setOltDetails] = useState();
//map states code for opening view map only on click 
  const [openTableView,setOpenTableView] = useState(false); 
  const [nasDetailsName, setNasDetailsName] = useState()
  //search functionality
  const handlesearchChange = (v) => {
    let value = v && v?.toLowerCase();
    let result = [];
    result = data?.filter((data) => {
      if (data?.serial_no?.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  useEffect(() => {
    handlesearchChange(props?.searchString);
  }, [props?.searchString]);

  //imports
  const nasStatus = {
    INACT: "Inactive",
    IN: "Inactive",
    ACT: "Active",
  };
  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  };

  const columns = [
    {
      name: <b className="Table_columns">{"ID"}</b>,
      selector: "id",
      cell: (row) => (
        <>
          {token.permissions.includes(NETWORK.OPTICALNASREAD) ? (
            <a onClick={() => openCustomizer("3", row)} className="openmodal">
              NAS{row.id}
            </a>
          ) : (
            <a className="openmodal">NAS{row?.id}</a>
          )}
        </>
      ),
      sortable: true,
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
      selector: "name",
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Serial Number"}
        </b>
      ),
      selector: "serial_no",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row?.serial_no}>
          {row?.serial_no}
        </div>
      ),
      style: {
        ...stickyColumnStyles,
        left: "160px !important",
      },
    },
    {
      name: <b className="Table_columns">{"Actions"}</b>,
      cell: (row) => {
        return (
          <a style={{ marginLeft: "10px" }}
            onClick={() => openCustomizer("4", row)}
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
      name: <b className="Table_columns">{"View"}</b>,
      cell: (row) => {
        return (
        <a
        onClick={() => {
          openCustomizer("5",row);
          OpenMaponView()
      }}
        // onClick={() => openCustomizer("5", row)}
        className="openmodal"
      >
        <PlaceIcon />
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
      name: <b className="Table_columns">{"Name"}</b>,
      selector: "name",
      cell: (row) => (
        <div className="ellipsis" title={row?.name}>
          {row.name}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Status"}</b>,
      selector: "status",
      sortable: true,
      cell: (row) => {
        return (
          <>
            {row.status === "ACT" ? (
              <img src={ACTCIRCLE} />
            ) : row.status === "INACT" || row.status === "IN" ? (
              <img src={EXPCIRCLE} />
            ) : (
              ""
            )}
            &nbsp; &nbsp;
            <Typography variant="caption">{nasStatus[row?.status]}</Typography>
          </>
        );
      },
    },

    {
      name: <b className="Table_columns">{"Branch"}</b>,
      selector: "branch",
      cell: (row) => (
        <div className="ellipsis" title={row?.branch}>
          {row.branch ? row.branch : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"NAS Type"}</b>,
      selector: "nas_type",
      sortable: true,
      cell: (row) => {
        let nastypeObj = nasType.find((s) => s.id == row.nas_type);
        return <span>{nastypeObj ? nastypeObj?.name : "-"}</span>;
      },
    },
    //Sailaja Updated nowrap for IP Address & Serial Number Fields
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"IP Address"}
        </b>
      ),
      selector: "ip_address",
      cell: (row) => (
        <div className="ellipsis" title={row?.ip_address}>
          {row.ip_address}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Secret"}</b>,
      selector: "secret",
      sortable: true,
    },
    {
      // name:  <b className="Table_columns">{"Accounting Time Interval"}</b>,
      name: (
        <b className="NASTable_columns Table_columns">
          {"Accounting Time Interval"}
        </b>
      ),

      selector: "accounting_interval_time",
      sortable: true,
    },
    {
      name: "",
      selector: "",
    },
    {
      name: <b className="Table_columns">{"Address"}</b>,
      sortable: true,
      cell: (row) => (
        <div
          className="ellipsis"
          title={`${row?.house_no ? row?.house_no : ""}${row?.house_no ? "," : ""
            }${row.street},${row.landmark},${row.city},${row.pincode},${row.district
            },${row.state},${row.country}`}
        >
          {`${row?.house_no ? row?.house_no : ""}${row?.house_no ? "," : ""}${row.street
            },${row.landmark},${row.city},${row.pincode},${row.district},${row.state
            },${row.country}`}
        </div>
      ),
    },
   
  ];

  const deleteRows = (selected) => {
    props.setClearSelection(false);

    let rows = selected.map((ele) => ele.id);
    let ser = selected?.map((ele) => ele.serial_no);
    if (rows.length > 1) {
      notMoreThanone();
    } else {
      //APICALL
      networkaxios
        .get(`network/nas/deletecheck/${rows[0]}`)
        // .then((response) => {
        //   if (response.data == true) {
        //     props.setClearSelection(false);
        //     props.setIsChecked([...rows]);
        //     props.setRowdeleterecord(selected[0]);
        //   } else {
        //     noDelete();
        //   }
        // });
        .then((response) => {
          
          if (response.data == true) {
            props.setIsChecked([...rows]);
            props.setSerialNo([...ser])
            props.setRowdeleterecord(selected[0]);
          } else {
            props.setIsChecked([]);
            props.setRowdeleterecord({});
            noDelete();
          }
        })
        .catch(function (error) {
          if (error.response && error.response.data) {
            if (error.response.status === 403) {
              toast.error(error.response.data.detail, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
              });
            } 
            // else {
            //   toast.error(error.response.data);
            // }
          } else {
            toast.error("Something went wrong", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000
            });
          }
        });
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

  // useEffect(() => {
  //   setLoading(true);
  //   const defaultLayoutObj = classes.find(
  //     (item) => Object.values(item).pop(1) === sidebar_type
  //   );
  //   const modifyURL =
  //     process.env.PUBLIC_URL +
  //     "/dashboard/default/" +
  //     Object.keys(defaultLayoutObj).pop();
  //   const id =
  //     window.location.pathname === "/"
  //       ? history.push(modifyURL)
  //       : window.location.pathname.split("/").pop();
  //   // fetch object by getting URL
  //   const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
  //   const layout = id ? layoutobj : defaultLayoutObj;
  //   DefaultLayout = defaultLayoutObj;
  //   handlePageLayputs(layout);
  //   let queryParams = "";

  //   if (props.searchString) {
  //     queryParams += `serial_no=${props.searchString}`;
  //   }

  //   if (props.inputs && props.inputs.branch === "ALL1") {
  //     queryParams += ``;
  //   } else if (props.inputs && props.inputs.branch) {
  //     queryParams += `&branch=${props.inputs.branch}`;
  //   }

  //   // Remove the first '&' character if it exists and serial_no is not present
  //   if (queryParams.startsWith("&")) {
  //     queryParams = queryParams.slice(1);
  //   }

  //   networkaxios
  //     .get(`network/v2/nas/display${queryParams ? `?${queryParams}` : ""}`)
  //     .then((res) => {
  //       props.setRowlength((prevState) => {
  //         return {
  //           ...prevState,
  //           ["nas"]: res?.data?.length,
  //         };
  //       });
  //       setData(res?.data);
  //       setFiltereddata(res?.data);
  //       setLoading(false);
  //       props.setFiltereddata(res?.data);
  //       props.setData(res?.data);
  //       props.setFiltereddataBkp(res?.data);
  //     });

  // }, [
  //   props.refresh,
  //   props.selectedTab,
  //   props.isDeleted,
  //   props.branchid,
  //   props.franchiseid,
  //   props.searchString
  // ]);

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
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);
    let queryParams = "";

    // if (props.searchString) {
    //   queryParams += `serial_no=${props.searchString}`;
    // }

    // if (props.inputs && props.inputs.branch === "ALL1") {
    //   queryParams += ``;
    // } else if (props.inputs && props.inputs.branch) {
    //   queryParams += `&branch=${props.inputs.branch}`;
    // }

    // if (queryParams.startsWith("&")) {
    //   queryParams = queryParams.slice(1);
    // }
    props.fetchNetworkLists()
    // networkaxios
    //   .get(`network/v2/nas/display${queryParams ? `?${queryParams}` : ""}`)
    //   .then((res) => {
    //     props.setRowlength((prevState) => {
    //       return {
    //         ...prevState,
    //         ["nas"]: res?.data?.length,
    //       };
    //     });
    //     setData(res?.data);
    //     setFiltereddata(res?.data);
    //     setLoading(false);
    //     props.setFiltereddata(res?.data);
    //     props.setData(res?.data);
    //     props.setFiltereddataBkp(res?.data);

    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //     setLoading(false);
    //   });
  }, [
    props.nasrefresh,
    props.selectedTab,
    props.branchid,
    props.franchiseid,
    props.searchString
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
      props.setNasLead(id);
      // props.setShowNasLocation(true);
    }
    setActiveTab1(type);
    setRightSidebar(true);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain-nas").classList.add("open");

    // }
  };

  console.log(props.naslead,"props.naslead")
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
    setRightSidebar(false);
    document.querySelector(".customizer-contain-nas").classList.remove("open");
    console.log("checkclose")
    setParentdpDetails()
    setCpeDetails()
    setChilddpDetails()
    setDefaultchilddpDetails()
    setOltDetails()
    setParentdpInfo()
    setNasDetailsName()
    props.setDeatilsname("NAS")


  };
  //end
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  //end
  //modal for insufficient modal
  const noDelete = () => {
    setNoDelete(!noDeletee);
    props.setClearSelectedRows(!props.clearSelectedRows);
    props.setClearSelection(!props.clearSelection);
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
  // useOutsideAlerter(box);
  // function useOutsideAlerter(ref) {
  //   useEffect(() => {
  //     // Function for click event
  //     function handleOutsideClick(event) {
  //       if (ref.current && !ref.current.contains(event.target)) {
  //         console.log(event.target.className,"nastable handleoutside")
  //         if (!event.target.className.includes("openmodal") && !event.target.className.includes("rbt") && !event.target.className.includes("input_wrap") && !event.target.className.includes("btn btn-primary btn-xs"))  {
  //           closeCustomizer();
  //         }
  //       }
  //     }

  //     // Adding click event listener
  //     document.addEventListener("click", handleOutsideClick);
  //   }, [ref]);
  // }

  // function for checkbox selection in dataTable
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
//map function onClick
const OpenMaponView = () =>{
  setOpenTableView(true)
}
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
                onChangeRowsPerPage={props.handleNasPerRowsChange}
                onChangePage={props.handleNasPageChange}
                // className="leadTable"
                className="nastable-list"
                noHeader
                columns={columns}
                // data={filteredData}
                data={props.networkLists.pageLoadData || []}
                progressPending={props.networkLists.uiState?.loading}
                progressComponent={
                  <SkeletonLoader loading={props.networkLists.uiState.loading} />
                }
                setFiltereddata={props.setFiltereddata}
                clearSelectedRows={props.clearSelectedRows}
                pagination
                paginationServer
                paginationTotalRows={props.networkLists.totalRows}
                noDataComponent={"No Data"}
                // clearSelectedRows={props.clearSelection}
                // conditionalRowStyles={props.conditionalRowStyles}
                conditionalRowStyles={conditionalRowStyles}
                selectableRows
                selectableRowsComponent={NewCheckbox}
                onSelectedRowsChange={
                  ({ selectedRows }) => (handleSelectedRows(selectedRows), deleteRows(selectedRows))
                }
              />
            </div>
            {/* )} */}
          </nav>
        </Col>
        <br />
      </Card>
      <>
        {token.permissions.includes(NETWORK.NAS_LIST) && (
          <Row>
            <Col md="12">
              <div
                className="customizer-contain customizer-contain-nas"
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
                    {/* Sailaja Changed close icon position on 19th July */}
                    <br />
                    <i
                      className="icon-close"
                      style={{
                        marginTop: "12px",
                        float: "right",
                        marginRight: "-3px",
                        cursor: "pointer",
                        color: "#000000",
                        fontSize: "medium",
                        fontWeight: "Bold",
                      }}
                      onClick={closeCustomizer}
                    ></i>
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
                    {/* modal for no delete */}
                    <Modal isOpen={noDeletee} toggle={noDelete} centered>
                      <ModalHeader toggle={noDelete}>Delete</ModalHeader>
                      <ModalBody>
                        <p>
                          You cannot delete this hardware as children are
                          attached to it
                        </p>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="secondary" onClick={noDelete}>
                          Ok
                        </Button>
                      </ModalFooter>
                    </Modal>
                    {/* end */}
                    {/* pop up for not more than one delete */}
                    <Modal
                      isOpen={nomoredelete}
                      toggle={notMoreThanone}
                      centered
                    >
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
                      <TabPane tabId="4">
                        <div id="headerheading">
                          {" "}
                          Details of {props.detailsname}
                        </div>
                        <br />
                        <NasDeviceDetails
                          loaderSpinneer={props.loaderSpinneer}
                          setLoaderSpinner={props.setLoaderSpinner}
                          nasDetailsName={nasDetailsName}
                          setNasDetailsName={setNasDetailsName}
                          detailsname={props.detailsname}
                          setDeatilsname={props.setDeatilsname}
                          nasData={data}
                          dataClose={closeCustomizer}
                          lead={props.naslead}
                          setParentdpDetails={setParentdpDetails}
                          parentdpDetails={parentdpDetails}
                          setChilddpDetails={setChilddpDetails}
                          defaultchilddpDetails={defaultchilddpDetails}
                          setDefaultchilddpDetails={setDefaultchilddpDetails}
                          childdpDetails={childdpDetails}
                          setCpeDetails={setCpeDetails}
                          cpeDetails={cpeDetails}
                          networkState={props.networkState}
                          oltDetails={oltDetails}
                          setOltDetails={setOltDetails}
                          hide={props.hide}
                          setHide={props.setHide}
                          parentdpInfo={parentdpInfo}
                          setParentdpInfo={setParentdpInfo}
                        />
                      </TabPane>
                    </TabContent>
                  </div>
                  <div className=" customizer-body custom-scrollbar">
                    <TabContent activeTab={activeTab1}>
                      <TabPane tabId="3">
                        <div id="headerheading" style={{ marginTop: "-85px" }}>
                          {" "}
                          NAS Information : NAS{props.naslead.id}{" "}
                        </div>
                        <NasDetails
                          lead={props.naslead}
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
                          NAS Information : NAS{props.naslead.id}{" "}
                        </div>
                        {console.log(props.openMap ,"props.openMap")}
                   {openTableView &&  <NasLocation lead={props.naslead} />}
                      </TabPane>

                    </TabContent>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </>
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

export default NasTable;
