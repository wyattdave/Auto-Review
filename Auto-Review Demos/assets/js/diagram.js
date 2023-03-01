

function createDiagram(data,name,trigger,objects){
  
  
let sStart="#fillArrows: true\n#lineWidth: 2\n#fill:#569AE5\n#background: white\n#acyclicer: greedy\n#ranker: tight-tree\n#.trigger: visual=roundrect fill=#569AE5\n#.if: visual=rhomb fill=#2596be\n#.switch: visual=ellipse fill=#2596be\n#.scope: visual=frame fill=#808080\n#.foreach: visual=transceiver fill=#00C1A0\n#.until: visual=sender fill=#00C1A0\n#.var: visual=input fill=#9925be\n#.terminate: visual=receiver fill=#cc4747\n#.var: visual=input fill=#EBDAF9\n";

let sDiagram=sStart;
data.forEach((item) => {
    let sTempRaw=item.position.replaceAll('||','')
    let sTemp=sTempRaw.substring(1,item.position.length-1);
    let aPrevious=sTemp.split('|');
    let aPeviousIndex=item.positionIndex.substring(1,item.positionIndex.length).split('|');
    let aPeviousType=item.positionType.substring(1,item.positionType.length).split('|');

    aPrevious.forEach((val,i) =>{

      if(aPrevious.length>0 && aPeviousIndex[i]!="" && aPeviousType.length==aPrevious.length && val!=null && val!=""){
        let sEntry;
        let sArror;
        if((aPeviousType[i]=="Switch" || aPeviousType[i]=="If" || aPeviousType[i]=="Scope" || aPeviousType[i]=="Foreach" || aPeviousType[i]=="Until")&&item.positionInfo!='Internal'){
          sArror='--:>';
        }else{
          sArror='->';
        }
        
        let oPreviousItem=objects[parseInt(aPeviousIndex[i])-1] 
        console.log(aPeviousIndex[i]-1,val,item.name,oPreviousItem)
        if (aPeviousType[i] == "Switch" ) {

          sEntry = '\n[<switch>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror;

        }else if ( aPeviousType[i] == "If" ){
     
           ;   
         let aIf=oPreviousItem.object.split('"else":{');
         let sBranch="No";

         if(aIf[0].includes('"'+item.name+'"') && sArror!='--:>'){
          sBranch="Yes"
         } else if( sArror=='--:>'){
          sBranch="";
         }
         
         sEntry = '\n[<if>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror+" "+sBranch;
         
        }else if ( aPeviousType[i] == "Foreach"){        
          sEntry = '\n[<foreach>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror;

        }else if (aPeviousType[i] == "Until" ){        
          sEntry = '\n[<until>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror;      

        }else if (aPeviousType[i] == "Scope"){
          sEntry = '\n[<scope>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror;
        
        }else if (val.replace(/[":\[|{}()\]]+/g, '') == "trigger"){
          sEntry = '\n[<trigger> *'+trigger+']'+sArror;

        }else if (val.replace(/[":\[|{}()\]]+/g, '') == "Terminate"){
          sEntry = '\n[<terminate>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror;  

        }else if (oPreviousItem.type.includes("Variable") || oPreviousItem.type.includes("Compose")){
          sEntry = '\n[<var>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror; 
          
        }else{
          sEntry = '\n['+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArror;
        }  


        if (item.type == "Switch" ) {        
          sEntry = sEntry+'[<switch>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

        }  else if (item.type == "If" ) {        
            sEntry = sEntry+'[<if>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

        }else if (item.type == "Foreach" ){
          sEntry = sEntry+'[<forach>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

        }else if (item.type == "Until"  ){
          sEntry = sEntry+'[<until>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

        }else if (item.type == "Scope" ){
          sEntry = sEntry+'[<scope>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'
          
        }else if (item.type == "Terminate" ){
          sEntry = sEntry+'[<terminate>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'
        
        }else if (item.type.includes("Variable") || item.type.includes("Compose")){
          sEntry = sEntry+'[<var>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

        }else{
          sEntry = sEntry+'['+item.name.replace(/[":\[|{}()\]]+/g, '')+']'
        }
  
      sDiagram =sDiagram+sEntry
    
    }
  })
});

return sDiagram

}

 




    