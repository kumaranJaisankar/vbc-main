import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button, Modal, ModalFooter, ModalBody } from "reactstrap";
import NewCustomerListsMoreFiltersContainer from "./CustomerFilter/NewCustomerListsMoreFiltersContainer";
import { downloadExcelFile, downloadPdf } from "./Export";
import TableColumns from "../../common/table-columns";
import { customeraxios } from "../../../axios";
import { CUSTOMER_LIST } from "../../../utils/permissions";
import { toast } from "react-toastify";
import REFRESH from "../../../assets/images/refresh.png";
import EXPORT from "../../../assets/images/export.png";
import Tooltip from "@mui/material/Tooltip";
import MigrateModal from "./migrate/migrate";
import { Spinner } from "reactstrap";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}


export const NewCustomerListsHeaderButtons = (props) => {
  const permissions = JSON.parse(localStorage.getItem("token")).permissions;
  const [searchUser, setSearchUser] = useState({ value: "", name: "username" });
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });
  const [isTableColumnOpen, setTableColumnOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
//  Sailaja added for  Export Download Button Loader on 3rd May 2023
const [isLoading, setIsLoading] = useState(false);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [showCustomerListsMoreFilters, setShowCustomerListsMoreFilters] =
    useState(false);

  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };

  const { RefreshHandler, customerLists, updateCustomerLists, filtersData } =
    props;

  const { currentTab, pageLoadDataForFilter } = customerLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  //rearranged headers by marieya
  const headersForExportFile = [
    ["all", "All"],
    ["username", "Customer ID"],
    ["register_mobile", "Mobile"],
    ["account_status", "Account Status"],
    ["first_name", "Name"],
    ["package_name", "Plan"],
    ["plan_updated", "Plan Update Date"],
    ["expiry_date", "Plan Due Date"],
    ["branch", "Branch"],
    ["franchise", "Franchise"],
    ["zone", "Zone"],
    ["area", "Area"],
    ["registered_email", "Email"],
    ["last_invoice_id", "Invoice"],
    ["created", "Created Date"],
    ["static_ip", "Static IP"],
    // ["user_advance_info","Installation Charges"],
    // ["user_advance_info","Security Deposit"],
    ["cleartext_password", "Password"],
    ["user_advance_info", "GSTIN"],
    ["stb_serial_no", "Setup Box No"],
    ["upload", "Upload"],
    ["download", "Download"],
    ["account_type", "Type"],
  ];

  const headersForExcel = [
    ["all", "All"],
    ["username", "Customer ID"],
    ["register_mobile", "Mobile"],
    ["account_status", "Account Status"],
    ["first_name", "Name"],
    ["package_name", "Plan"],
    ["plan_updated", "Plan Update Date"],
    ["expiry_date", "Plan Due Date"],
    ["branch", "Branch"],
    ["franchise", "Franchise"],
    ["zone", "Zone"],
    ["area", "Area"],
    ["registered_email", "Email"],
    ["last_invoice_id", "Invoice"],
    ["created", "Created Date"],
    ["static_ip", "Static IP"],
    // ["user_advance_info","Installation Charges"],
    // ["user_advance_info","Security Deposit"],
    ["cleartext_password", "Password"],
    ["user_advance_info", "GSTIN"],
    ["stb_serial_no", "Setup Box No"],
    ["upload", "Upload"],
    ["download", "Download"],
    ["account_type", "Type"],
  ]
  //new state added by marieya
  const [showmigrate, setShowMigrate] = useState(false);
  const showMigrateopen = () => setShowMigrate(!showmigrate);
//state for migrate functionality tabs 
const [BasicLineTab, setBasicLineTab] = useState("1");

  const memoizedColumns = useMemo(
    () =>
      props.tableColumns.map((item) => ({
        value: item.selector,
        name: item.name,
      })),
    []
  );
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
    const { isExportDataModalOpen } = exportData; // statement
    updateExportData({
      downloadAs,
      isExportDataModalOpen: !isExportDataModalOpen,
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
          downloadExcelFile(newresults,downloadAs, headersForExcelFiltered);
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
      })
      .catch(function (error) {
        setIsLoading(false);
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (is500Error) {
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

  useEffect(() => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        username: {
          ...prevState.appliedFilters.username,
          value: {
            ...prevState.appliedFilters.username.value,
            strVal: searchUser.value || "",
            label: searchUser.value,
            name: searchUser.name,
          },
        },
      },
    }));
  }, [searchUser]);

  const handleExportclose = () => {
    updateExportData({
      isExportDataModalOpen: false,
    });
    updateExportData({
      headersListForExport: [],
    });
  };
  const changeHandler = (event) => {
    setSearchUser((prevState) => {
      return {
        ...prevState,
        value: event.target.value,
      };
    });
  };

  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let migrateShow = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Admin") 
  ) {
    migrateShow = true;
  }
  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 1500);
  }, []);
  //added newsearch css by Marieya
  if (props.showOnlyExportButton) {
    return (
      <div>
        {token.permissions.includes(CUSTOMER_LIST.EXPORT) && (
          <>
            {props.customerLists.pageLoadData.length > 0 && (
              // Sailaja Added New Styles for Export  Button on 18th May 2023
              <MUIButton
                // className="muibuttons"
                variant="outlined"
                onClick={handleClick}
                style={{ height: "40px" }}
              >
              <img src={EXPORT} style={{width:"24px"}}/>
              {/* <img src={EXPORT} className="Header_img" /> */}
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
          <ModalBody>
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
            <Button
              color="secondary"
              id ="resetid"
              // onClick={() =>
              //   updateExportData({
              //     isExportDataModalOpen: false,
              //   })
              // }
              onClick={handleExportclose}
            >
              Close
            </Button>
            <Button
              color="primary"
              id="download_button1"
              onClick={() => handleDownload()}
              // disabled={
              //   exportData.headersListForExport.length > 0 ? false : true
              // }
              disabled={isLoading || (exportData.headersListForExport.length > 0 ? false : true)}
            >
             {isLoading ? <Spinner size="sm" /> : null} &nbsp;&nbsp;            
              Download
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <div>
          <Stack direction="row" spacing={2} >
            <p className="all_cust">Customers</p>
            <TableColumns
              open={isTableColumnOpen}
              handleClose={() => setTableColumnOpen(false)}
              columns={memoizedColumns}
              setColumnsToHide={props.setColumnsToHide}
            />
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ flex: 1 }}
              spacing={2}
              className="customers_responsive_filters"
            >
              <Paper
                component="div"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  // width: 400,
                  height: "40px",
                  boxShadow: "none",
                  border: "1px solid #E0E0E0",
                }}
              >
                <Select
                  variant="standard"
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  style={{
                    height: "38px",
                  }}
                  onChange={(event) =>
                    setSearchUser((prevState) => {
                      return {
                        ...prevState,
                        name: event.target.value,
                      };
                    })
                  }
                  value={searchUser.name}
                >
                  <MenuItem value="username">User ID</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                </Select>
                <div id="newSearch">
                  <InputBase
                    sx={{ ml: 1, flex: 1, position: "relative", top: "3px" }}
                    placeholder="Search With User ID , Mobile"
                    inputProps={{ "aria-label": "search google maps" }}
                    onChange={debouncedChangeHandler}
                  />
                </div>
                <IconButton
                  type="submit"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon style={{ width: "21px" }} />
                </IconButton>
              </Paper>
              {token.permissions.includes(CUSTOMER_LIST.EXPORT) && (
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
                    <MenuItem
                      onClick={() => handleExportDataModalOpen("excel")}
                    >
                      Export XLS
                    </MenuItem>
                    <MenuItem onClick={() => handleExportDataModalOpen("pdf")}>
                      Export PDF
                    </MenuItem>
                  </Menu>
                </>
              )}
              <Tooltip title={"Refresh"}>
                <MUIButton
                  className="muibuttons"
                  onClick={RefreshHandler}
                  variant="outlined"
                  style={{ height: "40px" }}
                >
                  <img src={REFRESH} className="Header_img" />
                </MUIButton>
              </Tooltip>
              {/* {token.permissions.includes(CUSTOMER_LIST.FILTERS) && (
              <Tooltip title={"Filters"}><Tooltip
                <MUIButton
                  className="muibuttons"
                  onClick={() => setShowCustomerListsMoreFilters(true)}
                  variant="outlined"
                  style={{ height: "40px" }}
                >
                  <img src={FILTERS} className="Header_img" />
                </MUIButton>
                </Tooltip>
              )} */}

              {permissions.includes(CUSTOMER_LIST.TOGGLE_COLUMN) && (
                <Tooltip title={"Show/Hide Columns"}>
                  <MUIButton
                    className="muibuttons"
                    variant="outlined"
                    onClick={() => setTableColumnOpen(true)}
                    style={{ height: "40px" }}
                    startIcon={
                      <VisibilityOffIcon
                        style={{ color: "#285295", fontSize: "25px" }}
                      />
                    }
                  ></MUIButton>
                </Tooltip>
              )}

          { migrateShow &&   <button
                className="btn btn-primary openmodal"
                id="newbuuon"
                type="button"
                // onClick={showMigrateopen}
                onClick={() => setModalOpen(true)}
              >
                <b>
                  <span
                    className="openmodal"
                    style={{ fontSize: "16px", marginLeft: "-9px" }}
                  >
                    Migrate
                  </span>
                </b>
                        
              </button>}
              <MigrateModal
              open={modalOpen}
              handleClose={(e) => {setModalOpen(false);RefreshHandler();setBasicLineTab("1")}}
              setBasicLineTab={setBasicLineTab}
              BasicLineTab={BasicLineTab}
                />
              <TableColumns
                open={isTableColumnOpen}
                handleClose={() => setTableColumnOpen(false)}
                columns={memoizedColumns}
                setColumnsToHide={props.setColumnsToHide}
              />
            </Stack>
          </Stack>
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
              <Button
                color="secondary"
                onClick={handleExportclose}
                id="resetid"
              >
                Close
              </Button>
              {/* <Button
                color="primary"
                id="download_button1"
                disabled={
                  exportData.headersListForExport.length > 0 ? false : true
                }
                onClick={() => handleDownload()}
              >
                Download
              </Button> */}
              {/* Sailaja commented off the above button  & Added below button for Export Download Button Loader on 27th April 2023 */}
              <Button
                    color="primary"
                    className="btn btn-primary openmodal"
                    id="download_button1"
                    onClick={handleDownload}
                    disabled={isLoading || (exportData.headersListForExport.length > 0 ? false : true)}
                    >
                    {isLoading ? <Spinner size="sm" /> : null}
                    &nbsp;&nbsp;
                    Download
                </Button>

            </ModalFooter>
          </Modal>
          <NewCustomerListsMoreFiltersContainer
            currentTab={props.currentTab}
            showCustomerListsMoreFilters={showCustomerListsMoreFilters}
            setShowCustomerListsMoreFilters={setShowCustomerListsMoreFilters}
            customerLists={customerLists}
            updateCustomerLists={updateCustomerLists}
            pageLoadDataForFilter={pageLoadDataForFilter}
            showTypeahead={false}
            branch={filtersData.branch}
            zone={filtersData.zone}
            area={filtersData.area}
          />
        </div>
      </React.Fragment>
    );
  }
};
