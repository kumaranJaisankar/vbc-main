import React from 'react';
import PropTypes from 'prop-types';
import ApexCharts from "react-apexcharts";
import { SelectMonth } from '../../../../constant';

const BarsWithValue = props => {
  const {categories, series, dataLabelsPosition, hideYAxis, hideXAxis, horizontal, seriesName, 
    offsetYPositin,offsetX , colorsData,dataLabelColor,tooltipTitleHide,grid,gridxaxis, gridyaxis, 
    dataLabelsVisible, yaxisSufix, yaxisTicks, selectedMonth, columnWidth} = props.graphData;

    const info = {
        options: {
          plotOptions: {
            bar: {
              dataLabels: {
                position: dataLabelsPosition? dataLabelsPosition : 'top' // top, center, bottom
              },
              horizontal: horizontal ? horizontal :false,
              columnWidth: columnWidth ? columnWidth+'%' : '35%',
            }
          },
          tooltip: {
            custom: function({series, seriesIndex, dataPointIndex, w}) {
              if(selectedMonth){
                return '<div class="tooltip-arrow_box">' +
                '<span>' + w.globals.labels[dataPointIndex] + '-'+ selectedMonth +': '+ series[seriesIndex][dataPointIndex] + '</span>' +
                '</div>';
              }else{
                return '<div class="tooltip-arrow_box">' +
                '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
                '</div>';
              }
            
            }
          },
          dataLabels: {
            enabled: dataLabelsVisible ? false : true,
            textAnchor: 'middle',
            formatter: function (val, opt) {
              return horizontal ? opt.w.globals.labels[opt.dataPointIndex] : Number(val).toLocaleString();
            },
            // offsetX: offsetX ? offsetX : 0,
            // offsetY: offsetYPositin ? offsetYPositin : -20,
            // offsetX : 0,
            // offsetY : 0,
            offsetY : -20,
            style: {
              fontSize: "12px",
              colors: dataLabelColor ? dataLabelColor : ["#87a4d8"]
            }
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
                type: "solid",
                gradient: {
                  colorFrom: "#D8E3F0",
                  colorTo: "#BED1E6",
                  stops: [0, 100],
                  opacityFrom: 1,
                  opacityTo: 1
                }
              }
            },
           
          },
          fill: {
            gradient: {
              shade: "light",
              type: "horizontal",
              shadeIntensity: 1,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
            },
            colors: colorsData ? colorsData :['#87a4d8', '#87a4d8', '#87a4d8']
          },
          yaxis: {
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: yaxisTicks ? yaxisTicks : false
            },
            labels: {
              show: hideYAxis ? false : true,
              formatter: (val)=> {
                return Number(val).toLocaleString() + (yaxisSufix ? yaxisSufix : '');
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

BarsWithValue.defaultProps = {
  grid: false,
  gridxaxis: false,
  gridyaxis: false
};

BarsWithValue.propTypes = {
    
};

export default BarsWithValue;