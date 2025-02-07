import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
  Input,
  Label,
} from "reactstrap";
import { logout_From_Firebase } from "../../../../utils";
import PermissionModal from "../../../common/PermissionModal";
import { ModalTitle, CopyText, Cancel } from "../../../../constant";
import { billingaxios } from "../../../../axios";
import AddPayment from "./addpayments";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { classes } from "../../../../data/layouts";
import PaymentDetails from "./paymentdetails";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import DISABLED from "../../../../assets/images/disabled.png";
import ENABLED from "../../../../assets/images/enabled.png";
import Badge from "@mui/material/Badge";

import { ADMINISTRATION } from "../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const PaymentList = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  const [paymentType, setPaymentType] = useState([]);
  const [useThis, setUseThis] = useState();
  const [useThisID, setUseThisID] = useState();

  const [modal, setModal] = useState();
  const [refresh, setRefresh] = useState(0);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //state for set as default
  const [setasdefault, setSetasdefault] = useState(false);

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

    // list of franchise api
    billingaxios
      .get(`payment/enh/gateways`)
      // .then((res) => setData(res.data))
      .then((res) => {
        let data = { ...res.data };
        let tableData = data.gateways;
        // for (let i = 0; i < data.gateways.length; i++) {
        //   let row = {
        //     ...data.gateways[i],
        //     // vendor: "ATOM",
        //     // gateway_enabled: data.gateway_enabled,
        //   };
        //   tableData.push(row);
        // }
        // for (let i = 0; i < data.RPAY.length; i++) {
        //   let row = {
        //     ...data.RPAY[i],
        //     vendor: "RPAY",
        //     gateway_enabled: data.gateway_enabled,
        //   };
        //   tableData.push(row);
        // }
        setData(tableData);
        setFiltereddata(tableData);
        setLoading(false);
        setRefresh(0);
        let { options } = res.data;
        setPaymentType([...options]);
      })
      .catch((error) => {
        const { code, detail, status } = error;
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        if (detail === "INSUFFICIENT_PERMISSIONS") {
          //calling the modal here
          permissiontoggle();
        } else if (is500Error) {
          setPermissionModalText("Something went wrong !");
          permissiontoggle();
        } else if (
          code === "In-valid token. Please login again" ||
          detail === "In-valid token. Please login again"
        ) {
          logout();
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  }, [refresh]);
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  // new records update in table

  const update = (newRecord) => {
    setData([...data, newRecord]);
    // setFiltereddata([...data, newRecord]);
    setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    closeCustomizer();
  };

  // edit details update function

  const detailsUpdate = (updatedata) => {
    setData([...data, updatedata]);
    // setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer();
  };

  //   //search bar
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      if (data.gateway.name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(false);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(true);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");

    // document.querySelector(".customizer-links").classList.add('open');
    // }
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
    if (searchInputField.current) {
    searchInputField.current.value = "";
    }
  };

  const searchInputField = useRef(null);

  //imports
  const tokenInfo1 = JSON.parse(localStorage.getItem("token"));
  let Showpassword = false;
  if (
    (tokenInfo1 && tokenInfo1.user_type === "Admin") 
  ) {
    Showpassword = true;
  }

  const columns = [
    // {
    //   name: "",
    //   selector: "action",
    //   width: "80px",
    //   center: true,
    //   cell: (row) => <MoreActions />,
    //   // style: {
    //   //   ...stickyColumnStyles,
    //   //   left: "80px",
    //   // },
    // },
    {
      name: <b className="Table_columns" >{"Name"}</b>,
      selector: "gateway.name",
      cell: (row) => (
        <>
          {token.permissions.includes(ADMINISTRATION.PAYMENTREAD) ? (
            <a
              onClick={() => openCustomizer("3", row)}
              // id="idcolor"
              className="openmodal"
            >
              {row.payment_gateway?.gateway ? row.payment_gateway?.gateway?.name:"---"}
              {/* {row.gateway ? row.gateway.name : "-"} */}
            </a>
          ) : row.payment_gateway?.gateway  ? (
            row.payment_gateway?.gateway?.name
          ) : (
            "---"
          )}
        </>
      ),
    },

    // {
    //   name: "Name",
    //   selector: "gateway.name",
    //   cell: (row) => {
    //     return <span>{row.gateway ? row.gateway.name : "-"}</span>;
    //   },
    //   sortable: true,
    // },
    {
      name: <b className="Table_columns" id="columns_left">{"Gateway"}</b>,
      selector: "gateway_type",
      sortable: true,
      cell: (row) => (
        <p id="columns_left">
          {row.payment_gateway?.gateway_type === "ATOM"
            ? "Atom"
            : row.payment_gateway?.gateway_type === "RPAY"
            ? "Razorpay"
            : row.payment_gateway?.gateway_type=== "PAYU"
            ? "PayU"
            : "N/A"}
        </p>
      ),
    },
    // {
    //   name: <b className="Table_columns" id="columns_right">{"Entity"}</b>,
    //   selector: "gateway_type",
    //   sortable: true,
    //   cell: (row) => (
    //     <span id="columns_right">
    //       {row?.entity}
    //     </span>
    //   ),
    // },
    //  {
    //   name: <b className="Table_columns" id="columns_right">{"Entity Name"}</b>,
    //   selector: "gateway_type",
    //   sortable: true,
    //   cell: (row) => (
    //     <span id="columns_right">
    //       {row?.entity_name}
    //     </span>
    //   ),
    // },
 
 
    
    //Sailaja Change Created Date as Created on 19th July
  
    // {
    //   name: "Updated",
    //   selector: "gateway.updated_at",
    //   sortable: true,
    //   cell: (row) => (
    //     <span className="digits" style={{ textTransform: "initial" }}>
    //       {" "}
    //       {moment(row.gateway.updated_at).format("DD MMM YY")}
    //     </span>
    //   ),
    // },
    {
      name: <b className="Table_columns" >{"Key ID"}</b>,
      selector: "gateway.key_id",
      cell: (row) => {
        return <span>{row.payment_gateway ? row.payment_gateway.gateway?.key_id : "-"}</span>;
      },
      sortable: true,
    },
    // {
    //   name: <b className="Table_columns">{"Default"}</b>,
    //   selector: "default",
    //   cell: (row) => {
    //     return (
    //       <span>
    //         {row.default ? (
    //           <CheckCircleOutlineOutlinedIcon style={{ color: "green" }} />
    //         ) : (
    //           <HighlightOffIcon style={{ color: "red" }} />
    //         )}
    //       </span>
    //     );
    //   },
    //   sortable: true,
    // },
    // {
    //   name: "client_id",
    //   selector: "gateway.client_id",
    //   cell: (row) => {
    //     return <span>{row.gateway ? row.gateway.client_id : "-"}</span>;
    //   },
    //   sortable: true,
    // },
 

    {
      name: <b className="Table_columns" id="columns_right">{"Status"}</b>,
      selector: "",
      cell: (row) => {
        return (
          <div
            onClick={() => {
              Verticalcentermodaltoggle();
              setUseThis(row);
            }}
            id="columns_right"
          >
            {row?.payment_gateway?.enabled ? (
              <span>
                <img
                  src={ENABLED}
                  style={{
                    position: "relative",
                    left: "-9px",
                    top: "-2px",
                    width: "21px",
                    height: "21px",
                  }}
                />
                &nbsp;
                {row?.payment_gateway?.default ? (
                  <Badge
                    badgeContent={"Default"}
                    color="success"
                    sx={{ position: "relative", top: "10px" }}
                  >
                    <span style={{ position: "relative", top: "-10px" }}>
                      Enabled
                    </span>{" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;{" "}
                  </Badge>
                ) : (
                  "Enabled"
                )}
              </span>
            ) : (
              <span>
                <img
                  src={DISABLED}
                  style={{
                    position: "relative",
                    left: "-9px",
                    top: "-2px",
                    width: "21px",
                    height: "21px",
                  }}
                />
                &nbsp;
                {row?.payment_gateway?.default ? (
                  <Badge
                    badgeContent={"Default"}
                    color="success"
                    sx={{ position: "relative", top: "10px" }}
                  >
                    {" "}
                    <span style={{ position: "relative", top: "-10px" }}>
                      Disabled
                    </span>{" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;{" "}
                  </Badge>
                ) : (
                  "Disabled"
                )}
              </span>
            )}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns" id="columns_right">{"Created"}</b>,
      selector: "gateway.created_at",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }} id="columns_right">
          {" "}
          {moment(row.gateways?.created_at).format("DD MMM YYYY")}
        </span>
      ),
    },
    Showpassword? {
      name: <b className="Table_columns" >{"Entity"}</b>,
      selector: "entity",
      sortable: true,
      cell: (row) => {
        return Showpassword ? (
          <span>{row.entity ? row.entity : "---"}</span>
        ) : (
          "---"
        );
      },
    }:"",
    Showpassword?   {
      name: <b className="Table_columns" id="">{"Entity Name"}</b>,
      selector: "entity_name",
      sortable: true,
      cell: (row) => {
        return Showpassword ? (
          <span>{row?.entity_name ? row?.entity_name : "---"}</span>
        ) : (
          "---"
        );
      },
    }:"",
  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });

  //change the buutons
  const paymentstatusapi = () => {
    billingaxios
      .patch(`payment/v2/gateway/${useThis.id}/ru`, { 
        id: useThis.id,
        entity_id:useThis.entity_id,
        payment_gateway: {
          id:useThis.payment_gateway?.id,
          enabled: !useThis.payment_gateway?.enabled,
          default: setasdefault,
        }
      })
      .then((res) => {
        let newfilterData = filteredData.map((d) => {
          if (d.id != useThis.id) {
            return d;
          } else {
            return { ...d, enabled: !useThis.enabled, default: setasdefault };
          }
        });
        setSetasdefault(false);
        setFiltereddata(newfilterData);
        setRefresh(1);

        toast.success("Successfully changed");
        // setFiltereddata((preState)=>{
        //   return{
        //     ...preState,
        //     default:!setasdefault
        //   }
        // });
      })
      .catch((err) => toast.error("Something went wrong"));
  };
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end
  // scroll top
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);

  //onside click hide sidebar
  const box = useRef(null);
  // useOutsideAlerter(box);

  // function useOutsideAlerter(ref) {
  //   useEffect(() => {
  //     // Function for click event
  //     function handleOutsideClick(event) {
  //       if (ref.current && !ref.current.contains(event.target)) {
  //         if (!event.target.className.includes("openmodal")) {
  //           closeCustomizer();
  //         }
  //       }
  //     }

  //     // Adding click event listener
  //     document.addEventListener("click", handleOutsideClick);
  //   }, [ref]);
  // }
  //end

  const handleClick = () => setSetasdefault(!setasdefault);
  console.log(setasdefault, "setasdefault");

  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        htmlFor="booty-check"
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="booty-check" />
    </div>
  ));

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

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  // css for breadcrumb by Marieya 
  // payment gateway enabled and default api changed by marieya on 8/8/22

   // only admin and superadmin was showing
   const tokenInfo = JSON.parse(localStorage.getItem("token"));
   let addPaymentConfig = false;
   if (
     (tokenInfo && tokenInfo.user_type === "Super Admin") ||
     (tokenInfo && tokenInfo.user_type === "Admin")
   ) {
    addPaymentConfig = true;
   } 
  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin">
            <Grid item md="12">
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={
                  <NavigateNextIcon
                    fontSize="small"
                    className="navigate_icon"
                  />
                }
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Customer Relations
                </Typography>
                {/* Sailaja Changed  Payments color from Breadcrumbs line numbers 604,606 on 13th July */}

                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"

                >
                  Payments
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Payment Gateway
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Row >
              <Col
                md="12"
                style={{  borderRadius: "10%" }}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "20px",
                    paddingLeft: "0px",
                    paddingTop: "0",
                  }}
                >
                  <span className="all_cust">Payments</span>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ flex: 1 }}
                    style={{width:"87%"}}
                  >
                    <Paper component="div" className="search_bar">
                   
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        inputProps={{ "aria-label": "search google maps" }}
                        placeholder="Search With Name "
                        onChange={(event) => handlesearchChange(event)}
                      />
                         <IconButton
                        type="submit"
                        sx={{ p: "10px" }}
                        aria-label="search"
                      >
                        <SearchIcon />
                      </IconButton>
                    </Paper>{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;
              {addPaymentConfig ? 
                    <>
                    {token.permissions.includes(
                      ADMINISTRATION.PAYMENTCREATE
                    ) && (
                      <button
                        className="btn btn-primary openmodal"
                        id="newbuuon"
                        type="submit"
                        onClick={() => openCustomizer("2")}
                      >
                        {/* Sailaja interchanged positions of New & + Admin/Payment Config  on 12th Aug REF Payment-1  */}
                          <b>
                            <span
                              className="openmodal new_btn"
                            >
                              New
                            </span>
                            <i
                              className="icofont icofont-plus openmodal"
                              style={{
                                cursor: "pointer",
                                // marginLeft: "-15px",
                              }}
                            ></i>
                          </b>
                      </button>
                    )}
                    </>:""}
                  </Stack>
                  <Modal
                    isOpen={Verticalcenter}
                    toggle={Verticalcentermodaltoggle}
                    centered
                    backdrop="static"
                  >
                    <ModalBody>
                      <span>
                        <b>{useThis && useThis.payment_gateway?.gateway?.name}</b>
                      </span>

                      <p>
                        {useThis && useThis.payment_gateway?.enabled ? (
                          "Do you want to disable this payment gateway?"
                        ) : (
                          <>
                            Do you want to enable this payment gateway?
                            <br />
                            <br />
                            <Input
                              type="checkbox"
                              className="checkbox_animated"
                              name="default"
                              checked={setasdefault}
                              onClick={handleClick}
                            />
                            <Label>
                              <b>Set as Default</b>
                            </Label>
                          </>
                        )}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onClick={() => {
                          Verticalcentermodaltoggle(true);
                          setUseThisID(useThis.id);
                          paymentstatusapi();
                        }}
                        id="yes_button"
                      >
                        {"Yes"}
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          Verticalcentermodaltoggle();
                          setUseThis(null);
                        }}
                        id="resetid"
                      >
                        {"No"}
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </Col>

              <Col md="12">
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <div className="data-table-wrapper">
                          <DataTable
                            className="payment-list"
                            columns={columns}
                            data={filteredData}
                            noHeader
                            pagination
                            noDataComponent={"No Data"}
                            conditionalRowStyles={conditionalRowStyles}
                            selectableRows
                            selectableRowsComponent={NewCheckbox}
                            // selectableRows
                            onSelectedRowsChange={({ selectedRows }) =>
                              handleSelectedRows(selectedRows)
                              // deleteRows(selectedRows)
                            }
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
      {/* Sailaja fixed Payment Configuration Edit icon and cancel icons in same line by using cancel_icon classname on 12th August */}

                        <br />
                        <i className="icon-close cancel_icon" onClick={closeCustomizer}></i>
                        <br />
                        <Modal
                          isOpen={modal}
                          toggle={toggle}
                          className="modal-body"
                          centered={true}
                        >
                          <ModalHeader toggle={toggle}>
                            {ModalTitle}
                          </ModalHeader>
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
                          <TabPane tabId="2">
                            <div id="headerheading">
                              Add New Payment Gateway
                            </div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <AddPayment
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                    rightSidebar={rightSidebar}
                                    paymentType={paymentType}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              Payment Gateway Information :{" "}
                              <span className="First_Letter1">{lead && lead.payment_gateway && lead.payment_gateway?.gateway.name}</span>
                            </div>
                            <PaymentDetails
                              lead={lead}
                              onUpdate={(data) => detailsUpdate(data)}
                              rightSidebar={rightSidebar}
                              dataClose={closeCustomizer}
                              openCustomizer={openCustomizer}
                              Refreshhandler={Refreshhandler}
                              paymentType={paymentType}
                            />
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
                {/* modal for insufficient permissions */}
                <PermissionModal
                  content={permissionModalText}
                  visible={permissionmodal}
                  handleVisible={permissiontoggle}
                />
                {/* end */}
              </Row>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default PaymentList;
