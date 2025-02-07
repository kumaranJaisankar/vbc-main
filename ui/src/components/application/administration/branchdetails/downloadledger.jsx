import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Table,
  Input,
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Spinner,
} from "reactstrap";
import { customeraxios, franchiseaxios } from "../../../../axios";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { downloadExcelFile, downloadPdf } from "./Export";
import DatePicker from "react-datepicker";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MUIButton from "@mui/material/Button";
import EXPORT from "../../../../assets/images/export.png";
import { BRANCH } from "../../../../utils/permissions";
import Tooltip from "@mui/material/Tooltip";

const DownloadLedger = (props, initialValues) => {
  const { id } = useParams();
  const [leadUser, setLeadUser] = useState(props.lead);
// For Export
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
// Added handleClick for Download Export on 15th May 2023
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};
  const [formData, setFormData] = useState({
    startdate: null,
    enddate: null,
  });
  const [download, setDownload] = useState({});
  const [data, setData] = useState([]);

  //states for data filter based on start date and end date
  const [basedondate, setBasedondate] = useState([]);
  //export states
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [downloadAs, setDownloadAs] = useState("");
  const [headersForExport, setHeadersForExport] = useState([]);
//  Sailaja added for Export Download Button Loader on 15th May 2023
const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (props.lead) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...props.lead.address,
        },
      }));
    }
    setLeadUser(props.lead);
    if (!isEmpty(props.lead)) {
      franchiseaxios
        .get(`wallet/ledger/B${props.lead.id}`)
        // .then((res) => setData(res.data))
        .then((res) => {
          setDownload(res.data);
          setBasedondate(res.data);
        });
    }
  }, [props.lead, props.walletinformationupdate]);

  const handleChange = (e) => {
    let addressList = [
      "house_no",
      "street",
      "landmark",
      "city",
      "district",
      "state",
      "pincode",
      "country",
    ];
    if (addressList.includes(e.target.name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
      setLeadUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
      // setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = (e, id) => {
    // e.preventDefault();
    // let data = { ...formData };
    // customeraxios
    //   .patch("customers/rud/" + id, data)
    //   .then((res) => {
    //     console.log(res);
    //     console.log(res.data);
    //     props.onUpdate(res.data);
    //     toast.success("Customer Information edited successfully", {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose: 1000,
    //     });
    //     props.setIsdisabled(true);
    //   })
    //   .catch(function (error) {
    //     toast.error("Something went wrong", {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose: 1000,
    //     });
    //     console.error("Something went wrong!", error);
    // });
  };
  //onchage for date
  const selectdate = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    basedondate &&
      basedondate.transactions &&
      setDownload((prevState) => ({
        ...prevState,
        transactions: basedondate.transactions.filter(
          (item) =>
            moment(item.payment_date).isBetween(
              moment(formData.startdate),
              moment(formData.enddate)
            ) ||
            moment(item.payment_date).isSame(
              moment(formData.startdate),
              "day"
            ) ||
            moment(item.payment_date).isSame(moment(formData.enddate), "day")
        ),
      }));
  }, [formData.startdate, formData.enddate]);

  // useEffect(() => {
  //   basedondate && basedondate.transactions && setDownload((prevState) => ({
  //      ...prevState,
  //      transactions: basedondate.transactions.filter(
  //        (item) =>
  //          new Date(item.payment_date) >= new Date(formData.startdate) &&
  //          new Date(item.payment_date) <= new Date(formData.enddate)
  //      ),
  //    }));
  //  }, [formData.startdate, formData.enddate]);

  //export functionality start here
  const handleExportDataModalOpen = (downloadAs) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    setDownloadableExcelData(download.transactions);
    setDownloadAs(downloadAs);
  };

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

  const headersForExportFile = [
    ["all", "All"],
    ["opening_balance", "Opening Balance"],
    ["credit_amount", "Credit"],
    ["debit_amount", "Debit"],
    ["type", "Type"],
    ["payment_date", "Payment Date"],
    ["person", "User Name"],
    ["wallet_amount", "Wallet Amount"],
  ];

  const handleDownload = () => {
    setIsLoading(true);
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    setIsLoading(false);
    if (downloadAs === "pdf") {
      handleExportDataAsPDF(headersForPDF);
    } else {
      downloadExcelFile(downloadableData, downloadAs, headers);
    }
    toggleDropdown();
    setHeadersForExport([]);
    setFilteredDataForModal(filteredData);
    setIsExportDataModalToggle(false);
  };

  const handleExportDataAsPDF = (headersForPDF) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    const { id, address, name } = download.branch;
    const { payment_date } =
      download.transactions[download.transactions.length - 1];
    const downloadfirstobject = download.transactions[0];
    let titleAddress = "";
    const {
      city,
      country,
      district,
      house_no,
      landmark,
      pincode,
      state,
      street,
    } = address;

    if (address) {
      titleAddress +=
        "" +
        "\n" +
        "                                               " +
        "                                                  " +
        "" +
        "\n" +
        "\n" +
        " " +
        "\n" +
        "\n" +
        "\n" +
        "ID " +
        "                           : " +
        "B" +
        "" +
        id +
        "\n" +
        "Branch Name     " +
        "    : " +
        name +
        "\n" +
        "Address                  : " +
        house_no +
        ", " +
        landmark +
        "\n" +
        "                                 " +
        street +
        ", " +
        city +
        "\n" +
        "                                 " +
        district +
        ", " +
        state +
        "\n" +
        "                                 " +
        country +
        ", " +
        pincode +
        "" +
        "                                                                                       From : " +
        downloadfirstobject.payment_date +
        "   To   " +
        "  " +
        payment_date;
    }

    const title = `${titleAddress}`;
    downloadPdf(title, headersForPDF, download.transactions, "Ledger");
  };

  //useefeect for emptying from date and to date
  useEffect(() => {
    setFormData({
      startdate: null,
      enddate: null,
    });
    basedondate &&
      basedondate.transactions &&
      setDownload((prevState) => ({
        ...prevState,
        transactions: basedondate.transactions,
      }));
  }, [props.rightSidebar]);

  const handleExportclose = () => {
    setIsExportDataModalToggle(false);
    setHeadersForExport([]);
  };
  //end

  return (
    <Fragment>
      <br />
      <Container fluid={true} id="cust_info">
        <Dropdown
          style={{ position: "relative", left: "70%", top: "-28px" }}
          isOpen={dropdownOpen}
          toggle={toggleDropdown}
          className="export-dropdown"
        >
          {/* Sailaja Commented off the code of Branch Ledger Export  on 15th May 2023 */}
          {/* <DropdownToggle tag="span" aria-expanded={dropdownOpen}>
            <button
              style={{
                position:"relative",
                top:"36px",
                right:"63px",
              relative:"142px",
                whiteSpace: "nowrap",
                marginRight: "15px",
                fontSize: "medium",
                fontWeight:"500",
                width: "180px",
                borderRadius: "5%",
                backgroundColor:"white",
                border:"2px solid #285295"
              }}
            >
                 <img src={EXPORT}/>
              {/* <img src={require("../../../../assets/images/export.svg")} /> 
              <style>
                {`
                  #dropdown-bg-important {
                  background-color: transparent !important;
                  }
                  `}
              </style>
              <span
                // className="dropdown-bg"
                // id="dropdown-bg-important"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  top: "2px",
                }}

              >
                &nbsp;&nbsp; Download
              </span>
              <img
                style={{
                  position: "relative",
                  left: "15px",
                }}
                // src={require("../../../../assets/images/downarrow.svg")}
              />
            </button>
          </DropdownToggle>
          <DropdownMenu
            className="export-dropdown-list-container"
            style={{ left: "4px",bottom:"-81px" }}
          >
            <ul
              className="header-level-menuexport"
              style={{ textAlign: "center" }}
            >
              <li
                style={{
                  borderBottom: "1px solid #d0d0d0",
                }}
                onClick={() => {
                  handleExportDataModalOpen("excel");
                }}
              >
                <span style={{ padding: "6px" }}>Download as .xls</span>
              </li>
              <li
                onClick={() => {
                  handleExportDataModalOpen("csv");
                }}
              >
                <span style={{ padding: "6px" }}>Download as .csv</span>
              </li>
              <li
                onClick={() => {
                  handleExportDataModalOpen("pdf");
                }}
              >
                <span style={{ padding: "6px" }}>Download as .pdf</span>
              </li>
            </ul>
          </DropdownMenu> */}
        </Dropdown>

        <Modal
          isOpen={isExportDataModalOpen}
          toggle={() => {
            setIsExportDataModalToggle(!isExportDataModalOpen);
            setFilteredDataForModal(filteredData);
            setHeadersForExport([]);
          }}
          centered
        >
          <ModalBody>
            <h5> Select the Fields Required </h5>
            <hr />
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
            <Button color="secondary" id="resetid" onClick={handleExportclose}>
              Close
            </Button>
            {/* Sailaja Added new Download Button on 15th May 2023 */}
            <Button
              color="primary"
              className="btn btn-primary openmodal"
              id="download_button1"
              onClick={() => handleDownload()}
              disabled={isLoading || (headersForExport.length > 0 ? false : true)}
              // disabled={headersForExport.length > 0 ? false : true}
            >
              {isLoading ? <Spinner size="sm" /> : null}
               &nbsp;&nbsp;
              Download
            </Button>
          </ModalFooter>
        </Modal>

        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          {/* Sailaja modified marginTop Property on 15th May 2023 */}
          <Row>
            <Col sm="4" style={{ marginTop: "-45px" }}>
              <Label className="kyc_label">From Date</Label>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                wrapperClassName="date-picker"
                selected={formData && formData.startdate}
                onChange={(date) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    startdate: date,
                  }))
                }
                // placeholderText="From Date"
                name="startdate"
              />
            </Col>
            <Col sm="4" style={{ marginTop: "-45px" }}>
              <Label className="kyc_label">To Date</Label>
              <DatePicker
                wrapperClassName="date-picker"
                dateFormat="yyyy/MM/dd"
                selected={formData && formData.enddate}
                onChange={(date) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    enddate: date,
                  }))
                }
                minDate={moment(formData.startdate).toDate()}
                // placeholderText="To Date"
                name="enddate"
                // id="meeting-time"
              />
            </Col>
            {/* Sailaja Added New Export In Branch Edit Ledger in 15th May 2023 */}
            <Col sm="4" style={{ marginTop: "-45px" }}>
              <>
                <Tooltip title={"Export"}>
                  <MUIButton
                    className="muibuttons"
                    variant="outlined"
                    onClick={handleClick}
                    style={{ height: "40px" }}
                  >
                    <img src={EXPORT} className="Header_img" />
                  </MUIButton>
                </Tooltip>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={() => handleExportDataModalOpen("csv")}>
                    Export CSV
                  </MenuItem>
                  <MenuItem onClick={() => handleExportDataModalOpen("excel")}>
                    Export XLS
                  </MenuItem>
                  <MenuItem onClick={() => handleExportDataModalOpen("pdf")}>
                    Export PDF
                  </MenuItem>
                </Menu>
              </>
            </Col>

            {/* <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                    value={formData && formData.startdate}
                    onChange={selectdate}
                    type="date"
                    id="meeting-time"
                    name="startdate"
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    From Date
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    onChange={selectdate}
                    // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                    value={formData && formData.enddate}
                    type="date"
                    id="meeting-time"
                    name="enddate"
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    To Date
                  </Label>
                </div>
              </FormGroup> */}
          </Row>
          <Row>
            <Table
              bordered={true}
              className="table table-bordered"
              style={{ width: "max-content" }}
            >
              <thead>
                <tr>
                  <th scope="col">{"Opening Balance"}</th>
                  <th scope="col">{"Credit"}</th>
                  <th scope="col">{"Debit"}</th>
                  <th scope="col">{"Type"}</th>
                  <th scope="col">{"Payment Date"}</th>
                  <th scope="col">{"User Name"}</th>
                  <th scope="col">{"Wallet Amount"}</th>
                </tr>
              </thead>
              <tbody>
                {/* {leadUser.map((services) => ( */}
                {!isEmpty(download) &&
                  download.transactions.map((plan) => {
                    return (
                      <tr>
                        <td scope="row">
                          {plan.opening_balance
                            ? "₹" + plan.opening_balance
                            : "--"}
                        </td>
                        <td scope="row">
                          {plan.credit_amount ? "₹" + plan.credit_amount : "--"}
                        </td>

                        <td scope="row">
                          {plan.debit_amount ? "₹" + plan.debit_amount : "--"}
                        </td>

                        <td scope="row">{plan.type ? plan.type : "--"}</td>

                        <td scope="row">
                          {moment(plan.payment_date).format("YYYY-MM-DD")}
                        </td>
                        <td scope="row">{plan.person ? plan.person : "--"}</td>

                        <td scope="row">
                          ₹{plan.wallet_amount ? plan.wallet_amount : "--"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default DownloadLedger;
