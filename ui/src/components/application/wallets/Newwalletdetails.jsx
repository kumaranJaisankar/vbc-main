import React, { useCallback, useState } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import { Right } from "../../../constant";
import WalletDetails from "./walletdetails";

export const NewWalletDetails = React.forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState(null);

  const {
    closeCustomizer1,
    isLeadDetailsOpen,
    isSessionHistoryOpen,
    selectedRow,
    RefreshHandler,
    detailsUpdate,
  } = props;

  const isOpen = isLeadDetailsOpen || isSessionHistoryOpen ? ' open' : '';

  const handleClose = useCallback(() => {
    setActiveTab(null);
    closeCustomizer1();
  }, [closeCustomizer1]);

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
               
              </div>
              <div className="customizer-body custom-scrollbar">
                {
                  (selectedRow && isLeadDetailsOpen) && (
                    <>
                      <div id="headerheading">
                        Wallet Information :
                        {selectedRow.entity_id}
                      </div>
                      <WalletDetails
                        wallet={selectedRow}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onUpdate={(data) => detailsUpdate(data)}
                        detailsUpdate={detailsUpdate}
                        closeCustomizer1={closeCustomizer1}
                        Refreshhandler={RefreshHandler}

                        setFilterselectedid={props.setFilterselectedid}
                        filterselectedid={props.filterselectedid}
                        selectedid={props.selectedid}
                        setSelectedid={props.setSelectedid}
                      />
                    </>
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
