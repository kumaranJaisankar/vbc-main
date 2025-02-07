import React, { useState, useEffect } from "react";
import moment from "moment";
import { iptvaxios } from "../../../../axios";
import DataTable from "react-data-table-component";

const BouquetTable = (props) => {
 
  const [bouquets, setBouquets] = useState([]);
  useEffect(() => {
    iptvaxios
      .get("/api/bouquet/getBouquets")
      .then((res) => setBouquets(res.data))
      .catch((err) => console.log(err));
  }, [props.refresh]);

  const TableColumns = [
    {
      name: "ID",
      selector: "id",
      //   sudha
      cell: (row) => (
        <>
          <a
            onClick={() => props.openCustomizer("3", row)}
            className="openmodal"
          >
            BO{row.id}
          </a>
        </>
      ),
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Type",
      sortable: true,
      cell: (row) => {
        return <div>{row.bouquetType ? "Broadcastor" : "MSO"}</div>;
      },
    },
    {
      name: "Status",
      sortable: true,
      cell: (row) => {
        return <div>{row.status ? "ACTIVE" : "INACTIVE"}</div>;
      },
    },
    {
      name: "Channel Count",
      sortable: true,
      cell: (row) => {
        return <div>{row.channels.length}</div>;
      },
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
    },
    {
      name: "Created Date",
      sortable: true,
      cell: (row) => {
        return <div>{moment(row.createdDate).format("DD MMM YYYY")}</div>;
      },
    },
    {
      name: "Created By",
      sortable: true,
      selector: "createdBy",
    },
  ];

  return (
    <>
      <DataTable
        className="customer-list"
        columns={TableColumns}
        data={bouquets}
        pagination
      />

     
    </>
  );
};
export default BouquetTable;
