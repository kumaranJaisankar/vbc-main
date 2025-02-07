import React from "react";
import { Chart } from "react-google-charts";

const CustomerBYStatusNEW = () => {
  return (
    <>
      <Chart
        width={"100%"}
        height={"300px"}
        chartType="BarChart"
        loader={<div>{"Loading Chart"}</div>}
        data={[
          [
            "Element",
            "",
            { role: "style" },
            {
              sourceColumn: 1,
              role: "annotation",
              type: "string",
              calc: "stringify",
            },
          ],
          ["Active", 20, "#9fd84e", 20],
          ["Online", 12, "#60af50", 12],
          ["Offline", 14, "#7f7f7f", 14],
          ["Expired", 16, "#ae621b", 16],
          ["Deactive", 18, "#edc519", 18],
        ]}
        options={{
          height: 300,
          bar: { groupWidth: "70%" },
          backgroundColor: "transparent",
          legend: { position: "none" },
          hAxis: { textPosition: 'none' },
          // hAxis: {
          //   gridlines: {
          //     interval: 0
          //   }      
          // }
        
        }}
      />
    </>
  );
};

export default CustomerBYStatusNEW;
