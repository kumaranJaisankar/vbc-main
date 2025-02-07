import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Modal,
  ModalFooter,
  ModalBody,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import useFormValidation from "../../customhooks/FormValidation";
// import {Globe} from "feather-icons";
import { default as axiosBaseURL } from "../../../axios";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { downloadExcelFile, downloadPdf } from "./Export";
import DatePicker from "react-datepicker";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EXPORT from "../../../assets/images/export.png";

const WalletDetails = (props, initialValues) => {
  const { id } = useParams();

  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);

  //export states
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [data, setData] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [downloadAs, setDownloadAs] = useState("");
  const [headersForExport, setHeadersForExport] = useState([]);

  const [formData, setFormData] = useState({
    startdate: null,
    enddate: null,
  });

  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
  }, [props.rightSidebar]);

  useEffect(() => {
    axiosBaseURL
      .get("franchise/wallet/today")
      // .then((res) => setData(res.data))
      .then((res) => {
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  const sourceDetails = (id, res) => {
    if (!isDisabled) {
      axiosBaseURL
        .get(`wallet/ledger/${res.data.entity_id}`, leadUser)
        .then((res) => {
          props.onUpdate(res.data);
          toast.success("Lead Source was edited successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setIsdisabled(true);
        })
        .catch(function (error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.error("Something went wrong!", error);
        });
      // }
    }
  };

  const handleSubmit = (e, entity_id) => {
    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(leadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      sourceDetails(entity_id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

  const requiredFields = ["name"];
  const { validate, Error } = useFormValidation(requiredFields);

  //export functionality start here
  const handleExportDataModalOpen = (downloadAs) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    setDownloadableExcelData(
      props.filterselectedid && props.filterselectedid.transactions
    );
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
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
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
    //adding code for from date and to date in pdf
    const { payment_date } =
      props.filterselectedid &&
      props.filterselectedid.transactions[
        props.filterselectedid && props.filterselectedid.transactions.length - 1
      ];
    const downloadfirstobject =
      props.filterselectedid && props.filterselectedid.transactions[0];
    let titleAddress = "";
    if (payment_date) {
      titleAddress +=
        "" +
        "\n" +
        "                                               " +
        "                                                  " +
        "" +
        "\n" +
        "" +
        "\n" +
        "                                               " +
        "                                                  " +
        "" +
        "\n" +
        "" +
        "\n" +
        "\n" +
        "        From : " +
        downloadfirstobject.payment_date +
        " To " +
        " " +
        payment_date;
    }
    const title = `${titleAddress}`;
    downloadPdf(
      title,
      headersForPDF,
      props.filterselectedid && props.filterselectedid.transactions,
      // props.selectedid && props.selectedid.transactions,
      "Download Ledger"
    );
  };

  const selectdate = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    props.setFilterselectedid((prevState) => ({
      ...prevState,
      transactions:
        props.selectedid &&
        props.selectedid.transactions &&
        props.selectedid.transactions.filter(
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
          // new Date(item.payment_date || Date.now()) >=
          //   new Date(formData.startdate || Date.now()) &&
          // new Date(item.payment_date || Date.now()) <=
          //   new Date(formData.enddate || Date.now())
        ),
    }));
  }, [formData.startdate, formData.enddate]);

  //useeffect for emptying from date and to date
  useEffect(() => {
    setFormData({
      startdate: null,
      enddate: null,
    });
    props.selectedid &&
      props.selectedid.transactions &&
      props.setFilterselectedid((prevState) => ({
        ...prevState,
        transactions:
          props.selectedid &&
          props.selectedid.transactions &&
          props.selectedid.transactions,
      }));
  }, [props.rightSidebar]);
  //end

  const handleExportclose = () => {
    setIsExportDataModalToggle(false);
    setHeadersForExport([]);
  };
  return (
    <Fragment>
      {/* <EditIcon
        className="icofont icofont-edit"
        style={{ top: "10px", right: "56px", color: "#2572C5" }}
        onClick={clicked}
        // disabled={isDisabled}
      /> */}

      <br />
      <Container fluid={true}>
        <Dropdown
          style={{ position: "relative", left: "70%", top: "-28px" }}
          isOpen={dropdownOpen}
          toggle={toggleDropdown}
          className="export-dropdown"
        >
          <DropdownToggle tag="span" aria-expanded={dropdownOpen}>
            <button

              style={{
                position:"relative",
                right:"142px",
                top:"36px",
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
              {/* <img src={require("../../../assets/images/export.svg")} /> */}
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
              {/* <img
                style={{
                  position: "relative",
                  left: "15px",
                  fill:"white"
                              }}
                src={require("../../../assets/images/downarrow.svg")}
              /> */}
            </button>
          </DropdownToggle>
          <DropdownMenu
            className="export-dropdown-list-container"
            style={{ left: "4px" , bottom :"-81px"}}
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
          </DropdownMenu>
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
            <h5> Confirmation</h5>
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
            <Button color="secondary" onClick={handleExportclose}>
              Close
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

        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.entity_id);
          }}
        >
          <Row>
            <Col sm="4" style={{ marginTop: "-63px" }}>
              <span className="label_text">From Date</span>
              <KeyboardArrowDownIcon 
                style={{
                  position: "relative",
                  top: "41px",
                  zIndex: "1",
                  left: "19%",
                }}/>
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
            <Col sm="4" style={{ marginTop: "-63px" }}>
              <span className="label_text">To Date</span>
              <KeyboardArrowDownIcon
                style={{
                  position: "relative",
                  top: "41px",
                  zIndex: "1",
                  left: "22%",
                }}
              />
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
            {/* <Col sm="4">
              <FormGroup>
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
              </FormGroup>
            </Col> */}
          </Row>
          <Row
            style={{ position: "relative", left: "15px", marginTop: "28px" }}
          >
            <Table bordered={false} style={{ width: "max-content" }}>
              <thead>
                <tr>
                  <th scope="col" className="table_header">
                    {"User Name"}
                  </th>
                  <th scope="col" className="table_header">
                    {"Payment Date"}
                  </th>
                  <th scope="col" className="table_header">
                    ₹ &nbsp;{"Opening Balance"}
                  </th>
                  <th scope="col" className="table_header">
                    ₹ &nbsp;{"Amount"}
                  </th>
                  <th scope="col" className="table_header">
                    {"Credit"}
                  </th>
                  <th scope="col" className="table_header">
                    {"Debit"}
                  </th>
                  <th scope="col" className="table_header">
                    ₹ &nbsp;{"Wallet Amount"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(props.filterselectedid) &&
                  props.filterselectedid &&
                  props.filterselectedid.transactions &&
                  props.filterselectedid.transactions.map((plan) => {
                    //   let something = plan.credit
                    return (
                      <tr>
                        <td scope="row" className="table_details">
                          {plan.person ? plan.person : "-"}
                        </td>
                        <td scope="row" className="table_details">
                          {plan.payment_date ? plan.payment_date : "-"}
                        </td>
                        <td scope="row" className="table_details">
                          {plan.opening_balance ? plan.opening_balance : "-"}
                        </td>
                        <td scope="row" className="table_details">
                          {plan.amount ? plan.amount : "-"}
                        </td>
                        <td scope="row" className="table_details">
                          {plan.credit_amount ? plan.credit_amount : "-"}
                        </td>
                        <td scope="row" className="table_details">
                          {plan.debit_amount ? plan.debit_amount : "-"}
                        </td>
                        <td scope="row" className="table_details">
                          {plan.wallet_amount ? plan.wallet_amount : "-"}
                        </td>
                      </tr>
                    );
                  })}
                {/* <td>
                  {props.selectedid &&
                    props.selectedid &&
                    props.selectedid.transactions &&
                    props.selectedid.transactions[0].pre_transaction_balance}
                </td>
                <td>
                  {props.selectedid &&
                    props.selectedid &&
                    props.selectedid.transactions &&
                    props.selectedid.transactions[0].credit}
                </td>
                <td>
                  {props.selectedid &&
                  props.selectedid.transactions &&
                  props.selectedid.transactions[0].debit
                    ? props.selectedid &&
                      props.selectedid.transactions &&
                      props.selectedid.transactions[0].debit
                    : "-"}
                </td>
                <td>
                  {props.selectedid &&
                    props.selectedid &&
                    props.selectedid.transactions &&
                    props.selectedid.transactions[0].transaction_date}
                </td>
                <td>
                  {props.selectedid &&
                    props.selectedid &&
                    props.selectedid.transactions &&
                    props.selectedid.transactions[0].name}
                </td>
                <td>
                  {props.selectedid &&
                    props.selectedid &&
                    props.selectedid.transactions &&
                    props.selectedid.transactions[0].payment_date}
                </td>
                <td>
                  {props.selectedid &&
                    props.selectedid &&
                    props.selectedid.wallet_amount}
                </td> */}
              </tbody>
            </Table>
          </Row>
          <br />
        </Form>
      </Container>
    </Fragment>
  );
};

export default WalletDetails;
