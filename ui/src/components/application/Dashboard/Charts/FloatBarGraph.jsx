import React from "react";
import ReactDOM from "react-dom";
import { Bar } from "react-chartjs-2";

const FloatBarGraph = ({labels, series, columnWidth}) => {
    const data= {
        labels: [...labels],
        datasets: [...series]
      }
    const options = {
      responsive: true,
      // cornerRadius: 40,
      legend: {
        display: true,
        position:'right'
      },
      // type: "bar",
        scales: {
          xAxes: [{
              stacked: true
          }],
          yAxes: [{
              stacked: true
          }]
      },
      // corners: 'round',
      // cornersRoundRadius: 50,
     
    };

    return (
      <Bar
        data={data}
        options={options}
        // width={20}
        // options={{ maintainAspectRatio: false }}
      
      />
    );
  }

export default FloatBarGraph;

