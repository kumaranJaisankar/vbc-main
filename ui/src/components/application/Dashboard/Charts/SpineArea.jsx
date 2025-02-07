import React from 'react';
import PropTypes from 'prop-types';
import ApexCharts from "react-apexcharts";

const months= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


const SpineArea = props => {
  const {series, categories, toolbarShow, month} = props;
    const info =  {
        series: series,
        options: {
          chart: {
            height: 370,
            type: 'area',
            toolbar:{
              show: toolbarShow ? true : toolbarShow
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: false,
            curve: 'smooth'
          },
          xaxis: {
            categories: categories,
            axisBorder: {
              show: true
            },
            axisTicks: {
              show: false
            },
          },
          yaxis:{
            axisBorder: {
              show: true
            },
            axisTicks: {
              show: false
            },
            labels: {
              formatter: function (value) {
                let val = value < 1 ? value.toFixed(2) : value;
                return val + " Gb".replace(/\.00$/,'');
              },
              style: {
                colors: '#000000',
              }
            },
          },
          grid: {
            show: true,
            borderColor: '#e8e8e8',
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
                lines: {
                    show: true,
                    
                }
            },   
            yaxis: {
                lines: {
                    show: true,
          
                }
            },  
          
        },
          tooltip: {
            enabled: true,
    
    
          },
          colors:['#ff94a4', '#6157D9'],
          legend: {
            floating: true,
            position: 'top',
            markers: {
              customHTML: function() {
                return '<span class="custom-marker"></span>'
              }
          }
        }
        },
      
      
      };
    
    return (
        <div id="chart">
        <ApexCharts options={info.options} series={info.series} type="area" height={370} />
      </div>
    );
};

SpineArea.propTypes = {
    
};

export default SpineArea;