import React, { useCallback, useState } from "react";
import {
  Row,
  Col,
} from "reactstrap";


import  LeadDetails from "./leaddetails";

export const NewLeadDetails = React.forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState(null);

  const {
    closeCustomizer1,
    isLeadDetailsOpen,
    isSessionHistoryOpen,
    selectedRow,
    RefreshHandler,
    detailsUpdate,
    // rightSidebar
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
                        Lead Information :
                        L{selectedRow.id}
                      </div>
                      <LeadDetails
                        lead={selectedRow}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onUpdate={(data) => detailsUpdate(data)}
                        detailsUpdate={detailsUpdate}
                        closeCustomizer1={closeCustomizer1}
                        Refreshhandler={RefreshHandler}
                        // rightSidebar={rightSidebar}
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
