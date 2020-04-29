function doPost(e) {
  
  var param = JSON.parse(e.postData.contents).parameter;
  
  var id = param.sheetID;
  var tag = param.sheetTag;
  var data = param.data;
  
  var SpreadSheet = SpreadsheetApp.openById(id);
  var Sheet = SpreadSheet.getSheetByName(tag);
  
  var curRow = Sheet.getLastRow() + 1;
  
  var map = findKeyMappingColumn(Sheet);
  
  var datas = new Array();
  
  var list = data.list;
  
  Logger.log(data);
  
  //remove list from data
  delete data.list;
  
  //list all data for each row
  for (var index in list){
    datas.push(Object.assign(list[index], data));
  }
  
  Logger.log(datas);
  
  for (var index in datas){
    for (var key in datas[index]){
      if(map.has(key)){
        Sheet.getRange(curRow, map.get(key)).setValue(datas[index][key]);
      }
      else{
        console.log("Error: Invalid key value, key doesn't exist");
      }
    }
    
    curRow = Sheet.getLastRow() + 1;
  }
  
  //return process finished
  return ContentService.createTextOutput(true);
}

// return a map which mapping keys to corresponding column indexs in certain sheet
function findKeyMappingColumn(Sheet){
  
  //Assume the number of column of each row are equal
  var maxColumn = Sheet.getMaxColumns();
  
  var map = new Map();
  
  for(var i = 1; i <= maxColumn; i++){
    var cell = Sheet.getRange(1, i);
    map.set(cell.getValue(), i);
  }
  
  return map;
}

function doTest(){
  var time = new Date().toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var response = doPost({
    postData:{
      contents:JSON.stringify({
        parameter:{
          "sheetID":"1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg",
          "sheetTag":"入庫紀錄",
          "data":{
            "時間":time,
            "表單號碼":123,
            "表單":"進貨單",
            "填寫人":user,
            "list":[{
              "產品":"123",
              "SKU":"456",
              "數量":"100",
              "入庫倉庫":"789"}
            ]
              
          }
        }
      })
    }
  });
  
  Logger.log(response);
}
