///By David Wyatt
let sDefinition = "";
let sDefinitionParsed = "";
let oReport;
let oLiveReport;
let sCustomList = null;
let sReview;

let aConnectionTier;
let i = 0;
let iWarning = 0;
let iDefinitionFind = 0;
let iDefinitionCount = 0;
let user = "";
let oSaved;
let oSavedDef;
let oRatings=oRatingsTemplate;
let oNaming=oNamingTemplate;
let aComplexity=aComplexityTemplate;
let aScoring=aScoringTemplate;
let oConfigReference=oConfigReferenceTemplate;
let oSolution;
let sSolutionHTML="";
let bResetStorage = false;
let aEnvironmentVar=[];
let oDependencies;
const iResetStorage = 8;
const sHtml =  '<html><head><meta name="color-scheme" content="dark"></head><body>';
const regExpNewLine = new RegExp("(?:\r\n|\n\r|\r|\n|  )", "gm");//("(?:\r\n|\n\r|\r|\n| )", "gm");
const regExpFormat = new RegExp("(?:{|})", "gm");
const sPrem = '<img src="assets/img/premium-32.png" class="smallIcon" />';
const sPrev = '<img src="assets/img/preview-32.png" class="smallIcon" />';
const regExpFileID = new RegExp("[A-Z0-9]{8}-([A-Z0-9]{4}-){3}[A-Z0-9]{12}","m");
let sortOrder;


const pLoading = document.getElementById("loading");
const spanVersion = document.getElementById("version");
const divCSV = document.getElementById("csvDropdown");
const divAdmin = document.getElementById("admin");
const butReview = document.getElementById("review-button");

const butShortcut  = document.getElementById("shortcut-button");
const divDivider = document.getElementById("solution-divider");
const butData = document.getElementById("data-button");

const butDefinition = document.getElementById("definition-button");
const lSolution = document.getElementById("solution-container");
const tSolution =document.getElementById("solution-title");
const iLoad = document.getElementById("loadSaved");
const divConfig = document.getElementById("admin");
const buLiveFlow = document.getElementById("loadLive");


function OpenReview() {

  sessionStorage.setItem("actions", JSON.stringify(oReport.actionArray));
  i = sessionStorage.getItem("windowCounter");
  const newWindow = window.open("", "Review" + new Date().getTime() + i);
  newWindow.document.write(sReview);
  i++;
  sessionStorage.setItem("windowCounter", i);
}


function OpenData() {
  i = sessionStorage.getItem("windowCounter");
  const newWindow = window.open("", "Data" + new Date().getTime() + i);
  newWindow.document.write(
    sHtml +
      '<p>Schema:<a href="/Configs/AutoReview-Schema.json">https://wyattdave.github.io/Auto-Review/Config/AutoReview-Schema.json</a></p><pre>' +
      JSON.stringify(oReport, undefined, 2) +
      "</pre></body></html>"
  );
  i++;
  sessionStorage.setItem("windowCounter", i);
}

function OpenDefinition() {
  SaveData();
  i = sessionStorage.getItem("windowCounter");
  const newWindow = window.open("", "Definition" + new Date().getTime() + i);
  newWindow.document.write(
    sHtml +
      '<p>Schema:<a href="https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#">https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#</a></p><pre>' +
      JSON.stringify(sDefinitionParsed, undefined, 2) +
      "</pre></body></html>"
  );
  i++;
  sessionStorage.setItem("windowCounter", i);
}


document.getElementById("review-button").addEventListener("click", OpenReview);
document.getElementById("data-button").addEventListener("click", OpenData);
document.getElementById("definition-button").addEventListener("click", OpenDefinition);

function review(){

}

(() => {
  if (typeof TransformStream == "undefined") {
    const script = document.createElement("script");
    script.src = "lib/web-streams-polyfill.min.js";
    document.body.appendChild(script);
  }

  const model = (() => {
    return {
      getEntries(file, options) {
        return new zip.ZipReader(new zip.BlobReader(file)).getEntries(options);
      },
      async getURL(entry, options) {
        return URL.createObjectURL(
          await entry.getData(new zip.BlobWriter(), options)
        );
      }
    };
  })();

  (() => {
    const fileInput = document.getElementById("file-input");
    const encodingInput = "utf-8";
    const fileInputButton = document.getElementById("file-input-button");
    const passwordInput = "";
    let entries;
    let selectedFile;
    fileInput.onchange = selectFile;
    fileInputButton.onclick = () =>
      fileInput.dispatchEvent(new MouseEvent("click"));


    async function selectFile() {
      try {
        fileInputButton.disabled = true;
        encodingInput.disabled = true;
        selectedFile = fileInput.files[0];
        pLoading.style.color = null;
        pLoading.innerHTML = "Loading.....";
        await loadFiles();
      } catch (error) {
        pLoading.innerHTML = error;
      } finally {
        fileInputButton.disabled = false;
        fileInput.value = "";
      }
    }

    async function loadFiles(filenameEncoding) {
      sSolutionHTML="";
      pLoading.innerHTML = "Loading...";
      entries = await model.getEntries(selectedFile, { filenameEncoding });
      if (entries && entries.length) {
        lSolution.style = "display: none";
        divDivider.style = "display: none";
        tSolution.style = "display: none";
      
        
        lSolution.innerHTML = "";
        sCustomList = null;
        oSolution= null;
        iDefinitionFind = 0;
        iDefinitionCount = 0;
        const filenamesUTF8 = Boolean(
          !entries.find((entry) => !entry.filenameUTF8)
        );
        const encrypted = Boolean(entries.find((entry) => entry.encrypted));
        encodingInput.value = filenamesUTF8
          ? "utf-8"
          : filenameEncoding || "cp437";
        encodingInput.disabled = filenamesUTF8;
        passwordInput.value = "";
        passwordInput.disabled = !encrypted;

        entries.forEach((entry, entryIndex) => {
          if (
            entry.filename.includes("definition.json") ||
            entry.filename.includes("Workflows/")
          ) {
            if (iDefinitionFind == iDefinitionCount) {
              pLoading.innerHTML = "Flow Found...Loading...";
              review(entry, "flow");
              let node = document.createElement("li");
              node.innerHTML=entry.filename.replace("Workflows/", "").split("-")[0]                  
              node.value = entryIndex;
              lSolution.appendChild(node);
              node.addEventListener("click", function () {
                review(entries[this.value], "flow");
              });
            } else {
              tSolution.style = "display: block";
              divDivider.style = "display: block";
              lSolution.style =
                "display: block; height:124px; overflow-y:auto; overflow-x:hidden";
              const node = document.createElement("li");
              const textnode = document.createTextNode(
                entry.filename.replace("Workflows/", "").split("-")[0]
              );
              node.appendChild(textnode);
              node.value = entryIndex;
              lSolution.appendChild(node);
              node.addEventListener("click", function () {
                review(entries[this.value], "flow");
              });
            }
            iDefinitionCount++;
          } else if (entry.filename.includes("customizations.xml")) {
            review(entry, "customizations");
          } else if (entry.filename.includes("solution.xml")) {
            review(entry, "solution");
          } else if (entry.filename.includes("environmentvariabledefinition.xml")) {
            review(entry, "environmentVar");   
          } else if (entry.filename.includes("complexityConfig.json")) {
            review(entry, "complexity");
          } else if (entry.filename.includes("namingConfig.json")) {
            review(entry, "naming");
          } else if (entry.filename.includes("scoringConfig.json")) {
            review(entry, "scoring");
          } else if (entry.filename.includes("ratingsConfig.json")) {
            review(entry, "ratings");
          }
        });
      }
      if (iDefinitionCount == 0) {
        pLoading.innerHTML = "No Flows Found in Zip";        
      }
      
    }

    async function review(entry, type) {
      try {
        const blobURL = await model.getURL(entry, {
          password: passwordInput.value,
          onprogress: (index, max) => {
            unzipProgress.value = index;
            unzipProgress.max = max;
          }
        });

        $.ajax({
          url: blobURL,
          success: function (sDefinition) {
           
            if (type == "flow") {
              sDefinitionParsed = JSON.parse(sDefinition);
             
              butReview.style="display:block;  width:100%;";
              butDefinition.style = "width:100%; display:block";
              oReport = null;
              let sId="";
              if(entry.filename.match(regExpFileID)){
                sId=entry.filename.match(regExpFileID)[0]
              }
             // try {
             
                oReport= CreateReview(
                    sDefinition,
                    "unknown",
                    sId,
                    aComplexity,
                    oNaming,
                    aConnectionTier,
                    ""
                )
               
                
                    if (oReport.error == "") {
                      pLoading.innerHTML = '<img src="assets/img/old flow grey fill.svg"/>&nbsp;'+oReport.name;
                      if (oReport.name == "unknown" && sCustomList != null) {
                        let sFlowName;
                        try {
                          
                          sFlowName =
                            sCustomList.ImportExportXml.Workflows.Workflow.find(
                              (item) =>
                                item.WorkflowId.toUpperCase() ==
                                "{" + oReport.id + "}".toUpperCase()
                            );
                   
                   
                        } catch (error) {
                          sFlowName =
                            sCustomList.ImportExportXml.Workflows.Workflow;
                        }
                        if (sFlowName != null) {
                          pLoading.innerHTML ='<img src="assets/img/old flow grey fill.svg"/>&nbsp;'+sFlowName.Name;
                          oReport.name = sFlowName.Name;
                        }
                      }
                
                      oSavedDef = sDefinitionParsed;
                      oSaved = oReport;
                      generateReport(oReport);
                      butReview.style="display:block;  width:100%;";
                     
                      butData.style = "display:block;";
                     
                      spanVersion.style = "display:none;";
                      divCSV.style = "display:block; width:100%;";
                      divAdmin.style = "display:none;";
                    } else {
                      pLoading.innerHTML = oReport.error;
                      spanVersion.style = "display:block;";
                      divCSV.style = "display:none;";
                    }
                  
                
              /*} catch (error) {
                pLoading.innerHTML = "Unexpected Error: " + error;
                pLoading.style.color = "red";
                spanVersion.style = "display:block;";
                divCSV.style = "display:none;";
                butDefinition.style = "display:block;  width:100%;";
              } finally {
                
              }*/
            } else if (type == "customizations") {
            
              sCustomList = xmlToJson.parse(sDefinition);
           
              let sConnectionRefs="";
              let sTables="";
              let sSecurityProfile="";
              let sCanvasApps="";
              let sCustomControls="";
              let sRoles="";
              let sLanguageCode="";
 
              if(sCustomList?.ImportExportXml?.connectionreferences?.connectionreference != undefined ){
                sConnectionRefs=sCustomList.ImportExportXml.connectionreferences.connectionreference;
              } else {
                sConnectionRefs=[];
              };              
              if(sCustomList?.ImportExportXml?.Entities?.Entity != undefined ){
                sTables=sCustomList.ImportExportXml.Entities.Entity;
              } else {
                sTables=[];
              };                           
              if(sCustomList?.ImportExportXml?.FieldSecurityProfiles?.FieldSecurityProfile != undefined ){
                sSecurityProfile=sCustomList.ImportExportXml.FieldSecurityProfile.FieldSecurityProfiles
              } else {
                sSecurityProfile=[];
              };                          
              if(sCustomList?.ImportExportXml?.CanvasApps?.CanvasApp != undefined ){
                sCanvasApps=sCustomList.ImportExportXml.CanvasApps.CanvasApp
              } else {
                sCanvasApps=[];
              };
              if(sCustomList?.ImportExportXml?.CustomControls?.CustomControl != undefined ){
                sCustomControls=sCustomList.ImportExportXml.CustomControls.CustomControl
              } else {
                sCustomControls=[];
              };
              if(sCustomList?.ImportExportXml?.Roles?.Role != undefined ){
              sRoles=sCustomList.ImportExportXml.Roles.Role
              } else {
                sRoles=[];
              };                         
              if(sCustomList?.ImportExportXml?.Languages?.Language != undefined ){
                sLanguageCode=sCustomList.ImportExportXml.Languages.Language
              } else {
                sLanguageCode='';
              };                           
          
              oSolution={
                Flows:sCustomList.ImportExportXml.Workflows.Workflow,
                ConnectionRefs:sConnectionRefs,
                Tables:sTables,
                SecurityProfile:sSecurityProfile,
                CanvasApps:sCanvasApps,
                CustomControls:sCustomControls,
                Roles:sRoles,
                LanguageCode:sLanguageCode
              };


            } else if (type == "solution") {
              oDependencies = xmlToJson.parse(sDefinition);
            } else if (type == "environmentVar") {
              aEnvironmentVar.push(xmlToJson.parse(sDefinition));
            } else if (type == "complexity") {
              pLoading.innerHTML = pLoading.innerHTML.replace(
                "No Flows Found in Zip",
                "<b>Config Updates:</b>"
              );
              let aJson = JSON.parse(sDefinition).aComplexityTemplate;
              if (checkArray("Name", "Complexity", aJson)) {
                console.log("complex");
                
                oConfigReference = {
                  ...oConfigReference,
                  complexity: JSON.parse(sDefinition).sReference
                };
                aComplexity = aJson;
                pLoading.innerHTML =
                  pLoading.innerHTML + "<p>Complexity Config Updated</p>";
              } else {
                pLoading.innerHTML =
                  pLoading.innerHTML +
                  "<p>Complexity Config Failed, please check JSON</p>";
                pLoading.style.color = "red";
              }
            } else if (type == "naming") {
              pLoading.innerHTML = pLoading.innerHTML.replace(
                "No Flows Found in Zip",
                "<b>Config Updates:</b>"
              );
              let oConfig = JSON.parse(sDefinition).oNamingTemplate;
              if (
                checkArray("Type", "Letter", oConfig.data) &&
                Object.hasOwn(oConfig, "char")
              ) {
                console.log("naming");
              
                oConfigReference = {...oConfigReference,naming: oConfig.sReference };
                oNaming = oConfig;
                pLoading.innerHTML =
                  pLoading.innerHTML + "<p> Naming Config Updated</p>";
              } else {
                pLoading.innerHTML =
                  pLoading.innerHTML +
                  "<p> Naming Config Failed, please check JSON</p>";
                pLoading.style.color = "red";
              }
            } else if (type == "scoring") {
              pLoading.innerHTML = pLoading.innerHTML.replace(
                "No Flows Found in Zip",
                "<b>Config Updates:</b>"
              );
              let aJson = JSON.parse(sDefinition).aScoringTemplate;
              if (checkArray("Name", "Score", aJson) && aJson.length == 20) {
                console.log("scoring");
               
                oConfigReference = {...oConfigReference,score: JSON.parse(sDefinition).sReference};
                aScoring = aJson;
                pLoading.innerHTML =
                  pLoading.innerHTML + "<p>Scoring Config Updated</p>";
              } else {
                pLoading.innerHTML =
                  pLoading.innerHTML +
                  "<p>Scoring Config Failed, please check JSON</p>";
                pLoading.style.color = "red";
              }
            } else if (type == "ratings") {
              pLoading.innerHTML = pLoading.innerHTML.replace(
                "No Flows Found in Zip",
                "<b>Config Updates:</b>"
              );
              let oConfig = JSON.parse(sDefinition).oRatingsTemplate;
              if (checkRatings(oConfig)) {
                console.log("rating");
               
                oConfigReference = {...oConfigReference,ratings: JSON.parse(sDefinition).sReference};
                oRatings = oConfig;
                pLoading.innerHTML =
                  pLoading.innerHTML + "<p>Ratings Config Updated</p>";
              } else {
                pLoading.innerHTML =
                  pLoading.innerHTML +
                  "<p>Ratings Config Failed, please check JSON</p>";
                pLoading.style.color = "red";
              }
            }
          }
        }).fail(function (data) {
          pLoading.innerHTML = "Unexpected Error: " + data["responseText"];
        });

      } catch (error) {
        pLoading.innerHTML = "Unexpected Error: " + error;
        pLoading.style.color = "red";
      }
    }
  })();
})();

function checkArray(key1, key2, aArray) {
  let i = 0;

  for (i = 0; i < aArray.length; i++) {
    if (!Object.hasOwn(aArray[i], key1)) {
      return false;
    }
    if (!Object.hasOwn(aArray[i], key2)) {
      return false;
    }
  }
  return true;
}

function checkRatings(oObject) {
  if (!Object.hasOwn(oObject, "complexityAm")) {
    return false;
  }
  if (!Object.hasOwn(oObject, "complexityRe")) {
    return false;
  }
  if (!Object.hasOwn(oObject, "actionsAm")) {
    return false;
  }
  if (!Object.hasOwn(oObject, "actionsRe")) {
    return false;
  }
  if (!Object.hasOwn(oObject, "variablesAm")) {
    return false;
  }
  if (!Object.hasOwn(oObject, "variablesRe")) {
    return false;
  }
  if (!Object.hasOwn(oObject, "exceptionsAm")) {
    return false;
  }
  if (!Object.hasOwn(oObject, "exceptionsRe")) {
    return false;
  }

  return true;
}

function generateReport(data) {
  sReview = sReviewTemplate;

  let isTrue = (currentValue) => currentValue == true;
  ////////const pLoading = document.getElementById("loading");
  let iFail = 0;
  iWarning = 0;
  const sIconW = '<span style="color:orange">&#9888;</span>';
  const sIconR = '<span style="color:red">&#10006;</span>';
  let sLabel = "";
  let sFlowDisplayName = data.name;
  if (!data.exceptionHandleScope) {
    iFail++;
  }
  if (!data.exceptionScope) {
    iFail++;
  }
  if (!data.mainScope) {
    iFail++;
  }
  if (data.composes == 1) {
    iWarning = iWarning + data.composes;
  } else if (data.composes > 2) {
    iFail++;
  }

  const sRef =
    "<p>Com:" +
    oConfigReference.complexity +
    " | Rat:" +
    oConfigReference.ratings +
    " | Nam:" +
    oConfigReference.naming +
    " | Sco:" +
    oConfigReference.score +
    "</p>";

  if (pLoading.innerHTML != "" && pLoading.innerHTML != null) {
    sFlowDisplayName = pLoading.innerHTML.replace('_img src=_assets_img_old flow grey fill.svg__&nbsp;',"").replace('<img src="assets/img/old flow grey fill.svg">',"");
    //
  }

  const bVariablePass =
    [data.varNameUse , data.varNaming].every(isTrue) || data.variables == 0;

  sReview = sReview.replace("{references}", sRef);
  sReview = sReview.replace("{flowName}", sFlowDisplayName);
  sReview = sReview.replace("{flowId}", data.id);
  sReview = sReview.replace("{owner}", data.owner);
  sReview = sReview.replace("{variable}", bVariablePass);
  sReview = sReview.replace("{exception}",data.exceptionScope && data.exceptionTerminate && data.exceptionLink
  );
  sReview = sReview.replace("{main}", data.mainScope);
  sReview = sReview.replace("{composes}", data.composes);
  sReview = sReview.replace("{date}", getToday());
  sReview = sReview.replace("{complexity}", data.complexity);
  let sPremIcon = "";
  if (data.premium) {
    sPremIcon = sPrem;
  }
  sReview = sReview.replace("{premium}", sPremIcon);

  if (data.complexity > oRatings.complexityRe) {
    sReview = sReview.replace(
      'id="complexity" style="text-align: center; background-color:green;',
      'id="complexity" style="text-align: center; background-color:red;'
    );
    iWarning++;
  } else if (data.complexity > oRatings.complexityAm) {
    sReview = sReview.replace(
      'id="complexity" style="text-align: center; background-color:green;',
      'id="complexity" style="text-align: center; background-color:orange;'
    );
    iFail++;
  }
  sReview = sReview.replace("{actions}", data.steps);

  if (data.steps > oRatings.actionRe) {
    sReview = sReview.replace(
      'id="actions" style="text-align: center; background-color:green;',
      'id="actions" style="text-align: center; background-color:red;'
    );
    iWarning++;
  } else if (data.steps > oRatings.actionsAm) {
    sReview = sReview.replace(
      'id="actions" style="text-align: center; background-color:green;',
      'id="actions" style="text-align: center; background-color:orange;'
    );
    iFail++;
  }
  sReview = sReview.replace("{variables}", data.variables);

  if (data.variables > oRatings.variablesRe) {
    sReview = sReview.replace(
      'id="variables" style="text-align: center; background-color:green;',
      'id="variables" style="text-align: center; background-color:red;'
    );
    iWarning++;
  } else if (data.variables > oRatings.variablesAm) {
    sReview = sReview.replace(
      'id="variables" style="text-align: center; background-color:green;',
      'id="variables" style="text-align: center; background-color:orange;'
    );
    iFail++;
  }
  sReview = sReview.replace("{exceptions}", data.exception);

  if (data.exception <= oRatings.exceptionsRe) {
    sReview = sReview.replace(
      'id="exceptions" style="text-align: center; background-color:green;',
      'id="exceptions" style="text-align: center; background-color:red;'
    );
    iWarning++;
  } else if (data.exception < oRatings.exceptions) {
    sReview = sReview.replace(
      'id="exceptions" style="text-align: center; background-color:green;',
      'id="exceptions" style="text-align: center; background-color:orange;'
    );
    iFail++;
  }

  let variablesTable =
    '<table class="mui-table mui-table--bordered" id="variablesTable" ><thead><tr><th>Name</th><th>Type</th><th>Value</th><th>Used</th><th>Named</th><th>Constant</th></tr></thead><tbody>';
  data.variableArray.forEach((item) => {
    sLabel = "";
    if (!item.local) {
      iWarning++;
      sLabel = sIconW;
    }
    if (!item.used) {
      iFail++;
      sLabel = sIconR;
    }
    if (!item.named) {
      iFail++;
      sLabel = sIconR;
    }
    variablesTable =
      variablesTable +
      "<tr><td>" +
      sLabel +
      " " +
      item.name +
      "</td><td>" +
      item.type +
      "</td><td><div contentEditable='true' style='overflow-y:auto; resize:both; background-color:white;'><pre>" +
      inputFormat(item.value) +
      "</pre></div></td><td>" +
      item.used +
      "</td><td>" +
      item.named +
      "</td><td>" +
      item.local +
      "</td></tr>";
  });
  variablesTable = variablesTable + "</tbody></table>";
  sReview = sReview.replace("{variablesTable}", variablesTable);

  let exceptionsTable =
    '<table class="mui-table mui-table--bordered"><thead><tr><th>Action</th><th>Name</th><th>Runafter</th></tr></thead><tbody>';
  data.exceptionArray.forEach((item) => {
    sLabel = "";
    if (!item.runAfter.includes("TimedOut")) {
      iFail++;
      sLabel = sIconR;
    }
    exceptionsTable =
      exceptionsTable +
      "<tr><td>" +
      sLabel +
      " " +
      item.step +
      "</td><td>" +
      item.name +
      "</td><td>" +
      item.runAfter +
      "</td></tr>";
  });
  exceptionsTable = exceptionsTable + "</tbody></table>";
  sReview = sReview.replace("{exceptionsTable}", exceptionsTable);

  let actionsTable =
    '<table class="mui-table mui-table--bordered" id="actionTable"><thead><tr><th style="max-width:24%">Name</th><th style="max-width:24%">Type</th><th style="max-width:24%">Run After</th><th style="max-width:24%">Notes</th><th>Nested</th><th>Id</th></tr></thead><tbody>';
  for (i=0;i<data.actionArray.length; i++){
       
        actionsTable =
        actionsTable +
        "<tr><td id='"+data.actionArray[i].hashId+"'><a href='#"+data.actionArray[i].hashId+"-IN'>" +
        data.actionArray[i].name +
        "</a></td><td>" +
        apiLink(data.actionArray[i].type,data.actionArray[i].step,data.actionArray[i].hashId) +
        "</td><td>" +
        data.actionArray[i].runAfter +
        "</td><td><div contentEditable='true' style='max-height=100px; overflow-y:auto; resize:vertical;'><pre>" +
        data.actionArray[i].notes.replaceAll('<','-').replaceAll("£$","") +
        "</pre></div></td><td>" +
        data.actionArray[i].nested +
        "</td><td>" +
        data.actionArray[i].index +
        "</td></tr>"
};
  
  actionsTable = actionsTable + "</tbody></table>";

  sReview = sReview.replace("{actionsTable}", actionsTable);

  let inputTable =
    '<table class="mui-table mui-table--bordered" id="inputTable"><thead><tr><th style="width:24%">Name</th><th style="width:14%">Type</th><th style="width:6%">Env</th><th>Inputs</th></tr></thead><tbody>';
  data.actionArray.forEach(
    (item) =>
      (inputTable =
        inputTable +
        "<tr><td id='"+item.hashId+"-IN'><a href='#"+item.hashId+"'>" +
        item.name +
        "</a></td><td>" +
        item.step +
        "</td><td>" +
        item.environmentB+
        "</td><td><div contentEditable='true' style='max-height=100px; overflow-y:auto; resize:vertical;'><pre>" +
        inputFormat(item.detail) +
        "</pre></div></td></tr>")
  );
  
  inputTable = inputTable + "</tbody></table>";

  sReview = sReview.replace("{inputTable}", inputTable);

  let connectionsTable =
    '<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Id</th><th>Count</th></tr></thead><tbody>';
  data.connectionArray.forEach(
    (item) =>
      (connectionsTable =
        connectionsTable +
        "<tr><td>" +
        item.conName +
        '</td><td style="max-width:200px">' +
        item.appId +
        "</td><td>" +
        item.count +
        "</td></tr>")
  );
  connectionsTable = connectionsTable + "</tbody></table>";
  sReview = sReview.replace("{connectionsTable}", connectionsTable);

  let apiTable =
    '<table class="mui-table mui-table--bordered" id="apiTable"><thead><tr><th>Name</th><th>Type</th><th>Connector</th><th>Filter</th><th>Pagination</th><th>Retry</th></tr></thead><tbody>';

  data.apiActionArray.forEach((item) => {
    sLabel = "";
    if (item.filter == "" && item.step == "GetItems") {
      iWarning++;
      sLabel = sIconW;
    }
    if (item.pagination == "" && (item.step == "GetItems" || item.step.includes('ListMyTasks'))) {
      iWarning++;
      sLabel = sIconW;
    }
    if (item.retry == "" && item.step == "PatchItem") {
      iWarning++;
      sLabel = sIconW;
    }
    if (item.tier != "Standard") {
      if (sLabel != "") {
        sLabel = sLabel + " ";
      }
      if (item.tier == "Premium") {
        sLabel = sLabel + sPrem;
      }
    }
   
    apiTable =
      apiTable +
      "<tr><td id='"+item.hashId+"-API'><a href='#"+item.hashId+"'>" +
      sLabel +
      " " +
      item.name +
      "</td><td>" +
      item.step +
      '</td><td style="max-width:200px">' +
      item.connector +
      '</td><td style="max-width:200px; max-height:100px; overflow-y:auto;">'+
      item.filter +
      "</td><td>" +
      item.pagination +
      '</td><td style="max-width:200px; max-height:100px; overflow-y:auto;">'+
      item.retry +
      "</td></tr>";
  });
  
  apiTable = apiTable + "</tbody></table>";
  sReview = sReview.replace("{apiTable}", apiTable);

  const iRating = rating(data);
  let sBar =
    '<div style="background-color:#EEEEEE"><div style="width:' +
    iRating +
    '%; background-color:{barColour}; color:white; text-align:center">' +
    iRating +
    "</div></div>";
  if (iRating < 75) {
    sBar = sBar.replace("{barColour}", "red");
  } else if (iRating < 90) {
    sBar = sBar.replace("{barColour}", "orange");
  } else {
    sBar = sBar.replace("{barColour}", "green");
  }

  sBar =
    sBar +
    '<table class="mui-table mui-table--bordered"><thead><tr><th></th><th></th></tr></thead><tbody><tr><td><h2>Warnings</h2></td><td><h2>' +
    iWarning +
    "</h2></td></tr><tr><td><h2>Failures</h2></td><td><h2>" +
    iFail +
    "</h2></td></tr></tbody></table>";
  sReview = sReview.replace("{ratingBar}", sBar);
  let sTrigger =
    "<div style='padding-left:10px'<b>Type: " +
    data.trigger +
    "</b><br><p><b>Data: </b>" +
    data.triggerData +
    "</b><br><p><b>Parameters: </b>" +
    data.triggerParam.replaceAll("£$","") +
    "</p><p><b>Configuration:</b> " +
    data.triggerConfig.replaceAll("£$","") +
    "</p><b>Inputs:</b> " +
    data.triggerInputs.replaceAll("£$","") +
    "</p><p><b>Recurrence: </b>" +
    data.triggerRecur +
    "</p><p><b>Expressions:</b> " +
    data.triggerExpress +
    "</p></div>";

  sReview = sReview.replace("{trigger}", sTrigger);

  const notesElm = document.getElementById("actionNotes");
  let sAct="";

  let aAct=data.actionArray.filter((item)=>
    item.notes!="" && item.notes!=null
  )

  aAct.forEach((object) => {
    sAct=sAct+object.name+": "+object.notes+"\n"
    
  });  

  sReview = sReview.replace("{connectorsTable}", "");

}

function rating(data) {
  let iScore = 0;

  if (data.exceptionScope && data.exceptionTerminate && data.exceptionLink) {
    iScore = iScore + aScoring.find((item) => item.Name == "exceptionScope").Score;
  }

  if (data.mainScope) {
    iScore = iScore + aScoring.find((item) => item.Name == "mainScope").Score;
  }

  if (data.varNaming) {
    iScore = iScore + aScoring.find((item) => item.Name == "varNaming").Score;
  }

  if (data.varNameUse) {
    iScore = iScore + aScoring.find((item) => item.Name == "varUsed").Score;
  }

  if (data.varNameConsts) {
    iScore = iScore + aScoring.find((item) => item.Name == "varConstant").Score;
  }

  let iCompose =
    aScoring.find((item) => item.Name == "composes").Score -
    data.composes *
      aScoring.find((item) => item.Name == "composesDeduction").Score;
  if (iCompose < 0) {
    iCompose = 0;
  }
  iScore = iScore + iCompose;

  let iVariable =
    aScoring.find((item) => item.Name == "variables").Score -
    data.variables *
      aScoring.find((item) => item.Name == "variablesDeduction").Score;
  if (iVariable < 0) {
    iVariable = 0;
  }
  iScore = iScore + iVariable;

  let iConnectorRef;
  if (
    data.connectionRefs >
    aScoring.find((item) => item.Name == "connectionsMin").Score
  ) {
    iConnectorRef =
      aScoring.find((item) => item.Name == "connections").Score -
      (data.connectionRefs -
        aScoring.find((item) => item.Name == "connectionsMin").Score) *
        aScoring.find((item) => item.Name == "connectionsDeduction").Score;
  } else {
    iConnectorRef = aScoring.find((item) => item.Name == "connections").Score;
  }
  if (iConnectorRef < 0) {
    iConnectorRef = 0;
  }
  iScore = iScore + iConnectorRef;

  let iComplexity = aScoring.find(
    (item) => item.Name == "complexityGreen"
  ).Score;
  if (data.complexity > oRatings.complexityRe) {
    iComplexity = aScoring.find((item) => item.Name == "complexityRed").Score;
  } else if (data.complexity > oRatings.complexityAm) {
    iComplexity = aScoring.find((item) => item.Name == "complexityAmber").Score;
  }
  iScore = iScore + iComplexity;

  let iActions = aScoring.find((item) => item.Name == "actionsGreen").Score;
  if (data.steps > oRatings.actionRe) {
    iActions = aScoring.find((item) => item.Name == "actionsAmber").Score;
  } else if (data.steps > oRatings.actionsAm) {
    iActions = aScoring.find((item) => item.Name == "actionsAmber").Score;
  }
  iScore = iScore + iActions;

  return iScore;
}

function getToday() {
  let date = new Date();
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/");
}

let result;

$.ajax({
  url: urlConnectors,
  success: function (result) {
    aConnectionTier = JSON.parse(result).value;
    
  }
}).fail(function (data) {
  aConnectionTier = null;
 
});

function apiLink(type,step,hashId){
  
  if(type=='OpenApiConnection'){
    return "<a href='#"+hashId+"-API'>"+step+"</a>"
  }else{
    return step
  }
}

function inputFormat(input) {
  if(input==undefined || input==null){return ""};
  let oJson=input.replaceAll('<','&lt;').replaceAll("£$","");
  oJson=oJson.replace(/\\n/g, "\n");
  oJson=oJson.replace(/\\r/g, "");
  oJson=oJson.replace(/\\t/g, "");
  return oJson.replaceAll('{','{ \n').replaceAll('}','} \n')
}
  
function listSolution(object){

  let sSolution=sSolutionTemplate;
  let dependenciesTable="";
  let variablesTable="";
  let connectionsTable ="";
  sSolution = sSolution.replace("{flowName}", oDependencies.ImportExportXml.SolutionManifest.UniqueName);
  sSolution = sSolution.replace("{flowId}", oDependencies.ImportExportXml.SolutionManifest.Version);
  sSolution = sSolution.replace("{owner}", oDependencies.ImportExportXml.SolutionManifest.Publisher.UniqueName);
  sSolution = sSolution.replace("{date}", getToday());

  if(object.ConnectionRefs.length>0 ){
    console.log(object.ConnectionRefs)
    connectionsTable =
    '<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Type</th><th>id</th><th>Cusomizable</th></tr></thead><tbody>';
    object.ConnectionRefs.forEach((item) => {
      let bCustomise=item.iscustomizable==1;
      connectionsTable =
      connectionsTable +
          "<tr><td>" +
          item.connectionreferencedisplayname +
          '</td><td>' +
          item.connectorid.split("/apis/")[1] +
          "</td><td>" +
          item.connectionreferencelogicalname +
          "</td><td>" +
          bCustomise+
          "</td></tr>"
      }
    );
    connectionsTable+= "</tbody></table>"; 
  }

  if(oDependencies?.ImportExportXml?.SolutionManifest?.MissingDependencies?.MissingDependency != undefined ){
    let aDependencies=oDependencies.ImportExportXml.SolutionManifest.MissingDependencies.MissingDependency;
    if(aDependencies){
      dependenciesTable =
      '<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Type</th><th>Dependent</th></tr></thead><tbody>';
      aDependencies.forEach((item) => {
        dependenciesTable =
        dependenciesTable +
            "<tr><td>" +
            item.Required.displayName +
            '</td><td>' +
            item.Required.type +
            "</td><td>" +
            item.Dependent.displayName +
            "</td></tr>"
        }
      );
      dependenciesTable+= "</tbody></table>";
    }
  };    
  if(aEnvironmentVar.length>0){
    variablesTable= '<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Type</th><th>Cusomizable</th></tr></thead><tbody>';
    
    aEnvironmentVar.forEach((item) => {
      let bCustomise=item.environmentvariabledefinition.iscustomizable==1;
      variablesTable =
      variablesTable +
          "<tr><td>" +
          item.environmentvariabledefinition.displayname.default +
          '</td><td>' +
          item.environmentvariabledefinition.type +
          "</td><td>" +
          bCustomise +
          "</td></tr>"
      }
    );
    variablesTable+= "</tbody></table>";

  }
  sSolution=sSolution.replace("{connectionsTable}",connectionsTable);
  sSolution=sSolution.replace("{variablesTable}",variablesTable);
  sSolution=sSolution.replace("{dependenciesTable}",dependenciesTable);
  sSolution=sSolution.replace("{json}",JSON.stringify(object, undefined, 2) );
  
  return sSolution
}

async function fetchAPIData(url, token) {
  try {
    const options = {
      headers: {
        Authorization: token,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching API data:', error);
  }
}

let owner = "";
let aActionReturn = [];
let sActiveTab;
let sFlowAPI="";
let sAPIflow="";
const regExFlow=new RegExp( '/flows\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
const regExEnvir=new RegExp( '/environments\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
const regExEnvirD=new RegExp( '/environments\/Default-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

function CreateReview(
  $inputString,
  sName,
  sId,
  aComplexity,
  aNaming,
  aConnectionTier,
  sOwner,
  sEnvironment
) {

  const sExceptLink ="concat('https://make.powerautomate.com/manage/environments/', workflow()?['tags']?['environmentName']";
  const sExceptLink2 ="concat('https://make.powerautomate.com/manage/environments/',workflow()?['tags']?['environmentName']";
  let oInput;
  let sError = "";
  
  const regExpEnviron = new RegExp('@parameters(.*?)\\)', "gm");
  const regExpEnviron2 = new RegExp('@{parameters(.*?)\\)', "gm");
  
  aActionReturn.length=0;

  let aVariableReturn = [];
  let aConnectionReturn = [];
  let aExceptionList = [];
  let aApiList = [];
  let aActionObjects = [];

  let sTrigger = "unknown";
  let sTriggerParam = "none";
  let sTriggerdata= "none";
  let sTriggerConfig = "none";
  let sTriggerExpress = "none";
  let sTriggerInputs = "none";
  let sTriggerRecur = "none";

  if (sOwner == "" || sOwner==undefined) {
    sOwner = "please input";

  }

  oInput = JSON.parse($inputString);
  

if(oInput.properties?.displayName!= undefined){
  sName=oInput.properties.displayName;
  sId=oInput.name;
}else if(oInput.name!=undefined){
  sId=oInput.name
}

const aActions=getChildren (oInput.properties.definition,new Array(),0,"root");

const keys = Object.keys(oInput.properties.definition.triggers);

keys.forEach((key) => {
  value=oInput.properties.definition.triggers[key]
  sTrigger=key;
 
  if(value?.inputs?.schema!=null){
    sTriggerParam=JSON.stringify(value.inputs)
  }
  if(value?.inputs?.parameters!=null){
    sTriggerParam=JSON.stringify(value.inputs)
  }
  if(value?.inputs?.parameters!=null){
    sTriggerdata=JSON.stringify(value.inputs.parameters)
  }
  if(value?.recurrance != null){
    sTriggerRecur=key.recurrance
  }
  if(value?.conditions != null){
    if(value.conditions[0]?.expression != null){
      sTriggerExpress=value.conditions[0].expression
    }
  }
  if(value?.inputs?.schema?.properties != null){
    sTriggerInputs= JSON.stringify(value.inputs.schema.properties)
  }
  if(value?.runtimeConfiguration != null){
    sTriggerConfig= JSON.stringify(value.runtimeConfiguration)
  }
});

//// actions
aActions.forEach((item,index) =>{
  let sId="MISSING";
  if(item.metadata?.operationMetadataId!=null){sId=item.metadata.operationMetadataId}

  let sStep="";
  let sConnector=""
  let sConApiID=""
  if(item.type=="OpenApiConnection"){
    sStep=item.inputs.host.operationId;
    sConnector=item.inputs.host.connectionName;
    sConApiID=item.inputs.host.apiId;
  }else{
    OpenApiConnection=item.type
    sStep=item.type
  }

  let sNewTier = "Standard";
  let sNewImgURL = null;
  if (sConnector != "") {
    let sNewConnectorInfo = aConnectionTier.find((c) =>
      c.name.includes(sConnector.substring(0, sConnector.length - 2).trim())
    );
    if (sConnector=="shared_sendmail" || sConnector=="shared_teams"){
      sNewTier = "Standard";
    }else if (sNewConnectorInfo != undefined) {
      sNewTier = sNewConnectorInfo.properties.tier;
      sNewImgURL = sNewConnectorInfo.properties.iconUri;
    } else {
      sNewTier = "Premium";
    }
  }

  let sRunAfter="";
  let sPosition="|";
  let sException="Non-Exception";
  if(item.runAfter==undefined){item.runAfter=item.parent}
  const keys = Object.keys(item.runAfter);
  keys.forEach((key) => {
    sPosition+=key+"|";
    sRunAfter=key+":"+JSON.stringify(item.runAfter[key]).replaceAll(","," | ");
    if(JSON.stringify(item.runAfter[key]).includes("Failed")){sException="Exception"}
  });

  if(sPosition=="|" && item.nestedLevel==0){sPosition="|trigger|"};
  if(sPosition=="|" && item.nestedLevel!=0){
    sPosition="|"+item.parent+"|"
  };

  if(sRunAfter.length>1){
    sRunAfter=sRunAfter.substring(0,sRunAfter.length-1)
  }

  let iNewComplexity;
  let aNewComplexFind = aComplexity.find((c) =>
      c.Name.includes(sStep + sConnector) || c.Name == item.type
  );

  if (aNewComplexFind != null) {
    iNewComplexity = Number(aNewComplexFind.Complexity);
  } else {
    iNewComplexity = 1;
  }
  let sFilter="";
  if(item?.inputs?.parameters?.$filter !=null){
    sFilter=item.inputs.parameters.$filter
  }
  let sRetry="";
  let sRetryDetail="";
  if(item?.inputs?.retryPolicy !=null){
    sRetry=item.inputs.retryPolicy.type
    sRetryDetail=JSON.stringify(item.inputs.retryPolicy);
  }
  let sPagination="";
  if(item?.runtimeConfiguration?.paginationPolicy !=null){
    sPagination=item.runtimeConfiguration.paginationPolicy.minimumItemCount
  }
  let sSecure="";
  if(item?.runtimeConfiguration?.secureData !=null){
    sSecure=JSON.stringify(item.runtimeConfiguration.secureData)
  }
  let sTimeout="";
  if(item?.limit?.timeout !=null){
    sTimeout=item.limit.timeout
  }
  let sNotes="";
  if(item?.description !=null){
    sNotes=item.description
  }

  let oTempItem=item;
  if(oTempItem.hasOwnProperty('actions')){delete oTempItem.actions}
  let aEnvironVar=JSON.stringify(oTempItem).match(regExpEnviron);

  let bEnvironVar=false;
  if(aEnvironVar){
    aEnvironVar=aEnvironVar.filter((object) => object!="@parameters('$authentication')");
    if(aEnvironVar.length>0){
      bEnvironVar=true
    }
  }

  if(!bEnvironVar){
    aEnvironVar=JSON.stringify(oTempItem).match(regExpEnviron2);
    if(aEnvironVar){
      aEnvironVar=aEnvironVar.filter((object) => object!="@{parameters('$authentication')");
      if(aEnvironVar.length>0){
        bEnvironVar=true
      }
    }
  }

  let sPostionInfo="";
  if(item.nestedLevel>0){sPostionInfo="Internal"}

  let sDetails="";
  if(item.inputs==undefined){
    sDetails="";
  }else if(item.inputs.hasOwnProperty('parameters')){
    sDetails=JSON.stringify(item.inputs.parameters);
  }else{
    sDetails=JSON.stringify(item.inputs);
  }

  if(item.hasOwnProperty('foreach')){
    sDetails=JSON.stringify(item.foreach);
  }

  if(item.hasOwnProperty('expression')){
    sDetails=JSON.stringify(item.expression);
  }

  let row = {
    name: item.operationName,
    step:  sStep,
    type: item.type,
    id: sId,
    hashId: sId+"###"+(index+1),
    tier: sNewTier,
    connector: sConnector,
    imgURL: sNewImgURL,
    runAfter: sRunAfter.replace(/[\[\]""]/g,""),
    exception: sException,
    index: index+1,
    object:item,
    complexity: iNewComplexity,
    detail: sDetails,
    filter: sFilter,
    pagination: sPagination,
    secure: sSecure,
    retry: sRetry,
    timeout: sTimeout,
    position: sPosition,
    positionInfo:sPostionInfo,
    environmentVariables:JSON.stringify(aEnvironVar),
    environmentB:bEnvironVar,
    notes:sNotes,
    parent:item.parent,
    apiId:sConApiID,
    branch:item.branch
  };

  aActionReturn.push(row);

  row={
    step: sStep,
    connector: sConnector,
    name:  item.operationName,
    id: sId,
    hashId: sId+"###"+(index+1),
    object: JSON.stringify(item),
    type:item.type,
    index: index+1,
    parent:item.parent
  }
    aActionObjects.push(row)

})

aActionReturn.forEach(item => {
  if(item.position=="|trigger|"){
    item.positionIndex="|0";
    item.positionType="|trigger"
    item.nested="";
  }else{
    item.positionIndex="";
    item.positionType="";
    item.nested="";
    const aPosition=aActionReturn.filter(value => item.position.includes("|"+value.name+"|") );
    aPosition.forEach(object =>{
      item.positionIndex+="|"+(Number(object.index));
      item.positionType+="|"+object.type; 
      let sFullNest=getNesting(item.parent)+"";
  
      if(sFullNest.substring(sFullNest.length-2,2)=="|0"){
        sFullNest=sFullNest.substring(0,sFullNest.length-2)
      };
      if(sFullNest=="0" || sFullNest==undefined || sFullNest==null|| sFullNest=="undefined"){
        sFullNest="";
      };
      item.nested=sFullNest; 
    })
  } 
})


///variables
const aHasDetail=aActionReturn.filter(item =>
  item.detail !=null && item.detail !=undefined && item.type!="InitializeVariable"
);

const aVariables=aActions.filter(item =>
  item.type=="InitializeVariable"
)

aVariables.forEach(item => {
  let sNameLead="";
  let sNamedCorrect=false;
  let sNameLocal=false;

  const oInputs=item.inputs.variables[0];
  const aFindUse=aHasDetail.filter(object =>
    typeof object.detail === 'string' && object.detail.includes(oInputs.name)
  );

  if (aNaming.data.filter((object) => object.Type == oInputs.type).length > 0) {
    sNameLead = aNaming.data.find((object) => object.Type == oInputs.type).Letter;
  }

  if (oInputs.name.substring(0,aNaming.char ) == sNameLead) {
    sNamedCorrect = true;
  }

  if (oInputs.value != "" && oInputs.value!= undefined && oInputs.value!= null) {
    if (oInputs.name.substring(1, oInputs.name.length - 1) ===
    oInputs.name.substring(1, oInputs.name.length - 1).toUpperCase()) {
      sNameLocal = true;
    }
  } else {
    sNameLocal = true;
  }

  let sValue=""

  if(isObject(oInputs.value)){
    sValue=JSON.stringify(oInputs.value);
  }else if(oInputs.value==undefined){
    sValue="";
  }else{
    sValue=oInputs.value+"";
  }

  if(oInputs.value==undefined){oInputs.value=""}
  aVariableReturn.push({
    name: oInputs.name,
    type: oInputs.type,
    value: sValue,
    used: aFindUse.length>0,
    named: sNamedCorrect,
    local: sNameLocal
  });

})

//// connection refs
  getDistinct(aActionReturn).forEach(item =>{
    const oAction=aActionReturn.find((object) =>  object.connector==item);
    aConnectionReturn.push({
      conName: item,
      appId: oAction.apiId,
      opId: oAction.step,
      count: aActionReturn.filter((object) =>  object.connector==item).length
    })

  })

  aApiList=aActionReturn.filter((item) => 
    item.type=="OpenApiConnection"
  )

  aExceptionList = aActionReturn.filter((item) => 
    item.exception == "Exception"
  );

  let bName;
  if (aVariableReturn.length == 0) {
    bName = true;
  } else {
    bName = aVariableReturn.every((element) => element.named === true);
  }
  let bLocal;
  if (aVariableReturn.length == 0) {
    bLocal = true;
  } else {
    bLocal = aVariableReturn.every((element) => element.local === true);
  }
  let bUsed;
  if (aVariableReturn.length == 0) {
    bUsed = true;
  } else {
    bUsed = aVariableReturn.every((element) => element.used === true);
  }

  let aExceptionScope = aExceptionList.filter(
    (item) => item.name == "Exception"
  );

  let bExceptionTerminate = false;
  let bExceptionLink =false

  if(aExceptionScope){
    bExceptionTerminate =aExceptionScope.length > 0 && JSON.stringify(aExceptionScope[0].object).includes("Terminate");
    bExceptionLink=aExceptionScope.length > 0 && (JSON.stringify(aExceptionScope[0].object).includes(sExceptLink) || JSON.stringify(aExceptionScope[0].object).includes(sExceptLink2));
  }

  aActionReturn.forEach((object) => {
    delete object["object"];
    delete object["apiId"];
    let oParent= aActionReturn.find((item) =>
        item.name==object.parent
      );
    if(oParent !=null){
      if(oParent.type!="If" && oParent.type!="Switch"){object.branch=""}
    }
  })
  
  let oReturn = {
    name: sName,
    id: sId,
    environment: sEnvironment,
    owner: sOwner,
    trigger: sTrigger,
    triggerData: sTriggerdata,
    triggerParam: sTriggerParam,
    triggerConfig: sTriggerConfig,
    triggerExpress: sTriggerExpress,
    triggerInputs: sTriggerInputs,
    triggerRecur: sTriggerRecur,
    premium: !aActionReturn.every((element) => element.tier === "Standard"),
    connectionRefs: aConnectionReturn.length,
    connectors: aApiList.length,
    steps: aActionReturn.length,
    variables: aVariableReturn.length,
    complexity: sumObj(aActionReturn, "complexity"),
    varNaming: bName,
    varNameConsts: bLocal,
    varNameUse: bUsed,
    composes: aActionReturn.filter((item) => item.type=="Compose").length,
    exception: aExceptionList.length,
    exceptionHandleScope: aExceptionList.filter((item) => item.step == "Scope").length > 0,
    exceptionScope: aExceptionScope.length > 0,
    exceptionTerminate: bExceptionTerminate,
    exceptionLink: bExceptionLink,
    mainScope: aActionReturn.filter((item) => item.name == "Main").length > 0,
    variableArray: aVariableReturn,
    actionArray: aActionReturn,
    apiActionArray: aApiList,
    exceptionArray: aExceptionList,
    connectionArray: aConnectionReturn,
    error: sError,
    actionObjectArray:aActionObjects
  };

  return oReturn;
}


function getNesting(parent){
  let sParents;
  if(parent!="root"){   
    let oParent =aActionReturn.find(item => { return item.name==parent}); 
    sParents=oParent.index
    if (oParent.parent!="root"){
      sParents+= "|"+getNesting(oParent.parent)
    }
  }
  return sParents
}

function getChildren(object,aReturn,nested,parent){
  if(object?.actions!= undefined){
    const keys = Object.keys(object.actions);
    keys.forEach((key) => {
      let value = object.actions[key];
      value.operationName=key;
      value.nestedLevel=nested,
      value.parent=parent,
      value.branch="Yes"
      aReturn.push(value);
      aReturn=getChildren(value,aReturn,nested+1,key)
    });
  }
  if(object?.else!= undefined){
    const keys = Object.keys(object.else.actions);
    keys.forEach((key) => {
      let value = object.else.actions[key];
      value.operationName=key;
      value.nestedLevel=nested,
      value.parent=parent,
      value.branch="No"
      aReturn.push(value);
      aReturn=getChildren(value,aReturn,nested+1,key)
    });
  }


  if(object?.cases!= undefined){
    const keys = Object.keys(object.cases);
    keys.forEach((key) => {
      let value = object.cases[key];     
      const keys2 = Object.keys(value.actions);
      keys2.forEach((key2) => {   
        
        let value2 = object.cases[key].actions[key2];
        value2.operationName=key2;
        value2.nestedLevel=nested,
        value2.parent=parent,
        value2.branch=key
        aReturn.push(value2);
        aReturn=getChildren(value2,aReturn,nested+1,key2)
      })
    });
    const keysDef = Object.keys(object.default.actions);
    keysDef.forEach((keyDef) => {
      let valueDefault=object.default.actions[keyDef];
      valueDefault.operationName=keyDef;
      valueDefault.nestedLevel=nested,
      valueDefault.parent=parent,
      valueDefault.branch="Default"
      aReturn.push(valueDefault);
      aReturn=getChildren(valueDefault,aReturn,nested+1,valueDefault)
    })
    
  }
  return aReturn
}

function sumObj(arr = [], field) {
  let sum = 0;
  sum = arr.reduce((accumulator, object) => {
    return accumulator + object[field];
  }, 0);
  return sum;
}

function getParent(data){
  let sortArray = data.sort((a, b) => {
      return a.value - b.value;  
  });
  return sortArray[0]
}

function distanceBetween(str,action,parent) {
  return Math.abs(str.indexOf(action) - str.indexOf(parent));
}


function getDistinct(arr) {
  const distinctCon = new Set();
  for (const obj of arr) {
    if(obj.connector!=""){
      distinctCon.add(obj.connector);
    }
  }
  
  return Array.from(distinctCon);
}

function isObject(objValue) {
  return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

function removeItemById(array, idToRemove) {
  return array.filter(item => item.flow !== idToRemove);
}


