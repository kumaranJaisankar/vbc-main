import React, { useEffect, useState, useLayoutEffect, useRef, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import {
  hardwareCategoryType,
  makeType,
} from "../../project/devicemanagement/opticalnetwork/oltdopdowns";
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
  TabPane,
  ModalBody,
} from "reactstrap";

import { classes } from "../../../../data/layouts";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { networkaxios } from "../../../../axios";
import moment from "moment";
import PlaceIcon from '@mui/icons-material/Place';
import { ModalTitle, Cancel, CopyText } from "../../../../constant";

import DataTable from "react-data-table-component";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OltDetails from "../devicemanagement/opticalnetwork/oltdetails";
import { NETWORK } from "../../../../utils/permissions";
import NasDeviceDetails from "../nas/nasdevicedetails";
import NasLocation from "./locations/Naslocation"
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const OltTable = (props) => {
  console.log(props, "prpss");
  const [dis, setDis] = useState(false);
  const [failed, setFailed] = useState([]);
  const [data, setData] = useState();
  // const [serialdata, setSerialData] = useState();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [isChecked, setIsChecked] = useState([]);
  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  //taking backup for original data
  const [lead, setLead] = useState([]);
  //no delete state
  const [noDeletee, setNoDelete] = useState();
  const [nomoredelete, setNomoredelete] = useState();
  //added reset of states for parent and childdp
  const [parentdpDetails, setParentdpDetails] = useState();
  const [childdpDetails, setChilddpDetails] = useState();
  const [cpeDetails, setCpeDetails] = useState();
  // const [showParentDP, setShowParentDP] = useState(true);
  const [showParentDPDetails, setShowParentDPDetails] = useState(false);
  // for child dp that is default
  const [showChildDPDetails, setShowChildDPDetails] = useState(true);
  //end
  const [showChildDP, setShowChildDP] = useState(true);
  const [openTableViewOlt,setOpenTableViewOlt] = useState(false); 

  // const [showParentDPDetails, setShowParentDPDetails ] = useState("1");
  // const [currentLevel, setCurrentLevel] = useState("parent");

  const width = useWindowSize();

  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  {
    console.log(props.branchid, "props.branchid1290");
  }
  {
    console.log(props.areaid, "areaa");
  }

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

  const searchInputField = useRef(null);

  const OpenMaponView = () =>{
    setOpenTableViewOlt(true)
  }

  //search functionality
  const handlesearchChange = (value) => {
    // let value = event.target.value.toLowerCase();
    let result = [];
    result = data?.filter((data) => {
      if (data.name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
    props.setFiltereddata(result);
    props.setFiltereddataBkp(result);
  };

  //imports

  useEffect(() => {
    handlesearchChange(props.searchString);
  }, [props.searchString]);
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
          {token.permissions.includes(NETWORK.OPTICALOLTREAD) ? (
            <a
              onClick={() => openCustomizer("4", row)}
              id="columns_alignment"
              className="openmodal"
            >
              OLT{row.id}
            </a>
          ) : (
            <a id="columns_alignment" className="openmodal">
              OLT{row.id}
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
    // {
    //   name: <b className="Table_columns">{"Actions"}</b>,
    //   cell: (row) => {
    //     return (
    //       <a
    //         onClick={() => openCustomizer("4", row)}
    //         // id="columns_alignment"
    //         className="openmodal"
    //       >
    //         <i className="fa fa-eye"></i>
    //       </a>
    //     );
    //   },
    //   sortable: false,
    //   style: {
    //     ...stickyColumnStyles,
    //     left: "275px !important",
    //     borderRight: "1px solid #CECCCC",
    //   },
    // },
    {
      name: <b className="Table_columns">{"Name"}</b>,
      selector: "name",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row.name}>
          {row.name}
        </div>
      ),
      style: {
        ...stickyColumnStyles,
        left: "275px !important",
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
      name: <b className="Table_columns" >{"Parent NAS"}</b>,
      selector: "parent_nas",
      cell: (row) => (
        <div className="ellipsis" title={row.parent_nas} >
          {row.parent_nas ? row.parent_nas : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Hardware Category"}
        </b>
      ),
      selector: "hardware_category",
      sortable: true,
      cell: (row) => {
        let statusObj = hardwareCategoryType.find(
          (s) => s.id == row.hardware_category
        );
        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
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
          {row.franchise?.name ? row.franchise?.name : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Zone"}</b>,
      selector: "zone",
      cell: (row) => (
        <div className="ellipsis" title={row.zone}>
          {row.zone.name ? row.zone.name : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Area"}</b>,
      selector: "area",
      cell: (row) => (
        <div className="ellipsis" title={row.area}>
          {row.area.name ? row.area.name : "---"}
        </div>
      ),
      sortable: true,
    },



    {
      name: <b className="Table_columns">{"No. of Ports"}</b>,
      selector: "no_of_ports",
      sortable: true,
    },
    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"Available Ports"}
        </b>
      ),
      selector: "available_ports",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Make"}</b>,
      selector: "make",
      sortable: true,
      cell: (row) => {
        let statusObj = makeType.find((s) => s.id == row.make);
        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: <b className="Table_columns">{"Model"}</b>,
      selector: "device_model",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Capacity Per Port"}</b>,
      selector: "capacity",
      sortable: true,
    },

    {
      name: (
        <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>
          {"OLT Use Criteria"}
        </b>
      ),
      selector: "olt_use_criteria",
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Specification"}</b>,
      selector: "specification",
      cell: (row) => (
        <div className="ellipsis" title={row.specification}>
          {row.specification}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Notes"}</b>,
      selector: "notes",
      cell: (row) => (
        <div className="ellipsis" title={row.notes}>
          {row.notes}
        </div>
      ),
      sortable: true,

    },

    {
      name: <b className="Table_columns">{"Address"}</b>,
      sortable: true,
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
    // Sailaja Changed Created At as Created on 19th July
    // Sailaja Modified Year Format As YYYY  for Network-> Optical Network(OLT) -> Created column on 20th March 2023

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
      name: <b className="Table_columns">{"Created By"}</b>,
      selector: "created_by",
      sortable: true,
    },
    {
      name: "",
      selector: "",
    },
  ];

  const onDelete = () => {
    let dat = { ids: isChecked };
    fetch(`${process.env.REACT_APP_API_URL_NETWORK}/network/olt/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAccess}`,
      },
      body: JSON.stringify(dat),
    })
      .then((response) => response.json())
      .then((data) => {
        var difference = [];
        if (data.length > 0) {
          difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
          setFailed([...data]);
        } else {
          difference = [...isChecked];
        }
        setFiltereddata((prevState) => {
          var newdata = prevState.filter(
            (el) => difference.indexOf(el.id) === -1
          );
          return newdata;
        });
        Verticalcentermodaltoggle();
        setClearSelectedRows(true);
        setIsChecked([]);
        props.setIsChecked([]);
        setClearSelection(true);
        if (data.length > 0) {
        }
      });
  };

  const deleteRows = (selected) => {
    props.setClearSelection(false);

    let rows = selected.map((ele) => ele.id);
    let ser = selected?.map((ele) => ele.serial_no);
    if (rows.length > 1) {
      notMoreThanone();
    } else {
      //APICALL
      networkaxios.get(`network/olt/deletecheck/${rows[0]}`)
      // .then((response) => {
      //   let resData = [...response.data];
      //   let isFlagFalse =
      //     resData.filter((d) => d.flag == false).length == resData.length;
      //   if (isFlagFalse) {
      //     setClearSelection(false);
      //     setIsChecked([...rows]);
      //     props.setIsChecked([...rows]);
      //     props.setRowdeleterecord(selected[0]);
      //   } else {
      //     noDelete();
      //   }
      // });
      .then((response) => {
          
        if (response.data == true) {
          setClearSelection(false);
          setIsChecked([...rows]);
          props.setIsChecked([...rows]);
          props.setSerialNo([...ser])
          props.setRowdeleterecord(selected[0]);
        } else {
          setIsChecked([]);
          props.setIsChecked([]);
          props.setRowdeleterecord({});
          noDelete();
        }
      }) .catch(function (error) {
        if (error.response && error.response.data) {
          if (error.response.status === 403) {
            toast.error(error.response.data.detail, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000
            });
          }
          //  else {
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

  //   // franchise
  //   if (props.inputs && props.inputs.franchise === "ALL2") {
  //     queryParams += ``;
  //   } else if (props.inputs && props.inputs.franchise) {
  //     queryParams += `&franchise=${props.inputs.franchise}`;
  //   }

  //   // zone
  //   if (props.inputs && props.inputs.zone === "ALL3") {
  //     queryParams += ``;
  //   } else if (props.inputs && props.inputs.zone) {
  //     queryParams += `&zone=${props.inputs.zone}`;
  //   }

  //   // area
  //   if (props.inputs && props.inputs.area === "ALL4") {
  //     queryParams += ``;
  //   } else if (props.inputs && props.inputs.area) {
  //     queryParams += `&area=${props.inputs.area}`;
  //   }


  //   networkaxios
  //     .get(`network/v2/olt/display${queryParams ? `?${queryParams}` : ""}`)
  //     .then((res) => {
  //       props.setRowlength((prevState) => {
  //         return {
  //           ...prevState,
  //           ["olt"]: res.data.length,
  //         };
  //       });
  //       setData(res.data);
  //       setFiltereddata(res.data);
  //       setLoading(false);
  //       props.setFiltereddata(res.data);
  //       props.setData(res.data);
  //       props.setFiltereddataBkp(res.data);
  //       // setRefresh(0);
  //     });

  // }, [
  //   refresh,
  //   props.refresh,
  //   props.selectedTab,
  //   props.isDeleted,
  //   props.branchid,
  //   props.franchiseid,
  //   props.zoneid,
  //   props.areaid,
  //   props.searchString,
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
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);
    const buildQueryString = () => {
      let queryParams = '';

      // if (props.searchString) {
      //   queryParams += `serial_no=${props.searchString}`;
      // }

      // if (props.inputs) {
      //   const { branch, franchise, zone, area } = props.inputs;

      //   if (branch !== 'ALL1' && branch) {
      //     queryParams += `&branch=${branch}`;
      //   }

      //   if (franchise !== 'ALL2' && franchise) {
      //     queryParams += `&franchise=${franchise}`;
      //   }

      //   if (zone !== 'ALL3' && zone) {
      //     queryParams += `&zone=${zone}`;
      //   }

      //   if (area !== 'ALL4' && area) {
      //     queryParams += `&area=${area}`;
      //   }
      // }
      // if (queryParams.startsWith("&")) {
      //   queryParams = queryParams.slice(1);
      // }

      return queryParams;
    };

    const queryParams = buildQueryString();
    props.fetchOltNetworkLists()
    // props.setRefresh(0);
    // networkaxios
    //   .get(`network/v2/olt/display${queryParams ? `?${queryParams}` : ""}`)
    //   .then((res) => {
    //     props.setRowlength((prevState) => {
    //       return {
    //         ...prevState,
    //         ["olt"]: res.data.length,
    //       };
    //     });
    //     setData(res.data);
    //     console.log("double")
    //     setFiltereddata(res.data);
    //     setLoading(false);
    //     props.setFiltereddata(res.data);
    //     props.setData(res.data);
    //     props.setFiltereddataBkp(res.data);
    //     props.setRefresh(0);
    //   });

  }, [
    props.refresh,
    props.selectedTab,
    props.branchid,
    props.franchiseid,
    props.zoneid,
    props.areaid,
    props.searchString,
  ]);

  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      props.setFiltereddataBkp(data);
      props.setFiltereddata(data);
    }
  }, [data]);

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(true);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain-olt").classList.add("open");
    console.log("clickkk");
    // }
  };
  // console.log(lead.id,"marieya")
  const toggle = () => {
    setModal(!modal);
  };
  //details update
  const detailsUpdate = (updatedata) => {
    // setFiltereddata((prevFilteredData) =>
    //   prevFilteredData?.map((data) =>
    //     data.idsetActiveTab1 == updatedata.id ? updatedata : data
    //   )
    // );
    // props.setFiltereddata((prevFilteredData) =>
    //   prevFilteredData.map((data) =>
    //     data.id == updatedata.id ? updatedata : data
    //   )
    // );

    closeCustomizer();
    props.Refreshhandler();
  };
  // added refresh after edit by Marieya on 12/8/22
  //close customizer functionlaity
  const closeCustomizer = () => {
    setRightSidebar(false);
    // setShowParentDPDetails(true);
    setChilddpDetails();
    setCpeDetails();
    document.querySelector(".customizer-contain-olt").classList.remove("open");
  };

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
      filteredData?.map((item) => ({ ...item, selected: false })) || [];
    const selectedIds = selectedRows.map((item) => item.id);
    const temp = tempFilteredData.map((item) => {
      if (selectedIds.includes(item.id)) return { ...item, selected: true };
      else return { ...item, selected: false };
    });
    setFiltereddata(temp);
    props.setFiltereddata(temp);
  };

  //onside click hide sidebar
  const box = useRef(null);
  useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          console.log(event.target.className, "olttable handleoutside");
          if (
            !event.target.className.includes("openmodal") &&
            !event.target.className.includes("light-only")
          ) {
            closeCustomizer();
            // console.log()
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }
  //end
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

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];

  console.log(props.data, "props.data");

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
                onChangeRowsPerPage={props.handleOltPerRowsChange}
                onChangePage={props.handleOltPageChange}
                className="nastable-list"
                columns={columns}
                // data={props.data}
                data={props.oltLists?.pageLoadData || []}
                progressPending={props.oltLists?.uiState?.loading}
                progressComponent={
                  <SkeletonLoader loading={props.oltLists?.uiState.loading} />
                }
                pagination
                paginationServer
                paginationTotalRows={props.oltLists.totalRows}
                noDataComponent={"No Data"}
                // clearSelectedRows={props.clearSelectedRows}
                clearSelectedRows={props.clearSelection}
                selectedTab={props.selectedTab}
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
      <Row>
        <Col md="12">
          <div
            className="customizer-contain customizer-contain-olt"
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
                {/* modal for no delete */}
                <Modal isOpen={noDeletee} toggle={noDelete} centered>
                  <ModalHeader toggle={noDelete}>Delete</ModalHeader>
                  <ModalBody>
                    <p>
                      You cannot delete this hardware as children are attached
                      to it
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
                <Modal isOpen={nomoredelete} toggle={notMoreThanone} centered>
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
                    <div id="headerheading" style={{ marginTop: "-54px" }}>
                      {" "}
                      OLT Information : OLT{lead.id}{" "}
                    </div>

                    <OltDetails
                      lead={lead}
                      onUpdate={(data) => detailsUpdate(data)}
                      dataClose={closeCustomizer}
                      rightSidebar={rightSidebar}
                      Refreshhandler={props.Refreshhandler}
                      openCustomizer={openCustomizer}
                    />
                  </TabPane>
                </TabContent>
              </div>
              <div className="customizer-body custom-scrollbar">
                <TabContent activeTab={activeTab1}>
                  <TabPane tabId="3">
                    <div id="headerheading" style={{ marginTop: "-67px" }}>
                      {console.log(props.detailsname, "props.detailsname")}
                      {/* Details of ({props.detailsname}) */}
                    </div>
                    <NasDeviceDetails
                      detailsname={props.detailsname}
                      setDeatilsname={props.setDeatilsname}
                      setDis={setDis}
                      dis={dis}
                      setRightSidebar={setRightSidebar}
                      lead={lead}
                      setParentdpDetails={setParentdpDetails}
                      parentdpDetails={parentdpDetails}
                      setChilddpDetails={setChilddpDetails}
                      childdpDetails={childdpDetails}
                      setCpeDetails={setCpeDetails}
                      cpeDetails={cpeDetails}
                      // showParentDP={showParentDP} setShowParentDP={setShowParentDP}
                      showParentDPDetails={showParentDPDetails}
                      setShowParentDPDetails={setShowParentDPDetails}
                      showChildDPDetails={showChildDPDetails}
                      setShowChildDPDetails={setShowChildDPDetails}
                      showChildDP={showChildDP}
                      setShowChildDP={setShowChildDP}
                    // currentLevel={currentLevel} setCurrentLevel={setCurrentLevel}
                    />
                  </TabPane>
                  <TabPane tabId="5">
                    <div id="headerheading" style={{ marginTop: "-85px" }}>
                      {" "}
                      OLT Information : OLT{lead.id}{" "}
                    </div>
                    {openTableViewOlt &&  <NasLocation lead={lead}/>}

                  </TabPane>

                </TabContent>
              </div>
            </div>
          </div>
        </Col>
      </Row>
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
export default OltTable;

