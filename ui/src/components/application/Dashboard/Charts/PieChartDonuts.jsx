import React from 'react';
import ApexCharts from "react-apexcharts";
import {timeConvert} from '../Common/timeConvert';

const PieChartDonuts = ({series, categories, label, colors, dataLabel, height=300, categoriesByStatus}) => {
    const state = {
        series: series,
        options: {
            chart: {
                type: 'donut',
                width: 380,
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                   
                    if(dataLabel){
                        return timeConvert(w.config.series[seriesIndex]);
                    }else{
                        return val.toFixed(2) + "%"
                    }

                }
              },
              stroke: {
                width: 0
              },
              tooltip: {
                custom: function({series, seriesIndex, dataPointIndex, w}) {
                    if(dataLabel){
                        return '<div class="arrow_box">' +
                        '<span>'+ w.config.labels[seriesIndex] +': ' + timeConvert(w.config.series[seriesIndex]) + '</span>' +
                        '</div>'
                    }else if(categoriesByStatus){
                        let categories = categoriesByStatus[w.config.labels[seriesIndex]].join(',');
                        return '<div class="arrow_box lead-with-categories">' +
                        '<span>'+ w.config.labels[seriesIndex] +': ' + w.config.series[seriesIndex] + '</span>' +
                        '<p>Categories: '+ categories + '</p>' +
                        '</div>'
                    }else{
                        return '<div class="arrow_box">' +
                        '<span>'+ w.config.labels[seriesIndex] +': ' + w.config.series[seriesIndex] + '</span>' +
                        '</div>'
                    }
        
                }
              },
            plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        showAlways: true,
                        show: label ? false :true,
                        label:  'New leads',
                        color: '#9AA1A9',
                        fontFamily: 'Roboto',
                        fontSize:'14px',
                      }
                    },
                    value: {
                        show: true,
                        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                         
                            if(dataLabel){
                                return timeConvert(w.config.series[seriesIndex]);
                            }else{
                                return val + "%"
                            }
        
                        }
                      },
                  }
                }
              },
              labels: categories,
              colors : colors,
              legend: {
                position: 'bottom'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 380
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },


    };


    return (
        <div id="chart">
            <ApexCharts options={state.options} series={state.series} type="donut"  height={height ? height : 300}/>
        </div>)

    }

    PieChartDonuts.propTypes = {

    };

    export default PieChartDonuts;