function createDiagram(data,name,trigger,objects){

  let sStart="#fillArrows: true\n#lineWidth: 2\n#fill:#569AE5\n#background: white\n#acyclicer: greedy\n#ranker: tight-tree\n#.data: visual=database fill=#EBDAF9\n#.trigger: visual=roundrect fill=#569AE5\n#.if: visual=rhomb fill=#2596be\n#.switch: visual=ellipse fill=#2596be\n#.scope: visual=frame fill=#808080\n#.foreach: visual=transceiver fill=#00C1A0\n#.until: visual=sender fill=#00C1A0\n#.var: visual=input fill=#9925be\n#.terminate: visual=receiver fill=#cc4747\n#.var: visual=input fill=#EBDAF9\n";

  let sDiagram=sStart;
  data.forEach((item) => {
      let sTempRaw=item.position.replaceAll('||','')
      let sTemp=sTempRaw.substring(1,item.position.length-1);
      let aPrevious=sTemp.split('|');
      let aPreviousIndex=item.positionIndex.substring(1,item.positionIndex.length).split('|');
      let aPreviousType=item.positionType.substring(1,item.positionType.length).split('|');

      aPrevious.forEach((val,i) =>{

        if(aPrevious.length>0 && aPreviousIndex[i]!="" && aPreviousType.length==aPrevious.length && val!=null && val!=""){
          let sEntry;
          let sArrow;
          if((aPreviousType[i]=="Switch" || aPreviousType[i]=="If" || aPreviousType[i]=="Scope" || aPreviousType[i]=="Foreach" || aPreviousType[i]=="Until")&&item.positionInfo!='Internal'){
            sArrow='--:>';
          }else{
            sArrow='->';
          }
          
          let oPreviousItem=objects[parseInt(aPreviousIndex[i])-1] 
          console.log(aPreviousIndex[i]-1,val,item.name,oPreviousItem)
          if (aPreviousType[i] == "Switch" ) {
            sEntry = '\n[<switch>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow;

          }else if ( aPreviousType[i] == "If" ){  
            let aIf=oPreviousItem.object.split('"else":{');
            let sBranch="No";

            if(aIf[0].includes('"'+item.name+'"') && sArrow!='--:>'){
              sBranch="Yes"
            } else if( sArrow=='--:>'){
              sBranch="";
            }
            sEntry = '\n[<if>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow+" "+sBranch;
          
          }else if ( aPreviousType[i] == "Foreach"){        
            sEntry = '\n[<foreach>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow;

          }else if (aPreviousType[i] == "Until" ){        
            sEntry = '\n[<until>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow;      

          }else if (aPreviousType[i] == "Scope"){
            sEntry = '\n[<scope>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow;
          
          }else if (val.replace(/[":\[|{}()\]]+/g, '') == "trigger"){
            sEntry = '\n[<trigger> *'+trigger+']'+sArrow;

          }else if (val.replace(/[":\[|{}()\]]+/g, '') == "Terminate"){
            sEntry = '\n[<terminate>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow;  

          }else if (oPreviousItem.type.includes("Variable") || oPreviousItem.type.includes("Compose")){
            sEntry = '\n[<var>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow; 
         
          }else if ( aPreviousType[i] == "Table" || aPreviousType[i] == "ParseJson" || aPreviousType[i] == "Select"  || aPreviousType[i] == "Join" || aPreviousType[i] == "Query" ){        
            sEntry = '\n[<data>'+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow;      
           
          }else{
            sEntry = '\n['+val.replace(/[":\[|{}()\]]+/g, '')+']'+sArrow;
          }  


          if (item.type == "Switch" ) {        
            sEntry = sEntry+'[<switch>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

          }  else if (item.type == "If" ) {        
              sEntry = sEntry+'[<if>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

          }else if (item.type == "Foreach" ){
            sEntry = sEntry+'[<foreach>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

          }else if (item.type == "Until"  ){
            sEntry = sEntry+'[<until>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

          }else if (item.type == "Scope" ){
            sEntry = sEntry+'[<scope>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'
            
          }else if (item.type == "Terminate" ){
            sEntry = sEntry+'[<terminate>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'
          
          }else if (item.type.includes("Variable") || item.type.includes("Compose")){
            sEntry = sEntry+'[<var>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']'

          }else if ( item.type == "Table" || item.type == "ParseJson" || item.type== "Select"  || item.type == "Join" || item.type == "Query" ){        
            sEntry = sEntry+'[<data>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']' 

          }else if ( item.type == "Table" || item.type == "ParseJson" || item.type== "Select"  || item.type == "Join" || item.type == "Query" ){        
            sEntry = sEntry+'[<data>'+item.name.replace(/[":\[|{}()\]]+/g, '')+']' 

          }else{
            sEntry = sEntry+'['+item.name.replace(/[":\[|{}()\]]+/g, '')+']'
          }
    
        sDiagram =sDiagram+sEntry
      
      }
    })
  });

  return sDiagram

}    