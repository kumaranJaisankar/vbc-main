import "./progressStepper.scss";
import Stepper from "./stepper/Stepper";
import React, { useState } from "react";
// import { Button } from "reactstrap";

const segments = [{"personal_details_form" : [
                  "Upload Customer Photo",
                  "Personal Information",
                  "Address",
                  ]}, 
                  {"service_details_form" : [
                    "Upload Customer Photo1",
                    "Personal Information1",
                    "Address1",
                  ]}, 
                  {"documents_form": [
                    "Upload Customer Photo11",
                    "Personal Information11",
                    "Address11",
                  ]}, 
                  {"payment_options_form": [
                    "Upload Customer Photo111",
                    "Personal Information111",
                    "Address111",
                  ]}];

const sectionIds = ["personal_details_form", "service_details_form", "documents_form", "payment_options_form"];
const ProgressStepper = (props) => {
  // const [ currentStep, setCurrentStep ] = useState(1);
  // const [ currentSubSegment, setCurrentSubSegment ] = useState(1);
  const { setCurrentFormId, currentStep, setCurrentStep, currentSubSegment, setCurrentSubSegment } = props;
  const handleClick = (clickType) => {
    let newStep = currentStep;
    let currentObj = segments[currentStep-1];
    if(clickType === "next")
    {
      if(currentSubSegment<currentObj[sectionIds[currentStep-1]].length){
        setCurrentSubSegment(currentSubSegment+1)
        props.setActiveSubSegment(currentObj[sectionIds[currentStep-1]][currentSubSegment]);
      }
      else
      {
        newStep++;
        setCurrentSubSegment(1);
        let obj = segments[currentStep];
        let key = Object.keys(obj)[0];
        props.setActiveSubSegment(obj[key][0]);
      }
    }
    else
    {
      if(currentSubSegment>1){
        setCurrentSubSegment(currentSubSegment-1)
        props.setActiveSubSegment(currentObj[sectionIds[currentStep-1]][currentSubSegment-2]);
      }
      else{
          newStep--;
          let obj = segments[currentStep-2];
          let key = Object.keys(obj)[0];
          let lengthOfSubSegment = obj[key].length;
          setCurrentSubSegment(lengthOfSubSegment);
          props.setActiveSubSegment(obj[key][lengthOfSubSegment-1]);
      }
    
    }

    if (newStep > 0 && newStep < 5) {
      setCurrentStep(newStep)
      setCurrentFormId(sectionIds[newStep-1])
    }
  }

    return (
      <>
        <div className="stepper-container-horizontal">
          <Stepper
            direction="horizontal"
            currentStepNumber={currentStep - 1}
            steps={stepsArray}
            stepColor="purple"
          />
        </div>

        {/* <div className="buttons-container">
        <Button
            disabled={Boolean(currentStep==1 && currentSubSegment===1)}
            style={{ width: "150px", height: "50px", marginRight: "20px"}}
            color="primary"
            onClick={() => handleClick()
            }
          >
            Previous
          </Button>
        <Button
            disabled={Boolean(currentStep==4 && currentSubSegment===3)}
            style={{ width: "150px", height: "50px"}}
            color="primary"
            onClick={() => handleClick("next")
            }
          >
            Next
          </Button>
        </div> */}
      </>
    );
}
export default ProgressStepper;
const stepsArray = [
  "Personal Details",
  "Service Details",
  "Documents",
  "Payment Options"
];