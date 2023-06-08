function convertToCSV(objArray) {
  let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  let str = "";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (let index in array[i]) {
      if (line != "") line += ",";
      let cell=array[i][index]
      line += cell
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, data, fileTitle) {

  let items=data.slice(0);
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  let jsonObject = JSON.stringify(items);

  let csv = this.convertToCSV(jsonObject);

  let exportedFilenmae = fileTitle + ".csv" || "export.csv";

  let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    let link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
