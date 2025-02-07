import React from 'react';
import PropTypes from 'prop-types';
import ApexCharts from "react-apexcharts";

const MixMultipleLine = ({catagories, avgSeries, grossSeries, columnWidth}) => {
    var info = {
        series: [{
        name: 'Gross',
        type: 'column',
        data: [...grossSeries]
      }, {
        name: 'Avg gross',
        type: 'column',
        data: [...avgSeries]
      }, {
        name: '',
        type: 'line',
        data: [...grossSeries]
      }],
      options:{
        plotOptions: {
          bar: {
            columnWidth: columnWidth,
          }
        },
        chart: {
        height: 200,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#87a4d8', '#b9d0f8', '#87a4d8'],
      stroke: {
        width: [1, 1, 4],
        curve: 'smooth',
        dashArray: [0, 0, 20]
      },
      title: {
        text: '',
        align: 'left',
        offsetX: 110
      },
      xaxis: {
        categories: [...catagories],
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#000000'
          },
          labels: {
            formatter: function (value) {
              return value + "k";
            },
            style: {
              colors: '#000000',
            }
          },
          title: {
            text: "",
            style: {
              color: '#000000',
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: 'Gross',
          opposite: false,
          show: false,
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
            color: '#FF843F'
          },
          labels: {
            formatter: function (value) {
              return value + "k";
            },
            style: {
              colors: '#FF843F',
            }
          },
          title: {
            text: "",
            style: {
              color: '#FF843F',
            }
          },
        },
        {
          seriesName: 'Gross line',
          opposite: false,
          show: false,
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
            color: '#FF843F'
          },
          labels: {
            style: {
              colors: '#FF843F',
            },
          },
          title: {
            text: "",
            style: {
              color: '#FF843F',
            }
          }
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 40
      }
    },
      };
    return (
        <div>
            <ApexCharts  
            options={info.options}
          series={info.series}
          type="line"
          height="300"/>
        </div>
    );
};

MixMultipleLine.propTypes = {
    
};

export default MixMultipleLine;
