import React from "react";
import ChartistGraph from "react-chartist";
const NetworkGraph = () => {
  const chart1 = {
    fullWidth: true,
    // axisX: { showGrid: false },
    axisX: {
      // showGrid: false
    },
    axisY: {
      // showGrid: false,
      showLabel: false,
      offset: 0
    },
  };
  return (
    <>
      <ChartistGraph
        key="1"
        className="ct-6 flot-chart-container"
        data={{
          labels: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
          ],
          series: [
            [5, 3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
            [3, 4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3],
          ],
        }}
        type={"Line"}
        listener={{
          draw: function (data) {
            if (data.type === "line" || data.type === "area") {
              data.element.animate({
                d: {
                  begin: 2000 * data.index,
                  dur: 2000,
                  from: data.path
                    .clone()
                    .scale(1, 0)
                    .translate(0, data.chartRect.height())
                    .stringify(),
                  to: data.path.clone().stringify(),
                },
              });
            }
          },
        }}
        options={chart1}
      />
    </>
  );
};

export default NetworkGraph;
