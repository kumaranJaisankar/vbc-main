import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import orderBy from "lodash/orderBy";
// import leadStatusJson from "../leadStatus.json";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

export const downloadExcelFile = (data, type, headers) => {
  var wb = XLSX.utils.book_new();
  var ws_name = "SheetJS";
  var dataModify = [...data.payments];
  console.log(dataModify.concat,"datamodify")
  if (dataModify) {
    dataModify = orderBy(dataModify, ["id"], ["asc"]);
    dataModify = dataModify.map((row) => {
      return {
        username: row.userdata && row.userdata.username,
        name:row.userdata && row.userdata.name,
        franchise: row.franchise,
        payment_id: row.payment_id,
        mobile_number: row.userdata && row.userdata.mobile_number,

        pickup_type: row.pickup_type,
        // online_payment_mode:row.online_payment_mode,
        amount: row.amount,
        due_amount: row.due_amount,
        status:row.status,
        collected_by: row.collected_by,
        completed_date: row.completed_date,
      };
    });
  }
  const headerKeys = Object.keys(dataModify[0]);
  const requiredHeaderKeys = headers;
  let newDataModify = dataModify.map((item) => {
    let newItem = {};
    requiredHeaderKeys.forEach(
      (requiredKey) => (newItem[requiredKey] = item[requiredKey])
    );
    return newItem;
  });
  const ws_data = newDataModify;
  console.log(ws_data);
  var ws = XLSX.utils.json_to_sheet(ws_data, { header: headers });
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  XLSX.writeFile(wb, `Payments${type === "csv" ? ".csv" : ".xlsx"}`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};
//Sailaja Changed Excel & CSV File Name as Payments (47th Line ) on 14th July
//   pdf
//pdf changes made by Marieya

export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
	// const VBCLOGO = require("../../../../assets/images/vbclogo.png");
  console.log(headersForPDF);
  const unit = "pt";
  const size = "A2"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);


  let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
  let dataBody = tableData.payments.map((elt) => {
    const data = columns.reduce((acc, colObj) => {
      if (colObj.dataKey === "radius")
        return {
          ...acc,
          [colObj.dataKey]: elt[colObj.dataKey].name,
        };
      else if (colObj.dataKey === "mobile_number" && elt.userdata) {
        return { ...acc, mobile_number: elt.userdata.mobile_number };
      }
      else if (colObj.dataKey === "completed_date" && elt.completed_date){
        return { ...acc,completed_date: moment(elt.completed_date).format('DD-MMM-YY')}
        
              }
      else if (colObj.dataKey === "name" && elt.userdata) {
        return { ...acc, name: elt.userdata.name };
      }
      else if (colObj.dataKey === "username" && elt.userdata) {
        return { ...acc, username: elt.userdata.username };
      } else return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
    }, {});
    console.log(data);
    return data;
  });
  console.log(dataBody);

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
  // doc.text(350,20,"Billing Report",)
  // doc.line(35, 65, 160, 65);
  // doc.setFontSize(13);
  doc.text(40,40,"Billing Information");
  // doc.line(35, 65, 160, 65);
  // doc.text(title, marginLeft, 10);
  // doc.setFillColor(0, 0, 255)
  // doc.addImage(VBCLOGO, 'PNG', 650, 22, 130, 80);
  // const title = `${pdfTitle}`;

	// doc.text(title, marginLeft, 20);
  doc.autoTable(styledContent);
  doc.save(`${fileName}.pdf`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};
// billing export changes by Marieya