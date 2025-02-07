import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import orderBy from "lodash/orderBy";
// import leadStatusJson from "../leadStatus.json";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadExcelFile = (data, type, headers) => {
  var wb = XLSX.utils.book_new();
  var ws_name = "SheetJS";
  let dataModify = [...data];
  if (dataModify) {
    dataModify = orderBy(dataModify, ["id"], ["asc"]);
    dataModify = dataModify.map((row) => {
      // let addressTrim = `${row.house_no},${row.street},${row.area},${row.district},${row.pin_code}`;
      // let statusObj = leadStatusJson.find((s) => s.id == row.status);

      return {
        opening_balance: row.opening_balance,
        credit_amount: row.credit_amount,
        debit_amount: row.debit_amount,
        type: row.type,
        payment_date: row.payment_date,
        person: row.person,
        service: row?.service,
        wallet_amount: row.wallet_amount,
      };
    });
  }
  // const requiredHeaderKeys = headers;
  // let newDataModify = dataModify.map((item) => {
  //   let newItem = {};
  //   requiredHeaderKeys.forEach(
  //     (requiredKey) => (newItem[requiredKey] = item[requiredKey])
  //   );
  //   return newItem;
  // });
  // const ws_data = newDataModify;
  // console.log(ws_data);
  // var ws = XLSX.utils.json_to_sheet(ws_data, { header: headers });
  const headerKeys = headers.map((header) => header[0]);
  // Extract the frontend labels from the headers array
  const headerLabels = headers.map((header) => header[1]);

  let newDataModify = dataModify.map((item) => {
    let newItem = {};
    headerKeys.forEach(
      (key, index) => (newItem[headerLabels[index]] = item[key])
    );
    return newItem;
  });

  var ws = XLSX.utils.json_to_sheet(newDataModify, { header: headerLabels });
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  XLSX.writeFile(wb, `Spark Radius${type === "csv" ? ".csv" : ".xlsx"}`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};

//   pdf

export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
  console.log(tableData,"testdata")
  const VBCLOGO = require("../../../../../assets/images/vbclogo.png");
  console.log(headersForPDF);
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  const title = `${pdfTitle}`;

  // const address1 = `${address}`

  let columns = headersForPDF.map((h) => ({
    pdfTitle,
    header: h[1],
    dataKey: h[0],
  }));
  console.log(tableData,"tableData")
  let dataBody = tableData.map((elt) => {
    const data = columns.reduce((acc, colObj) => {
      if (colObj.dataKey === "radius")
        return {
          ...acc,
          [colObj.dataKey]: elt[colObj.dataKey].name,
        };
      else if (colObj.dataKey === "opening_balance" && elt.opening_balance) {
        return { ...acc, opening_balance: elt.opening_balance };
      } else if (colObj.dataKey === "credit_amount" && elt.credit_amount) {
        return { ...acc, credit_amount: elt.credit_amount };
      } else if (colObj.dataKey === "debit_amount" && elt.debit_amount) {
        return { ...acc, debit_amount: elt.debit_amount };
      } else if (colObj.dataKey === "type" && elt.type) {
        return { ...acc, type: elt.type };
      } else if (colObj.dataKey === "payment_date" && elt.payment_date) {
        return { ...acc, payment_date: elt.payment_date };
      } else if (colObj.dataKey === "person" && elt.person) {
        return { ...acc, person: elt.person };
      } else if (colObj.dataKey === "wallet_amount" && elt.wallet_amount) {
        return { ...acc, wallet_amount: elt.wallet_amount };
      } else if (colObj.dataKey === "address" && elt.address) {
        const address = `${elt.address.house_no},${elt.address.street},${elt.address.landmark},${elt.address.city},${elt.address.district},${elt.address.state},${elt.address.country},${elt.address.pincode}`;
        return {
          ...acc,
          address,
        };
      } else return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
    }, {});
    console.log(data);
    return data;
  });
  console.log(dataBody);

  let styledContent = {
    startY: 200,
    startX: 70,
    columnStyles: {
      id: { cellWidth: 40 },
    },
    body: dataBody,
    columns,
    headStyles: { fillColor: [20, 20, 20] },
  };
  // doc.setTextColor(255, 0, 0);
  doc.setFontSize(20);
  doc.text(350, 20, "Ledger Report");
  doc.line(35, 65, 160, 65);
  doc.setFontSize(13);
  doc.text(35, 60, "Franchise Information");
  doc.line(35, 65, 160, 65);
  doc.setFontSize(13);
  doc.text(title, marginLeft, 10);
  // doc.autoTable(content);
  doc.setFillColor(0, 0, 255);
  doc.addImage(VBCLOGO, "PNG", 650, 22, 130, 80);
  doc.autoTable(styledContent);
  doc.save(`${fileName}.pdf`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};
