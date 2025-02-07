import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from "react-google-charts";

const PieChartWithColor = ({value, options, maxTotal, type}) => {
    return (
        <div style={{margin: 'auto'}}>
             <Chart
                width={120}
                height={120}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['Task', 'Hours per Day'],
                    [type, value],
                    ['total count', maxTotal],
                  ]}
                options={options}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    );
};

PieChartWithColor.propTypes = {
    
};

export default PieChartWithColor;