
let sSearchTerm;
let elmContent;
let sPreviousSearch="";
let sScreen="app";
console.log("report loaded");

const elmCodeSearch = document.getElementById('target-search');
const elmContainSearch = document.getElementById('container-search');
elmCodeSearch.addEventListener('click', search);

const elmContainerCodeBlock = document.getElementById('container-codeBlock');
const elmCodeBlock = document.getElementById('target-codeBlock');
elmCodeBlock.addEventListener('click', codeBlock);

const elmContainerComponents = document.getElementById('container-components');
const elmComponents = document.getElementById('target-components');
elmComponents.addEventListener('click', components);

const elmContainerFormula = document.getElementById('container-formula');
const elmFormula= document.getElementById('target-formula');
elmFormula.addEventListener('click', formula);

const elmContainerGlobal = document.getElementById('container-global');
const elmGlobal= document.getElementById('target-global');
elmGlobal.addEventListener('click', global);

const elmContainerLocal = document.getElementById('container-local');
const elmLocal= document.getElementById('target-local');
elmLocal.addEventListener('click', local);

const elmContainerCollections = document.getElementById('container-collections');
const elmCollections= document.getElementById('target-collections');
elmCollections.addEventListener('click', collections);

const elmContainerApp = document.getElementById('container-app');
const elmApp= document.getElementById('target-app');
elmApp.addEventListener('click', app);

const elmContainerConnections = document.getElementById('container-connectionDetails');
const elmConnections= document.getElementById('target-connections');
elmConnections.addEventListener('click', connections);

const elmContainerDataSources = document.getElementById('container-dataSources');
const elmDataSources= document.getElementById('target-dataSources');
elmDataSources.addEventListener('click', dataSources);

const elmContainerReferences = document.getElementById('container-references');
const elmReferences= document.getElementById('target-references');
elmReferences.addEventListener('click', references);

const elmContainerEnvirVars= document.getElementById('container-envirVars');
const elmEnvirVars= document.getElementById('target-envirVars');
elmEnvirVars.addEventListener('click', envirVars);

const elmContainerFlows = document.getElementById('container-flows');
const elmFlows= document.getElementById('target-flows');
elmFlows.addEventListener('click', flows);

const elmContainerTables = document.getElementById('container-tables');
const elmTables= document.getElementById('target-tables');
elmTables.addEventListener('click', tables);

const elmContainerDiagram = document.getElementById('container-diagram');
const elmDiagram= document.getElementById('target-diagram');
elmDiagram.addEventListener('click', diagram);

const elmContainerFlags = document.getElementById('container-flags');
const elmFlags= document.getElementById('target-flags');
elmFlags.addEventListener('click', flags);

const elmContainerTests = document.getElementById('container-tests');
const elmTests= document.getElementById('target-tests');
elmTests.addEventListener('click', tests);

const elmContainerDependencies= document.getElementById('container-dependencies');
const elmDependencies= document.getElementById('target-dependencies');
elmDependencies.addEventListener('click', dependencies);

function dependencies(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="dependencies"
  elmContainerDependencies.style="display:block";
}


function codeBlock(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="codeBlock"
  elmContainerCodeBlock.style="display:block";
}

function components(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="components"
  elmContainerComponents.style="display:block";
}

function formula(){
  hideAll(); 
  sScreen="formula"
  elmContainerFormula.style="display:block";
}

function global(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="global"
  elmContainerGlobal.style="display:block";
}

function local(){
  hideAll(); 
  sScreen="local"
  elmContainerLocal.style="display:block";
}

function collections(){
  hideAll();
  elmContainSearch.style=null; 
  sScreen="collections"
  elmContainerCollections.style="display:block";
}

function app(){
  hideAll(); 
  sScreen="app"
  elmContainerApp.style="display:block";
}

function connections(){
  hideAll(); 
  sScreen="connections"
  elmContainerConnections.style="display:block";
}

function dataSources(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="dataSources"
  elmContainerDataSources.style="display:block";
}

function references(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="references"
  elmContainerReferences.style="display:block";
}

function envirVars(){
  hideAll();
  elmContainSearch.style=null;
  sScreen="envirVars"
  elmContainerEnvirVars.style="display:block";
}

function flows(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="flows"
  elmContainerFlows.style="display:block";
}

function tables(){
  hideAll(); 
  elmContainSearch.style=null;
  sScreen="tables"
  elmContainerTables.style="display:block";
}

function diagram(){
  hideAll(); 
  sScreen="diagram"
  elmContainerDiagram.style="display:block";
}

function flags(){
  hideAll(); 
  sScreen="flags"
  elmContainerFlags.style="display:block";
}

function tests(){
  hideAll(); 
  elmContainSearch.style=null; 
  sScreen="tests"
  elmContainerTests.style="display:block";
}

function hideAll(){
  elmContainSearch.style.display="none"
  elmContainerCodeBlock.style="display:none";
  elmContainerComponents.style="display:none";
  elmContainerGlobal.style="display:none";
  elmContainerLocal.style="display:none";
  elmContainerCollections.style="display:none";
  elmContainerFormula.style="display:none";
  elmContainerApp.style="display:none";

  elmContainerConnections.style="display:none";
  elmContainerDataSources.style="display:none";
  elmContainerReferences.style="display:none";
  elmContainerEnvirVars.style="display:none";
  elmContainerTests.style="display:none";
  elmContainerDependencies.style="display:none";
  elmContainerTests.style="display:none";
  elmContainerFlows.style="display:none";
  elmContainerTables.style="display:none";
  elmContainerDiagram.style="display:none";
  elmContainerFlags.style="display:none";
  const elmPopup= document.getElementById('popup');

  if(elmPopup){elmPopup.remove()}
}




function search() {

  sSearchTerm = document.getElementById('content-search').value.replaceAll(' ','&nbsp;');
  switch(sScreen) {
    case "components":
      getFilter(sSearchTerm);
      break;
    case "codeBlock":
      elmContent = document.getElementById('content-codeBlock');
      popup(elmContent,sSearchTerm);
      break
    case "global":
      getFilter(sSearchTerm);
      break
    case "collections":
      getFilter(sSearchTerm);
      break
    case "envirVars":
      getFilter(sSearchTerm);
      break
    case "flows":
      getFilter(sSearchTerm);
      break
    case "tables":
      getFilter(sSearchTerm);
      break
    case "tests":
        getFilter(sSearchTerm);
      break
    case "references":
        getFilter(sSearchTerm);
      break 
    case "dataSources":
        getFilter(sSearchTerm);
      break 
    default:
     alert("Not availble yet")
  } 
  
}

function popup(elmContent,sSearchTerm){
  const elmCheckPop=document.getElementById('popup');
if(elmCheckPop){elmCheckPop.remove()}
  const regExpSearch = new RegExp(sSearchTerm, 'gi');
  let iNewelmContent = elmContent.innerHTML.replaceAll('<span class="highlight">'+sPreviousSearch+'</span>',sPreviousSearch);
  iNewelmContent = iNewelmContent.replaceAll('<span class="selected">'+sPreviousSearch+'</span>',sPreviousSearch);
  elmContent.innerHTML = iNewelmContent;
  iNewelmContent = elmContent.innerHTML.replace(regExpSearch, `<span class="highlight">${sSearchTerm}</span>`);
  elmContent.innerHTML = iNewelmContent;
  const elements = elmContent.querySelectorAll('span.highlight');

  if(elements.length>0){
    sPreviousSearch=sSearchTerm;
    const popup = document.createElement("div");
    popup.setAttribute('class','card shadow mb-4');
    popup.setAttribute('id','popup');
    popup.style.position = "fixed";
    popup.style.top = "10px";
    popup.style.right = "10px";
    popup.style.padding = "10px";
    popup.style.border = "1px solid black";
    popup.style.backgroundColor = "white";
    popup.style.zIndex =1000;

    const count = document.createElement("span");
    count.innerHTML = "Found " + elements.length + " occurrences. Selected 1";
    popup.appendChild(count);
  
    elements[0].setAttribute("class", "selected");
    elements[0].scrollIntoView();

    let index = 0;
    const nextBtn = document.createElement("button");
    nextBtn.setAttribute("class", "btn btn-secondary");
    nextBtn.style.margin = "5px";
    nextBtn.innerHTML = "Next";
    nextBtn.addEventListener("click", function() {
        index = (index + 1) % elements.length;
        elements[index].scrollIntoView();
        elements[index].setAttribute("class", "selected");
        let iNext=index-1
        if(iNext<0){
          iNext=elements.length-1
        }
        elements[iNext].setAttribute("class", "hightlighted");
        count.innerHTML = "Found " + elements.length + " occurrences. Selected "+index+1;
    });
    popup.appendChild(nextBtn);

    const prevBtn = document.createElement("button");
    prevBtn.setAttribute("class", "btn btn-secondary");
    prevBtn.style.margin = "5px";
    prevBtn.innerHTML = "Previous";
    prevBtn.addEventListener("click", function() {
        index = (index - 1 + elements.length) % elements.length;
        elements[index].scrollIntoView();
        elements[index].setAttribute("class", "selected");
        let iNext=index+1
        if(iNext>elements.length-1){
          iNext=0
        }
        elements[iNext].setAttribute("class", "hightlighted");
        count.innerHTML = "Found " + elements.length + " occurrences. Selected "+index+1;
    });
    popup.appendChild(prevBtn);

    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("class", "btn btn-secondary");
    closeBtn.style.margin = "5px";
    closeBtn.innerHTML = "Close";
    closeBtn.addEventListener("click", function() {
      popup.remove();
      let iNewelmContent = elmContent.innerHTML.replaceAll('<span class="highlight">'+sSearchTerm+'</span>',sSearchTerm);
      iNewelmContent = iNewelmContent.replaceAll('<span class="selected">'+sSearchTerm+'</span>',sSearchTerm);
      elmContent.innerHTML = iNewelmContent;
    })
    popup.appendChild(closeBtn);
    document.body.appendChild(popup);
  }else{
    alert("No results found")
  }
}

function getFilter(filterTerm){
  const RegExpLogic= new RegExp('(?:=|<>|!=|>|<|includes|!includes|notincludes)');
  const aLogic=filterTerm.match(RegExpLogic);
  
  if(filterTerm.length==""){
    filterTable(sScreen,"/","/","/")
  }else if(aLogic){
    const sLogic = aLogic[0];
    const aFilter=filterTerm.split(sLogic)
    filterTable(sScreen,aFilter[0].trim(),aFilter[1].trim(),sLogic.trim())
 
  } else{
    alert("Invalid Filter\rcolumn = value\rcolumn != value\rcolumn includes value\rcolumn !includes value\rcolumn=value");
  }

}


function filterTable(sTable,sColumn, sValue,sLogic) {
  sColumn=sColumn.replaceAll('&nbsp;','');
  sValue=sValue.replaceAll('&nbsp;','');
  console.log(sTable,sColumn, sValue,sLogic)
  const table = document.getElementById("table-"+sTable);
  const columnIdx = Array.from(table.getElementsByTagName("th")).findIndex(th => th.textContent === sColumn);
  const rows = Array.from(table.getElementsByTagName("tr"));
  
  console.log(rows,columnIdx)
  let filteredRows;
  if(columnIdx>=0 || sLogic =="/"){
    if(sLogic !="/"){
      switch(sLogic) {
        case "=":
          filteredRows = rows.filter(row => row.cells[columnIdx].innerHTML === sValue );
          break
        case "<>":
          filteredRows = rows.filter(row => row.cells[columnIdx].innerHTML != sValue );
          break
        case "!=":
            filteredRows = rows.filter(row => row.cells[columnIdx].innerHTML != sValue );
            break
        case "includes":
          filteredRows = rows.filter(row => row.cells[columnIdx].innerHTML.includes(sValue));
          break
        case "!includes":
          filteredRows = rows.filter(row => !row.cells[columnIdx].innerHTML.includes(sValue));
          break
        case "notincludes":
            filteredRows = rows.filter(row => !row.cells[columnIdx].innerHTML.includes(sValue));
            break
        case ">":
          filteredRows = rows.filter(row => parseInt(row.cells[columnIdx].innerHTML) > sValue );
          break
        case "<":
          filteredRows = rows.filter(row => row.cells[columnIdx].innerHTML < sValue );
          break  
        default:
          filteredRows = rows.filter(row => row.cells[columnIdx].innerHTML !="!£$^%&%*^(^(^^()))" );
      }
  
      rows.forEach((row,index) => {
        if(index>0){row.style.display = "none"}
      });    
    }else{

      filteredRows = rows.filter(row => row.cells[0].innerHTML !="!£$^%&%*^(^(^^()))" );
    }
    filteredRows.forEach(row => row.style.display = "");
  }else{
    alert("Invalid Filter\rField not found\rPlease note fields are case sensitive");
  }
