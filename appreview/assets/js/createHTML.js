alert("The site hosting this javascript is getting deprecated, please create new review export");
function generateCodeReport() {

    ////Components and code block
    let aComponents=[];
    let sScreen="";
    aScreens.forEach(parent =>{
      sScreen+=parent.Screen+"<br>";
      parent.Components.forEach(item =>{
        aComponents=[...aComponents,...item]
      })
    })
  
    let sCodeJson="";
    let sFormulas="";
    let iComponentCount=0;
    let sOnstartScript="";
   
console.log(appData)
    if(appData.OnStart){
      sCodeJson+='<span class="lightGrey-width"><b>Application - Start</b></span><br>OnStart<br><br>'+appData.OnStart.InvariantScript.replaceAll('\n','<br>').replaceAll(' ','&nbsp;')+"<br><br>"
      sOnstartScript=appData.OnStart.InvariantScript
    };
  
    let sTable='<div class="table-responsive"><table class="table table-bordered" id="table-components" width="100%" cellspacing="0"><tr><th>Screen</th><th>Name</th><th>Type</th><th>Parameter</th><th>Code</th></tr>';
  
    let aLocalVarBySceen=[];
    aComponents.forEach(parent=>{
      parent.Rules.forEach(item=>{
        let sScript=item.InvariantScript.replace(RegExHtml,'');
        sTable+='<tr><td>'+
        parent.Screen
        +'</td><td>'+
        parent.Name
        +'</td><td>'+
        parent.StyleName
        +'</td><td>'+
        item.Property
        +'</td><td>'+
        sScript
        +'</td></tr>';
  
        // if(item.Property.substring(0,2)=="On"){  
        if(sScript.substring(0,3)!="RGB" && sScript.length>4){  
          sCodeJson+='<span class="lightGrey-width"><b>'+parent.Name+" - "+parent.StyleName+" / Screen:"+parent.Screen+"</b></span><br><b>"+item.Property+"</b><br>"+sScript.replaceAll('\r\n','<br>').replaceAll(' ','&nbsp;')+"<br><br>"
        }
        ///array for local variables to know screen
        aLocalVarBySceen.push({screen:parent.Screen,code:sScript});
        
      })
    })
    sTable+="</table></div>"
  
    let aComponentTotals=appConfig.Components.filter(item=>{
      return item.Component !="TestSuite" && item.Component !="TestCase" && item.Component !="screen"
    })
  
    iComponentCount=aComponentTotals.map(item => item.Count).reduce((prev, curr) => prev + curr, 0);
    let sScreenCount=appConfig.Components.find(({ Component }) => Component == "screen").Count;
  
  
    ////variables
    ///local
    let aLocalVar=[]; 
    aLocalVarBySceen.forEach(itemScreen =>{
      let aAllLocal=[...itemScreen.code.matchAll(RegExUpdateCon)].map(match => match[1]);
      let aLocalVarAll= [...new Set(aAllLocal)];
  
      aLocalVarAll.forEach(item =>{    
        let aVarSplit=item.split(',');
        aVarSplit.forEach(childItem =>{
          let sVar=childItem.split(':')[0];
          let iVar=aAllLocal.filter(item2 =>{return item2.includes(sVar)}).length;
          let iAllVar=sTable.split(sVar).length-(iVar+1);
          aLocalVar.push({variable:sVar,screen:itemScreen.screen,set:iVar,used:iAllVar});
        }); 
      })
    });
  
    let sTableVarLo='<div class="table-responsive"><table class="table table-bordered" id="table-global" width="100%" cellspacing="0"><tr><th>Variable</th><th>Screen</th><th>Count_Set</th><th>Count_Used</th></tr>';
    let aLocalVarAll= Array.from(new Set(aLocalVar.map(item => JSON.stringify(item)))).map(str => JSON.parse(str));
  
    aLocalVarAll.forEach(item =>{
      sTableVarLo+="<tr><td>"+item.variable+"</td><td>"+item.screen+"</td><td>"+item.set+"</td><td>"+item.used+"</td></tr>";
    });
    sTableVarLo+="</table></div>"
  
  ///global
    let aAllGlobal=sCodeJson.match(RegExSet);
    let aGlobalVarAll= [...new Set(aAllGlobal)];
    let aGlobalVar=[];
    let sTableVarGl='<div class="table-responsive"><table class="table table-bordered" id="table-global" width="100%" cellspacing="0"><tr><th>Variable</th><th>Type</th><th>Count_Set</th><th>Count_Used</th></tr>';
    
    aGlobalVarAll.forEach(item =>{    
      let sVar=item.substring(4,item.length-1);
      let iVar=aAllGlobal.filter(item2 =>{return item2==item}).length;
      let iAllVar=(sTable+sOnstartScript).split(sVar).length-(iVar+1);
      aGlobalVar.push(sVar);
      sTableVarGl+="<tr><td>"+sVar+"</td><td>"+"Global"+"</td><td>"+iVar+"</td><td>"+iAllVar+"</td></tr>";
    })
    sTableVarGl+="</table></div>"
  
    if(appData.Formula){
      sFormulas=appData.Formula.InvariantScript.replaceAll('\n','<br>').replaceAll(' ','&nbsp;');
    }else{
      sFormulas="Formulas not used";
    }
  
    ////data sources
    let aCollections=aDataSources.filter( item =>{
      return item.Type=="CollectionDataSourceInfo"
    })
  
    let sCollections='<div class="table-responsive"><table class="table table-bordered" id="table-collections" width="100%" cellspacing="0"><tr><th>Name</th><th>Used_Count</th></tr>';
    aCollections.forEach(item =>{
      let iCount=(sCodeJson+sOnstartScript).split(item.Name).length-1
      sCollections+="<tr><td>"+item.Name+
      "</td><td>"+iCount+
      "</td></tr>";
    })
    sCollections+="</table></div>"
  
  
  ////Connections
  
  let aConnections=aDataSources.filter( item =>{
    return item.Type=="ServiceInfo"
  })
  let aConnectionDetail=[];
  let sConnections='<div class="table-responsive"><table class="table table-bordered" id="table-connections" width="100%" cellspacing="0"><tr><th>Name</th><th>Used_Count</th></tr>';
  aConnections.forEach(item =>{
    let iCount=sCodeJson.split(item.Name).length-1
    sConnections+="<tr><td>"+item.Name+
    "</td><td>"+iCount+
    "<td></tr>";
   
    let RegExCon=new RegExp(`\\'${item.Name}(.*?)\\(`, "gm");  
    let aConDetails=sCodeJson.match(RegExCon);
    if(!aConDetails){
      RegExCon=new RegExp(`\\${item.Name}(.*?)\\(`, "gm");
      aConDetails=sCodeJson.match(RegExCon);
    }

    if(aConDetails){
      aConDetails.forEach(child=>{
        aConnectionDetail.push({
          "Connection":item.Name,
          "Action":child
        })
      })
    }
  })
  sConnections+="</table></div>"
  
  const aConnectionDetailUnique = aConnectionDetail.filter((item, index, arr) =>
    arr.findIndex(t => JSON.stringify(t) === JSON.stringify(item)) === index
  );
  
  let sAllCollectionDivs="";
  aConnections.forEach(item =>{
    let sConnectionDiv=sConnectionTemplate;
    sConnectionDiv=sConnectionDiv.replaceAll('{$connection}',item.Name);
    sConnectionDiv=sConnectionDiv.replaceAll('{$card}','card-'+item.Name);
    let aDetails = aConnectionDetailUnique.filter(child =>{
      return child.Connection==item.Name
    })
    let sConnectionDetailDiv="";
  
    if(item.ApiId=="/providers/microsoft.powerapps/apis/shared_logicflows"){
      sConnectionDetailDiv="Run";
    } else{
      aDetails.forEach(action =>{
        let sAction=action.Action;
        sConnectionDetailDiv+=sAction.substring(0,sAction.length-1)+"<br>"
      })
    }
    sConnectionDiv=sConnectionDiv.replaceAll('{$connectionDetail}',sConnectionDetailDiv);
    sAllCollectionDivs+=sConnectionDiv;
  })
  
  //not used
  let sConnectionDetail='<div class="table-responsive"><table class="table table-bordered" id="table-connectionDetail" width="100%" cellspacing="0"><tr><th>Connection</th><th>Action</th><th>Used_Count</th></tr>';
  aConnectionDetailUnique.forEach(item=>{
    sConnectionDetail+="<tr><td>"+
    item.Connection+
    "<tr><td>"+
    item.Action+
    "<tr><td>"+
    aConnectionDetail.filter(child =>{return child.Action==item.Action}).length
    "</td><tr>"
  })
  sConnectionDetail+="</table></div>";
  //STIP-Auth(.*?)\(
  //
  
  ////Envirnoment Variables
  let sEnvirVar='<div class="table-responsive"><table class="table table-bordered" id="table-envirVars" width="100%" cellspacing="0"><tr><th>Name</th><th>Description</td><th>API</th><th>DataType</th><th>Type</th></tr>';
  aEnvirVar.forEach(item =>{
    sEnvirVar+="<tr><td>"+item.Name+
    "</td><td>"+item.Description+
    "</td><td>"+item.API+
    "</td><td>"+item.DataType+
    "</td><td>"+item.Type+
    "</td></tr>";
  })
  sEnvirVar+="</table></div>"
  
  
  //Data sources
  
  let aDataSourcesOnly=aDataSources.filter( item =>{
    return item.Type=="ConnectedDataSourceInfo" || item.Type=="NativeCDSDataSourceInfo" || item.Type=="StaticDataSourceInfo"
  })
  
  let sDataSources='<div class="table-responsive"><table class="table table-bordered" id="table-dataSources" width="100%" cellspacing="0"><tr><th>Name</th><th>Source</td><th>Used_Count</th></tr>';
  aDataSourcesOnly.forEach(item =>{
    let sData=item.Name.replaceAll(' ','&nbsp;')
    if(sData=='Environment&nbsp;Variable&nbsp;Definitions'){sData='Environment&nbsp;Variable&nbsp;Definition'}
    let iCount=sCodeJson.split(sData).length-1
    sDataSources+="<tr><td>"+item.Name+
    "</td><td>"+item.DatasetName+
    "</td><td>"+iCount+
    "</td></tr>";
  })
  sDataSources+="</table></div>"
  
  let sConnectionRefs='<div class="table-responsive"><table class="table table-bordered" id="table-references" width="100%" cellspacing="0"><tr><th>Name</th><th>ID</td><th>Type</th></tr>';
  aConnectionRef.forEach(item => {
    sConnectionRefs+="<tr><td>"+item.Name+
    "</td><td>"+item.Id+
    "</td><td>"+item.Type+
    "</td></tr>";
  })
  sConnectionRefs+="</table></div>"
  
  ////Flows
  let sFlows='<div class="table-responsive"><table class="table table-bordered" id="table-flows" width="100%" cellspacing="0"><tr><th>Name</th><th>ID</td><th>SubProcess</th></tr>';
  aFlows.forEach(item => {
    sFlows+="<tr><td>"+item.Name+
    "</td><td>"+item.Id+
    "</td><td>"+item.SubProcess+
    "</td></tr>";
  })
  sFlows+="</table></div>"
  
  ////Tables
  let sTables='<div class="table-responsive"><table class="table table-bordered" id="table-tables" width="100%" cellspacing="0"><tr><th>Name</th><th>ID</td><th>Description</th></tr>';
  aTables.forEach(item => {
    sTables+="<tr><td>"+item.Name+
    "</td><td>"+item.Id+
    "</td><td>"+item.Description+
    "</td></tr>";
  })
  sTables+="</table></div>"


  ////Test
  let sTests='<div class="table-responsive"><table class="table table-bordered" id="table-suites" width="100%" cellspacing="0"><tr><th>Suite Trigger</th><th>Action</th></tr>'

  if(oTests !=undefined){
    oTests.Suites.forEach(item => {
      sTests+="<tr><td>"+item.Property+
      "</td><td>"+item.InvariantScript+
      "</td></tr>";
    })
  }
  sTests+="</table></div><br><br>";
  sTests+='<div class="table-responsive"><table class="table table-bordered" id="table-tests" width="100%" cellspacing="0"><tr><th>Suite</th><th>Test</td><th>Description</th><th>Action</th></tr>'

  if(oTests !=undefined){
    oTests.Tests.forEach(item => {
      sTests+="<tr><td>"+item.Suite+
      "</td><td>"+item.Test+
      "</td><td>"+item.TestDescription+
      "</td><td>"+item.Action+
      "</td></tr>";
    })
  }
  sTests+="</table></div>";

  
  ////missing dependencies
  let sMissingDependencies='<div class="table-responsive"><table class="table table-bordered" id="table-dependencies" width="100%" cellspacing="0"><tr><th>Name</th><th>Parent ID</th><th>Type</th><th>Required</th></tr>';
  aMissingDependencies.forEach(item =>{
    sMissingDependencies+="<tr><td>"+item.Name+"</td>"+
    "<td>"+item.ParentId+"</td>"+
    "<td>"+item.Type+"</td>"+
    "<td>"+item.NameReq+"</td></tr>";
  });
  sMissingDependencies+="</table></div>";
  
  ////Checker
  const sCheckerTemplate=' <div class="text-xs font-weight-bold text-uppercase mb-1" >{top}</div><div class="text-xs font-weight-bold text-gray-800">{bottom}</div><br>'

  let sChecker="";
  aChecker.forEach(item =>{
    let sBottom=item.Name +" - "+item.Level+ " / "+ item.Type+" / "+item.Category+" / "+item.How
    let sCheck=sCheckerTemplate.replace('{bottom}',sBottom)
    sChecker=sChecker+sCheck.replace('{top}',item.Why)
  })


  ////Diagram
  let aDiagram=[];
  let sStart="#fillArrows: true\n#lineWidth: 2\n#fill:white\n#ranker: tight-tree\n#direction: right\n#fill:#f8f9fc\n"
  aScreens.forEach(item =>{
    let aNavScreens=[];
    if(item.Links){
      item.Links.forEach(nav =>{
        let aExpress=nav.split(",");
        if(aExpress.length==1){
          aExpress=aExpress[0].split(")");
        }
        let sLink=aExpress[0].replace("Navigate(","").replaceAll("'","");
        aNavScreens.push(sLink);
        sStart+="["+item.Screen+"]->["+sLink+"]\n";
      })
    }
    const iComponentCount=aComponents.filter(comp =>{
      return comp.Screen==item.Screen
    }).length;
    aDiagram.push({
      'Screen':item.Screen,
      'CountComponents': iComponentCount,
      'Links':aNavScreens
    })
   item.CountComponents=iComponentCount
   sStart+="["+item.Screen+"| Component Count:"+iComponentCount+"]\n";
  })
    
  ////App Config
  let sComponentTotalsTable='<div class="table-responsive"><table class="table table-bordered" id="table-componentTotals" width="100%" cellspacing="0"><tr><th>Component</th><th>Count_Set</th></tr>';
  aComponentTotals.forEach(item =>{
    sComponentTotalsTable+="<tr><td>"+item.Component+"</td>"+
    "<td>"+item.Count+"</td></tr>";
  });
  sComponentTotalsTable+="</table></div>";
  
  let sExperimentalTable='';
  appConfig.Experimental.forEach(item =>{
    sExperimentalTable+=item+"<br>"
  });

    let sAppConfig={
      "Name":appConfig.Name,
      "appA":sScreenCount,
      "appB":iComponentCount,
      "appC":aGlobalVarAll.length + aLocalVarAll.length,
      "appD":aConnections.length,
      "app1":
        "<b>ID: </b>"+appConfig.ID+"<br>"+
        "<b>Type: </b>"+appConfig.Type+"<br>"+
        "<b>Description: </b>"+appConfig.Description+"<br>"+
        "<b>Api Limit: </b>"+appConfig.ApiLimit+"<br>"+
        "<b>Error Count: </b>"+appConfig.ErrorCount+"<br>"+
        "<b>Instrument Key: </b>"+appConfig.InstrumentKey+"<br>",
      "app2":sExperimentalTable,
      "app3":sScreen,   
      "app4":sComponentTotalsTable
    }

  ////flags
  let aScreenCompCount=[];
  let fScreenCompCount=false;
  aScreens.forEach(item =>{
    if(aComponents.filter(child =>{return child.Screen==item.Screen}).length>400){fScreenCompCount=true};
    aScreenCompCount.push({
      "Screen":item.Screen,
      "Count":aComponents.filter(child =>{return child.Screen==item.Screen}).length
    })
  })
  
  
  let iConcurrent=0;
  if(sCodeJson.match(/ConCurrent\(/g)){
    iConcurrent= sCodeJson.match(/ConCurrent\(/g).length
  }
  let iIfError=0;
  if(sCodeJson.match(/IfError\(/g)){
    iIfError= sCodeJson.match(/IfError\(/g).length
  }
  let iFilter=0;
  if(sCodeJson.match(/Filter\(Filter\(/g)){
    iFilter= sCodeJson.match(/Filter\(Filter\(/g).length
  }

  const oFlags={
    "isSolution":fSolution,
    "missingDependencies":aMissingDependencies.length>0,
    "enivironmentVar":aEnvirVar.length>0,
    "connectionRefs":aConnectionRef.length>0,
    "screens":aScreens.length<11,
    "connections":aConnections.length<6,
    "componentsPerScreen":!fScreenCompCount, 
    "concurrent":iConcurrent>0, 
    "iferror":iIfError>0,
    "doubleFilter":iFilter>0,
    "checker":sChecker,
    "delegation":""
  }
    
    ////create report
  
    const oReport={
      "app":sAppConfig,
      "formula":sFormulas,
      "codeBlock":sCodeJson,
      "components":sTable,
      "global":sTableVarGl,
      "local":sTableVarLo,
      "collections":sCollections,
      "test":sTests,
      "dataSources":sDataSources,
      "connections":sConnections,
      "connectionDetail":sAllCollectionDivs,
      "references":sConnectionRefs,
      "environmentVariables":sEnvirVar,
      "missingDependencies":sMissingDependencies,
      "tables":sTables,
      "flows":sFlows,
      "diagram":sStart,
      "flags":oFlags,
      "counts":{
        "global":aGlobalVarAll.length,
        "local":"In Build","components":iComponentCount
      }
    }

    localStorage.setItem('report',LZString.compress(JSON.stringify(oReport)));
     window.open("codeReview.html");
  }


