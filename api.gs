// return a map which mapping keys to corresponding column indexs in certain sheet
function findKeyMappingColumn(Sheet, row){
  
  //Assume the number of column of each row are equal
  var maxColumn = Sheet.getMaxColumns();
  
  var map = new Map();
  
  for(var i = 1; i <= maxColumn; i++){
    var cell = Sheet.getRange(row, i);
    map.set(cell.getValue(), i);
  }
  
  return map;
}

function findKeyList(Sheet, row){
  
  //Assume the number of column of each row are equal
  var maxColumn = Sheet.getMaxColumns();
  
  var list = new Array();
  
  var vals = Sheet.getRange(row, 1, 1, maxColumn).getValues();
  
  for (var row in vals){
    for(var col in vals[row]){
      list.push(vals[row][col]);
    }
  }
  return list;
}

function getRowByDate(sheet, time){
  
  var startRow = parseInt(PropertiesService.getScriptProperties().getProperty("fixRow_storageSheet")) + 1;
  
  //[WORKAROUND] Assume genesis date at location (n, 1)
  var genesis = new Date(sheet.getRange(startRow, 1).getValue());
  
  var date = new Date(time);
  
  return startRow + parseInt((date.getTime() - genesis.getTime()) / 86400000);
}

function createStorageSheet(sheetTag){
  
  var spreadSheet = getStorageSpreadSheet();
  
  //create new sheet
  var sheet = spreadSheet.insertSheet(sheetTag);
  
  //initialize new sheet
  //
  var w1Sheet = spreadSheet.getSheetByName("W1");//[WORKAROUND] Assume w1 sheet always exist and correct
  
  //copy first column
  var vals = w1Sheet.getRange(1, 1, w1Sheet.getLastRow()).getValues();
  
  sheet.getRange(1, 1, vals.length).setValues(vals);
  
  return sheet;
}

// return a map indicating whole commodity information with sku as key
function getCommodityInfo(){
  
  var sheet = getCommoditySheet();
  
  var skuCol = findColumnIndex(sheet, "SKU") - 1;
  var indexCol = findColumnIndex(sheet, "編號") - 1;
  var nickNameCol = findColumnIndex(sheet, "簡稱") - 1;
  var productCol = findColumnIndex(sheet, "產品列表") - 1;
  var fullNameCol = findColumnIndex(sheet, "產品全名") - 1;
  
  var fixRow = parseInt(PropertiesService.getScriptProperties().getProperty("fixRow_commoditySheet"));
  
  var vals = sheet.getRange(fixRow + 1, 1, sheet.getLastRow() - fixRow, sheet.getLastColumn()).getValues();
  
  var set = new Set();
  var map = new Map();
  
  for (var row in vals){
    set.add(vals[row][skuCol]);
    map.set(vals[row][indexCol], {"sku":vals[row][skuCol], "product":vals[row][productCol], "fullname":vals[row][fullNameCol], "nickname":vals[row][nickNameCol]});
  }
  
  return [set, map];
}

function getStorageSheet_skuMap(sheet, skuRow, idxRow){
  
  var fixCol = parseInt(PropertiesService.getScriptProperties().getProperty("fixCol_storageSheet"));
  
  var map = new Map();
  
  if (sheet.getLastColumn() - fixCol > 0){
    var skus = sheet.getRange(skuRow, fixCol + 1, 1, sheet.getLastColumn() - fixCol).getValues();
    var indexs = sheet.getRange(idxRow, fixCol + 1, 1, sheet.getLastColumn() - fixCol).getValues();
  
    for ( var index in indexs[0]){
      map.set(skus[0][index], indexs[0][index]);
    }
  }
  
  return map;
}

function test1(){
  
  onOpen();
  
  createStorageSheet("W3");
  
  //var [skus, commodities] = getCommodityInfo();
  
  //updateStorageSheet_commodity(getStorageSheet("W2"), commodities, skus);
}

function updateStorageSheet_commodity(sheet, commodities, newSkus){
  
  var renewTable = false;
  
  var fixCol = parseInt(PropertiesService.getScriptProperties().getProperty("fixCol_storageSheet"));
  var fixRow = parseInt(PropertiesService.getScriptProperties().getProperty("fixRow_storageSheet"));
  
  var skuRow = findRowByKey(sheet, "SKU", 1, fixCol, fixRow);
  var idxRow = findRowByKey(sheet, "編號", 1, fixCol, fixRow);
  var nicknameRow = findRowByKey(sheet, "簡稱", 1, fixCol, fixRow);
  var productRow = findRowByKey(sheet, "產品列表", 1, fixCol, fixRow);
  var fullnameRow = findRowByKey(sheet, "產品全名", 1, fixCol, fixRow);
  
  var map = getStorageSheet_skuMap(sheet, skuRow, idxRow);
  
  var todayRow = getRowByDate(sheet, new Date().getTime());
  
  var keys = commodities.keys();
  
  for (var index = keys.next().value, curCol = fixCol + 1; index; index = keys.next().value, curCol++){
    
    if (renewTable) map = getStorageSheet_skuMap(sheet, skuRow, idxRow); // update the map
    
    var sku = commodities.get(index)["sku"];
    
    //check sku if already in sheet
    if (map.has(sku)){
      if(index == map.get(sku)) continue;
      else{
        
        //flag on renew table
        renewTable = true;
        
        var oldCol = findColumnIndex(sheet, sku, skuRow);
        
        //copy column data of certain sku to new column
        var vals = sheet.getRange(3, oldCol, todayRow - 3 + 1).getValues();
        
        //delete old column
        if (map.get(sku) > index) sheet.deleteColumn(oldCol);
        
        //insert a column after current column
        sheet.insertColumns(curCol);
        
        //set new column's index
        sheet.getRange(idxRow, curCol).setValue(index);
        
        //paste
        sheet.getRange(3, curCol, todayRow - 3 + 1).setValues(vals);
        
        //delete old column
        if (map.get(sku) < index){
          if (curCol > oldCol){
            sheet.deleteColumn(oldCol);
          }
          else{
            sheet.deleteColumn(oldCol + 1);
          }
        }
        
        // if duplicated column not exist in new info, move to back
        var vals = sheet.getRange(3, curCol + 1, todayRow - 3 + 1).getValues();
        if (vals[skuRow - 3][0] != ""){
          if (newSkus.has(vals[skuRow - 3][0])){
            
            //shift a column
            //curCol++;
            
            Logger.log("next:" + curCol);

            continue;
          }
          else{
            
            //set new column's index
            sheet.getRange(idxRow, fixCol + map.size + 1).setValue(map.size + 1);
            
            //copy column data of certain sku to new column
            sheet.getRange(3, fixCol + map.size + 1, todayRow - 3 + 1).setValues(vals);
            
            //delete old column
            sheet.deleteColumn(curCol + 1);
          }
        }
      }
    }else{
      
      //flag on renew table
      renewTable = true;
      
      //insert a column after current column
      sheet.insertColumns(curCol);
      
      //set info
      sheet.getRange(idxRow, curCol).setValue(index);
      sheet.getRange(skuRow, curCol).setValue(commodities.get(index)["sku"]);
      sheet.getRange(productRow, curCol).setValue(commodities.get(index)["product"]);
      sheet.getRange(fullnameRow, curCol).setValue(commodities.get(index)["fullname"]);
      sheet.getRange(nicknameRow, curCol).setValue(commodities.get(index)["nickname"]);
      
      // if duplicated column not exist in new info, move to back
      var vals = sheet.getRange(3, curCol + 1, todayRow - 3 + 1).getValues();
      if (vals[skuRow - 3][0] != ""){
        if (newSkus.has(vals[skuRow - 3][0])){
          
          //shift a column
          curCol++;
          
          continue;
        }
        else{
          
          //set new column's index
          sheet.getRange(idxRow, fixCol + map.size + 1).setValue(map.size + 1);
          
          //copy column data of certain sku to new column
          sheet.getRange(3, fixCol + map.size + 1, todayRow - 3 + 1).setValues(vals);
          
          //delete old column
          sheet.deleteColumn(curCol + 1);
        }
      }        
    }
      
  }
  
  Logger.log(curCol);
}

//copy the latest amount of all commodity to today
function appendCountToToday(sheet){
  
  var todayRow = getRowByDate(sheet, new Date().getTime());
  
  var fixCol = parseInt(PropertiesService.getScriptProperties().getProperty("fixCol_storageSheet"));
  
  //check if the data of today is already there
  var val = sheet.getRange(todayRow, fixCol + 1).getValue();
  
  if (sheet.getLastColumn() - fixCol > 0 && val == ""){
    var vals = sheet.getRange(todayRow - 1, fixCol + 1, 1, sheet.getLastColumn() - fixCol).getValues();
  
    sheet.getRange(todayRow, fixCol + 1, 1, sheet.getLastColumn() - fixCol).setValues(vals);
  }
}

function updateAllStorageSheet_commodity(){
  
    var storageIDList = getStorageIDList();
  
  Logger.log(storageIDList);
  
  var [skus, commodities] = getCommodityInfo();
  
  for (var index in storageIDList){
    
    //check sheet exist, if not then create it
    var sheet = getStorageSheet(storageIDList[index]);
    if (!sheet){
      sheet = createStorageSheet(storageIDList[index]);
    }
  
    //update commodity info
    updateStorageSheet_commodity(sheet, commodities, skus);
    
    //and copy the amount of commodity to today
    appendCountToToday(sheet);
  }
}

function callbackDaily(){
  updateAllStorageSheet_commodity();
}

function doTest(){
  var time = new Date().toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var response = submitOrder("1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg", "入庫紀錄",
                             {
                               "出入庫日期":time,
                               "時間":time,
                               "表單號碼":123,
                               "表單":"出貨單",
                               "填寫人":user,
                               "list":[{
                                 "產品":"功能白",
                                 "SKU":"CB1-PS11WT",
                                 "數量":"100",
                                 "出庫倉庫":"W1"
                               },{
                                 "產品":"功能黑",
                                 "SKU":"CB1-PS11BL",
                                 "數量":"100",
                                 "出庫倉庫":"W1"
                               }]
                             }
                       );
  
  Logger.log(response);
}
