import React from "react";
export const getNetworkReportTableColumn = () => {
  const customerRepotsTableColumns = [
    {
      name: <b className="Table_columns"> {"Name"}</b>,
      selector: "name",
      sortable: true,
    },
    {
      name:<b className="Table_columns">{"Consumed (%)"} </b> ,
      selector: "utilization_percent",
      sortable: true,
    },
  ];
  return customerRepotsTableColumns;
};
