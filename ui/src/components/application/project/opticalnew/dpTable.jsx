import React, { useEffect, useState, useLayoutEffect, useRef,useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { networkaxios } from "../../../../axios";
import {
  Row,
  Col,
  Card,
  Input,
  Modal,
  ModalHeader,
  ModalFooter,
  Button,
  TabContent,
  TabPane,
  FormGroup,
  Label,ModalBody
} from "reactstrap";
import { toast } from "react-toastify";
import { classes } from "../../../../data/layouts";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PlaceIcon from '@mui/icons-material/Place';
import {ModalTitle,Cancel ,CopyText} from "../../../../constant";
import moment from "moment";

import DataTable from "react-data-table-component";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import Dpedetails from '../devicemanagement/opticalnetwork/dpedetails';
import NasLocation from "./locations/Naslocation"
// import DpDeviceDetails from "./dpdevicedetails"
// token
import { NETWORK } from "../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
 if (storageToken !== null) {
  var token = JSON.parse(storageToken) ;
}

//end
const DpTable = (props) => {

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [clearSelection, setClearSelection] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [modal, setModal] = useState();
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [openTableViewDp,setOpenTableViewDp] = useState(false); 

  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  //no delete state
  const [noDeletee, setNoDelete] = useState();
  //end
     //no delete state
     const [nomoredelete, setNomoredelete] = useState();
  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  //added reset of states for parent and childdp
const [parentdpDetails, setParentdpDetails] = useState();
const [childdpDetails, setChilddpDetails] = useState();
const [cpeDetails, setCpeDetails] =  useState();
  // states on 16th april
  const [oltDetailsName, setOltDetailsName] = useState()
  const [defaultchilddpDetails, setDefaultchilddpDetails] = useState();
  const [oltDetails, setOltDetails] = useState();
  const [parentdpInfo, setParentdpInfo] = useState();

  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );

  const searchInputField = useRef(null);

  //search functionality
  const handlesearchChange = (v) => {
    let value = v && v.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      if (data.name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
    props.setFiltereddata(result);
  };


  useEffect(() => {
    handlesearchChange(props.searchString)
  },[props.searchString])

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
      name: <b className="Table_columns"  id="columns_alignment">{"ID"}</b>,
      selector: "id",
      cell: (row) => (
        <>
        { token.permissions.includes(props.selectedDpRadioBtnDisplay == "parentdp" ? NETWORK.OPTICALPARENTDPREAD : NETWORK.OPTICALCHILDDPREAD)  ?(

        <a onClick={() => openCustomizer("3", row)}  id="columns_alignment"
        className="openmodal"
        >

          {props.selectedDpRadioBtnDisplay == "parentdp" ? "PDP":"CDP" }{row.id}
        </a>
        ):(
          <span  id="columns_alignment"
        >

          {props.selectedDpRadioBtnDisplay == "parentdp" ? "PDP":"CDP" }{row.id}
        </span>
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
      name: <b className="CustomerTable_columns">{"Serial Number"}</b>,
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
    //       onClick={() => openCustomizer("4", row)}
    //       // id="columns_alignment"
    //       className="openmodal"
    //     >
    //       <i className="fa fa-eye"></i>
    //     </a>
    //     );
    //   },
    //   sortable: false,
    //   style: {
    //     ...stickyColumnStyles,
    //     left: "275px !important",
    //   borderRight: "1px solid #CECCCC",
    //   },
    // },
    {
      name:<b className="Table_columns">{"Name"}</b> ,
      selector: "name",
      sortable: true,
            style: {
        ...stickyColumnStyles,
        left: "275px !important",
      // borderRight: "1px solid #CECCCC",
      },
    },
    // },

    {
      name:<b className="Table_columns">{"View"}</b>,
      cell: (row) => {
       return (
         <a
         onClick={() => {
          openCustomizer("5",row);
          OpenMaponView()
      }} 
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
          {row.zone?.name ? row.zone?.name : "---"}
        </div>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Area"}</b>,
      selector: "area",
      cell: (row) => (
        <div className="ellipsis" title={row.area}>
          {row.area?.name ? row.area?.name : "---"}
        </div>
      ),
      sortable: true,
    },
    // {
    //   name: <b className="CustomerTable_columns">{"Serial Number"}</b>,
    //   selector: "serial_no",
    //   sortable: true,
    // },
    {
      name: <b className="Table_columns">{"No. of Ports"}</b>,
      selector: "no_of_ports",
      sortable: true,
    },
   
   
    {
      name: <b className="CustomerTable_columns">{"Available Ports"}</b>,
      selector: "available_ports",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Parent OLT"}</b>,
      selector: "parent_olt",
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace:"nowrap" }}>{"Parent OLT Port"}</b>,
      cell: (row) => {
        let lastchar = row.parent_oltport ? row.parent_oltport[row.parent_oltport.length -1] : '';
        return <span>{lastchar}</span>;
        },
      selector: "parent_oltport",
      sortable: true,
    },
    
    {
      name: <b className="Table_columns">{"Parent DP Port"}</b>,
      selector: "parent_dpport",
      cell: (row) => (
        <span>
          {row.parent_dpport ? row.parent_dpport : "---"}
        </span>
      ),
      sortable: true,
    },
    
    {
      name: <b className="Table_columns">{"Address"}</b>,
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={`$${row?.house_no ? row?.house_no : ''}${row?.house_no ?",":"" }${row.street},${row.landmark},${row.city},${row.pincode},${row.district},${row.state},${row.country}`}>
         {`${row?.house_no ? row?.house_no : ''}${row?.house_no ?",":"" }${row.street},${row.landmark},${row.city},${row.pincode},${row.district},${row.state},${row.country}`}
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
//Sailaja changed created at as Created on 19th
// Sailaja Modified Year Format As YYYY  for Network-> Optical Network(DP) -> Created column on 20th March 2023
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
      selector: row => row.created_by ? row.created_by :  "---",
      sortable: true,
    },
    // {
    //   name: <b className="Table_columns">{"Created By"}</b>,
    //   selector: "created_by",
  
    //   sortable: true,
    // },
  ];

  const OpenMaponView = () =>{
    setOpenTableViewDp(true)
  }

  const deleteRows = (selected) => {
    props.setClearSelection(false);

    let rows = selected.map((ele) => ele.id);
    let ser = selected?.map((ele) => ele.serial_no);
    if (rows.length > 1) {
      notMoreThanone();
    } else if(rows.length == 1) {
      //APICALL
      networkaxios
        .get(
          `network/${props.selectedDpRadioBtnDisplay}/deletecheck/${rows[0]}`
          
        )
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
        })
        .catch(function (error) {
          if (error.response && error.response.data) {
            if (error.response.status === 403) {
              toast.error(error.response.data.detail, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
              });
            }
             else {
              toast.error(error.response.data);
            }
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

    // if (props.searchString) {
    //   queryParams += `serial_no=${props.searchString}`;
    // }
    
    // if (props.inputs && props.inputs.branch === "ALL1") {
    //   queryParams += ``;
    // } else if (props.inputs && props.inputs.branch) {
    //   queryParams += `&branch=${props.inputs.branch}`;
    // }
    
    // if (props.inputs && props.inputs.franchise === "ALL2") {
    //   queryParams += ``;
    // } else if (props.inputs && props.inputs.franchise) {
    //   queryParams += `&franchise=${props.inputs.franchise}`;
    // }
    
    // if (props.inputs && props.inputs.zone === "ALL3") {
    //   queryParams += ``;
    // } else if (props.inputs && props.inputs.zone) {
    //   queryParams += `&zone=${props.inputs.zone}`;
    // }
    
    // if (props.inputs && props.inputs.area === "ALL4") {
    //   queryParams += ``;
    // } else if (props.inputs && props.inputs.area) {
    //   queryParams += `&area=${props.inputs.area}`;
    // }
    
    // // Remove the first '&' character if it exists and serial_no is not present
    // if (!props.searchString && queryParams.startsWith("&")) {
    //   queryParams = queryParams.slice(1);
    // }
    
    // networkaxios
    //   .get(`network/v2/${selectedDpRadioBtnDisplay}/display${queryParams ? `?${queryParams}` : ""}`)
    //   .then((res) => {
    //     props.setRowlength((prevState) => {
    //       return {
    //         ...prevState,
    //         ["dp"]: res?.data?.length,
    //       };
    //     });
    //     setData(res?.data);
    //     setFiltereddata(res?.data);
    //     setLoading(false);
    //     props.setFiltereddata(res?.data);
    //     props.setData(res?.data);
    //     props.setFiltereddataBkp(res?.data);
    //     props.setDpRefresh(0);
    //   });
    props.fetchDpNetworkLists()
  }, [
    props.dprefresh,
    props.selectedTab,
    props.branchid,props.franchiseid, props.zoneid,props.areaid,
    props.searchString
  ]);

  useEffect(()=>{
    // networkaxios
    // .get(`network/v2/${selectedDpRadioBtnDisplay}/display`)
    // .then((res) => {
    //   props.setRowlength((prevState) => {
    //     return {
    //       ...prevState,
    //       ["dp"]: res.data.length,
    //     };
    //   });
    //   setData(res.data);
    //   setFiltereddata(res.data);
    //   props.setFiltereddata(res.data);
    //   props.setFiltereddataBkp(res.data);
    //   setLoading(false);
    //   // props.setRefresh(0);
    // });
    props.fetchDpNetworkLists()

  },[props.selectedDpRadioBtnDisplay ])
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
      document.querySelector(".customizer-contain-dp").classList.add("open");

    // }
  };
  const toggle = () => {
    setModal(!modal);
  };
  //details update
  const detailsUpdate = (updatedata) => {
  //   setData([...data, updatedata]);
  //   setFiltereddata((prevFilteredData) =>
  //     prevFilteredData.map((data) =>
  //       data.id == updatedata.id ? updatedata : data
  //     )
  //   );
  //   props.setFiltereddata((prevFilteredData) =>
  //   prevFilteredData.map((data) =>
  //     data.id == updatedata.id ? updatedata : data
  //   )
  // );
  // props.setFiltereddataBkp((prevFilteredData) =>
  // prevFilteredData.map((data) =>
  //   data.id == updatedata.id ? updatedata : data
  // )
// );

    closeCustomizer();
    props.Refreshhandler();
  };
  // added refresh after edit by Marieya on 12/8/22
//close customizer functionlaity
const closeCustomizer = () => {
  setRightSidebar(!rightSidebar);
  document.querySelector(".customizer-contain-dp").classList.remove("open");
};

  //modal for insufficient modal
  const noDelete = () => {
    props.setClearSelectedRows(!props.clearSelectedRows);
    props.setClearSelection(!props.clearSelection);
    setNoDelete(!noDeletee);
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
  // setFiltereddata(temp);
  // props.setFiltereddata(temp);
  // props.setFiltereddataBkp(temp);
};

//onside click hide sidebar
const box = useRef(null);
// useOutsideAlerter(box);

// function useOutsideAlerter(ref) {
//   useEffect(() => {
//     // Function for click event
//     function handleOutsideClick(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         console.log(event.target.className,"dptable handleoutside")
//         if (
//           rightSidebar &&
//           !event.target.className.includes("openmodal") && !event.target.className.includes("light-only")
//         ) {
//           closeCustomizer();
//         }
//       }
//     }

//     // Adding click event listener
//     document.addEventListener("click", handleOutsideClick);
//   }, [ref]);
// }


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
      <Card style={{ borderRadius: "0" ,boxShadow: "none" }}>
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
                <Col md="8">
                 
                </Col>
                <Row style={{ height: "35px" }}>
                  <Col sm="10">
                    <FormGroup className="m-t-15 m-checkbox-inline custom-radio-ml" style={{display:"flex"}}>
                      <div className="" style={{marginTop:"-7px",zIndex:"1"}}>
                        <Input
                         className="radio_animated"
                          defaultChecked
                          id="displayparent"
                          type="radio"
                          name="radio3"
                          value={props.selectedDpRadioBtnDisplay === "parentdp"}
                          onClick={() => {
                            props.setSelectedDpRadioBtnDisplay("parentdp");
                            props.selectedDpRadioBtn("parentdp");
                          }}
                        />
                        <Label className="mb-0" for="displayparent">
                          {Option}
                          <span className="digits">Parent DP</span>
                        </Label>
                      </div>
                      &nbsp;&nbsp;
                      <div className="" style={{marginTop:"-7px",zIndex:"1"}}>
                        <Input
                         className="radio_animated"
                          id="displaychild"
                          type="radio"
                          name="radio3"
                          value={props.selectedDpRadioBtnDisplay === "childdp"}
                          onClick={() => {
                            props.setSelectedDpRadioBtnDisplay("childdp");
                            props.selectedDpRadioBtn("childdp");
                          }}
                        />
                        <Label className="mb-0" for="displaychild">
                          {Option}
                          <span className="digits">Child DP</span>
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                {/* <DataTable
                  className="leadTable"
                  columns={columns}
                  data={props.data}
                  noHeader
                  // selectableRows
                  // onSelectedRowsChange={({ selectedRows }) =>
                  //   deleteRows(selectedRows)
                  // }
                  clearSelectedRows={clearSelectedRows}
                  pagination
                  noDataComponent={"No Data"}
                  clearSelectedRows={props.clearSelection}
                  clearSelectedRows={props.clearSelectedRows}

                  // conditionalRowStyles={props.conditionalRowStyles}
                  // // selectableRows
                  // onSelectedRowsChange={({ selectedRows }) => (
                  //   handleSelectedRows(selectedRows),
                  //   deleteRows(selectedRows)
                  // )}
                  conditionalRowStyles={conditionalRowStyles}
                  selectableRows
                  onSelectedRowsChange={({ selectedRows }) => (
                    handleSelectedRows(selectedRows)
                    // deleteRows(selectedRows)
                  )}
                  selectableRowsComponent={NewCheckbox}
                /> */}
                 <DataTable
                  onChangeRowsPerPage={props.handleDpPerRowsChange}
                  onChangePage={props.handleDpPageChange}
                  className="nastable-list"
                  columns={columns}
                  // data={props.data}
                  data={props.dpLists?.pageLoadData || []}
                  progressPending={props.dpLists?.uiState?.loading}
                  progressComponent={
                    <SkeletonLoader loading={props.dpLists?.uiState.loading} />
                  }
                  // selectableRows
                  // onSelectedRowsChange={({ selectedRows }) =>
                  //   deleteRows(selectedRows)
                  // }
                  // clearSelectedRows={clearSelectedRows}
                  pagination
                  paginationServer
                  paginationTotalRows={props.dpLists.totalRows} 
                  noDataComponent={"No Data"}
                  clearSelectedRows={props.clearSelection}

                  conditionalRowStyles={props.conditionalRowStyles}
                  selectableRows
                  onSelectedRowsChange={({ selectedRows }) => (
                    handleSelectedRows(selectedRows),
                    deleteRows(selectedRows)
                  )}
                />
              </div>
            {/* )} */}
          </nav>
        </Col>
        <br />
      </Card>
      {/* /delte */}
      <Row>
        <Col md="12">
         
                <div className="customizer-contain customizer-contain-dp" 
                ref={box}
                 style={{borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px"}}>
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
                    <Button id="yes_button" onClick={noDelete}>
                      Ok
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* end */}
                  {/* pop up for not more than one delete */}
                  <Modal isOpen={nomoredelete} toggle={notMoreThanone} centered>
                  <ModalBody>
                    <p>
                      Please select only one record
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button id="yes_button" onClick={notMoreThanone}>
                      Ok
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* end */}
              </div>
              <div className=" customizer-body custom-scrollbar">
                <TabContent activeTab={activeTab1}>
                  <TabPane tabId="3">
                  <div id="headerheading" style={{marginTop:"-50px"}}> DP Information : {props.selectedDpRadioBtnDisplay == "parentdp" ? "PDP":"CDP" }{lead.id} </div>
                    <Dpedetails
                      lead={lead}
                      onUpdate={(data) => detailsUpdate(data)}
                      dataClose={closeCustomizer}
                      rightSidebar={rightSidebar}
                      selectedDpRadioBtnDisplay={props.selectedDpRadioBtnDisplay}
                      openCustomizer={openCustomizer}
                      Refreshhandler={props.Refreshhandler}
                    />
                  </TabPane>
                  <TabPane tabId="4">
                  <div id="headerheading" style={{ marginTop: "-46px" }}>
                      Details of ({props.detailsname})
                    </div>
                    <br/>
                  {/* <DpDeviceDetails
                       loaderSpinneer={props.loaderSpinneer}
                       setLoaderSpinner={props.setLoaderSpinner}
                       oltDetailsName={oltDetailsName}
                             setOltDetailsName={setOltDetailsName}
                              detailsname={props.detailsname}
                              setDeatilsname={props.setDeatilsname}
                              nasData={data}
                              dataClose={closeCustomizer}
                              lead={lead}
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
                    /> */}
                  </TabPane>
                  <TabPane tabId="5">
                        <div id="headerheading" >
                          {" "}
                          DP Information : {props.selectedDpRadioBtnDisplay == "parentdp" ? "PDP":"CDP" }{lead.id}{" "}
                        </div>
                        {openTableViewDp &&  <NasLocation lead={lead}/>}
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
export default DpTable;
