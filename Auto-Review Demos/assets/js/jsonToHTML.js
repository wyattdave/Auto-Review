
let htmlTable;

function constructTable(list) {

    let cols = Headers(list); 

    for (let i = 0; i < list.length; i++) {
        let row = $('<tr/>');  
        for (let colIndex = 0; colIndex < cols.length; colIndex++)
        {
            let val = list[i][cols[colIndex]];

            if (val == null) val = ""; 
                row.append($('<td/>').html(val));
        }
         

        htmlTable+=row;
    }
    console.log(htmlTable)
    return htmlTable;
}
 
function Headers(list) {
    let columns = [];
    let header = '<table><tr>';
     
    for (let i = 0; i < list.length; i++) {
        let row = list[i];
         
        for (let k in row) {
            if ($.inArray(k, columns) == -1) {
                columns.push(k);
                header.append($('<th/>').html(k));
            }
        }
    }
     console.log(header)

    htmlTable=header;
        return columns;
}  