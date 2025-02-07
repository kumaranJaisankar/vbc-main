import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EXPORT from "../../../../../assets/images/export.png";
import {
  downloadExcelFile,
  downloadPdf,
} from "./reportsIndex";
import { toast } from "react-toastify";

import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import { customeraxios } from "../../../../../axios";
import { REPORTS } from "../../../../../utils/permissions";
import { Spinner } from "reactstrap";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const CustomerExport = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  const { customerLists } = props;
  const { currentTab, pageLoadDataForFilter } = customerLists;
  const [pageLoadData, setPageLoadData] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  //  Sailaja added for Customer Reports Export Download Button Loader on 3rd May 2023
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
    // Sailaja Updated Export Fields for  Customer Reports on 28th July
  const headersForExportFile = [
    ["all", "All"],
    ["username", "Customer ID"],
    ["register_mobile", "Mobile"],
    ["account_status", "A/C Status"],
    ["first_name", "Name"],
    ["package_name", "Plan"],
    ["plan_updated", "Plan Update Date"],
    ["expiry_date", "Plan Due Date"],    
    ["branch", "Branch"],
    ["franchise","Franchise"],
    ["zone","Zone"],
    ["area","Area"],    
    ["registered_email", "Email"],    
    ["last_invoice_id", "Invoice"],  
    ["account_type", "Account Type"],
    ["upload", "Upload"],
    ["download", "Download"],
    ["created","Created Date"],
    ["address","Address"]
   
   
  ];

  const headersForExcel = [
    ["all", "All"],
    ["username", "Customer ID"],
    ["register_mobile", "Mobile"],
    ["account_status", "A/C Status"],
    ["first_name", "Name"],
    ["package_name", "Plan"],
    ["plan_updated", "Plan Update Date"],
    ["expiry_date", "Plan Due Date"],    
    ["branch", "Branch"],
    ["franchise","Franchise"],
    ["zone","Zone"],
    ["area","Area"],    
    ["registered_email", "Email"],    
    ["last_invoice_id", "Invoice"],  
    ["account_type", "Account Type"],
    ["upload", "Upload"],
    ["download", "Download"],
    ["created","Created Date"],
    ["address","Address"]
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
    const queryParams = props.getQueryParams(false);
    customeraxios
      .get(`customers/v3/list?export=true&${queryParams}`)
      .then((response) => {
        let newresults = response.data.map((item) => (
          {
            "id": item?.id,
            "username": item?.user?.username,
            "cleartext_password": item?.user?.cleartext_password,
            "area": item?.area?.name,
            "area_id": item?.area?.id,
            "franchise": item?.area?.franchise?.name,
            "branch": item?.area?.zone?.branch?.name,
            "zone": item?.area?.zone?.name,
            "package_name": item?.service_plan?.package_name,
            "download": item?.service_plan?.download,
            "upload": item?.service_plan?.upload,
            "user": item?.user?.id,
            "first_name": item?.first_name,
            "last_name": item?.last_name,
            "service_plan": item?.service_plan?.id,
            "service_type": item?.service_type,
            "register_mobile": item?.register_mobile,
            "registered_email": item?.registered_email,
            "account_status": item?.account_status,
            "restrict_access": item?.restrict_access,
            "payment_status": item?.payment_status,
            "created": item?.created,
            "account_type": item?.account_type,
            "expiry_date": item?.expiry_date,
            "plan_updated": item?.plan_updated,
            "monthly_date": item?.monthly_date,
            "last_invoice_id": item?.last_invoice_id,
            "radius_info": item?.radius_info,
            "user_advance_info": item?.user_advance_info,
            "address": item?.address,
            "network_info": item?.network_info,
          }
        ))
        setPageLoadData(newresults, "response.data");
        setIsLoading(false);
        if (downloadAs === "pdf") {
          handleExportDataAsPDF(headersForPDF, newresults);
        } else {
          // downloadExcelFile(newresults, downloadAs, headers);
          downloadExcelFile(newresults, downloadAs, headersForExcelFiltered);
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
      });
  };
  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
    const title = `${currentTab} Customers`;
    downloadPdf(title, headersForPDF, pageLoadData, "Customers");
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
    });
    updateExportData({
      headersListForExport: [],
    });
  };
//download btn css changed by Marieya
  return (
    <div>
      {token.permissions.includes(REPORTS.EXPORT) && (
        <>
          <MUIButton
            variant="outlined"
            onClick={handleClick}
            // startIcon={<ExitToAppIcon />}
            // endIcon={<ArrowDropDownIcon />}
          >
            <img src={EXPORT} style={{ width: "24px" }} />
          </MUIButton>
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
            headersListForExport: [],
          });
        }}
        centered
      >
        {/* <ModalHeader
          toggle={() => {
            updateExportData({
              isExportDataModalOpen: !exportData.isExportDataModalOpen,
            });
          }}
        >
          Confirmation
        </ModalHeader> */}
        <ModalBody>
          {/* Sailaja Modified Heading on 28th July */}
          {/* <h5>Confirmation</h5> */}
          <h5>Select the Fields Required</h5>
          <hr />
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
          <Button color="secondary" onClick={handleExportclose} id="resetid">
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
            {isLoading ? <Spinner size="sm" /> : null} &nbsp;&nbsp;
            <span className="openmodal">Download</span>
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CustomerExport;
