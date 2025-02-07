import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import orderBy from "lodash/orderBy";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from 'moment';
export const downloadExcelFile = (data, type, headers) => {
  var wb = XLSX.utils.book_new();
  var ws_name = "SheetJS";
  let dataModify = [...data];
  console.log(dataModify.concat, "datamodify")
  if (dataModify) {
    dataModify = orderBy(dataModify, ["id"], ["asc"]);
    dataModify = dataModify.map((row) => {
      let d = new Date(row.assigned_date ? row.assigned_date : '-')
      let p = new Date(row.open_date ? row.open_date : "-")

      // if (row.status) {
      //   statustic = ticketStatusNew?.find((ticket) => ticket.id == row.status)?.name;
      // }
      const watchlistsUsers = row.watchlists.map((list) => list.user.username);
      //mob no keyname changed by marieya
      return {
        id: row.id,
        // opened_by:row.opened_by.username,
        ticket_category: row.ticket_category?.category,
        sub_category: row.sub_category?.name,
        priority_sla: row.priority_sla?.name,
        open_date: row.open_date && (p.getFullYear() + "-" + (p.getMonth() + 1) + "-" + p.getDate()),
        open_for: row.open_for,
        mobile_number: row?.mobile_number,
        assigned_date: row.assigned_date && (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()),
        status_name: row.status_name,
        customer_notes: row.customer_notes,
        notes: row.notes,
        zone: row?.zone.name,
        area: row?.area.name,
        name: row?.name,
        created_by: row.created_by.username,
        assigned_to: row.assigned_to?.username,
        closed_by: row.closed_by?.username,
        resolved_by: row?.resolved_by?.username,
        branch: row.branch.name,
        franchise: row.franchise?.name,
        watchlists: watchlistsUsers.join(","),
      };
    });
  }
  // const headerKeys = Object.keys(dataModify[0]);
  // const requiredHeaderKeys = headers;
  // let newDataModify = dataModify.map((item) => {
  //   let newItem = {};
  //   requiredHeaderKeys.forEach(
  //     (requiredKey) => (newItem[requiredKey] = item[requiredKey])
  //   );
  //   return newItem;
  // });

  //Marieya changed export api for helpdesk reports and complaints
  // Sailaja Renamed  Complaints module post download  Excel & CSV file names on 27th JULY
  {/*Marieya added line 53 for xlsx format headers */ }
  // const ws_data = newDataModify;
  // console.log(ws_data);
  // var ws = XLSX.utils.json_to_sheet(ws_data, { header: headers });

	const headerKeys = headers.map(header => header[0]);
	const headerLabels = headers.map(header => header[1]);
	let newDataModify = dataModify.map(item => {
		let newItem = {};
		headerKeys.forEach((key, index) => newItem[headerLabels[index]] = item[key]);
		return newItem;
	});
	var ws = XLSX.utils.json_to_sheet(newDataModify, { header: headerLabels });
  // XLSX.utils.sheet_add_aoa(ws, [["Ticket ID", "Customer ID", "Mobile", "Complaint Status","Name","Category","Sub Category","Opened Date","Closed Date","Zone","Area","Assigned By","Assigned To","Resolved By","Closed By","Notes"]], { origin: "A1" });
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  XLSX.writeFile(wb, `Complaints${type === "csv" ? ".csv" : ".xlsx"}`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};

//   pdf

export const downloadPdf = (pdfTitle, headersForPDF, tableData, ticketStatus) => {
  const VBCLOGO = require("../../../../assets/images/vbclogo.png");
  // Sailaja Fixed  Complaints PDF column alignment on 27th July
  console.log(headersForPDF);
  console.log(tableData, "tabledata");
  const unit = "pt";
  const size = "A2"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 10;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  const title = `${pdfTitle}`;


  let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
  let dataBody = tableData.map((elt) => {
    const data = columns.reduce((acc, colObj) => {
      if (colObj.dataKey === "radius")
        return {
          ...acc,
          [colObj.dataKey]: elt[colObj.dataKey].name,
        };

      else if (colObj.dataKey === "opened_by" && elt.opened_by) {
        return { ...acc, opened_by: elt.opened_by.username };
      } else if (colObj.dataKey === "ticket_category" && elt.ticket_category) {
        return { ...acc, ticket_category: elt.ticket_category.category };
      } else if (colObj.dataKey === "sub_category" && elt.sub_category) {
        return { ...acc, sub_category: elt.sub_category.name };
      } else if (colObj.dataKey === "resolved_by" && elt.resolved_by) {
        return { ...acc, resolved_by: elt.resolved_by.name };
      } else if (colObj.dataKey === "assigned_to" && elt.assigned_to) {
        return { ...acc, assigned_to: elt.assigned_to?.name };
      } else if (colObj.dataKey === "closed_by" && elt.closed_by) {
        return { ...acc, closed_by: elt.closed_by?.name };
      } else if (colObj.dataKey === "created_by" && elt.created_by) {
        return { ...acc, created_by: elt.created_by?.name };
      } else if (colObj.dataKey === "priority_sla" && elt.priority_sla) {
        return { ...acc, priority_sla: elt.priority_sla.name };

      }

      else if (colObj.dataKey === "franchise" && elt.franchise) {
        return { ...acc, franchise: elt.franchise.name };

      } else if (colObj.dataKey === "branch" && elt.branch) {
        return { ...acc, branch: elt.branch.name };

      } else if (colObj.dataKey === "area" && elt.area) {
        return { ...acc, area: elt.area.name };

      } else if (colObj.dataKey === "zone" && elt.zone) {
        return { ...acc, zone: elt.zone.name };

      }
      else if (colObj.dataKey === "watchlists" && elt.watchlists) {
        console.log(
          elt.watchlists.map((item) => item.user.username),
          "watchlistitem"
        );

        return {
          ...acc,
          watchlists: elt.watchlists
            .map((item) => item.user.username)
            .join(","),
        };
      }
      else if (colObj.dataKey === "status" && elt.status_name) {
        const status = `${elt.status_name}`;
        console.log(status, "Status Check");
        return {
          ...acc,
          status,
        };

      }


      else if (colObj.dataKey === "open_date" && elt.open_date) {
        return { ...acc, open_date: moment(elt.open_date).format('DD MMM YY') }
      }
      else if (colObj.dataKey === "assigned_date" && elt.assigned_date) {
        return { ...acc, assigned_date: moment(elt.assigned_date).format('DD MMM YY') }
      }
      else if (colObj.dataKey === "closed_date" && elt.closed_date) {
        return { ...acc, closed_date: moment(elt.closed_date).format('DD MMM YY') }
      }

      else return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
    }, {});
    console.log(data);
    return data;
  });
  console.log(dataBody, "statuscheck");

  // let styledContent = {
  //   startY: 50,
  //   startX: 10,
  //   columnStyles: {
  // 	id: { cellWidth: 40 },

  //   },
  //   body: dataBody,
  //   columns,
  // };
  let styledContent = {
    startY: 50,
    startX: 30,
    columnStyles: {
      id: { cellWidth: 40 },
    },
    body: dataBody,
    columns,
    // headStyles: { fillColor: [20, 20, 20] },
  };

  // doc.setFontSize(20);
  doc.text(40, 40, "Tickets");
  // doc.setFontSize(13);
  //   doc.text(title, marginLeft, 10,);
  // doc.setFillColor(0, 0, 255);
  // doc.addImage(VBCLOGO, "PNG", 650, 22, 130, 80);

  // Sailaja Fixed  Helpdesk Reports  post download  PDF file name on 27th JULY
  doc.autoTable(styledContent);
  doc.save(`Tickets.pdf`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};
