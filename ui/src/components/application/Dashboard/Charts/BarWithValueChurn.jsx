import React from 'react';
import PropTypes from 'prop-types';
import ApexCharts from "react-apexcharts";

const BarsWithValueChurn = props => {
  const {categories, series, dataLabelsPosition, hideYAxis, hideXAxis, horizontal, seriesName, 
    offsetYPositin,offsetX , colorsData,dataLabelColor,tooltipTitleHide,grid,gridxaxis, gridyaxis, dataLabelsVisible} = props.graphData;
    
    const info = {
        options: {
          plotOptions: {
            bar: {
              dataLabels: {
                position: dataLabelsPosition? dataLabelsPosition : 'top' // top, center, bottom
              },
              horizontal: horizontal ? horizontal :false,
            }
          },
          dataLabels: {
            enabled: dataLabelsVisible ? false : true,
            textAnchor: 'start',
            formatter: function (val, opt) {
              return horizontal ? opt.w.globals.labels[opt.dataPointIndex] : Number(val).toLocaleString();
            },
            // offsetX: offsetX ? offsetX : 0,
            // offsetY: offsetYPositin ? offsetYPositin : -20,
            offsetX : 0,
            offsetY : 0,
            // offsetY : -20,
            style: {
              fontSize: "12px",
              colors: dataLabelColor ? dataLabelColor : ["#E31818"]
            }
          },
          xaxis: {
            categories: categories,
            position: "bottom",
            labels: {
              offsetY: 0,
              show: hideXAxis ? false : true,
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs_: {
              fill: {
                type: "gradient",
                gradient: {
                  colorFrom: "#D8E3F0",
                  colorTo: "#BED1E6",
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5
                }
              }
            },
            // tooltip: {
            //   enabled: false,
            //   offsetY: -35,
            //     custom: function({series, seriesIndex, dataPointIndex, w}) {
            //       return '<div class="arrow_box">' +
            //         '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
            //         '</div>'
            //     },
            //     x: {
            //       formatter: function(val) {
            //         return ''
            //       },
            //       title: {
            //         formatter: function (seriesName) {
            //           if(tooltipTitleHide){
            //             return '';
            //           }else{
            //             return seriesName;
            //           }
            //         }
            //       }
            //     }
            // }
          },
          fill: {
            gradient: {
              shade: "light",
              type: "horizontal",
              shadeIntensity: 1,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 0,
              opacityTo: 0,
              stops: [0]
            },
            colors: colorsData ? colorsData :['#E8E8E8', '#FFCAAB', '#FFCAAB']
          },
          yaxis: {
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            labels: {
              show: hideYAxis ? false : true,
              formatter: (val)=> {
                return Number(val).toLocaleString();
              }
            }
          },
          chart: {
            animations: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          grid: {
            show: grid,
            borderColor: '#90A4AE',
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
                lines: {
                    show: gridxaxis
                }
            },   
            yaxis: {
                lines: {
                    show: gridyaxis
                }
            },  
        }
      },
        series: [
          {
            name: seriesName ? seriesName : "leads",
            data: series
          }
        ]
      };
    return (
        <div>
              <ApexCharts  
              options={info.options}
          series={info.series}
          type="bar"
          height="300"
          ClassName="bars-with-value"/>
        </div>
    );
};

BarsWithValueChurn.defaultProps = {
  grid: false,
  gridxaxis: false,
  gridyaxis: false
};

BarsWithValueChurn.propTypes = {
    
};

export default BarsWithValueChurn;