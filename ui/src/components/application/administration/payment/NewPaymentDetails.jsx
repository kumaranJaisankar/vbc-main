import React,{useCallback,useState} from "react";
import {
    Row,
    Col,
  } from "reactstrap";
  import PaymentDetails from "./paymentdetails"
export const NewPaymentDeatils =  React.forwardRef((props, ref) =>{
    const [activeTab, setActiveTab] = useState(null);

  const {
    closeCustomizer,
    isPaymentDetailsOpen,
    isSessionHistoryOpen,
    selectedRow,
    detailsUpdate,
    // rightSidebar
  } = props;

  const isOpen = isPaymentDetailsOpen || isSessionHistoryOpen ? ' open' : '';

  const handleClose = useCallback(() => {
    setActiveTab(null);
    closeCustomizer();
  }, [closeCustomizer]);
  console.log(selectedRow,"selectedRow")

    return(
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
                  (selectedRow && isPaymentDetailsOpen) && (
                    <>
                      <div id="headerheading">
                      Payment Gateway Information :
                       {selectedRow?.payment_gateway?.gateway?.name}
                      </div>
                      <PaymentDetails
                        lead={selectedRow}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onUpdate={(data) => detailsUpdate(data)}
                        detailsUpdate={detailsUpdate}
                        dataClose={closeCustomizer}
                        RefreshHandler={props.RefreshHandler}
                       
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
    )
});