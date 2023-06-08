const startClear = document.getElementById('load');
startClear.addEventListener('click', function() {
    load();
  });
startClear.click();

function load() {

  const oReport=JSON.parse(sessionStorage.getItem('report'));
console.log(oReport);
  document.getElementById('count-components').innerHTML="Component Table Count: "+oReport.counts.components;
  document.getElementById('count-global').innerHTML="Global Variable Count: "+oReport.counts.global;

  document.getElementById('content-codeBlock').innerHTML=oReport.codeBlock;
  document.getElementById('content-components').innerHTML=oReport.components;
  document.getElementById('content-formula').innerHTML=oReport.formula;
  document.getElementById('content-global').innerHTML=oReport.global;
  document.getElementById('content-local').innerHTML=oReport.local;
  document.getElementById('content-collections').innerHTML=oReport.collections;
  //document.getElementById('content-connections').innerHTML=oReport.connections;
  document.getElementById('content-dataSources').innerHTML=oReport.dataSources;
  document.getElementById('container-connectionDetails').innerHTML=oReport.connectionDetail;
  document.getElementById('content-references').innerHTML=oReport.references;
  document.getElementById('content-envirVars').innerHTML=oReport.environmentVariables;
  document.getElementById('content-flows').innerHTML=oReport.flows;
  document.getElementById('content-tables').innerHTML=oReport.tables;
  document.getElementById('content-diagram').innerHTML=oReport.diagram;
  document.getElementById('content-tests').innerHTML=oReport.test;
  document.getElementById('content-dependencies').innerHTML=oReport.missingDependencies;

  document.getElementById('content-app').innerHTML=oReport.app.Name;
  document.getElementById('content-appA').innerHTML=oReport.app.appA;
  document.getElementById('content-appB').innerHTML=oReport.app.appB;
  document.getElementById('content-appC').innerHTML=oReport.app.appC;
  document.getElementById('content-appD').innerHTML=oReport.app.appD;
  document.getElementById('content-app1').innerHTML=oReport.app.app1;
  document.getElementById('content-app2').innerHTML=oReport.app.app2;
  document.getElementById('content-app3').innerHTML=oReport.app.app3;
  document.getElementById('content-app4').innerHTML=oReport.app.app4;

  document.getElementById('content-solutionFlag').innerHTML=oReport.flags.isSolution;
  document.getElementById('content-connectionRefsFlag').innerHTML=oReport.flags.connectionRefs;
  document.getElementById('content-EnvirnomentVarFlag').innerHTML=oReport.flags.enivironmentVar;
  document.getElementById('content-missingDependencyFlag').innerHTML=oReport.flags.missingDependencies;
  document.getElementById('content-screenFlag').innerHTML=oReport.flags.screens;
  document.getElementById('content-connectionsFlag').innerHTML=oReport.flags.connections;
  document.getElementById('content-conPerScreenFlag').innerHTML=oReport.flags.componentsPerScreen;
  document.getElementById('content-concurrentFlag').innerHTML=oReport.flags.concurrent;
  document.getElementById('content-filterFlag').innerHTML=oReport.flags.doubleFilter;
  document.getElementById('content-iferrorFlag').innerHTML=oReport.flags.iferror;

  document.getElementById('content-checkerFlag').innerHTML=oReport.flags.checker;

  updateFlags(oReport.flags);
}


function updateFlags(oFlags){
  const sSuccessColour="card border-left-success shadow h-100 py-2";
  const sFailColour="card border-left-danger shadow h-100 py-2"
  const sFailWarning="card border-left-warning shadow h-100 py-2"

  const elmSolution=document.getElementById('border-solutionFlag');
  const elmConnectionRefs=document.getElementById('border-connectionRefsFlag');
  const elmEnvirnomentVars=document.getElementById('border-EnvirnomentVarFlag');
  const elmMissingdependencies=document.getElementById('border-missingDependencyFlag');
  const elmScreens=document.getElementById('border-screenFlag');
  const elmConnections=document.getElementById('border-connectionsFlag');
  const elmConPerScreen=document.getElementById('border-conPerScreenFlag');
  const elmConcurrent=document.getElementById('border-concurrentFlag');
  const elmFilter=document.getElementById('border-filterFlag');
  const elmIferror=document.getElementById('border-iferrorFlag');
  const elmChecker=document.getElementById('border-checkerFlag');

  if(oFlags.isSolution){
    elmSolution.setAttribute("class", sSuccessColour)
  }else{
    elmSolution.setAttribute("class", sFailColour)
  }
  if(oFlags.connectionRefs){
    elmConnectionRefs.setAttribute("class", sSuccessColour)
  }else{
    elmConnectionRefs.setAttribute("class", sFailColour)
  }
  if(oFlags.enivironmentVar){
    elmEnvirnomentVars.setAttribute("class", sSuccessColour)
  }else{
    elmEnvirnomentVars.setAttribute("class", sFailColour)
  }
  if(oFlags.missingDependencies){
    elmMissingdependencies.setAttribute("class", sFailColour)
  }else{
    elmMissingdependencies.setAttribute("class", sSuccessColour)
  }
  if(oFlags.screens){
    elmScreens.setAttribute("class", sSuccessColour)
  }else{
    elmScreens.setAttribute("class", sFailWarning)
  }
  if(oFlags.connections){
    elmConnections.setAttribute("class", sSuccessColour)
  }else{
    elmConnections.setAttribute("class", sFailColour)
  }
  if(oFlags.componentsPerScreen){
    elmConPerScreen.setAttribute("class", sSuccessColour)
  }else{
    elmConPerScreen.setAttribute("class", sFailColour)
  }
  if(oFlags.concurrent){
    elmConcurrent.setAttribute("class", sSuccessColour)
  }else{
    elmConcurrent.setAttribute("class", sFailWarning)
  }
  if(oFlags.doubleFilter){
    elmFilter.setAttribute("class", sFailColour)
  }else{
    elmFilter.setAttribute("class", sSuccessColour)
  }
  if(oFlags.iferror){
    elmIferror.setAttribute("class", sSuccessColour)
  }else{
    elmIferror.setAttribute("class", sFailWarning)
  }
  if(oFlags.elmChecker==""){
    elmIferror.setAttribute("class", sSuccessColour)
  }else{
    elmIferror.setAttribute("class", sFailWarning)
  }
}

downloadElem.addEventListener("click", function() {
  downloadHTML()
});

function downloadHTML(){

  let sHTML=document.querySelector("html").innerHTML;
  let sName=document.getElementById("content-app").innerHTML;
  sHTML='<!doctype html><html lang="en">'+sHTML+'</html>';
  
  sHTML=sHTML.replace('<div class="mui--text-white mui--text-body2" style="font-size:10px" id="download">Download</div>','');
  sHTML=sHTML.replaceAll('src="assets/','src="https://wyattdave.github.io/Auto-Review/appreview/assets/');
  sHTML=sHTML.replaceAll('href="assets/','href="https://wyattdave.github.io/Auto-Review/appreview/assets/');
  sHTML=sHTML.replaceAll('src="vendor/','src="https://wyattdave.github.io/Auto-Review/appreview/assets/vendor/');
  sHTML=sHTML.replaceAll('href="vendor/','href="https://wyattdave.github.io/Auto-Review/appreview/assets/vendor/');
  sHTML=sHTML.replaceAll('href="css/','href="https://wyattdave.github.io/Auto-Review/appreview/css/');

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
  encodeURIComponent(sHTML));
  element.setAttribute('download', sName+'.html');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

}