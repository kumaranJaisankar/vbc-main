import React, { Fragment,  useState } from "react"; //hooks
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  ModalFooter,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  Card,
} from "reactstrap";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import {
  downloadExcelFile,
  downloadPdf,
} from "../../franchise/franchisedetails/Export";

const CustomerLedger = (props) => {

  const [leadUser, setLeadUser] = useState(props.lead);
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    startdate: new Date(),
    enddate: new Date(),
  });
  const [download, setDownload] = useState({});


  const [customerlist, setCustomerlist] = useState({});

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

  const handleSubmit = (e, id) => {
    
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
    ["payee", "User Name"],
    ["wallet_amount", "Wallet Amount"],
  ];

  const handleDownload = () => {
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    console.log(headersForPDF, ":headersForPDF");
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
    const title = `Ledger Accounts`;
    downloadPdf(title, headersForPDF, download.transactions, "Download Ledger");
  };
  const selectdate = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Fragment>
      <Container fluid={true} id="custinfo" style={{marginLeft:"14px"}}>
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
            Confirmation
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
              color="secondary"
              onClick={() => setIsExportDataModalToggle(false)}
            >
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
             
        <Row>
          <Col sm="6">
            <Card style={{ height: "91px", padding: "20px" }}>
              <p style={{ color: "#6190e5", textAlign: "center",fontSize:"19px" }}>
                ₹{props.balance ? props.balance.wallet_info : 0}
              </p>
              <p style={{ textAlign: "center",fontSize:"19px",marginTop:"-23px" }}>Wallet Balance</p>
            </Card>
          </Col>
        </Row>
        <br/>

        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{ marginTop: "-27px",marginLeft:"0px" }}>
            <Table
              bordered={true}
              className="table table-bordered"
              style={{ width: "max-content" }}
            >
              <thead>
                <tr>
                  <th scope="col">{"Opening balance"}</th>
                  <th scope="col">{"Credit"}</th>
                  <th scope="col">{"Debit"}</th>
                  <th scope="col">{"Type"}</th>
                  <th scope="col">{"Payment Date"}</th>

                  <th scope="col">{"Wallet Amount"}</th>
                </tr>
              </thead>
              <tbody>
                {!isEmpty(customerlist) &&
                  customerlist.transactions.map((plan) => {
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

                        <td scope="row">
                          {plan.wallet_amount ? "₹" + plan.wallet_amount : ""}
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

export default CustomerLedger;
