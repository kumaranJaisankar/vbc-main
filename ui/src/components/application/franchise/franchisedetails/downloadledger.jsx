import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  Table,
  ModalFooter,
  Button,
  Modal,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Spinner,
} from "reactstrap";
import { franchiseaxios } from "../../../../axios";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { downloadExcelFile, downloadPdf } from "./Export";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MUIButton from "@mui/material/Button";
import EXPORT from "../../../../assets/images/export.png";
import { FRANCHISE } from "../../../../utils/permissions";
import Tooltip from "@mui/material/Tooltip";
import DatePicker from "react-datepicker";
// Sailaja Added Storage Token for franchise Ledger Download on 11th May 2023
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}


const DownloadLedger = (props) => {
  const { id } = useParams();
// For Export
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
// Added handleClick for Download Export on 11th May 2023
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};
  const [leadUser, setLeadUser] = useState(props.lead);
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    startdate: null,
    enddate: null,
    // new Date()
  });
  const [download, setDownload] = useState({});

  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();

  //exportData
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [downloadAs, setDownloadAs] = useState("");
  const [headersForExport, setHeadersForExport] = useState([]);
  //states for data filter based on start date and end date
  const [basedondate, setBasedondate] = useState([]);

  //end
//  Sailaja added for Export Download Button Loader on 27th April 2023
const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
     props.setIsdisabled(true); 
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
        .get(`wallet/ledger/F${props.lead.id}`)
        // .then((res) => setData(res.data))
        .then((res) => {
          console.log(res);
          setDownload(res.data);
          setBasedondate(res.data);
          // props.setIsdisabled(true);
        });
    }
  }, [props.lead, props.walletinformationupdate, props.rightSidebar]);

  useEffect(() => {
    basedondate &&
      basedondate.transactions &&
      setDownload((prevState) => ({
        ...prevState,
        transactions: basedondate.transactions.filter(
          (item) =>
            // new Date(item.payment_date) >= new Date(formData.startdate) &&
            // new Date(item.payment_date) <= new Date(formData.enddate)

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

  //export functionality
  const handleExportDataModalOpen = (downloadAs) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    setDownloadableExcelData(download.transactions);
    setDownloadAs(downloadAs);
  };

  const handleCheckboxChange = (event) => {
    console.log(event);
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
    ["service","Plan Name"],
    ["wallet_amount", "Wallet Amount"],
  ];

  const handleDownload = () => {
    setIsLoading(true);
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    console.log(headersForPDF, ":headersForPDF");
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
    const { id, name, address, created_at } = download.franchise;
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
        "F" +
        "" +
        id +
        "\n" +
        "Franchise Name     " +
        ": " +
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
  const selectdate = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      <Container fluid={true} id="custinfo">
        <Dropdown
          style={{ position: "relative", left: "70%", top: "-28px" }}
          isOpen={dropdownOpen}
          toggle={toggleDropdown}
          className="export-dropdown"
        >
          {/* Sailaja Commented off the code of Franchise Ledger Export  on 11th May 2023 */}
          
          {/* <DropdownToggle tag="span" aria-expanded={dropdownOpen}>
            <button
              style={{
                position:"relative",
                top:"8px",
                whiteSpace: "nowrap",
                marginRight: "15px",
                fontSize: "medium",
                fontWeight:'500',
                width: "180px",
                borderRadius: "5%",
                backgroundColor:"white",
                border:"2px solid #285295"
              }}

            >
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
            style={{ left: "4px", bottom:"-81px" }}
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
          {/* Sailaja Modified header on Franchise Edit Ledger on 11th May 2023 */}
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
          {/* Sailaja modified marginTop Property on 11th May 2023 */}        
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
              </FormGroup> */}
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
              {/* Sailaja Added New Export In Franchise Edit Ledger in 11th May 2023 */}
             <Col sm="4" style={{ marginTop: "-45px", left: "18rem" }}>
              {token.permissions.includes(FRANCHISE.EXPORT) && (
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
            )}
            </Col>
              {/* <FormGroup>
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
            </Col>
          </Row>
          <br/>
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
                  <th scope="col">{"Plan Name"}</th>
                  <th scope="col">{"Wallet Amount"}</th>
                </tr>
              </thead>
              <tbody>
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
                        <td scope="row">{plan.service ? plan.service : "--"}</td>
                        <td scope="row">
                          {plan.wallet_amount ? "₹" + plan.wallet_amount : ""}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <br/>
            </Table>
            
            <br/><br/> <br/><br/> <br/><br/> <br/><br/><br/><br/> <br/><br/> <br/><br/> <br/><br/><br/> <br/><br/> <br/><br/> <br/><br/>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default DownloadLedger;
