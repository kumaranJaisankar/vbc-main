import React from "react";
import Stack from "@mui/material/Stack";
import { ADMINISTRATION } from "../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
    var token = JSON.parse(storageToken);
}

const NewPaymentListHeader = (props) => {

    // only admin and superadmin was showing
    const tokenInfo = JSON.parse(localStorage.getItem("token"));
    let addPaymentConfig = false;
    if (
        (tokenInfo && tokenInfo.user_type === "Super Admin") ||
        (tokenInfo && tokenInfo.user_type === "Admin")
    ) {
        addPaymentConfig = true;
    }
    return (
        <React.Fragment>
            <div>
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                        {addPaymentConfig ?
                            <>
                                {token.permissions.includes(
                                    ADMINISTRATION.PAYMENTCREATE
                                ) && (

                                        <button
                                            className="btn btn-primary openmodal"
                                            id="newbuuon"
                                            type="submit"
                                            onClick={() => props.openCustomizer("2")}
                                        >
                                            <b>
                                                <span className="openmodal" style={{ fontSize: "16px", marginLeft: "-9px" }}>
                                                    New &nbsp;&nbsp;
                                                </span>
                                            </b>
                                            <i
                                                className="icofont icofont-plus openmodal"
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            ></i>
                                        </button>
                                    )}
                            </> : ""}
                    </Stack>
                </Stack>
            </div>
        </React.Fragment>
    )
}
export default NewPaymentListHeader;