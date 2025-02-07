import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { downloadExcelFile, downloadPdf } from "./Export/wallettableexport";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import { adminaxios } from "../../../axios";
import REFRESH from "../../../assets/images/refresh.png";
import Stack from "@mui/material/Stack";
import EXPORT from "../../../assets/images/export.png";
import NewWalletListMoreFiltersContainer from "./WalletFilter/NewWalletListMoreFiltersContainer";
import { Spinner } from "reactstrap";


const WalletHeaderButtons = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  const { RefreshHandler, walletLists, updateWalletLists, filtersData } = props;
  const { currentTab, pageLoadDataForFilter } = walletLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  //  Sailaja added for Reports Export Download Button Loader on 3rd May 2023
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  //state for filter
  const [showWalletListsMoreFilters, setShowWalletListsMoreFilters] =
    useState(false);
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
    ["entity_id", "Entity ID"],
    ["name", "Name"],
    ["person", "User Name"],
    ["type", "Type"],
    ["mode", "Mode"],
    ["amount", "Amount"],
    ["payment_date","Payment Date"]
  ];
  const headersForExcel = [
    ["all", "All"],
    ["entity_id", "Entity ID"],
    ["name", "Name"],
    ["person", "User Name"],
    ["type", "Type"],
    ["mode", "Mode"],
    ["amount", "Amount"],
    ["payment_date","Payment Date"]
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
    adminaxios
      .get(`wallet/transactions/export?${queryParams}`)
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
      });
  };
  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
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

  //end



  return (
    <div>
      <Stack direction="row" spacing={2}>
        <p className="all_cust">Payments</p>
        {/* <MUIButton
          onClick={() => setShowWalletListsMoreFilters(true)}
          startIcon={<FilterAltIcon />}
          endIcon={<ArrowDropDownIcon />}
          variant="outlined"
          style={{ height: "37px" }}
        >
          More Filters
        </MUIButton> */}
        <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
          <MUIButton
            style={{ height: "40px" }}
            variant="outlined"
            onClick={handleClick}
            className="muibuttons"
          >
            <img src={EXPORT} className="Header_img" />
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
          <MUIButton
            style={{ height: "40px" }}
            onClick={RefreshHandler}
            variant="outlined"
            className="muibuttons"
          >
            <img src={REFRESH} className="Header_img" />
          </MUIButton>
        </Stack>
        {/* </Stack> */}

      </Stack>
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
          {/* Sailaja changed Download & Cancel Button Styles And Renamed Con */}
          {/* Confirmation */}
          Select the Fields Required
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
            id="resetid"
            onClick={() =>
              updateExportData({
                isExportDataModalOpen: false,
              })
            }
          >
            Close
          </Button>
          <Button  id="download_button1" color="primary" onClick={() => handleDownload()}
            // disabled={exportData.headersListForExport.length > 0 ? false : true}
            disabled={isLoading || (exportData.headersListForExport.length > 0 ? false : true)}
          >
             {isLoading ? <Spinner size="sm" /> : null} &nbsp;&nbsp;
            Download
          </Button>
        </ModalFooter>
      </Modal>
      <NewWalletListMoreFiltersContainer
        showWalletListsMoreFilters={showWalletListsMoreFilters}
        setShowWalletListsMoreFilters={setShowWalletListsMoreFilters}
        walletLists={walletLists}
        updateWalletLists={updateWalletLists}
        pageLoadDataForFilter={pageLoadDataForFilter}
        showTypeahead={false}
        branch={filtersData.branch}
      />
    </div>
  );
};

export default WalletHeaderButtons;
