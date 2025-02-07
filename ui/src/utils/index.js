import { firebase_app } from "../data/config";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const requiredFieldsKYCForm = [
  "first_name",
  "last_name",
  "register_mobile",
  "registered_email",
  "alternate_email",
  "alternate_mobile",
  "house_no",
  "landmark",
  "Aadhar_Card_No",
  "service_plan",
  "customer_pic",
  "street",
  "city",
  "pincode",
  "district",
  "state",
  "country",
  "identity_proof",
  "address_proof",
  "signature",
  "upload_speed",
  "download_speed",
  "data_limit",
  "plan_cost",
  "plan_SGST",
  "plan_CGST",
  "total_plan_cost",
  "installation_charges",
  "security_deposit",
  "plan_type",
  "branch",
  "area"
];

export const isValueZero = (val) => {
  return val === 0 ? true : false;
};

export const logout_From_Firebase = () => {
  localStorage.removeItem("profileURL");
  localStorage.removeItem("token");
  firebase_app.auth().signOut();
};

export const logout_From_Auth0 = () => {
  localStorage.removeItem("auth0_profile");
  localStorage.setItem("authenticated", false);
};

export const leadStatusJson = [
  {
    id: "OPEN",
    name: "Open Lead",
  },
  {
    id: "QL",
    name: "Feasible Lead",
  },
  {
    id: "UQL",
    name: "Non Feasible Lead",
  },
  {
    id: "CBNC",
    name: "Closed But Not Converted",
  },
  {
    id: "CNC",
    name: "Closed and Converted",
  },

  {
    id: "LC",
    name: "Lead Conversion",
  },
];
export const leadReportsStatusJson = [
  {
    id: "ALL",
    name: "All",
  },
  {
    id: "OPEN",
    name: "Open Lead",
  },
  {
    id: "QL",
    name: "Feasible Lead",
  },
  {
    id: "UQL",
    name: "Non Feasible Lead",
  },
  {
    id: "CBNC",
    name: "Closed But Not Converted",
  },
  {
    id: "CNC",
    name: "Closed and Converted",
  },

  {
    id: "LC",
    name: "Lead Conversion",
  },
];
export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
  console.log(headersForPDF);
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  const title = `${pdfTitle}`;
  const headers = [[...headersForPDF.map((col) => col[1])]];

  const dataKey = headersForPDF.map((col) => col[0]);

  const data = tableData.map((elt) => {
    return dataKey.map((key) => {
      if (key === "lead_source" || key === "type") return elt[key.name];
      else if (key === "status")
        return leadStatusJson.find((s) => s.id == elt.status).name;
      else if (key === "address")
        return `${elt.house_no},${elt.street},${elt.landmark},${elt.city},${elt.district},${elt.state},${elt.country},${elt.pincode}`;
      else return elt[key];
    });
  });
  let content = {
    startY: 50,
    head: headers,
    body: data,
  };

  let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
  let dataBody = tableData.map((elt) => {
    const data = columns.reduce((acc, colObj) => {
      if (colObj.dataKey === "lead_source" || colObj.dataKey === "type")
        return {
          ...acc,
          [colObj.dataKey]: elt[colObj.dataKey].name,
        };
      else if (colObj.dataKey === "status") {
        const statusObj = leadStatusJson.find((s) => s.id == elt.status);
        return {
          ...acc,
          status: statusObj.name,
        };
      } else if (colObj.dataKey === "address") {
        const address = `${elt.house_no},${elt.street},${elt.landmark},${elt.city},${elt.district},${elt.state},${elt.country},${elt.pincode}`;
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
    startY: 50,
    columnStyles: {
      id: { cellWidth: 40 },
      address: { cellWidth: 100 },
      lead_source: { cellWidth: 60 },
      type: { cellWidth: 60 },
      notes: { cellWidth: 60 },
    },
    body: dataBody,
    columns,
  };

  doc.text(title, marginLeft, 40);
  // doc.autoTable(content);

  doc.autoTable(styledContent);
  doc.save(`${fileName}.pdf`);
};
