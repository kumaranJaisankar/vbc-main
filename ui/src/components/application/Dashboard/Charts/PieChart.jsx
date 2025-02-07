import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from "react-google-charts";

const PieChart = ({style, data, options}) => {
    return (
        <div>
            <Chart
                width={style.width}
                height={style.height}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={data}
                options={options}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    );
};

PieChart.propTypes = {

};

export default PieChart;