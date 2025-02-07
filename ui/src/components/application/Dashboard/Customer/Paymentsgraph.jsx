import React from "react";
import ChartistGraph from "react-chartist";
import { Row, Col } from "reactstrap";
const PaymentGraph = () => {
  const chart4Data = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    series: [[5, 9, 7, 8, 5, 3, 5, 4]],
    scales: {
      xAxes: [
        {
          ticks: {
            display: false, //this will remove only the label
          },
        },
      ],
    },
  };
  const chart4Options = {
    low: 0,
    showArea: true,
    axisX: {
      showGrid: false,
    },
    axisY: {
      showGrid: false,
      showLabel: false,
      offset: 0,
    },
  };
  return (
    <>
      <Row>
        <Col className="" xs={12} md={9} lg={9}>
          <ChartistGraph
            data={chart4Data}
            options={chart4Options}
            type={"Line"}
            className="ct-4 flot-chart-container"
          />
        </Col>

        <Col className="" xs={12} md={3} lg={3}>
          <div style={{ borderBottom: "1px solid #d9d9d9" }}>
            <h5>Last 7 Days</h5>

            <h5 style={{ color: "#2e29c4" }}>Rs. 12L</h5>
          </div>

          <div style={{ borderBottom: "1px solid #d9d9d9" }}>
            <h5>Last 14 Days</h5>

            <h5 style={{ color: "#2e29c4" }}>Rs. 26L</h5>
          </div>

          <div>
            <h5>Last Month</h5>

            <h5 style={{ color: "#2e29c4" }}>Rs. 50L</h5>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default PaymentGraph;
