import React from "react";
import { connect } from "react-redux";
import { setActiveBreadCrumb } from "../../../redux/kyc-form/actions";

import Breadcrumbs from "voltage-breadcrumbs";
const CustomLink = ({ text, onClick, className }) => (
  <a
    href="#"
    className={className}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    {text}
  </a>
);

const Breadcrumbcomponent = (props) => {
  const {
    rendered,
    isPermanentAddressShow,
    activeAddressBreadCrumb,
    setActiveBreadCrumb,
  } = props;

  const handleBreadCrumbClick = (id) => {
    setActiveBreadCrumb(id);
  };
  const activeClassName = "breadcrumb-active";

  let links = [
    <CustomLink
      text="Billing Address"
      className={`breadcrumb-styles ${
        activeAddressBreadCrumb === "billing_address" ? activeClassName : ""
      }`}
      onClick={() => handleBreadCrumbClick("billing_address")}
    />,
    <CustomLink
      text="Permanent Address"
      className={`breadcrumb-styles ${
        activeAddressBreadCrumb === "permanent_address" ? activeClassName : ""
      }`}
      onClick={() => handleBreadCrumbClick("permanent_address")}
    />,
  ];

  links = !isPermanentAddressShow ? [links[0]] : [...links];

  return (
    <>
      {/* <Breadcrumb>
        <BreadcrumbItem className={`breadcrumb-styles ${activeAddressBreadCrumb === "billing_address" ? activeClassName : ""}`}>
            <span onClick={() => handleBreadCrumbClick("billing_address")}>Billing Address</span>
        </BreadcrumbItem>
        <BreadcrumbItem  className={`breadcrumb-styles ${activeAddressBreadCrumb === "permanent_address" ? activeClassName : ""}`}><span onClick={() => handleBreadCrumbClick("permanent_address")}>Permanent Address</span>
        </BreadcrumbItem>
        </Breadcrumb> */}
      <div className="breadcrumb-wrapper">
        <Breadcrumbs links={links} separator={">"} />
      </div>

      {activeAddressBreadCrumb === "billing_address" && (
        <div id="billing_address">{rendered[0]}</div>
      )}

      {activeAddressBreadCrumb === "permanent_address" && (
        <div id="permanent_address">{rendered[1]}</div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
    const { activeAddressBreadCrumb } = state.KYCForm;
    return {
        activeAddressBreadCrumb
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveBreadCrumb: (payload) => dispatch(setActiveBreadCrumb(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbcomponent);
