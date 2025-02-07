import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Stepper.scss"; 

import {ReactComponent as Personal_Details_Logo } from "../../../assets/images/personal_details_icon.svg";
import {ReactComponent as Service_Details_Logo } from "../../../assets/images/service_icon.svg";
import {ReactComponent as Documents_Logo } from "../../../assets/images/document_icon.svg";
import {ReactComponent as Payment_Icon_Logo } from "../../../assets/images/payment_icon.svg";

const stepsIcons = {
  "Personal Details": Personal_Details_Logo,
  "Service Details": Service_Details_Logo,
  "Documents": Documents_Logo,
  "Payment Options": Payment_Icon_Logo
};

export default class Stepper extends Component {
  constructor() {
    super();
    this.state = {
      // Completed - to add a check mark
      // Selected - to fill step with color
      // Highlighted - to make text of selected step bold
      steps: []
    };
  }

  componentDidMount() {
    const { steps, currentStepNumber } = this.props;

    const stepsState = steps.map((step, index) => {
      const stepObj = {};
      stepObj.description = step;
      stepObj.highlighted = index === 0 ? true : false;
      stepObj.selected = index === 0 ? true : false;
      stepObj.completed = false;
      return stepObj;
    });

    const currentSteps = this.updateStep(currentStepNumber, stepsState);

    this.setState({
      steps: currentSteps
    });
  }

  componentDidUpdate(prevProps) {
    const { steps } = this.state;
    const currentSteps = this.updateStep(this.props.currentStepNumber, steps);

    if (prevProps.currentStepNumber !== this.props.currentStepNumber)
      this.setState({
        steps: currentSteps
      });
  }

  updateStep(stepNumber, steps) {
    const newSteps = [...steps];
    let stepCounter = 0;

    // Completed - to add a check mark
    // Selected - to fill step with color
    // Highlighted - to make text of selected step bold

    while (stepCounter < newSteps.length) {
      // Current step
      if (stepCounter === stepNumber) {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: true,
          selected: true,
          completed: false
        };
        stepCounter++;
      }
      // Past step
      else if (stepCounter < stepNumber) {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: false,
          selected: true,
          completed: true
        };
        stepCounter++;
      }
      // Future step
      else {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: false,
          selected: false,
          completed: false
        };
        stepCounter++;
      }
    }

    return newSteps;
  }

  getFillColor = (step) => {
    const normalFillColor = "#9C9C9C";
    const activeFillColor = "#1565c0";
    const completedFillColor = "#258925";
    if(step.highlighted)
    return activeFillColor;
    else if(step.completed)
    return completedFillColor;
    else
    return normalFillColor;
  }

  getLogo = (step) => {

    switch(step.description){
      case "Personal Details": 
            return <span style={{paddingRight: "10px"}} >
            <Personal_Details_Logo fill={this.getFillColor(step)}/></span>
            break;
      case "Service Details":
            return <span style={{paddingRight: "10px"}} >
            <Service_Details_Logo fill={this.getFillColor(step)}/></span>
            break;
      case "Documents":
            return <span style={{paddingRight: "10px"}} >
            <Documents_Logo fill={this.getFillColor(step)}/></span>
            break;
      case "Payment Options":
            return <span style={{paddingRight: "10px"}} >
            <Payment_Icon_Logo fill={this.getFillColor(step)}/></span>
            break;
      default: 
            return <></>
    }
  }

  render() {
    const { direction, stepColor } = this.props;
    const { steps } = this.state;
    const stepsJSX = steps.map((step, index) => {
      return (
        <div className="step-wrapper" key={index}>
          <div
            className={`step-number ${
              step.selected ? "step-number-selected" : "step-number-disabled"} 
              ${step.completed ? "step-number-completed" : "step-number-disabled"}` }
            // style={{ background: `${step.selected ? stepColor : "none"}` }}
          >
            {step.highlighted ? <div className="step-selected-radio"></div> : ""}
            {step.completed ? <span>&#10003;</span> : ""}
          </div>
          <div
            className={`step-description step-description-position-top ${step.highlighted &&
              "step-description-active"} ${step.completed && "step-description-completed"}`}
          >
            {this.getLogo(step)}
            {step.description}
          </div>
          {index !== steps.length - 1 && (
            <div className={`divider-line divider-line-${steps.length} ${step.completed && "divider-completed"}`} />
          )}
        </div>
      );
    });

    return <div className={`stepper-wrapper-${direction}`}>{stepsJSX}</div>;
  }
}

Stepper.propTypes = {
  direction: PropTypes.string.isRequired,
  currentStepNumber: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  stepColor: PropTypes.string.isRequired
};
