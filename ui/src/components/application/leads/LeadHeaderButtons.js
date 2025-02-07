import React, { useState, useMemo , useRef, useEffect} from "react";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FilterIcon from "@mui/icons-material/FilterAlt";
import { default as axiosBaseURL } from "../../../axios";
import { ImportContainer } from "./Import/ImportContainer";
import DeleteModal from "./DeleteModal";
import { downloadExcelFile, downloadPdf } from "./Export";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import NewLeadListsMoreFiltersContainer from "../leads/Filter/NewLeadListsMoreFiltersContainer";
import { LEAD } from '../../../utils/permissions';
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
var token;
if (storageToken !== null) {
  token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

export const LeadHeaderButtons = (props) => {
  const leadPermissions = useMemo(() => {
    return Object.keys(LEAD).reduce((initialValue, currentValue) => {
      if (!initialValue[currentValue]) {
        initialValue[currentValue] = token.permissions.includes(
          LEAD[currentValue]
        );
        return initialValue;
      }
      return initialValue;
    }, {});
  }, []);
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    leadLists,
    updateleadLists,
    openSetImportPanelCloseConfirmationModal,
    closeCustomizer,
    setImportPanelCloseConfirmationModal,
    importDivStatus,
    setImportDivStatus,
    setIsImportFlow,
    openCorrectDataPanel,
    setImportedData,
    detailsUpdate,
    filtersData,
    Verticalcenter,
    Verticalcentermodaltoggle,
    isChecked,
    setIsChecked,
    notOpenLeadIdsForDelete,
    setClearSelectedRows,
    setClearSelection,
  } = props;
  const [showLeadListsMoreFilters, setShowLeadListsMoreFilters] =
    useState(false);
  const { currentTab, pageLoadDataForFilter } = leadLists;
  const [pageLoadData, setPageLoadData] = useState([]);

  const headersForExportFile = [
    ["all", "All"],
    ["id", "ID"],
    ["first_name", "First Name"],
    ["last_name", "Last Name"],
    ["mobile_no", "Mobile No"],
    ["alternate_mobile_no", "Alternate Mobile No"],
    ["email", "Email"],
    ["address", "Address"],
    ["lead_source", "Lead Source"],
    ["type", "Type"],
    ["status", "Status"],
    ["assigned_to", "Assigned To"],
    ["notes", "Notes"],
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

  const handleExportDataModalOpen = (downloadAs) => {
    handleClose();
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      downloadAs,
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };

  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
    const title = `${currentTab} Leads`;
    downloadPdf(title, headersForPDF, pageLoadData, "Leads");
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };

  const handleDownload = () => {
    const { headersListForExport, downloadAs } = exportData;
    const headers = headersListForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );

    const queryParams = props.getQueryParams();
    axiosBaseURL.get(`radius/lead/export?${queryParams}`).then((response) => {
      setPageLoadData(response.data, "response.data");
      if (downloadAs === "pdf") {
        handleExportDataAsPDF(headersForPDF, response.data);
      } else {
        downloadExcelFile(response.data, downloadAs, headers);
      }
    });

    updateExportData({
      uiState: {
        showDropdown: false,
      },
      isExportDataModalOpen: false,
      headersListForExport: [],
      downloadAs: "",
    });
  };

  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };

  
  
  
  return (
    <React.Fragment>
      <div>
        <Stack direction="row" spacing={2}>
          {leadPermissions.CREATE && (
            <button
              style={{
                whiteSpace: "nowrap",
                fontSize: "medium",
              }}
              className="btn btn-primary openmodal"
              type="submit"
              onClick={() => props.openCustomizer("2")}
            >
              <span style={{ marginLeft: "-10px" }} className="openmodal">
                &nbsp;&nbsp; New{" "}
              </span>
              <i
                className="icofont icofont-plus openmodal"
                style={{
                  paddingLeft: "10px",
                  cursor: "pointer",
                }}
              ></i>
            </button>
          )}
          <MUIButton
            onClick={props.RefreshHandler}
            variant="outlined"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </MUIButton>
          {leadPermissions.EXPORT && (
            <MUIButton
              variant="outlined"
              onClick={handleClick}
              startIcon={<ExitToAppIcon />}
              endIcon={<ArrowDropDownIcon />}
            >
              Export
            </MUIButton>
          )}

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
          {leadPermissions.IMPORT && (
            <MUIButton
              onClick={() => setImportDivStatus(!importDivStatus)}
              variant="outlined"
              startIcon={
                <ExitToAppIcon style={{ transform: "rotate(180deg)" }} />
              }
              endIcon={<ArrowDropDownIcon />}
            >
              Import
            </MUIButton>
          )}
          {leadPermissions.FILTERS && (
            <MUIButton
              onClick={() => setShowLeadListsMoreFilters(true)}
              variant="outlined"
              startIcon={<FilterIcon />}
              endIcon={<ArrowDropDownIcon />}
            >
              More Filters
            </MUIButton>
          )}
          {/* <MUIButton
            onClick={Verticalcentermodaltoggle}
            variant="outlined"
            startIcon={<DeleteIcon />}
          ></MUIButton> */}
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
            <Button color="primary" onClick={() => handleDownload()}
             disabled={exportData.headersListForExport.length > 0 ? false : true}
            >
              Download
            </Button>
          </ModalFooter>
        </Modal>
        <NewLeadListsMoreFiltersContainer
          currentTab={props.currentTab}
          showLeadListsMoreFilters={showLeadListsMoreFilters}
          setShowLeadListsMoreFilters={setShowLeadListsMoreFilters}
          leadLists={leadLists}
          updateleadLists={updateleadLists}
          pageLoadDataForFilter={pageLoadDataForFilter}
          showTypeahead={false}
          lead={filtersData.lead_source}
        />

        <ImportContainer
          setIsImportFlow={setIsImportFlow}
          setImportDivStatus={setImportDivStatus}
          importDivStatus={importDivStatus}
          updateleadLists={updateleadLists}
          openCorrectDataPanel={openCorrectDataPanel}
          setImportedData={setImportedData}
          onUpdate={detailsUpdate}
        />

        <Modal
          isOpen={openSetImportPanelCloseConfirmationModal}
          toggle={() =>
            setImportPanelCloseConfirmationModal(
              !openSetImportPanelCloseConfirmationModal
            )
          }
          className="modal-body"
          centered={true}
        >
          <ModalHeader
            toggle={() =>
              setImportPanelCloseConfirmationModal(
                !openSetImportPanelCloseConfirmationModal
              )
            }
          >
            Confirmation
          </ModalHeader>
          <ModalBody>
            <p>
              Your imported file will not be saved.Do you still want to close?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={props.closeCustomizer}>
              Yes
            </Button>
            <Button
              color="secondary"
              onClick={() =>
                setImportPanelCloseConfirmationModal(
                  !openSetImportPanelCloseConfirmationModal
                )
              }
            >
              {"Cancel"}
            </Button>
          </ModalFooter>
        </Modal>

        <DeleteModal
          visible={Verticalcenter && isChecked.length > 0}
          handleVisible={Verticalcentermodaltoggle}
          isChecked={isChecked}
          updateleadLists={updateleadLists}
          setClearSelectedRows={setClearSelectedRows}
          setIsChecked={setIsChecked}
          setClearSelection={setClearSelection}
          notOpenLeadIdsForDelete={notOpenLeadIdsForDelete}
        />
      </div>
    </React.Fragment>
  );
};
