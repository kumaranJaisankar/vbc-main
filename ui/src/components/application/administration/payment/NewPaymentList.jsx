import React, { useState, useEffect, useRef, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { billingaxios } from "../../../../axios";
import DataTable from "react-data-table-component";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { ADMINISTRATION } from "../../../../utils/permissions";
import DISABLED from "../../../../assets/images/disabled.png";
import ENABLED from "../../../../assets/images/enabled.png";
import Badge from "@mui/material/Badge";
import moment from "moment";
// import { toast } from "react-toastify";
import { classes } from "../../../../data/layouts";
import AddPayment from "./addpayments"
import { useDispatch } from "react-redux";
import { NewPaymentDeatils } from "./NewPaymentDetails"
import { Button, Modal, ModalFooter, ModalBody, Input, Label, TabContent, TabPane } from "reactstrap";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import NewPaymentListHeader from "./NewPaymentListHeader"
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
    var token = JSON.parse(storageToken);
}
const NewPaymentList = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");  
    const [paymentLIst, UpdatePaymentList] = useState(
        {
            uiState: { loading: false },
            currentPageNo: 1,
            currentItemsPerPage: 10,
            pageLoadData: [],
            prevURI: null,
            nextURI: null,
            currentTab: "all",
            tabCounts: {},
            totalRows: "",
        },
    )
    const [Verticalcenter, setVerticalcenter] = useState(false);
    const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
    const [useThis, setUseThis] = useState();
    const [setasdefault, setSetasdefault] = useState(false);
    const [activeTab1, setActiveTab1] = useState("1");
    const [sidebar_type, setSidebar_type] = useState();
    const [refresh, setRefresh] = useState(0);
    const [rightSidebar, setRightSidebar] = useState(true);
    const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    let history = useHistory();
    let DefaultLayout = {};
    const dispatch = useDispatch();
    useEffect(() => {
        const defaultLayoutObj = classes.find(
            (item) => Object.values(item).pop(1) === sidebar_type
        );

        const id =
            window.location.pathname === "/"
                ? history.push()
                : window.location.pathname.split("/").pop();
        // fetch object by getting URL
        const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
        const layout = id ? layoutobj : defaultLayoutObj;
        DefaultLayout = defaultLayoutObj;
        handlePageLayputs(layout);
    }, []);
    const handlePageLayputs = (type) => {
        let key = Object.keys(type).pop();
        let val = Object.values(type).pop();
        document.querySelector(".page-wrapper").className = "page-wrapper " + val;
        localStorage.setItem("layout", key);
        history.push(key);
    };
    const closeCustomizer = () => {
        setRightSidebar(false);
        setIsPaymentDetailsOpen(false)
        document.querySelector(".customizer-contain").classList.remove("open");
    };

    const openCustomizer = (type) => {
        setActiveTab1(type);
        setRightSidebar(!rightSidebar);
        document.querySelector(".customizer-contain").classList.add("open");
    };

    const paymentIdClickHandler = (row) => {
        setSelectedRow(row);
        setIsPaymentDetailsOpen(true);
    };
    // new records update in table

    const detailsUpdate = () => {
        RefreshHandler();
        closeCustomizer();
    };
    const searchInputField = useRef(null);
    //refresh page
    const RefreshHandler = () => {
        setRefresh((prevValue) => prevValue + 1);
        if (searchInputField.current) searchInputField.current.value = "";
    };
    const getQueryParams = () => {
        const { currentPageNo, currentItemsPerPage } = paymentLIst;

        let queryParams = "";
        if (currentItemsPerPage) {
            queryParams += `limit=${currentItemsPerPage}`;
        }
        if (currentPageNo) {
            queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
        }

        return queryParams;
    };

    // pagination api

    const fetchPaymentList = () => {
        UpdatePaymentList((prevState) => ({
            ...prevState,
            uiState: {
                loading: true,
            },
        }));
        const queryParams = getQueryParams();
        billingaxios.get(`payment/v3/list/gateways?${queryParams}`)
            .then((response) => {
                const { data } = response;
                const { gateways } = data;
                UpdatePaymentList((prevState) => ({
                    ...prevState,
                    currentPageNo: gateways?.page,
                    pageLoadData: [...gateways?.results],
                    prevURI: gateways?.previous,
                    nextURI: gateways?.next,
                    totalRows: gateways?.count,
                }));
            })

            // .catch(function (error) {
            //     const errorString = JSON.stringify(error);
            //     const is500Error = errorString.includes("500");
            //     const is404Error = errorString.includes("404");
            //     if (error.response && error.response.data.detail) {
            //         toast.error(error.response && error.response.data.detail, {
            //             position: toast.POSITION.TOP_RIGHT,
            //             autoClose: 1000,
            //         });
            //     } else if (is500Error) {
            //         toast.error("Something went wrong", {
            //             position: toast.POSITION.TOP_RIGHT,
            //             autoClose: 1000,
            //         });
            //     } else if (is404Error) {
            //         toast.error("API mismatch", {
            //             position: toast.POSITION.TOP_RIGHT,
            //             autoClose: 1000,
            //         });
            //     } else {
            //         toast.error("Something went wrong", {
            //             position: toast.POSITION.TOP_RIGHT,
            //             autoClose: 1000,
            //         });
            //     }
            // })
            // Modified by Marieya
            .catch(function (error) {
                const errorString = JSON.stringify(error);
                const is500Error = errorString.includes("500");
                const is404Error = errorString.includes("404");
                let errorMessage = "Something went wrong";
              
                if (error.response && error.response.data.detail) {
                  errorMessage = error.response.data.detail;
                } else if (is500Error) {
                  errorMessage = "Something went wrong";
                } else if (is404Error) {
                  errorMessage = "API mismatch";
                }
              
                setShowModal(true);
                setModalMessage(errorMessage);
              })
              

            .finally(function () {
                UpdatePaymentList((prevState) => ({
                    ...prevState,
                    uiState: {
                        loading: false,
                    },
                }));
            })
    }
    useEffect(() => {
        fetchPaymentList();
    }, [
        paymentLIst.currentPageNo,
        paymentLIst.currentItemsPerPage,
        refresh
    ]);

    const tokenInfo1 = JSON.parse(localStorage.getItem("token"));
    let Showpassword = false;
    if (
        (tokenInfo1 && tokenInfo1.user_type === "Admin")
    ) {
        Showpassword = true;
    }
    const columns = [

        {
            name: <b className="Table_columns" >{"Name"}</b>,
            selector: "gateway.name",
            cell: (row) => (
                <>
                    {token.permissions.includes(ADMINISTRATION.PAYMENTREAD) ? (
                        <a
                            row={row}
                            onClick={() => paymentIdClickHandler(row)}
                            className="openmodal"
                        >
                            {row?.payment_gateway?.gateway ? row?.payment_gateway?.gateway?.name : "---"}
                        </a>
                    ) : row?.payment_gateway?.gateway ? (
                        row?.payment_gateway?.gateway?.name
                    ) : (
                        "---"
                    )}
                </>
            ),
        },
        {
            name: <b className="Table_columns" id="columns_left_1">{"Gateway"}</b>,
            selector: "gateway_type",
            sortable: true,
            cell: (row) => (
                <p id="columns_left">
                    {row?.payment_gateway?.gateway_type === "ATOM"
                        ? "Atom"
                        : row?.payment_gateway?.gateway_type === "RPAY"
                            ? "Razorpay"
                            : row?.payment_gateway?.gateway_type === "PAYU"
                                ? "PayU"
                                : "N/A"}
                </p>
            ),
        },


        {
            name: <b className="Table_columns" id="wallet_columns_right">{"Key ID"}</b>,
            selector: "gateway.key_id",
            cell: (row) => {
                return <span id="wallet_columns_right">{row?.payment_gateway ? row.payment_gateway?.gateway?.key_id : "-"}</span>;
            },
            sortable: true,
        },



        {
            name: <b className="Table_columns" id="columns_right">{"Status"}</b>,
            selector: "",
            cell: (row) => {
                return (
                    <div
                        onClick={() => {
                            Verticalcentermodaltoggle();
                            setUseThis(row);
                        }}
                        id="columns_right"
                    >
                        {row?.payment_gateway?.enabled ? (
                            <span>
                                <img
                                    src={ENABLED}
                                    style={{
                                        position: "relative",
                                        left: "-9px",
                                        top: "-2px",
                                        width: "21px",
                                        height: "21px",
                                    }}
                                />
                                &nbsp;
                                {row?.payment_gateway?.default ? (
                                    <Badge
                                        badgeContent={"Default"}
                                        color="success"
                                        sx={{ position: "relative", top: "10px" }}
                                    >
                                        <span style={{ position: "relative", top: "-10px" }}>
                                            Enabled
                                        </span>{" "}
                                        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;{" "}
                                    </Badge>
                                ) : (
                                    "Enabled"
                                )}
                            </span>
                        ) : (
                            <span>
                                <img
                                    src={DISABLED}
                                    style={{
                                        position: "relative",
                                        left: "-9px",
                                        top: "-2px",
                                        width: "21px",
                                        height: "21px",
                                    }}
                                />
                                &nbsp;
                                {row?.payment_gateway?.default ? (
                                    <Badge
                                        badgeContent={"Default"}
                                        color="success"
                                        sx={{ position: "relative", top: "10px" }}
                                    >
                                        {" "}
                                        <span style={{ position: "relative", top: "-10px" }}>
                                            Disabled
                                        </span>{" "}
                                        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;{" "}
                                    </Badge>
                                ) : (
                                    "Disabled"
                                )}
                            </span>
                        )}
                    </div>
                );
            },
            sortable: true,
        },
// Sailaja Modified Year Format As YYYY  for Admin/ payment-config Created Column on 20th March 2023

        {
            name: <b className="Table_columns" id="columns_right">{"Created"}</b>,
            selector: "gateway.created_at",
            sortable: true,
            cell: (row) => (
                <span className="digits" style={{ textTransform: "initial" }} id="columns_right">
                    {" "}
                    {moment(row.gateways?.created_at).format("DD MMM YYYY")}
                </span>
            ),
        },
        Showpassword ? {
            name: <b className="Table_columns" >{"Entity"}</b>,
            selector: "entity",
            sortable: true,
            cell: (row) => {
                return Showpassword ? (
                    <span>{row.entity ? row.entity : "---"}</span>
                ) : (
                    "---"
                );
            },
        } : "",
        Showpassword ? {
            name: <b className="Table_columns" id="">{"Entity Name"}</b>,
            selector: "entity_name",
            sortable: true,
            cell: (row) => {
                return Showpassword ? (
                    <span>{row.entity_name ? row.entity_name : "---"}</span>
                ) : (
                    "---"
                );
            },
        } : "",
    ];

    const handlePerRowsChange = (newPerPage, page) => {
        UpdatePaymentList((prevState) => ({
            ...prevState,
            currentPageNo: page,
            currentItemsPerPage: newPerPage,
        }));
    };

    const handlePageChange = (page) => {
        UpdatePaymentList((prevState) => ({
            ...prevState,
            currentPageNo: page,
        }));
    };


    //change the buutons
    const paymentstatusapi = () => {
        billingaxios
            .patch(`payment/v2/gateway/${useThis.id}/ru`, {
                id: useThis.id,
                entity_id: useThis.entity_id,
                payment_gateway: {
                    id: useThis.payment_gateway?.id,
                    enabled: !useThis.payment_gateway?.enabled,
                    default: setasdefault,
                }
            })
            .then((res) => {
                let newfilterData = paymentLIst.pageLoadData.map((d) => {
                    if (d.id != useThis.id) {
                        return d;
                    } else {
                        return { ...d, enabled: !useThis.enabled, default: setasdefault };
                    }
                });
                setSetasdefault(false);
                UpdatePaymentList(newfilterData);
                setShowModal(true);
                setModalMessage("Successfully changed");
                // toast.success("Successfully changed", {
                //     autoClose: 1000,
                // });

            })
            // .catch((err) => {
            //     toast.error("Something went wrong")
            //     console.log(err, "errr")
            // });
            .catch((err) => {
                console.log(err, "errr");
                // If an error message exists, assign it to errorMessage, else use a default message
                const errorMessage = err?.response?.data?.detail ? err.response.data.detail : "Something went wrong";
                // Set the error message state which will be displayed in the modal
                setModalMessage(errorMessage);
                // Show the modal
                setShowModal(true);
              })
              
    };
    const handleClick = () => setSetasdefault(!setasdefault);
    const handleLeadSelectedRows = () => { };
    return (
        <div style={{ padding: "20px" }}>
            <Grid container spacing={1} style={{ position: "relative" }}>
                <Grid item md="12" id="breadcrumb_margin">
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator={
                            <NavigateNextIcon fontSize="small" className="navigate_icon" />
                        }
                    >
                        <Typography
                            sx={{ display: "flex", alignItems: "center" }}
                            color=" #377DF6"
                            fontSize="14px"
                        >
                            Customer Relations
                        </Typography>
                        <Typography
                            sx={{ display: "flex", alignItems: "center" }}
                            color="#00000 !important"
                            fontSize="14px"
                            className="last_typography"
                        >
                            Payments
                        </Typography>
                        <Typography
                            sx={{ display: "flex", alignItems: "center" }}
                            color="#00000 !important"
                            fontSize="14px"
                            className="last_typography"
                        >
                            Payment Gateway
                        </Typography>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            <br />
            <br />
            <Grid
                container
                spacing={1}
                className=" edit-profile data_table"
                id="breadcrumb_table"
            >   <Grid item md="12">

                    <NewPaymentListHeader openCustomizer={openCustomizer} />
                </Grid>
                <Grid item md="12">

                    <DataTable
                        columns={columns}
                        data={paymentLIst.pageLoadData || []}
                        noHeader
                        clearSelectedRows={false}
                        progressPending={paymentLIst.uiState?.loading}
                        pagination
                        paginationServer
                        progressComponent={
                            <SkeletonLoader loading={paymentLIst?.uiState?.loading} />
                        }
                        paginationTotalRows={paymentLIst.totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        noDataComponent={"No Data"}
                        selectableRows
                        onSelectedRowsChange={({ selectedRows }) => {
                            handleLeadSelectedRows(selectedRows)
                        }}
                    />
                </Grid>
                <Grid>
                    {isPaymentDetailsOpen && (
                        <NewPaymentDeatils
                            detailsUpdate={detailsUpdate}
                            isPaymentDetailsOpen={isPaymentDetailsOpen}
                            closeCustomizer={closeCustomizer}
                            selectedRow={selectedRow}
                            RefreshHandler={RefreshHandler}
                        />
                    )}
                </Grid>
                <Modal
                    isOpen={Verticalcenter}
                    toggle={Verticalcentermodaltoggle}
                    centered
                    backdrop="static"
                >
                    <ModalBody>
                        <span>
                            <b>{useThis && useThis.payment_gateway?.gateway?.name}</b>
                        </span>

                        <p>
                            {useThis && useThis.payment_gateway?.enabled ? (
                                "Do you want to disable this payment gateway?"
                            ) : (
                                <>
                                    Do you want to enable this payment gateway?
                                    <br />
                                    <br />
                                    <Input
                                        type="checkbox"
                                        className="checkbox_animated"
                                        name="default"
                                        checked={setasdefault}
                                        onClick={handleClick}
                                    />
                                    <Label>
                                        <b>Set as Default</b>
                                    </Label>
                                </>
                            )}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={() => {
                                Verticalcentermodaltoggle(true);
                                paymentstatusapi();
                            }}
                            id="yes_button"
                        >
                            {"Yes"}
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => {
                                Verticalcentermodaltoggle();
                                setUseThis(null);
                            }}
                            id="resetid"
                        >
                            {"No"}
                        </Button>
                    </ModalFooter>
                </Modal>
            </Grid>
            <Grid container spacing={1}>
                <Grid item md="12">
                    <div
                        className="customizer-contain"
                        style={{
                            borderTopLeftRadius: "20px",
                            borderBottomLeftRadius: "20px",
                        }}
                    >
                        <div className="tab-content" id="c-pills-tabContent">
                            <div
                                className="customizer-header"
                                style={{
                                    border: "none",
                                    padding: "30px 25px",
                                    borderTopLeftRadius: "20px",
                                }}
                            >
                                <i className="icon-close" style={{ position: "absolute", top: "20px" }}
                                    onClick={closeCustomizer}></i>
                            </div>
                        </div>

                        <div className="tab-content" id="c-pills-tabContent">
                            <div className=" customizer-body custom-scrollbar">
                                <TabContent activeTab={activeTab1}>
                                    <TabPane tabId="2">
                                        <div id="headerheading">
                                            Add New Payment Gateway
                                        </div>
                                        <ul
                                            className="layout-grid layout-types"
                                            style={{ border: "none" }}
                                        >
                                            <li
                                                data-attr="compact-sidebar"
                                                onClick={(e) => handlePageLayputs(classes[0])}
                                            >
                                                <div className="layout-img">
                                                    <AddPayment
                                                        dataClose={closeCustomizer}
                                                        onUpdate={detailsUpdate}
                                                        rightSidebar={rightSidebar}
                                                    />
                                                </div>
                                            </li>
                                        </ul>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </div>
                    </div>
                    <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
                </Grid>
            </Grid>
        </div>
    )
}
const SkeletonLoader = ({ loading }) => {
    const tableData = useMemo(
        () => (loading ? Array(10).fill({}) : []),
        [loading]
    );

    return (
        <Box sx={{ width: "100%", pl: 2, pr: 2 }}>
            {tableData.map((_) => (
                <Skeleton height={50} />
            ))}
        </Box>
    );
};
export default NewPaymentList;