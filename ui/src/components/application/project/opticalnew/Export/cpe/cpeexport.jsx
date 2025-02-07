import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EXPORT from "../../../../../../assets/images/export.png";
import MUIButton from "@mui/material/Button";
import {
    Modal,
    ModalFooter,
    ModalBody,
    Button,
    Spinner,
} from "reactstrap";
import { downloadExcelFile, downloadPdf } from "./export";
import { networkaxios } from "../../../../../../axios";

const CPEExport = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    // modal
    const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
    const [downloadableData, setDownloadableExcelData] = useState([]);
    const [downloadAs, setDownloadAs] = useState("");
    const [headersForExport, setHeadersForExport] = useState([]);
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
        setDownloadableExcelData(props.filteredData);
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
    // const handleExportDataAsPDF = (headersForPDF) => {
    //     setIsExportDataModalToggle(!isExportDataModalOpen);
    //     const title = `CPE`;
    //     downloadPdf(title, headersForPDF, props.filteredData, "CPE");
    //     // downloadPdf(title, headersForPDF, filteredData, "leads_report");
    // };
    const handleExportDataAsPDF = (headersForPDF, data) => {
        setIsExportDataModalToggle(!isExportDataModalOpen);
        const title = `CPE`;
        downloadPdf(title, headersForPDF, data, "CPE");
    };
    const handleDownload = () => {
        // If you have a loading state or any other indicator, set it here.
        setIsLoading(true);
    
        networkaxios
            .get(`network/cpe/enh/list?export=true${props.filterParamscpe}`)
            .then((res) => {
                console.log("API Data for CPE:", res.data);
    
                const headers = headersForExport.filter((header) => header !== "all");
                const headersForPDF = headersForExportFile.filter(
                    (h) => headers.includes(h[0]) && h
                );
                const headersForExcelFiltered = headersForExcel.filter(
                    (h) => headers.includes(h[0]) && h
                );
                    setIsLoading(false);
                if (downloadAs === "pdf") {
                    handleExportDataAsPDF(headersForPDF, res.data); // Assuming you also need the data here
                } else {
                    downloadExcelFile(res.data, downloadAs, headersForExcelFiltered);
                }
    
                setHeadersForExport([]);
                setIsExportDataModalToggle(false);
                // If you have a loading state, reset it here.
            })
            .catch((error) => {
                // Handle errors. You can show a toast notification or any other way you want.
                // toast.error("Error fetching CPE data.");
                console.error(error);
                // Reset the loading state if you have one.
                // setIsLoading(false);
            });
    };
    
    // const handleDownload = () => {
    //     const headers = headersForExport.filter((header) => header !== "all");
    //     const headersForPDF = headersForExportFile.filter(
    //         (h) => headers.includes(h[0]) && h
    //     );
    //     const headersForExcelFiltered = headersForExcel.filter(
    //         (h) => headers.includes(h[0]) && h
    //       );
    //     if (downloadAs === "pdf") {
    //         handleExportDataAsPDF(headersForPDF);
    //     } else {
    //         // downloadExcelFile(downloadableData, downloadAs, headers);
    //         downloadExcelFile(downloadableData,downloadAs, headersForExcelFiltered);
    //     }
    //     setHeadersForExport([]);
    //     setIsExportDataModalToggle(false);
    // };

    const headersForExportFile = [
        ["all", "All"],
        // ["id", "ID"],
        ["customer_id", "Customer Id"],
        ["serial_no","Serial Number"],
        ["parent_child_dpport","Parent Child DP Port"],
        ["branch","Branch"],
        ["franchise","Franchise"],
        ["zone","Zone"],   
        ["area","Area"],
        ["make","Make"],
        ["model","Model"],
        ["mobile_no","Mobile"],
        ["notes","Notes"],
        ["specification","Specification"]
    ];
    const headersForExcel = [
        ["all", "All"],
        // ["id", "ID"],
        ["customer_id", "Customer Id"],
        ["serial_no","Serial Name"],
        ["parent_child_dpport","Parent Child DP Port"],
        ["branch","Branch"],
        ["franchise","Franchise"],
        ["zone","Zone"],   
        ["area","Area"],
        ["make","Make"],
        ["model","Model"],
        ["mobile_no","Mobile"],
        ["notes","Notes"],
        ["specification","Specification"]
    ]
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
                <MenuItem onClick={() =>  handleExportDataModalOpen("excel")}>
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
                    <button
                        // color="primary"
                        className="btn btn-primary openmodal"
                        id="download_button1"
                        onClick={() => handleDownload()}
                        // disabled={headersForExport.length > 0 ? false : true}
                        disabled={isLoading || (headersForExport.length > 0 ? false : true)}
                
                    >
                        {isLoading ? <Spinner size="sm" /> : null}
                          &nbsp;&nbsp;
                        <span className="openmodal">
                            Download
                        </span>
                    </button>
                </ModalFooter>
            </Modal>
        </>
    )
}
export default CPEExport;