import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
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
import { toast } from "react-toastify";
import { classes } from "../../../../../data/layouts";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { networkaxios } from "../../../../../axios";
import { ModalTitle, Cancel, CopyText } from "../../../../../constant";
import { statusType } from "./radiushealthdropdown";
import DataTable from "react-data-table-component";
import { ADD_SIDEBAR_TYPES } from "../../../../../redux/actionTypes";

import { CopyToClipboard } from "react-copy-to-clipboard";
import RadiusDetails from "./radiusdetails";
import { NETWORK } from "../../../../../utils/permissions";
import EXPCIRCLE from "../../../../../assets/images/Customer-Circle-img/ExpiredCircle.png";
import ACTCIRCLE from "../../../../../assets/images/Customer-Circle-img/ActiveCircle.png";
import Typography from "@mui/material/Typography";
import MoreActions from "../../../../common/CommonMoreActions";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const RadiusTable = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [refresh, setRefresh] = useState(0);
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
  const [lead, setLead] = useState([]);
  const width = useWindowSize();

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
  };

  useEffect(() => {
    handlesearchChange(props.searchRadiusString);
  }, [props.searchRadiusString])
  //imports
  const radiusStatus = {
    IN: "In Active",
    ACT: "Active",
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
      name: <b className="Table_columns">{"ID"}</b>,
      selector: "id",
      cell: (row) => (
        <>
          {token.permissions.includes(NETWORK.RADIUSREAD) ? (
            <a
              onClick={() => openCustomizer("3", row)}
              className="openmodal"
            >
              R{row.id}
            </a>
          ) : (
            <a
              className="openmodal"

            >
              R{row.id}
            </a>
          )}
        </>

      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Name"}</b>,
      selector: "name",
      sortable: true,
    },
    //Sailaja fixed two line fieldnames for IP Address(129th Line)field on 21st July
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"IP Address"}</b>,
      selector: "ip_address",
      sortable: true,
    },
    //Sailaja added style  whiteSpace for User Name field on 21st July
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"User Name"}</b>,
      selector: "username",
      cell: (row) => (
        <span>{row?.username ? "*****" : "---"}</span>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Password"}</b>,
      selector: "password",
      cell: (row) => (
        <span>{row?.password ? "*****" : "---"}</span>
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
            ) : row.status === "IN" ? (
              <img src={EXPCIRCLE} />
            ) : (
              ""
            )}
            &nbsp; &nbsp;
            {/*Sailaja fixed two line fieldnames for Status  field(166th Line) on 21st July */}
            <Typography variant="caption" style={{ whiteSpace: "nowrap" }}>
              {radiusStatus[row.status]}
            </Typography>
          </>
        );
      },
      // cell: (row) => {
      //   let statusObj = statusType.find((s) => s.id == row.status);
      //   return <span>{statusObj ? statusObj.name : "-"}</span>;
      // },
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
      name: "",
      selector: "",
      sortable: "",
    },

  ];

  const deleteRows = (selected) => {
    props.setClearSelection(false);

    let rows = selected.map((ele) => ele.id);
    if (rows.length > 1) {
      notMoreThanone();
    } else {
      //APICALL
      networkaxios
        .get(`network/nas/deletecheck/${rows[0]}`)
        .then((response) => {
          if (response.data == true) {
            props.setClearSelection(false);
            props.setIsChecked([...rows]);
            props.setRowdeleterecord(selected[0]);
          } else {
            noDelete();
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


  //use effect hook for getting the data
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
    networkaxios
      .get("network/radius/create")
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  }, [refresh, props.refresh]);

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
    setRightSidebar(true);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain-nas").classList.add("open");
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
  };
  //close customizer functionlaity
  const closeCustomizer = () => {
    setRightSidebar(false);
    document.querySelector(".customizer-contain-nas").classList.remove("open");
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

            !event.target.className.includes("openmodal")
          ) {
            closeCustomizer();
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

  return (
    <div>
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
                  columns={columns}
                  data={filteredData}
                  setFiltereddata={props.setFiltereddata}
                  clearSelectedRows={props.clearSelectedRows}
                  pagination
                  noHeader
                  noDataComponent={"No Data"}
                  // clearSelectedRows={props.clearSelection}


                  conditionalRowStyles={conditionalRowStyles}
                  selectableRows
                  onSelectedRowsChange={({ selectedRows }) => (
                    handleSelectedRows(selectedRows)
                    // deleteRows(selectedRows)
                  )}
                  selectableRowsComponent={NewCheckbox}
                />
              </div>
            )}
          </nav>
        </Col>
        <br />
      </Card>
      <Row>
        <Col md="12">

          <div className="customizer-contain customizer-contain-nas"
            ref={box}
            style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
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

                  <TabPane tabId="3">
                    <div id="headerheading" style={{ marginTop: "-55px" }}>Radius Details : R{lead.id}</div>
                    <RadiusDetails
                      lead={lead}
                      onUpdate={(data) => detailsUpdate(data)}
                      rightSidebar={rightSidebar}
                      dataClose={closeCustomizer}
                      openCustomizer={openCustomizer}
                      Refreshhandler={props.Refreshhandler}
                    />
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

export default RadiusTable;

