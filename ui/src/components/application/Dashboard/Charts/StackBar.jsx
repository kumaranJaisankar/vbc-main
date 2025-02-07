import React from 'react';
import PropTypes from 'prop-types';
import ApexCharts from "react-apexcharts";

const StackBar = ({ categories, series, columnWidth }) => {

  const state = {

    series: [{
      name: 'Tickets',
      data: [...series]
    }],
    options: {
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'bottom' // top, center, bottom
          },
          horizontal: false,
          columnWidth: columnWidth ? columnWidth + '%' : '10%',
        }
      },
      dataLabels: {
        position: 'top',
        enabled: true,
        textAnchor: 'start',
        style: {
          fontSize: '10pt',
          colors: ['#000']
        },
        offsetX: -50,
        horizontal: true,
        dropShadow: {
          enabled: false
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":-  " + val;
        },
      },
      colors: ['#FF843F'],
      chart: {
        type: 'bar',
        height: 280,
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      xaxis: {
        categories: [...categories],
        position: "bottom",
        labels: {
          offsetY: 0,
          show: false,
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
      },
      yaxis: {
        lines: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,

        }
      },
      fill: {
        opacity: 1
      },

      grid: {
        show: false,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          },

        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'darken',
            value: 0.35,
          }
        },
      },

    },
  };


  return (
    <div id="chart">
      <ApexCharts options={state.options} series={state.series} type="bar" height={280} />
    </div>
  );
};

StackBar.propTypes = {

};

export default StackBar;