import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { downloadExcelFile, downloadPdf } from "./invoiceexport";
import { toast } from "react-toastify";
import { billingaxios } from "../../../../../axios";
import { Button, Modal,  ModalFooter, ModalBody } from "reactstrap";
import { REPORTS } from "../../../../../utils/permissions";
import EXPORT from "../../../../../assets/images/export.png";
import Tooltip from '@mui/material/Tooltip';
import { Spinner } from "reactstrap";



var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const GstExport = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  const { ledgerLists } = props;
  const { currentTab } = ledgerLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  //  Sailaja added for GST Export Download Button Loader on 3rd May 2023
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };
  const handleExportDataModalOpen = (downloadAs) => {
    handleClose();
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      downloadAs,
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };
  const headersForExportFile = [
    ["all", "All"],
    ["branch", "Branch"],
    ["franchise", "Franchise"],
    ["customer_username", "User ID"],
    ["customer_name", "Customer Name"],
    ["mobile_number", "Mobile"],
    ["payment_id", "Payment ID"],
    ["pickup_type", "Payment Method"],
    ["payment_method", "Payment Type"],
    ['package_name', "Package Name"],
    ["collected_by_name", "Name"],
    ["collected_by_username", "Collected By"],
    ["check_reference_no", "Cheque Number"],
    ["upi_reference_no", "UTR Number"],
    ["transaction_no", "Transaction Number"],
    ["bank_reference_no", "Bank Reference No"],
    ["completed_date", "Completed Date"],
    ["status", "Status"],
    ['installation_charges', 'Installation Charges'],
    ['security_deposit', 'Security Deposit'],
    ["amount", "Total Amount"],
    ["due_amount", "Due Amount"],
    ["static_ip_total_cost", "Static IP Cost"],


  ];
  // Headers for Excel
  const headersForExcel = [
    ["all", "All"],
    ["branch", "Branch"],
    ["franchise", "Franchise"],
    ["customer_username", "User ID"],
    ["customer_name", "Customer Name"],
    ["mobile_number", "Mobile"],
    ["payment_id", "Payment ID"],
    ["pickup_type", "Payment Method"],
    ["payment_method", "Payment Type"],
    ['package_name', "Package Name"],
    ["collected_by_name", "Name"],
    ["collected_by_username", "Collected By"],
    ["check_reference_no", "Cheque Number"],
    ["upi_reference_no", "UTR Number"],
    ["transaction_no", "Transaction Number"],
    ["bank_reference_no", "Bank Reference No"],
    ["completed_date", "Completed Date"],
    ["status", "Status"],
    ['installation_charges', 'Installation Charges'],
    ['security_deposit', 'Security Deposit'],
    ["amount", "Total Amount"],
    ["due_amount", "Due Amount"],
    ["static_ip_total_cost", "Static IP Cost"],

  ]
  const handleCheckboxChange = (event) => {
    const { headersListForExport } = exportData;
    if (event.target.checked) {
      if (event.target.defaultValue === "all") {
        let allKeys = headersForExportFile.map((h) => {
          if (h) {
            return h[0];
          }
        });
        updateExportData({
          headersListForExport: [...allKeys],
        });
      } else {
        let list = [...headersListForExport];
        list.push(event.target.defaultValue);
        updateExportData({
          headersListForExport: [...list],
        });
      }
    } else {
      if (event.target.defaultValue === "all") {
        updateExportData({
          headersListForExport: [],
        });
      } else {
        let removedColumnFromHeader = headersListForExport.filter(
          (item) => item !== event.target.defaultValue
        );
        updateExportData({
          headersListForExport: [...removedColumnFromHeader],
        });
      }
    }
  };
  const handleDownload = () => {
    setIsLoading(true);
    const { headersListForExport, downloadAs } = exportData;
    const headers = headersListForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );

    const headersForExcelFiltered = headersForExcel.filter(
      (h) => headers.includes(h[0]) && h
    );
    const queryParams = props.getQueryParams();
    billingaxios
      // payment/v2/export
      .get(`payment/enh/list?export=True&${queryParams}&is_gst=True`)
      .then((response) => {
        setPageLoadData(response.data, "response.data");
        setIsLoading(false);
        if (downloadAs === "pdf") {
          handleExportDataAsPDF(headersForPDF, response.data);
        } else {
          // downloadExcelFile(response.data, downloadAs, headers);
          downloadExcelFile(response.data, downloadAs, headersForExcelFiltered);
        }
        // Added Close the modal after successful API call on 10th May 2023
        updateExportData({
          uiState: {
            showDropdown: false,
          },
          isExportDataModalOpen: false,
          headersListForExport: [],
          downloadAs: "",
        });
        // End
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error, "exportt")
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is404Error) {
          toast.error("API mismatch", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
        console.log(error)
      });
  };
  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
    let pdfTitle = "GST Reports";

    const title = `${pdfTitle}`;

    // const {
    //   total_amount,
    //   total_gst,
    // }=ledgerLists?.total_counts;
    // if(ledgerLists?.total_counts){
    //   title += 
    //   "\n"+
    //   "Invoice Reports" + 
    //   "                                                                                                                                                                  "+"Total Amount" + " :  "+ "   "+total_amount.toFixed(2)  + "     "+"Total GST" + " : "+ "      "+total_gst.toFixed(2) 

    // }
    console.log(ledgerLists,"props.billingReport")

    downloadPdf(title, headersForPDF, pageLoadData, "Reports");
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportclose = () => {
    updateExportData({
      isExportDataModalOpen: false,
    })
    updateExportData({
      headersListForExport: ([]),
    });
  };
  // made changes in pdf by Marieya
  return (
    <div>
      {token.permissions.includes(REPORTS.EXPORT) && (
        <>
          <Tooltip title={"Export"}>
            <MUIButton
              variant="outlined"
              onClick={handleClick}
              className="muibuttons"
            >
           <img src={EXPORT} style={{width:"24px"}}/>
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
      <Modal
        isOpen={exportData.isExportDataModalOpen}
        toggle={() => {
          updateExportData({
            isExportDataModalOpen: !exportData.isExportDataModalOpen,
          });
          updateExportData({
            headersListForExport: ([]),
          });
        }}
        centered
      >
        <ModalBody>
          {/* <h5>Confirmation</h5> */}
          <h5>Select the Fields Required</h5>
          <hr/>
          <div>
            {headersForExportFile.map((column, index) => {
              if (column) {
                return (
                  <span style={{ display: "block" }}>
                    <label for={column[1]} key={`${column[1]}${index}`}>
                      <input
                        value={column[0]}
                        onChange={handleCheckboxChange}
                        type="checkbox"
                        name={column[1]}
                        checked={exportData.headersListForExport.includes(
                          column[0]
                        )}
                      />
                      &nbsp; {column[1]}
                    </label>
                  </span>
                );
              }
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleExportclose}
            id="resetid"
          >
            Close
          </Button>
          <button
            id="download_button1"
            className="btn btn-primary openmodal"
            // disabled={exportData.headersListForExport.length > 0 ? false : true}
            disabled={isLoading || (exportData.headersListForExport.length > 0 ? false : true)}

            color="primary"
            onClick={() => handleDownload()}
          >
            {isLoading ? <Spinner size="sm" /> : null}
            &nbsp;&nbsp;

            <span className="openmodal">Download</span>
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GstExport;
