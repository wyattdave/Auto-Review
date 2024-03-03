const downloadElem = document.getElementById("download");
const jsonDiv = document.getElementById("json");
const tablesDiv = document.getElementById("tables");
const jsonElm = document.getElementById("show-json");


const startClear = document.getElementById("restScroll");

startClear.addEventListener("click", function(e) {
    e.stopPropagation();
    topFunction()
  });

  startClear.click();  

  jsonElm.addEventListener("click", function() {
    if(jsonElm.innerText=="JSON Schema"){
        tablesDiv.style.display="none";
        jsonDiv.style.display="block";
        jsonElm.innerText="Tables"
    }else{
        tablesDiv.style.display="block";
        jsonDiv.style.display="none";
        jsonElm.innerText="JSON Schema"
    }
  });


downloadElem.addEventListener("click", function() {
    downloadHTML()
  });

  
  function downloadHTML(){
  
    let sHTML=document.querySelector("html").innerHTML;
    let sName=document.getElementById("target-flowName").innerHTML;
    sHTML='<!doctype html><html lang="en">'+sHTML+'</html>';
    sHTML=sHTML.replace('<div class="mui--text-white mui--text-body2" style="font-size:10px" id="download">Download</div>','');
    sHTML=sHTML.replaceAll('assets/','https://wyattdave.github.io/Auto-Review/assets/')
    sHTML=sHTML.replaceAll('mu/js/mui.min.js','https://wyattdave.github.io/Auto-Review/mu/js/mui.min.js')
  
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
    encodeURIComponent(sHTML));
    element.setAttribute('download', sName+'.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  
  }

  function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
  }