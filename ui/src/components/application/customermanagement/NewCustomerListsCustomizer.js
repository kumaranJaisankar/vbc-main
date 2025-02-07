import React, { useCallback, useState } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from "reactstrap";

import { ModalTitle, CopyText, Cancel } from "../../../constant";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { CustomerDetailss } from "./customersdetail/customerdetails";
import SessionHistory from "./sessionhistory";

export const NewCustomerListsCustomizer = React.forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState(null);

  const {
    closeCustomizer,
    modal,
    toggle,
    isCustomerDetailsOpen,
    isSessionHistoryOpen,
    configDB,
    selectedRow,
    RefreshHandler,
    renew,
    setRenew,
    detailsUpdate,
  } = props;

  const isOpen = isCustomerDetailsOpen || isSessionHistoryOpen ? ' open' : '';

  const handleClose = useCallback(() => {
    setActiveTab(null);
    closeCustomizer();
  }, [closeCustomizer]);

  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <div className={`customizer-contain${isOpen}`} ref={ref}>
            <div className="tab-content" id="c-pills-tabContent">
              <div className="customizer-header">
                <br />
                <i className="icon-close" onClick={handleClose}></i>
                <br />
                <Modal
                  isOpen={modal}
                  toggle={toggle}
                  className="modal-body"
                  centered={true}
                >
                  <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
                  <ModalFooter>
                    <CopyToClipboard text={JSON.stringify(configDB)}>
                      <Button
                        color="primary"
                        className="notification"
                        onClick={() =>
                          toast.success("Code Copied to clipboard !", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                          })
                        }
                      >
                        {CopyText}
                      </Button>
                    </CopyToClipboard>
                    <Button color="btn btn-secondary" onClick={toggle}>
                      {Cancel}
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
              <div className="customizer-body custom-scrollbar">
                {
                  (selectedRow && isCustomerDetailsOpen) && (
                    <>
                      <div id="headerheading">
                        Customer Information :
                        {selectedRow.username}
                      </div>
                      <CustomerDetailss
                        renew={renew}
                        setRenew={setRenew}
                        lead={selectedRow}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onUpdate={(data) => detailsUpdate(data)}
                        detailsUpdate={detailsUpdate}
                        closeCustomizer={closeCustomizer}
                        Refreshhandler={RefreshHandler}
                      />
                    </>
                  )
                }
                {
                  (selectedRow && isSessionHistoryOpen) && (
                    <SessionHistory selectedRow={selectedRow} />
                  )
                }
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
});
