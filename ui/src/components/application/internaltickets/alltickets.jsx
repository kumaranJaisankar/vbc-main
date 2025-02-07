import React, { Fragment, useEffect, useState, useRef } from "react";
import moment from "moment";
import { TicketFilterContainer } from "./TicketFilter/TicketFilterContainer";
import Skeleton from "react-loading-skeleton";
import Ticketutilitybadge from "../../utilitycomponents/ticketutilitybadge";
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
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Input,
} from "reactstrap";

import { Search } from "react-feather";
import { downloadExcelFile } from "./Export";
import { helpdeskaxios, adminaxios } from "../../../axios";
import AddTicket from "./addticket";
import TicketDetails from "./ticketdetails";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
import DeleteModal from "./DeleteModal";
import DraftModal from "./DraftModal";
import { connect } from "react-redux";

import {
  toggleDraftModal,
  closeDraftModal,
} from "../../../redux/internal-tickets/actions";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const AllTickets = (props) => {
  const { toggleDraftModal, closeDraftModal } = props;
  const { history } = useHistory();

  const [rowlength, setRowlength] = useState({});
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [assignedTo, setAssignedTo] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lead, setLead] = useState([]);
  const [ticketStatus, setTicketStatus] = useState([]);
  const [modal, setModal] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  const [ticketSubcategory, setTicketSubcategory] = useState([]);
  const [ticketCategory, setTicketCategory] = useState([]);
  const [prioritySla, setPrioritySla] = useState([]);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  // draft
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  //end
  const [utilityBadge, setUtilityBadgeData] = useState({});
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [clearSelection, setClearSelection] = useState(false);
  const [selectedtab, setSelectedtab] = useState("All");
  const [ openforcustomer, setOpenforcustomer] = useState()

  const handleModalToggle = () => {
    if (modalVisible == true) {
      setIsChecked([]);
      setClearSelection(true);
    }

    if (isChecked.length > 0) {
      setModalVisible(!modalVisible);
    } else {
      toast.error("Please select any record", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      // return false;
    }
  };

  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleTableDataFilter = (status, isCount = false) => {
    setSelectedtab(status);
    switch (status) {
      case "All":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["All"]: data.length,
            };
          });
        } else {
          setFiltereddata(data);
        }
        break;

      case "Provisioning":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["Provisioning"]: data.filter(
                (item) => item.ticket_category.category === "Provisioning"
              ).length,
            };
          });
        } else {
          setFiltereddata(
            data.filter(
              (item) => item.ticket_category.category === "Provisioning"
            )
          );
        }
        break;
      case "Installation":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["Installation"]: data.filter(
                (item) => item.ticket_category.category === "Installation"
              ).length,
            };
          });
        } else {
          setFiltereddata(
            data.filter(
              (item) => item.ticket_category.category === "Installation"
            )
          );
        }
        break;
      case "KYC Started":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["KYC Started"]: data.filter(
                (item) => item.ticket_category.category === "KYC Started"
              ).length,
            };
          });
        } else {
          setFiltereddata(
            data.filter(
              (item) => item.ticket_category.category === "KYC Started"
            )
          );
        }
        break;

      default:
        setFiltereddata(data);
    }
  };

  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  useEffect(() => {
    setLoading(true);
    helpdeskaxios
      .get(`list/ticket`)
      .then((res) => {
        let utilityBadgeData = {
          Provisioning: 0,
          "KYC Started": 0,
          Installation: 0,
        };
        res.data.forEach(
          (item) =>
            (utilityBadgeData[item.ticket_category.category] =
              utilityBadgeData[item.ticket_category.category] + 1)
        );
        setUtilityBadgeData(utilityBadgeData);
        // setFiltereddata((prevState)=>[...prevState,res.data]);
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
        // openfor 
        const usernameFromUrl = new URLSearchParams(window.location.search).get('username')
        if(window.location.search !== '' && usernameFromUrl!==''){
          setOpenforcustomer(usernameFromUrl)
          openCustomizer("2")
        }
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
        } else if (code === "In-valid token. Please login again" || detail === "In-valid token. Please login again") {
          logout();
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  }, [refresh]);
  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setFiltereddataBkp(data);
      handleTableDataFilter("All", true);
      handleTableDataFilter("Provisioning", true);
      handleTableDataFilter("KYC Started", true);
      handleTableDataFilter("Installation", true);

      handleTableDataFilter(selectedtab, true);
      handleTableDataFilter(selectedtab, false);
    }
  }, [data]);

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  const update = (newRecord) => {
    setData([newRecord, ...data]);
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
      if (
        data.open_for.toLowerCase().search(value) != -1 ||
        data.ticket_category.category.toLowerCase().search(value) != -1 ||
        data.sub_category.name.toLowerCase().search(value) != -1
      )
        return data;
    });
    setFiltereddata(result);
  };

  //delete
  const deleteRows = (selected) => {
    setClearSelection(false);
    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);
  };

  const toggle = () => {
    setModal(!modal);
  };

  //draft customizers
  const closeCustomizer = (value) => {
    // draft
    if (isDirty && value) {
      toggleDraftModal();
    } else {
      handleCloseDraftModal();
    }
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem("ticketDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    if (rightSidebar) {
      document.querySelector(".customizer-contain").classList.add("open");
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
    // {
    //   name: "ID",
    //   selector: "id",
    //   cell: (row) => (
    //     <a onClick={() => openCustomizer("3", row)} id="idcolor">
    //       T{row.id}
    //     </a>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Customer ID",
      selector: "open_for",
      cell: (row) => (
        <a onClick={() => openCustomizer("3", row)} >
          T{row.open_for}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Mobile",
      selector: "mobile_number",
      sortable: true,
    },
    {
      name: "Open For",
      selector: "open_for",
      sortable: true,
    },
    {
      name: "Priority",
      selector: "priority_sla.name",
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: (row) => {
        let statusObj = ticketStatus.find((s) => s.id == row.status);

        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
    {
      name: "Category",
      selector: "ticket_category.category",
      sortable: true,
    },
    {
      name: "Subcategory",
      selector: "sub_category.name",
      sortable: true,
    },
    {
      name: "Assigned To",
      selector: "assigned_to.username",
      sortable: true,
      cell: (row) => {
        return (
          <span>{row.assigned_to ? row.assigned_to.username : "N/A"}</span>
        );
      },
    },

    {
      name: "Open Date",
      selector: "open_date",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.open_date).format("MMMM Do YYYY")}
        </span>
      ),
    },

    {
      name: "Assigned Date",
      selector: "assigned_date",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.assigned_date).format("MMMM Do YYYY")}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Customer Notes",
      selector: "customer_notes",
      sortable: true,
    },
    {
      name: "Notes",
      selector: "notes",
      sortable: true,
    },
    {
      name: "Watchlist",
      selector: "watchlists",
      sortable: true,
      cell: (row) => {
        const users = row.watchlists.map((list) => list.user.username);
        return <span>{users.join(",")}</span>;
      },
    },
  ];

  const headersForExportFile = [
    ["all", "All"],
    ["id", "ID"],
    ["open_for", "Customer ID"],
    ["mobile_number", "Mobile"],
    ["open_date", "Open Date"],
    ["opened_by", "Open By"],
    ["ticket_category", "Ticket Category"],
    ["sub_category", "Sub Category"],
    ["priority_sla", "Priority"],
    ["assigned_date", "Assinged Date"],
    ["status", "Status"],
    ["customer_notes", "Customer Notes"],
    // ["open_for", "Open For"],
    ["notes", "Notes"],
    ["watchlists", "Watchlists"],
  ];

  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });

  //filter show and hide level menu
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");

    if (concernedElement && concernedElement.contains(event.target)) {
      setLevelMenu(true);
      // setImportDivStatus(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        if (event.target.className !== "icon-filter") {
          setLevelMenu(false);
          var element = document.getElementById("departmentNameId");
          if (element) {
            element.classList.remove("showcard");
          }

          //   setImportDivStatus(true);
        }
      }
    }
  });
  useEffect(() => {
    helpdeskaxios
      .get(`create/options/ticket`)
      .then((res) => {
        let { opened_by, category, priority_sla, subcategory, status } =
          res.data;
        setTicketCategory([...category]);
        setPrioritySla([...priority_sla]);
        setTicketSubcategory([...subcategory]);
        setTicketStatus([...status]);
      })
      .catch((err) => {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });

    adminaxios
      .get("accounts/options/all")
      .then((res) => {
        let { users } = res.data;
        setAssignedTo([...users]);
      })

      .catch((err) => {
        console.log(err);
        // toast.error("Something went wrong", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose:1000
        // });
      });
  }, []);

  //selected row downloadExcelFile
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

  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [downloadAs, setDownloadAs] = useState("");
  const [headersForExport, setHeadersForExport] = useState([]);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      if (event.target.defaultValue === "all") {
        let allKeys = headersForExportFile.map((h) => h[0]);
        setHeadersForExport(allKeys);
      } else {
        let list = [...headersForExport];
        list.push(event.target.defaultValue);
        setHeadersForExport(list);
      }
    } else {
      if (event.target.defaultValue === "all") {
        setHeadersForExport([]);
      } else {
        let removedColumnFromHeader = headersForExport.filter(
          (item) => item !== event.target.defaultValue
        );
        setHeadersForExport(removedColumnFromHeader);
      }
    }
  };

  const handleExportDataModalOpen = (downloadAs) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    setDownloadableExcelData(filteredData);
    setDownloadAs(downloadAs);
  };

  const handleDownload = () => {
    const headers = headersForExport.filter((header) => header !== "all");
    downloadExcelFile(downloadableData, downloadAs, headers, ticketStatus);
    toggleDropdown();
    setHeadersForExport([]);
    setFilteredDataForModal(filteredData);
    setIsExportDataModalToggle(false);
  };

  // selected rows changes color
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#FFE1D0",
      },
    },
  ];
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end

  //draft start
  const saveDataInDraftAndCloseModal = () => {
    localStorage.setItem("ticket/", JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem("ticketDraftSaveKey", "ticket/");

    closeDraftModal();
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    setIsDirty(false);
  };

  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };
  const handleCloseDraftModal = () => {
    closeDraftModal();
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    localStorage.removeItem("ticket/");
    localStorage.removeItem("ticketDraftSaveKey");
    setIsDirty(false);
    setLead({});
  };

  // draft end

   // scroll top
 const ref = useRef();
 useEffect(() => {
   ref.current.scrollIntoView(0,0)
 }, [])

  return (
    <Fragment>
       <div ref={ref}>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          {/* <TicketDashboard /> */}

          <Row>
            <Col md="12" style={{ paddingBottom: "10px", borderRadius: "10%" }}>
              <div
                style={{
                  display: "flex",
                  padding: "20px",
                  borderBottom: "1px solid lightgray",
                  paddingLeft: "0px",
                  paddingTop: "0",
                }}
              >
                <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-primary"
                  type="submit"
                  onClick={() => openCustomizer("2")}
                >
                   <i
                    className="icofont icofont-plus"
                    style={{
                      paddingLeft: "10px",
                      cursor: "pointer",
                    }}
                  ></i>
                  <span style={{ marginLeft: "-10px" }}>&nbsp;&nbsp; New </span>
                 
                </button>
                <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-secondary"
                  onClick={Refreshhandler}
                >
                  <img src={require("../../../assets/images/Refresh.svg")} />
                  <span
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      top: "2px",
                    }}
                  >
                    &nbsp;&nbsp; Refresh
                  </span>
                </button>

                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggleDropdown}
                  className="export-dropdown"
                >
                  <DropdownToggle tag="span" aria-expanded={dropdownOpen}>
                    <button
                      style={{
                        whiteSpace: "nowrap",
                        marginRight: "15px",
                        fontSize: "medium",
                        width: "160px",
                        borderRadius: "5%",
                      }}
                      class="btn btn-secondary"
                    >
                      <img src={require("../../../assets/images/export.svg")} />
                      <style>
                        {`
                  #dropdown-bg-important {
                  background-color: transparent !important;
                  }
                  `}
                      </style>
                      <span
                        className="dropdown-bg"
                        id="dropdown-bg-important"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          top: "2px",
                        }}
                      >
                        &nbsp;&nbsp; Export
                      </span>
                      <img
                        style={{
                          position: "relative",
                          left: "15px",
                        }}
                        src={require("../../../assets/images/downarrow.svg")}
                      />
                    </button>
                  </DropdownToggle>
                  <DropdownMenu
                    className="export-dropdown-list-container"
                    style={{ left: "4px" }}
                  >
                    <ul
                      className="header-level-menuexport "
                      style={{ textAlign: "center" }}
                    >
                      <li
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                        }}
                        onClick={() => {
                          handleExportDataModalOpen("csv");
                        }}
                      >
                        <span style={{ padding: "6px" }}>export as .csv</span>
                      </li>
                      <li
                        onClick={() => {
                          handleExportDataModalOpen("excel");
                        }}
                      >
                        <span>export as .xls</span>
                      </li>
                    </ul>
                  </DropdownMenu>
                </Dropdown>

                <Modal
                  isOpen={isExportDataModalOpen}
                  toggle={() => {
                    setIsExportDataModalToggle(!isExportDataModalOpen);
                    setFilteredDataForModal(filteredData);
                  }}
                  centered
                >
                  <ModalHeader
                    toggle={() => {
                      setIsExportDataModalToggle(!isExportDataModalOpen);
                      setFilteredDataForModal(filteredData);
                    }}
                  >
                    Select the Fields Required
                  </ModalHeader>
                  <ModalBody>
                    <div>
                      {headersForExportFile.map((column, index) => (
                        <span style={{ display: "block" }}>
                          <label for={column[1]} key={`${column[1]}${index}`}>
                            <input
                              value={column[0]}
                              onChange={handleCheckboxChange}
                              type="checkbox"
                              name={column[1]}
                              checked={headersForExport.includes(column[0])}
                            />
                            &nbsp; {column[1]}
                          </label>
                        </span>
                      ))}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                     id="resetid"
                      onClick={() => setIsExportDataModalToggle(false)}
                    >
                      {Close}
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => handleDownload()}
                      disabled={headersForExport.length > 0 ? false : true}
                    >
                      Download
                    </Button>
                  </ModalFooter>
                </Modal>
                <Col
                  className="left-header horizontal-wrapper pl-0"
                  style={{ display: "contents" }}
                >
                  <li
                    className="level-menu outside"
                    style={{ display: "block" }}
                  >
                    <button
                      style={{
                        whiteSpace: "nowrap",
                        marginRight: "15px",
                        fontSize: "medium",
                      }}
                      class="btn btn-secondary"
                      onClick={() => OnLevelMenu(levelMenu)}
                    >
                      <img
                        src={require("../../../assets/images/morefilters.svg")}
                      />
                      <span
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          top: "2px",
                        }}
                      >
                        &nbsp;&nbsp; More Filters
                      </span>
                      <img
                        style={{
                          position: "relative",
                          left: "15px",
                        }}
                        src={require("../../../assets/images/downarrow.svg")}
                      />
                    </button>
                  </li>
                </Col>
                <TicketFilterContainer
                  levelMenu={levelMenu}
                  setLevelMenu={setLevelMenu}
                  filteredData={filteredData}
                  setFiltereddata={setFiltereddata}
                  filteredDataBkp={filteredDataBkp}
                  loading={loading}
                  setLoading={setLoading}
                  showTypeahead={false}
                  ticketCategory={ticketCategory}
                  ticketSubcategory={ticketSubcategory}
                  prioritySla={prioritySla}
                  assignedTo={assignedTo}
                />

                <div className="edit-delete-button-wrapper">
                  <button
                    style={{
                      whiteSpace: "nowrap",
                      marginRight: "15px",
                      fontSize: "medium",
                      width: "0px",
                    }}
                    class="btn btn-secondary"
                    onClick={handleModalToggle}
                    disabled={true}
                  >
                    <i
                      className="icofont icofont-ui-delete"
                      // {VerticallyCentered}
                    ></i>
                    <span
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        top: "2px",
                      }}
                    >
                      &nbsp;&nbsp;
                    </span>
                  </button>
                </div>
              </div>
            </Col>
            <Col md="12">
              <Ticketutilitybadge
                handleTableDataFilter={handleTableDataFilter}
                rowlength={rowlength}
                data={utilityBadge}
              />
            </Col>

            <Col md="12">
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
                        <Col md="8">
                          <Form>
                            <div
                              className="search_iconbox"
                              style={{
                                borderRadius: "3px",
                              }}
                            >
                              <Input
                                className="form-control"
                                type="text"
                                placeholder="Search With Category, Subcategory , Customer Id"
                                onChange={(event) => handlesearchChange(event)}
                                ref={searchInputField}
                                style={{
                                  border: "none",
                                  backgroundColor: "white",
                                }}
                              />

                              <Search
                                className="search-icon"
                                style={{
                                  border: "none",
                                  position: "absolute",
                                  right: "1.5rem",
                                  color: "#3B3B3B",
                                }}
                              />
                            </div>
                          </Form>
                        </Col>
                        <DataTable
                          columns={columns}
                          data={filteredData}
                          noHeader
                          // selectableRows
                          onSelectedRowsChange={({ selectedRows }) => (
                            handleSelectedRows(selectedRows),
                            deleteRows(selectedRows)
                          )}
                          clearSelectedRows={clearSelectedRows}
                          pagination
                          noDataComponent={"No Data"}
                          // clearSelectedRows={clearSelection}
                          conditionalRowStyles={conditionalRowStyles}
                        />
                      </div>
                    )}
                  </nav>
                </Col>
                <br />
              </Card>
            </Col>

            <Row>
              <Col md="12" className="CUSTOM_TEST">
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
                        backgroundColor: "#FFE1D0",
                        borderTopLeftRadius: "20px",
                      }}
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
                    <div className="customizer-body custom-scrollbar">
                      <TabContent activeTab={activeTab1}>
                        <TabPane tabId="2">
                          <div id="headerheading"> Add New Ticket </div>
                          {activeTab1 == "2" && (
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <AddTicket
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                    rightSidebar={rightSidebar}
                                    // draft passing data
                                    setIsDirtyFun={setIsDirtyFun}
                                    setformDataForSaveInDraft={
                                      setformDataForSaveInDraft
                                    }
                                    lead={lead}
                                    //calling reset after draft
                                    setLead={setLead}
                                    openforcustomer={openforcustomer}
                                  />
                                </div>
                              </li>
                            </ul>
                          )}
                        </TabPane>
                        <TabPane tabId="3">
                          <div id="headerheading">
                            {" "}
                            Ticket Information : T{lead.open_for}
                          </div>
                          {activeTab1 == "3" && (
                            <TicketDetails
                              lead={lead}
                              onUpdate={(data, isClose) =>
                                detailsUpdate(data, isClose)
                              }
                              openCustomizer={openCustomizer}
                              rightSidebar={rightSidebar}
                              dataClose={closeCustomizer}
                            />
                          )}
                        </TabPane>
                        {/* <TabPane tabId="4">
                        {activeTab1 == '4' &&
                        <BasicInfo/>
                          }
                        </TabPane> */}
                      </TabContent>
                    </div>
                  </div>
                </div>
              </Col>
              {/* modal */}

              <DeleteModal
                visible={modalVisible}
                handleVisible={handleModalToggle}
                isChecked={isChecked}
                tokenAccess={tokenAccess}
                setFiltereddata={setFiltereddata}
                setClearSelectedRows={setClearSelectedRows}
                setIsChecked={setIsChecked}
                setClearSelection={setClearSelection}
              />

              {/* modal for insufficient permissions */}
              <PermissionModal
                content={permissionModalText}
                visible={permissionmodal}
                handleVisible={permissiontoggle}
              />
              {/* end */}

              {/* draft modal start*/}
              {props.openDraftModal && (
                <DraftModal
                  openDraftModal={props.openDraftModal}
                  closeDraftModal={handleCloseDraftModal}
                  toggleDraftModal={toggleDraftModal}
                  handleSaveClick={saveDataInDraftAndCloseModal}
                />
              )}
              {/* draft modal end */}
            </Row>
          </Row>
        </div>
      </Container>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const { openDraftModal } = state.InternalTickets;
  return {
    openDraftModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDraftModal: () => dispatch(toggleDraftModal()),
    closeDraftModal: () => dispatch(closeDraftModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTickets);