import React, { useEffect, useMemo, useState } from "react";
import MUIButton from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  downloadExcelFile,
  downloadPdf,
} from "../../franchise/Export/index";

import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import { adminaxios } from "../../../../axios"; 
const FranchiseExport = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  const { RefreshHandler, franchiseLists, updateFranchiseLists, filtersData } =
    props;
  const { currentTab,  pageLoadDataForFilter } = franchiseLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
    ["name", "Franchise Name"],
    ["code","Franchise Code"],
    ["wallet_amount","Wallet Amount"],
    ["renewal_amount","Renewal Amount"],
    ["customer_count","No of customers"],
    ["sms_gateway_type","smsgateway"]
  ];
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
    const { headersListForExport, downloadAs } = exportData;
    const headers = headersListForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );

    const queryParams = props.getQueryParams();
    adminaxios.get(`accounts/reports/franchise/export?${queryParams}`)
        .then((response) => {
          setPageLoadData(response.data,"response.data");
          if (downloadAs === "pdf") {
           handleExportDataAsPDF(headersForPDF, response.data);
         }
         else {
           downloadExcelFile(response.data, downloadAs, headers)
         }
        })
    updateExportData({
      uiState: {
        showDropdown: false,
      },
      isExportDataModalOpen: false,
      headersListForExport: [],
      downloadAs: "",
    });
  };
  const handleExportDataAsPDF = (headersForPDF,pageLoadData) => {
    const title = `${currentTab} Franchise Reports`;
    downloadPdf(title, headersForPDF, pageLoadData, "Franchise Reports");
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
         <MUIButton
            onClick={props.RefreshHandler}
            variant="outlined"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </MUIButton>
      <MUIButton
        variant="outlined"
        onClick={handleClick}
        startIcon={<ExitToAppIcon />}
        endIcon={<ArrowDropDownIcon />}
      >
        Export
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
          Export csv
        </MenuItem>
        <MenuItem onClick={() => handleExportDataModalOpen("excel")}>
          Export xls
        </MenuItem>
        <MenuItem onClick={() => handleExportDataModalOpen("pdf")}>
          Export pdf
        </MenuItem>
      </Menu>

      <Modal
        isOpen={exportData.isExportDataModalOpen}
        toggle={() => {
          updateExportData({
            isExportDataModalOpen: !exportData.isExportDataModalOpen,
          });
        }}
        centered
      >
        <ModalHeader
          toggle={() => {
            updateExportData({
              isExportDataModalOpen: !exportData.isExportDataModalOpen,
            });
          }}
        >
          Confirmation
        </ModalHeader>
        <ModalBody>
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
            onClick={() =>
              updateExportData({
                isExportDataModalOpen: false,
              })
            }
          >
            Close
          </Button>
          <Button color="primary" onClick={() => handleDownload()}>
            Download
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FranchiseExport;
