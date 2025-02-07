import React, { useState, useEffect } from 'react';
import { Modal,ModalBody, ModalFooter, Spinner } from 'reactstrap';
import Button from "@mui/material/Button";
import { adminaxios } from "./axios/index"

function IdleMonitor() {
    //to disable button
    const [disable, setDisable] = useState(false);
    //Modal
    const [idleModal, setIdleModal] = useState(false);

    let idleTimeout = 1000 * 60 * 5;  //5 minute
    let idleLogout = 1000 * 11; //2 Minutes
    let idleEvent;
    let idleLogoutEvent;

    /**
     * Add any other events listeners here
     */
    const events = [
        'mousemove',
        'click',
        'keypress',
        'scroll',
        'load'
    ];


    /**
     * @method sessionTimeout
     * This function is called with each event listener to set a timeout or clear a timeout.
     */
    const sessionTimeout = () => {
        if (!!idleEvent) clearTimeout(idleEvent);
        if (!!idleLogoutEvent) clearTimeout(idleLogoutEvent);

        idleEvent = setTimeout(() => setIdleModal(true), idleTimeout); //show session warning modal.
        idleLogoutEvent = setTimeout(() => logOut, idleLogout); //Call logged out on session expire.
    };

    /**
     * @method extendSession
     * This function will extend current user session.
     */
    const extendSession = () => {
        console.log('user wants to stay logged in');
    }


    /**
     * @method logOut
     * This function will destroy current user session.
     */
    const logOut = async () => {
        setDisable(true);
        await adminaxios
            .delete(`/accounts/logout`)
            .then((res) => {
                console.log(res);
            })
            .catch(function (error) {
                window.location.assign(`${process.env.PUBLIC_URL}/login`);
            });

        localStorage.removeItem("profileURL");
        localStorage.removeItem("token");
        localStorage.removeItem("backup");

        window.location.assign(`${process.env.PUBLIC_URL}/login`);
    }

    useEffect(() => {
        for (let e in events) {
            window.addEventListener(events[e], sessionTimeout);
        }

        return () => {
            for (let e in events) {
                window.removeEventListener(events[e], sessionTimeout);
            }
        }
    }, []);


    return (

        <Modal isOpen={idleModal} toggle={() => setIdleModal(false)} centered backdrop="static">
            {/* <ModalHeader toggle={() => setIdleModal(false)}>
            Session expire warning
        </ModalHeader> */}
            <ModalBody>
                {/* your session will expire in {idleLogout / 60 / 1000} minutes. Do you want to extend the session? */}

                Your session has been <b>expired</b>, please Login.
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="contained"
                    type="button"
                    onClick={() => logOut()}
                    disabled={disable}
                >
                    {disable ? <Spinner size="sm"> </Spinner> : null} &nbsp;&nbsp;
                    {"Login"}
                </Button>
                {/* <button className="btn btn-success" onClick={()=> extendSession()}>Extend session</button> */}

            </ModalFooter>
        </Modal>
    )

}

export default IdleMonitor;