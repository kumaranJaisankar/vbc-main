import React, { useState, useEffect } from "react";

import moment from "moment";
import { Card, CardHeader, CardBody, Row, Col, Input } from "reactstrap";
import DateSelect from "../Common/DateSelect";

const NewCustomerCount = ({
  new_customers_created,
  defautDatePickerValue,
  getCustomerInfoBydate,
}) => {
  const [newCustomerdateRange, setNewCustomerDateRange] = useState(
    defautDatePickerValue
  );

  useEffect(() => {
    const startDate = moment(newCustomerdateRange[0]).format("YYYY-MM-DD");
    const endDate = moment(newCustomerdateRange[1]).format("YYYY-MM-DD");
    getCustomerInfoBydate(startDate, endDate, "newCustomer");
  }, [newCustomerdateRange]);

  return (
    <div className="bandwidth-usage new-customer">
      <Card>
        <CardHeader style={{ padding: "14px" }}>
          <Row>
            <Col md={7}>
              <div className="bandwidth-usage-text">New customer</div>
            </Col>
            <Col md={5} style={{ padding: "0px 10px", textAlign: "right" }}>
              <DateSelect
                setDateRange={setNewCustomerDateRange}
                defaultPickerValue={defautDatePickerValue}
              />
            </Col>
          </Row>
        </CardHeader>
        <CardBody style={{ padding: "14px" }}>
          <div className="new-customer-count">
            <span className="customerCount">{new_customers_created}</span>
          </div>
          <div className="customer-subtext">
            {" "}
            customers generated based <br /> on last{" "}
            {moment(newCustomerdateRange[1]).diff(
              moment(newCustomerdateRange[0]),
              "days"
            ) > 0
              ? moment(newCustomerdateRange[1]).diff(
                  moment(newCustomerdateRange[0]),
                  "days"
                )
              : 30}{" "}
            days
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

NewCustomerCount.propTypes = {};

export default NewCustomerCount;
