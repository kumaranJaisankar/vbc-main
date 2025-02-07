import React from "react";
import PropTypes from "prop-types";
import ApexCharts from "react-apexcharts";

const PieChartDonuts = ({ series, categories, width }) => {
  const state = {
    series: series,
    options: {
      chart: {
        type: "donut",
        width: width ? width : 208,
      },
      stroke: {
        width: 0
      },
      plotOptions: {
        pie: {
          donut: {
            size: "80%",
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                // label: "CUSTOMERS ONLINE",
                color: "#263238",
                fontFamily: "Roboto",
                fontWeight: "700",
                fontSize: "13px",
              },
              name: {
                show: true,
                offsetY: 20,
                formatter: () => "TOTAL",
                fontSize: "12px",
              },
              value: {
                fontFamily: "Roboto",
                fontWeight: "700",
                offsetY: -25,
                fontSize: "45px",
              },
            },
          },
        },
      },
      labels: categories,
      //   theme: {
      //     palette: "palette4",
      //   },
      colors: ["#3EBFBE", "#FBBC5B", "#7E7E7E"],

      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "right",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: width ? width : 208,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div id="chart">
      <ApexCharts
        options={state.options}
        series={state.series}
        type="donut"
        height="300"
      />
    </div>
  );
};

PieChartDonuts.propTypes = {};

export default PieChartDonuts;
