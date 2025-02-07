import React, { useCallback, useState } from "react";
import {
  Row,
  Col,
} from "reactstrap";


import  SerivceDetails from "./servicedetails";
export const NewServiceDetails = React.forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState(null);

  const {
    closeCustomizer1,
    isServiceDetailsOpen,
    isSessionHistoryOpen,
    selectedRow,
    RefreshHandler,
    detailsUpdate,
  } = props;

  const isOpen = isServiceDetailsOpen || isSessionHistoryOpen ? ' open' : '';

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
                  (selectedRow && isServiceDetailsOpen) && (
                    <>
                      <div id="headerheading">
                      Plan Information :
                       {selectedRow.package_name}
                      </div>
                      <SerivceDetails
                        lead={selectedRow}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onUpdate={(data) => detailsUpdate(data)}
                        detailsUpdate={detailsUpdate}
                        closeCustomizer1={closeCustomizer1}
                        RefreshHandler={RefreshHandler}
                        // openCustomizer={openCustomizer}
                        
                       
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
