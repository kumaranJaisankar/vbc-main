import React from "react";
import MoreActions from "../../../common/CommonMoreActions";

export const getofferListsTableColumns = ({}) => {
  const offerListsTableColumns = [
    // {
    //   name: "",
    //   selector: "action",
    //   width: "80px",
    //   center: true,
    //   cell: (row) => (
    //     <MoreActions
    //     />
    //   ),
    // },
    // {
    //   name: <b className="Table_columns">{"ID"}</b>,
    //   selector: "id",
    //   sortable: false,
    //   cell: (row) =>{
    //    return( <span>O{row.id}</span>
    //    )
    //   }
    // },
    {
      name: <b className="Table_columns">{"Offer Name"}</b>,
      selector: "name",
      cell: (row) => <span>{row.name}</span>,
      sortable: false,
    },
    // added condition for time unit and Valid for by Marieya on 17/8/22
    {
      name: (
        <b className="Table_columns" id="columns_width">
          {"Time Unit"}
        </b>
      ),
      selector: "time_unit",
      sortable: false,
      cell: (row) => {
        return (
          <span id="columns_width">
            {row.time_unit + " "}
            {row.time_unit === 1 ? "Month" : "Months"}
          </span>
        );
      },
    },
    {
      name: (
        <b className="Table_columns" id="columns_width">
          {"Valid For"}
        </b>
      ),
      sortable: false,
      cell: (row) => {
        return (
          <span id="columns_width">
            {row.valid_for_time_unit + " "}
            {row.valid_for_time_unit === 1 ? "Month" : "Months"}
          </span>
        );
      },
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
  ];

  return offerListsTableColumns;
};

export const unitTypeStatus = [
  {
    id: "day",
    name: "day(s)",
  },
  {
    id: "mon",
    name: "month(s)",
  },
  {
    id: "hrs",
    name: "hour(s)",
  },
];
