import React from "react";
import AllPlans from "../allplans";

const AllPlansRightSidePanel = (props) => {
  const { closeCustomizer } = props;
  return (
    <div className="customizer-contain">
      <div className="tab-content" id="c-pills-tabContent">
        <div
          className="customizer-header"
          style={{ padding: "0px", border: "none" }}
        >
          <br />
           <div id="headerheading" style={{marginTop:"-12px"}}> All Plans</div>
          <i className="icon-close" onClick={closeCustomizer}></i>
          <br />
        </div>
        <div className=" customizer-body custom-scrollbar">

            <AllPlans 
            setSelectedPlan={props.setSelectedPlan}
            handleChangeFormInput={props.handleChangeFormInput}
            closeCustomizer={closeCustomizer}
            isformclose={props.isformclose}
    
            />
        </div>
      </div>
    </div>
  );
};

export default AllPlansRightSidePanel;
