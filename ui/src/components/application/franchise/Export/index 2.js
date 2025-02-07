import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import orderBy from "lodash/orderBy";
// import leadStatusJson from "../leadStatus.json";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from 'moment';

export const downloadExcelFile = (data, type, headers) => {
  var wb = XLSX.utils.book_new();
  var ws_name = "SheetJS";
  let dataModify = [...data];
  if (dataModify) {
    dataModify = orderBy(dataModify, ["id"], ["asc"]);
    dataModify = dataModify.map((row) => {
      // let addressTrim = `${row.house_no},${row.street},${row.area},${row.district},${row.pin_code}`;
      // let statusObj = leadStatusJson.find((s) => s.id == row.status);
      let addressTrim = `${row.address.house_no},${row.address.street},${row.address.landmark},${row.address.city},${row.address.district},${row.address.state},${row.address.pincode},${row.address.country}`;
      let created = new Date(row.created_at);
      let updated = new Date(row.updated_at)
      return {
        id: row.id,
        name: row.name,
        code: row.code,
        wallet_amount:row.wallet_amount,
        renewal_amount:row.renewal_amount,
        customer_count:row.customer_count,
        type: row.type.name,
        address: addressTrim,
        // revenue_sharing: row.revenue_sharing,
        // type: row.type.name,
        status: row.status.name,
        // status: statusObj.name,
        // renewal_bal: row.renewal_bal,
        // outstanding_bal:row.outstanding_bal,
        sms_gateway_type: row.sms_gateway_type.name,
        // sms_balance:row.sms_balance,
        created_at:(created.getFullYear() + "-" +  (created.getMonth() + 1) + "-" +  created.getDate()),
        updated_at:(updated.getFullYear() + "-" +  (updated.getMonth() + 1) + "-" +  updated.getDate()),

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
  XLSX.writeFile(wb, `Spark Radius${type === "csv" ? ".csv" : ".xlsx"}`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};

//   pdf

export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
	const VBCLOGO = require("../../../../assets/images/vbclogo.png");

  console.log(headersForPDF);
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 10;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  // const title = `${pdfTitle}`;

  let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
  let dataBody = tableData.map((elt) => {
    const data = columns.reduce((acc, colObj) => {
      if (colObj.dataKey === "radius")
        return {
          ...acc,
          [colObj.dataKey]: elt[colObj.dataKey].name,
        };
      else if (colObj.dataKey === "sms_gateway_type" && elt.sms_gateway_type) {
        return { ...acc, sms_gateway_type: elt.sms_gateway_type.name };
      } else if (colObj.dataKey === "role" && elt.role) {
        return { ...acc, role: elt.role.name };
      } else if (colObj.dataKey === "type" && elt.type) {
        return { ...acc, type: elt.type.name };
      } else if (colObj.dataKey === "status" && elt.status) {
        return { ...acc, status: elt.status.name };
      }

// added
// else if (colObj.dataKey === "wallet_amount" && elt.wallet_amount) {
//   return { ...acc, wallet_amount: elt.wallet_amount};
// }
//

      else if (colObj.dataKey === "created_at" && elt.created_at){
return { ...acc,created_at: moment(elt.created_at).format('DD-MMM-YY')}

      } else if (colObj.dataKey === "updated_at" && elt.updated_at){
        return { ...acc,updated_at: moment(elt.updated_at).format('DD-MMM-YY')}
        
              }
      else if (colObj.dataKey === "address" && elt.address) {
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
    startY: 110,
    startX: 150,
    columnStyles: {
      id: { cellWidth: 40 },
    },
    body: dataBody,
    columns,
    headStyles: { fillColor: [20, 20, 20] },
  };

 
  doc.setFontSize(20);
  doc.text(350,20,"All Franchises")
 
  
  // doc.text(title, marginLeft, 10,);
  doc.setFillColor(0, 0, 255)
  doc.addImage(VBCLOGO, 'PNG', 650, 22, 130, 80)



  doc.autoTable(styledContent);
  doc.save(`${fileName}.pdf`);
  toast.success("File downloaded successfully.", {
    autoClose: 1000,
  });
};
