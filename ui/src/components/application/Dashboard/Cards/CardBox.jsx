import React from "react";
import { Row, Col } from "reactstrap";
import camelCase from "lodash/camelCase";
import startCase from "lodash/startCase";
import { Link } from "react-router-dom";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const CardBox = ({
  id,
  totalCount,
  classType,
  selected,
  onClickHandler,
}) => {
  const obj = {
    lead: `${process.env.PUBLIC_URL}/app/leads/leadsContainer/${process.env.REACT_APP_API_URL_Layout_Name}`,
    customer: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
    network: `${process.env.PUBLIC_URL}/app/project/opticalnew/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
    ticket: `${process.env.PUBLIC_URL}/app/ticket/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
    payment: `${process.env.PUBLIC_URL}/app/billingandpayments/billing/${process.env.REACT_APP_API_URL_Layout_Name}`,
  };
  return (
    <>

      <div className={`${classType + "-card"} card-new-background`}>
        <fieldset
          key={id}
          id={id}
          onClick={onClickHandler}
          className={`card-container ${
            selected ? "card-new card-new-active" : "card-new"
          }`}
        >
          <div className="card-content">
            <Row>
              <Col xs={6} md={6} lg={6} className="card-left">
                {/* <br /> */}
                    <Link
                      to={obj[classType]}
                      className={`${selected ? "linto linto-active" : "linto"}`}
                    >
                      <span>{"->"}</span>
                    </Link>

                <div
                  className="m-0 card-title"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <span>
                    <b style={{ fontSize: "25px", color: "black" }}>
                      {totalCount}
                    </b>
                  </span>
                  <br />
                  <span
                    className="see-analysis"
                    style={{
                      whiteSpace: "nowrap",
                      zIndex: 1,
                      fontSize: "18px",
                      color: "black",
                      lineHeight: "30px",
                      fontWeight: "500",
                    }}
                  >
                  </span>
                    {startCase(camelCase(classType))}{" "}
                </div>
              </Col>
              <Col xs={6} md={6} lg={6} className="card-right"></Col>
            </Row>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default CardBox;
