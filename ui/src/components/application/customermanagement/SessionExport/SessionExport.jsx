import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EXPORT from "../../../../assets/images/export.png"
import MUIButton from "@mui/material/Button";
import { Spinner } from "reactstrap";
import {
    Modal,
    ModalFooter,
    ModalBody,
    Button,
} from "reactstrap";
import { downloadExcelFile, downloadPdf } from "./Export";
import { customeraxios } from "../../../../axios";
const SessionExport = (props) => {

    // modal
    const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
    const [downloadableData, setDownloadableExcelData] = useState([]);
    const [downloadAs, setDownloadAs] = useState("");
    const [headersForExport, setHeadersForExport] = useState([]);
    const [pageLoadData, setPageLoadData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // export drop down 
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // download function call
    const handleExportDataModalOpen = (downloadAs) => {
        handleClose();
        setIsExportDataModalToggle(!isExportDataModalOpen);
        setDownloadableExcelData(pageLoadData);
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

    const handleExportclose = () => {
        setIsExportDataModalToggle(false);
        setHeadersForExport([]);
    };
    const handleExportDataAsPDF = (headersForPDF) => {
        setIsExportDataModalToggle(!isExportDataModalOpen);
        const title = `Traffic/Session`;
        downloadPdf(title, headersForPDF, pageLoadData, "Traffic");
        // downloadPdf(title, headersForPDF, filteredData, "leads_report");
    };
    const handleDownload = () => {
        setIsLoading(true);
        console.log("clicked csv download")
        const headers = headersForExport.filter((header) => header !== "all");
        const headersForPDF = headersForExportFile.filter(
            (h) => headers.includes(h[0]) && h
        );
        const headersForExcelFiltered = headersForExcel.filter(
            (h) => headers.includes(h[0]) && h
        );
        const queryParams = props.getQueryParams(false);
        customeraxios
            .get(`customers/enh/v2/data/${props?.profileDetails?.user?.username}/consumption?export=true&${queryParams}`)
            .then((response) => {
                setPageLoadData(response.data, "response.data");
                setIsLoading(false);
                if (downloadAs === "pdf") {
                    handleExportDataAsPDF(headersForPDF);
                } else {
                    // downloadExcelFile(downloadableData, downloadAs, headers);
                    downloadExcelFile(response.data, downloadAs, headersForExcelFiltered);
                }
                setHeadersForExport([]);
                setIsExportDataModalToggle(false);
            });
    };

    const headersForExportFile = [
        ["all", "All"],
        ["radacctid", "Id"],
        ["username", "User Name"],
        // ["acctupdatetime", "Date"],
        ["acctstarttime", "Start Time"],
        ["acctstoptime", "Stop Time"],
        ["acctoutputoctets", "Download"],
        ["acctinputoctets", "Upload"],
        ["acctsessiontime", "Online Time"],
        ["framedipaddress", "IP Address"],
        ["nasipaddress", "NAS IP"],
        ["callingstationid", "MAC ID"],
    ];
    const headersForExcel = [
        ["all", "All"],
        ["radacctid", "Id"],
        ["username", "User Name"],
        // ["acctupdatetime", "Date"],
        ["acctstarttime", "Start Time"],
        ["acctstoptime", "Stop Time"],
        ["acctoutputoctets", "Download"],
        ["acctinputoctets", "Upload"],
        ["acctsessiontime", "Online Time"],
        ["framedipaddress", "IP Address"],
        ["nasipaddress", "NAS IP"],
        ["callingstationid", "MAC ID"],
    ];
    

    return (
        <>
            <MUIButton
                className="muibuttons"
                variant="outlined"
                onClick={handleClick}
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

            {/* modal */}

            <Modal
                isOpen={isExportDataModalOpen}
                toggle={() => {
                    setIsExportDataModalToggle(!isExportDataModalOpen);
                    setHeadersForExport([]);
                }}
                centered
            >
                <ModalBody>
                    <h5>Select the Fields Required</h5>
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
                {/* Sailaja Commented(1412to 1422) & added  Cancel & Download Button colors(1393,1411) on 14th July Line no:1272       */}

                <ModalFooter>
                    <Button
                        color="secondary"
                        id="resetid"
                        onClick={handleExportclose}
                    // onClick={() => setIsExportDataModalToggle(false)}
                    >
                        {"Close"}
                    </Button>
                    {/* <button
                        // color="primary"
                        className="btn btn-primary openmodal"
                        id="download_button1"
                        onClick={() => handleDownload()}
                        disabled={headersForExport.length > 0 ? false : true}
                    >
                        <span className="openmodal">
                            
                            Download
                        </span>
                    </button> */}
                    <button
                    // color="primary"
                    className="btn btn-primary openmodal"
                    id="download_button1"
                    onClick={() => handleDownload()}
                    // disabled={ headersForExport.length > 0 ? false : true}
                    disabled={isLoading || (headersForExport.length > 0 ? false : true)}
                  >
                    {isLoading ? <Spinner size="sm" /> : null} &nbsp;&nbsp;
                    Download
                  </button>
                </ModalFooter>
            </Modal>
        </>
    )
}
export default SessionExport;