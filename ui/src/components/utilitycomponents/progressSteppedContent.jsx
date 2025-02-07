import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { Row, Col } from "reactstrap";

import { ReactComponent as OnlinePaymentLogo } from "../../assets/images/online_payment_icon.svg";
import { ReactComponent as CashLogo } from "../../assets/images/cash_icon.svg";
import { ReactComponent as ChequeLogo } from "../../assets/images/cheque_icon.svg";
import { ReactComponent as IdentityLogo } from "../../assets/images/document_icon.svg";
import { ReactComponent as SignatureLogo } from "../../assets/images/signature_icon.svg";
import { ReactComponent as AddressProofLogo } from "../../assets/images/document_icon.svg";
import { ReactComponent as BillingDatesLogo } from "../../assets/images/billing_date_icon.svg";
import { ReactComponent as InstallationLogo } from "../../assets/images/installations_charges_icon.svg";
import { ReactComponent as ServicePlanLogo } from "../../assets/images/service_plan_icon.svg";
import { ReactComponent as LocationLogo } from "../../assets/images/location_icon.svg";
import { ReactComponent as PersonalInfoLogo } from "../../assets/images/personal_info_icon.svg";
import { ReactComponent as UploadImageLogo } from "../../assets/images/upload_image_icon.svg";

const iconHeight = 24;
const iconWidth = 24;
const normalColor = "black";
const activeColor = "#1565c0";

export const ProgressStepperContent = (props) => {
  const [currentTabId, setTabId] = useState(1);
  const {
    leftTabArray,
    components,
    currentSubSegmentId,
    currentStep,
    currentSubSegment,
    setActiveSubSegment,
    setCurrentSubSegment,
    onClickHandlerForProgressStepper,
    checkSectionValidity,
    setShowError
  } = props;
  const active = "active";
  const notActive = "";

  const onClickHandler = (index, item) => {
    setActiveSubSegment(item);
    setCurrentSubSegment(index + 1);
  };

  const getIcon = (item) => {
    const isActive = item === currentSubSegmentId;
    switch (item) {
      case "Upload Customer Photo":
        return (
          <UploadImageLogo
            height={iconHeight}
            width={iconWidth}
            fill={isActive ? activeColor : normalColor}
          />
        );
        break;
      // case "Personal Information":
      //   return <PersonalInfoLogo height={iconHeight} width={iconWidth}  fill={isActive ? activeColor : normalColor}/>;
      //   break;
      // case "Address":
      //   return <LocationLogo height={iconHeight} width={iconWidth}  fill={isActive ? activeColor : normalColor}/>;
      //   break;
      case "Service Plan":
        return (
          <ServicePlanLogo
            height={iconHeight}
            width={iconWidth}
            fill={isActive ? activeColor : normalColor}
          />
        );
        break;
      // case "Installation Charges":
      //   return <InstallationLogo height={iconHeight} width={iconWidth} fill={isActive ? activeColor : normalColor} stroke={isActive ? activeColor : normalColor}/>;
      //   break;
      // case "Billing Dates":
      //   return <BillingDatesLogo height={iconHeight} width={iconWidth} fill={isActive ? activeColor : normalColor}/>;
      //   break;
      // case "Identity Proof":
      //   return <IdentityLogo height={iconHeight} width={iconWidth} fill={isActive ? activeColor : normalColor}/>;
      //   break;
      // case "Signature":
      //   return <SignatureLogo height={iconHeight} width={iconWidth} fill={isActive ? activeColor : normalColor}/>;
      //   break;
      // case "Address Proof":
      //   return <AddressProofLogo height={iconHeight} width={iconWidth} fill={isActive ? activeColor : normalColor}/>;
      //   break;
      case "Online Payment":
        return (
          <OnlinePaymentLogo
            height={iconHeight}
            width={iconWidth}
            fill={isActive ? activeColor : normalColor}
          />
        );
        break;
      case "Cash":
        return (
          <CashLogo
            height={iconHeight}
            width={iconWidth}
            fill={isActive ? activeColor : normalColor}
          />
        );
        break;
      case "Cheque":
        return (
          <ChequeLogo
            height={iconHeight}
            width={iconWidth}
            fill={isActive ? activeColor : normalColor}
          />
        );
        break;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    console.log('currentStep:', currentStep);
    console.log('currentSubSegment:', currentSubSegment);
  }, [currentStep, currentSubSegment]);

  return (
    <>
      <div className="formContent" style={{ marginTop: "-79px" }}>
        <div className="left-form-sections">
          {leftTabArray.map((item, index) => {
            return (
              <div
                className={`left-form-tabs ${currentSubSegmentId === item ? active : notActive
                  }`}
              // onClick={() => onClickHandler(index, item)}
              >
                <span style={{ marginRight: "5px" }}>
                  {getIcon(item, currentSubSegmentId)}
                </span>
                <span style={{ cursor: "pointer" }}>{item}</span>
              </div>
            );
          })}
        </div>

        <div className="right-form-sections">
          <p className="KYC_heading">Add Customer</p>
          {components.map((component, index) => {
            return currentSubSegmentId === leftTabArray[index] && component;
          })}
          {/* {currentSubSegmentId === leftTabArray[0] && components[0]}
          {currentSubSegmentId === leftTabArray[1] && components[1]}
          {currentSubSegmentId === leftTabArray[2] && components[2]} */}

          <br />
          <div className="dividing_line"></div>
          <br />
          {
            <div className="form-submit-btn">
              <Row style={{ marginTop: "30px" }} className="form-submit-row">
                <Col sm="6">

                  {Boolean(currentStep == 3) && props.children}
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  {/* <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/vbc`,
                  }}
                > */}
                  {/* <Button
                    disabled={Boolean(
                      currentStep == 1 && currentSubSegment === 1
                    )}
                    // color="primary"
                    id="resetid"
                    onClick={() => onClickHandlerForProgressStepper()}
                  
                  >
                    Back
                  </Button> */}
                  {Boolean(
                    currentStep == 1 && currentSubSegment === 1
                  ) ? "" :
                    <Button
                      disabled={Boolean(
                        currentStep == 1 && currentSubSegment === 1
                      )}
                      // color="primary"
                      id="resetid"
                      onClick={() => onClickHandlerForProgressStepper()}

                    >
                      Back
                    </Button>
                  }

                  {/* </Link> */}

                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {Boolean(currentStep !== 3) && (
                    <Button
                      disabled={Boolean(
                        currentStep == 3 && currentSubSegment === 2,
                        
                      )}
                      color="primary"
                      id="save_button"
                      onClick={() => {
                        if (currentStep == 1) {
                          setShowError(true);
                        }
                        if (checkSectionValidity(currentSubSegmentId))
                          onClickHandlerForProgressStepper("next");
                        else return;
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default ProgressStepperContent;
