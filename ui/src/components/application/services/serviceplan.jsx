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
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
} from "reactstrap";
import {
  packageType,
  packageDatatype,
  fupCalculation,
  fallBacktype,
  billingType,
  billingCycle,
  statusType,
  expiryDate,
} from "./data";
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
import AddServicePlan from "./addserviceplan";
import SerivceDetails from "./servicedetails";
import { servicesaxios } from "../../../axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

import { ModalTitle, CopyText, Cancel } from "../../../constant";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RefreshIcon from "@mui/icons-material/Refresh";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
const ServicePlan = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();

  const [modal, setModal] = useState();
  const [refresh, setRefresh] = useState(0);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  // draft
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  // checkbox selected
  const [addCombo, setAddCombo] = useState(0);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );

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

    servicesaxios
      .get(`/plans/list`)
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
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

  const update = (newRecord) => {
    Refreshhandler();
    setData([...data, ...newRecord]);
    setFiltereddata([...newRecord, ...data]);
    closeCustomizer(false);
  };

  const detailsUpdate = (updatedata, isClose = true) => {
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    if (isClose) {
      closeCustomizer(false);
    }
  };

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      let statusObj = packageType.find((s) => s.id == data.package_type);

      const packageTypename = statusObj ? statusObj.name : "";

      if (
        data.package_name.toLowerCase().search(value) != -1 ||
        packageTypename.toLowerCase().search(value) != -1
      )
        return data;
    });
    setFiltereddata(result);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const closeCustomizer = (value) => {
    // draft
    if (isDirty && value) {
      setisDirtyModal(true);
    } else {
      closeDirtyModal();
    }
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem("plansDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");
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

  const searchInputField = useRef(null);

  const columns = [
    {
      name: "ID",
      selector: "id",
      cell: (row) => (
        <a  
        onClick={() => openCustomizer("3", row)}
        className="openmodal">
          S{row.id}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Package Name",
      selector: "package_name",
      sortable: true,
    },
    {
      name: (
        <table>
          <tbody>
            <tr>
              <th
                style={{
                  width: "90px",
                }}
              >
                {"Sub Plan Name"}
              </th>
              <th
                style={{
                  width: "90px",
                }}
              >
                {"Total Cost"}
              </th>
              <th
                style={{
                  width: "90px",
                }}
              >
                {"Duration"}
              </th>
            </tr>
          </tbody>
        </table>
      ),
      selector: "sub_plans.package_name",
      cell: (row) => (
        <>
          <table
            style={{
              width: "maxWidth",
              margin: "2px",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            <tr style={{ display: "flex" }}>
              <td
                style={{
                  width: "90px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  borderRight: "none",
                  padding: "5px",
                }}
              >
                {row.package_name}
              </td>
              <td
                style={{
                  width: "90px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  borderRight: "none",
                  padding: "5px",
                }}
              >
                {" "}
                ₹ {parseFloat(row.total_plan_cost).toFixed(2)}
              </td>
              <td
                style={{
                  width: "90px",
                  overflow: "hidden",
                  border: "1px solid #e6e6e6",
                  padding: "5px",
                }}
              >
                {row.time_unit + " " + row.unit_type + "(s)"}
              </td>
            </tr>

            {row.sub_plans ? (
              row.sub_plans.map((list, index) => (
                <span key={list.id}>
                  <tr style={{ display: "flex" }}>
                    <td
                      style={{
                        width: "90px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        borderRight: "none",
                        padding: "5px",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {list.package_name}
                    </td>
                    <td
                      style={{
                        width: "90px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        borderRight: "none",
                        padding: "5px",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {" "}
                      ₹ {parseFloat(list.total_plan_cost).toFixed(2)}
                    </td>
                    <td
                      style={{
                        width: "90px",
                        overflow: "hidden",
                        border: "1px solid #e6e6e6",
                        padding: "5px",
                        ...(row.sub_plans.length !== 1 &&
                          index !== row.sub_plans.length - 1 && {
                            ...{ borderBottom: "none" },
                          }),
                      }}
                    >
                      {list.time_unit + " " + list.unit_type + "(s)"}
                    </td>
                  </tr>
                </span>
              ))
            ) : (
              <span> </span>
            )}
          </table>
        </>
      ),
      sortable: true,
    },

    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "Download Speed",
      selector: "download_speed",
      cell: (row) => {
        return <span>{row ? row.download_speed : "-"}</span>;
      },
      sortable: true,
    },

    {
      name: "Upload Speed",
      selector: "upload_speed",
      cell: (row) => {
        return <span>{row ? row.upload_speed : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Package Type",
      selector: "package_type",
      sortable: true,
      cell: (row) => {
        let statusObj = packageType.find((s) => s.id == row.package_type);

        return <span>{statusObj ? statusObj.name : row.package_type}</span>;
      },
    },
    {
      name: "Package Data Type",
      selector: "package_data_type",
      sortable: true,
      cell: (row) => {
        let statusObj = packageDatatype.find(
          (s) => s.id == row.package_data_type
        );

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: "FUP Calculation",
      selector: "fup_calculation_type",
      sortable: true,
      cell: (row) => {
        let statusObj = fupCalculation.find(
          (s) => s.id == row.fup_calculation_type
        );

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },

    {
      name: "Fall Back Type",
      selector: "fall_back_type",
      sortable: true,
      cell: (row) => {
        let statusObj = fallBacktype.find((s) => s.id == row.fall_back_type);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: "Billing Type",
      selector: "billing_type",
      sortable: true,
      cell: (row) => {
        let statusObj = billingType.find((s) => s.id == row.billing_type);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },

    {
      name: "Billing Cycle",
      selector: "billing_cycle",
      sortable: true,
      cell: (row) => {
        let statusObj = billingCycle.find((s) => s.id == row.billing_cycle);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: (row) => {
        let statusObj = statusType.find((s) => s.id == row.status);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },

    {
      name: "Plan Cost",
      selector: "plan_cost",
      cell: (row) => {
        return <span>{row ? row.plan_cost : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Plan CGST %",
      selector: "plan_cgst",
      cell: (row) => {
        return <span>{row ? row.plan_cgst : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Plan SGST %",
      selector: "plan_sgst",
      cell: (row) => {
        return <span>{row ? row.plan_sgst : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Total Plan Cost",
      selector: "total_plan_cost",
      cell: (row) => {
        return <span>{parseFloat(row.total_plan_cost).toFixed(2)}</span>;
      },
      sortable: true,
    },
    {
      name: "Renewal Expiry Day",
      selector: "renewal_expiry_day",
      sortable: true,
      cell: (row) => {
        let statusObj = expiryDate.find((s) => s.id == row.renewal_expiry_day);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: "Time Unit",
      cell: (row) => {
        return (
          <span>{row ? row.time_unit + " " + row.unit_type + "(s)" : "-"}</span>
        );
      },
      sortable: true,
    },
  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end

  //draft start
  const saveDataInDraftAndCloseModal = () => {
    localStorage.setItem("plans/", JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem("plansDraftSaveKey", "plans/");

    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    setIsDirty(false);
  };

  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };
  const closeDirtyModal = () => {
    setisDirtyModal(false);
    setRightSidebar(false);
    document.querySelector(".customizer-contain").classList.remove("open");
    localStorage.removeItem("plans/");
    localStorage.removeItem("plansDraftSaveKey");
    setIsDirty(false);
    setLead({});
  };

  // draft end

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#FFE1D0",
      },
    },
  ];

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    if (searchInputField.current) searchInputField.current.value = "";
  };
  // scroll top
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);

  //onside click hide sidebar
  const box = useRef(null);
  useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (rightSidebar && !event.target.className.includes("openmodal")) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  //end

  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <div className="edit-profile">
            <Stack direction="row" spacing={2}>
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "medium",
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
              <MUIButton
                onClick={Refreshhandler}
                variant="outlined"
                startIcon={<RefreshIcon />}
              >
                Refresh
              </MUIButton>

              <MUIButton
                variant="outlined"
                startIcon={<AddIcon />}
                disabled={addCombo === 0}
              >
                New Combo
              </MUIButton>

              <MUIButton
                variant="outlined"
                startIcon={<AddIcon />}
                disabled={addCombo === 0}
              >
                Existing Combo
              </MUIButton>

              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                <Paper
                  component="div"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 400,
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search With  Package Name and Package Type"
                    inputProps={{ "aria-label": "search google maps" }}
                    onChange={(event) => handlesearchChange(event)}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Stack>
            </Stack>
            <Row>
              <Col md="12" style={{ marginTop: "52px" }}>
                <Card style={{ borderRadius: "0" }}>
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
                          <Col md="8"></Col>
                          <DataTable
                            columns={columns}
                            data={filteredData}
                            noHeader
                            pagination
                            noDataComponent={"No Data"}
                            conditionalRowStyles={conditionalRowStyles}
                            selectableRows={true}
                            onSelectedRowsChange={({
                              allSelected,
                              selectedCount,
                              selectedRows,
                            }) => {
                              setAddCombo(selectedCount);
                              console.log(selectedCount, "selectedCount");
                            }}
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
                  <div className="customizer-contain" ref={box}>
                    <div className="tab-content" id="c-pills-tabContent">
                      <div
                        className="customizer-header"
                        style={{ border: "none" }}
                      >
                        <br />
                        <i
                          className="icon-close"
                          onClick={() => closeCustomizer(true)}
                        ></i>
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
                            <div id="headerheading"> Add New Plan</div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <AddServicePlan
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                    rightSidebar={rightSidebar}
                                    // draft
                                    setIsDirtyFun={setIsDirtyFun}
                                    setformDataForSaveInDraft={
                                      setformDataForSaveInDraft
                                    }
                                    lead={lead}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              {" "}
                              Plan Information : S{lead.id}
                            </div>
                            <SerivceDetails
                              lead={lead}
                              onUpdate={(data) => detailsUpdate(data)}
                              openCustomizer={openCustomizer}
                              dataClose={closeCustomizer}
                            />
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* modal */}
              <PermissionModal
                content={permissionModalText}
                visible={permissionmodal}
                handleVisible={permissiontoggle}
              />
              {/* end */}
              {/* draft modal start*/}
              <Modal
                isOpen={isDirtyModal}
                toggle={() => setisDirtyModal(!isDirtyModal)}
                className="modal-body"
                centered={true}
              >
                <ModalHeader toggle={() => setisDirtyModal(!isDirtyModal)}>
                  {"Confirmation"}
                </ModalHeader>
                <ModalBody>Do you want to save this data in draft?</ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    className="notification"
                    onClick={saveDataInDraftAndCloseModal}
                  >
                    {"Save as Draft"}
                  </Button>
{/* Sailaja Changed close button Styles (Line Number 860)on 13th July */}
                  <Button id ="resetid" onClick={() => closeDirtyModal()}>
                    {"Close"}
                  </Button>
                </ModalFooter>
              </Modal>
              {/* draft modal end */}
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default ServicePlan;
