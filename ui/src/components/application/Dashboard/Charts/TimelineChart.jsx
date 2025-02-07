
import React from 'react';
import PropTypes from 'prop-types';
import ApexCharts from "react-apexcharts";

const TimelineChart = ({ style, data, options }) => {

    const state = {

        series: [...data],
        options: {
            chart: {
                height: 'auto',
                type: 'rangeBar',
                toolbar: { show: false },
                parentHeightOffset: 0,
                sparkline: {
                    enabled: true
                  }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '50%',
                    rangeBarGroupRows: true
                }
            },
            colors: [
                "#FF843F", "#FFCAAB", "#FDAD80", "#CF865E", "#95481D",
                "#FF5C00", "#B78C73", "#D4526E", "#8D5B4C", "#F86624",
                "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
            ],
            fill: {
                type: 'solid'
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    offsetY: 0,
                    show: false,
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },

                labels: {
                    offsetY: 0,
                    show: false,
                    formatter: (val) => {
                        return Number(val).toLocaleString();
                    }
                }
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            },
            legend: {
                show: false,
                position: 'right'
            },
            tooltip: {
                custom: function (val, opts) {
                    const name = val.w.config.series[val.seriesIndex].name;
                    const count = val.seriesIndex ==0 ? val.series[val.seriesIndex][0] : val.series[val.seriesIndex][0] - val.series[val.seriesIndex-1][0]
                    return (
                       `${name}: ${count} `
                    )
                }
            }
        },


    };


    return (
        <div id="chart">
            <ApexCharts options={state.options} series={state.series} type="rangeBar" height={180} />
        </div>
    );
};

TimelineChart.propTypes = {

};

export default TimelineChart;



