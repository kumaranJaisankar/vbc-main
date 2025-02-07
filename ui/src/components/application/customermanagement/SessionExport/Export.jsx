import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import orderBy from 'lodash/orderBy';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from 'moment';

export const downloadExcelFile = (data, type, headers) => {
    var wb = XLSX.utils.book_new()
    var ws_name = 'SheetJS'
    let dataModify = [...data];
    if (dataModify) {
        dataModify = orderBy(dataModify, ['id'], ['asc']);
        dataModify = dataModify.map(row => {
            let d = new Date(row.acctstarttime)
            let s = new Date(row.acctstoptime)
            let u = new Date(row.acctupdatetime)
            const displayTotaltime = (seconds) => {
                seconds = Number(seconds);
                var d = Math.floor(seconds / (3600 * 24));
                var h = Math.floor((seconds % (3600 * 24)) / 3600);
                var m = Math.floor((seconds % 3600) / 60);

                var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                return dDisplay + hDisplay + mDisplay;
            };
            // return
            return {
                radacctid: row.radacctid,
                username: row.username,
                acctupdatetime: (u.getFullYear() + "-" + (u.getMonth() + 1) + "-" + u.getDate()),
                // acctstarttime: (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()),
                acctstarttime: moment(d).format('DD-MMM-YY,h:mm a'),
                acctstoptime: moment(d).format('DD-MMM-YY,h:mm a'),
                // acctstoptime: (s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate()),
                acctoutputoctets: (parseFloat(row.acctoutputoctets / 1024 / 1024 / 1024).toFixed(2) +
                    "GB"),
                acctinputoctets: (parseFloat(row.acctinputoctets / 1024 / 1024 / 1024).toFixed(2) +
                    "GB"),
                framedipaddress: row.framedipaddress,
                nasipaddress: row.nasipaddress,
                callingstationid: row.callingstationid,
                acctsessiontime: displayTotaltime(row.acctsessiontime)
            }
        })
    }

//     const headerKeys = Object.keys(dataModify[0]);
//     const requiredHeaderKeys = headers;
//     let newDataModify = dataModify.map(item => {
//         let newItem = {};
//         requiredHeaderKeys.forEach(requiredKey => newItem[requiredKey] = item[requiredKey])
//         return newItem;
//     });
//     const ws_data = newDataModify;
//     var ws = XLSX.utils.json_to_sheet(ws_data, { header: headers })
//     XLSX.utils.book_append_sheet(wb, ws, ws_name)
//     XLSX.writeFile(
//         wb,
//         `Traffic${type === 'csv' ? '.csv' : '.xlsx'}`,
//     )
//     toast.success(
//         'File downloaded successfully.', {

//         autoClose: 1000
//     }
//     )
// }
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
XLSX.writeFile(wb, `Traffic/Session${type === "csv" ? ".csv" : ".xlsx"}`);
toast.success("File downloaded successfully.", {
autoClose: 1000,
});
};


export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
    const displayTotaltime = (seconds) => {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor((seconds % (3600 * 24)) / 3600);
        var m = Math.floor((seconds % 3600) / 60);

        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        return dDisplay + hDisplay + mDisplay;
    };

    const unit = "pt";
    const size = "A3"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    // const title = `${pdfTitle}`;
    const headers = [[...headersForPDF.map((col) => col[1])]];

    const dataKey = headersForPDF.map((col) => col[0]);

    const data = tableData.map((elt) => {
        return dataKey.map((key) => {
            if (key === "lead_source" || key === "type") return elt[key.name];

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


            else if (colObj.dataKey === "acctupdatetime" && elt.acctupdatetime) {
                return { ...acc, acctupdatetime: moment(elt.acctupdatetime).format('DD-MMM-YY') }

            } else if (colObj.dataKey === "acctstarttime" && elt.acctstarttime) {
                return { ...acc, acctstarttime: moment(elt.acctstarttime).format('DD-MMM-YY,h:mm a') }

            }
            else if (colObj.dataKey === "acctstoptime" && elt.acctstoptime) {
                return { ...acc, acctstoptime: moment(elt.acctstoptime).format('DD-MMM-YY,h:mm a') }

            }
            else if (colObj.dataKey === "acctsessiontime" && elt.acctsessiontime) {
                return { ...acc, acctsessiontime: displayTotaltime(elt.acctsessiontime) }

            }

            else if (colObj.dataKey === "acctoutputoctets" && elt.acctoutputoctets) {
                return {
                    ...acc, acctoutputoctets: (parseFloat(elt.acctoutputoctets / 1024 / 1024 / 1024).toFixed(2) +
                        "GB")
                }

            }
            else if (colObj.dataKey === "acctinputoctets" && elt.acctinputoctets) {
                return {
                    ...acc, acctinputoctets: (parseFloat(elt.acctinputoctets / 1024 / 1024 / 1024).toFixed(2) +
                        "GB")
                }

            }
            else if (colObj.dataKey === "address") {
                const address = `${elt.house_no},${elt.street},${elt.landmark},${elt.city},${elt.district},${elt.state},${elt.country},${elt.pincode}`;
                return {
                    ...acc,
                    address,
                };
            } else return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
        }, {});
        return data;
    });

    console.log(dataBody, ":dataBody")
    console.log(columns, ":columns")

    let styledContent = {
        startY: 50,
        startX: 30,
        columnStyles: {
            id: { cellWidth: 40 },
            address: { cellWidth: 100 },
            lead_source: { cellWidth: 60 },
            type: { cellWidth: 60 },
            notes: { cellWidth: 60 },
        },
        body: dataBody,
        columns,
        //   headStyles: { fillColor: [20, 20, 20] },
    };
    // doc.setFillColor(0, 0, 255)
    // doc.text(title, marginLeft, 20);
    // doc.addImage(VBCLOGO, 'PNG', 650, 22, 130, 80)
    doc.text(40, 40, "Traffic/Session");
    doc.autoTable(styledContent);
    doc.save(`${fileName}.pdf`);
    toast.success(
        'File downloaded successfully.', {

        autoClose: 1000
    }
    )
};