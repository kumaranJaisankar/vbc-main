import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import orderBy from "lodash/orderBy";
// import leadStatusJson from "../leadStatus.json";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadExcelFile = (data, type, headers) => {
  var wb = XLSX.utils.book_new();
  var ws_name = "SheetJS";
  let dataModify = [...data.transactions];
  if (dataModify) {
    dataModify = orderBy(dataModify, ["id"], ["asc"]);
    dataModify = dataModify.map((row) => {
      // let addressTrim = `${row.house_no},${row.street},${row.area},${row.district},${row.pin_code}`;
      // let statusObj = leadStatusJson.find((s) => s.id == row.status);

      return {
        entity_id: row.entity_id,
        name:row.name,
        person:row.person,
        type:row.type,
        mode:row.mode,
        amount:row.amount,
        payment_date:row?.payment_date
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
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  XLSX.writeFile(wb, `Wallet${type === "csv" ? ".csv" : ".xlsx"}`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};
// Sailaja Renamed Excel file as Wallet on  14th July
//   pdf

export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
	const VBCLOGO = require("../../../../assets/images/vbclogo.png");
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 10;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  // const title = `${pdfTitle}`;

  let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
  let dataBody = tableData && tableData.transactions.map((elt) => {
    const data = columns.reduce((acc, colObj) => {
      if (colObj.dataKey === "radius")
        return {
          ...acc,
          [colObj.dataKey]: elt[colObj.dataKey].name,
        };
      else if (colObj.dataKey === "entity_id" && elt.entity_id) {
        return { ...acc, entity_id: elt.entity_id };
      } else if (colObj.dataKey === "credit_amount" && elt.credit_amount) {
        return { ...acc, credit_amount: elt.credit_amount };
      } else if (colObj.dataKey === "debit_amount" && elt.debit_amount) {
        return { ...acc, debit_amount: elt.debit_amount };
      } else if (colObj.dataKey === "type" && elt.type) {
        return { ...acc, type: elt.type };
      } else if (colObj.dataKey === "payment_date" && elt.payment_date) {
        return { ...acc, payment_date: elt.payment_date };
      } else if (colObj.dataKey === "payee" && elt.payee) {
        return { ...acc, payee: elt.payee };
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
    return data;
  });

  // let styledContent = {
  //   startY: 50,
  //   startX: 10,
  //   columnStyles: {
  //     id: { cellWidth: 40 },
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
  doc.text(40,40,"Wallet")
 
  
  
  // doc.setFontSize(13);
  // doc.text(title, marginLeft, 20,);
  // doc.setFillColor(0, 0, 255)
  // doc.addImage(VBCLOGO, 'PNG', 650, 22, 130, 80)


  doc.autoTable(styledContent);
  doc.save(`${fileName}.pdf`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};
