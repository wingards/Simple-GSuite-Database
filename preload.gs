function getColContents(sheet, col, startRow, size){
  
  var list = new Array();
  
  var vals = sheet.getRange(startRow, col, size).getValues();
  
  for (var row in vals){
    for (var col in vals[row]){
      list.push(vals[row][col]);
    }
  }
  
  return list;
}

function getImportEventList(){
  
  var sheet = getStorageEventSheet();
  
  //Find column index of "入庫簡稱"
  var col = findColumnIndex(sheet, "入庫簡稱");
  
  var fixRow = 1;
  
  var list = getColContents(sheet, col, fixRow + 1, sheet.getLastRow() - fixRow);
  
  Logger.log(list);
              
  return list;
}

function getExportEventList(){
  
  var sheet = getStorageEventSheet();
  
  //Find column index of "出庫簡稱"
  var col = findColumnIndex(sheet, "出庫簡稱");
  
  var fixRow = 1;
  
  var list = getColContents(sheet, col, fixRow + 1, sheet.getLastRow() - fixRow);
  
  Logger.log(list);
              
  return list;
}

function getTransferEventList(){
  
  var sheet = getStorageEventSheet();
  
  //Find column index of "換庫簡稱"
  var col = findColumnIndex(sheet, "換庫簡稱");
  
  var fixRow = 1;
  
  var list = getColContents(sheet, col, fixRow + 1, sheet.getLastRow() - fixRow);
  
  Logger.log(list);
              
  return list;
}

function getStorageList(){
  
  var sheet = getStorageEventSheet();
  
  //Find column index of "倉庫簡稱"
  var col = findColumnIndex(sheet, "倉庫簡稱");
  
  var fixRow = 1;
  
  var list = getColContents(sheet, col, fixRow + 1, sheet.getLastRow() - fixRow);
  
  Logger.log(list);
              
  return list;
}

function getStorageIDList(){
  var sheet = getStorageEventSheet();
  
  //Find column index of "倉庫代號"
  var col = findColumnIndex(sheet, "倉庫代號");
  
  var fixRow = 1;
  
  var list = getColContents(sheet, col, fixRow + 1, sheet.getLastRow() - fixRow);
  
  Logger.log(list);
              
  return list;
}

function getCommodityList(){
  
  var sheet = getCommonSheet();
  
  //Find column index of "簡稱"
  var col = findColumnIndex(sheet, "簡稱");
  
  var fixRow = 1;
  
  var list = getColContents(sheet, col, fixRow + 1, sheet.getLastRow() - fixRow);
  
  Logger.log(list);
              
  return list;
}

function getCommoditySKUList(){
  
  var sheet = getCommonSheet();
  
  //Find column index of "簡稱"
  var col = findColumnIndex(sheet, "簡稱");
  
  var fixRow = 1;
  
  var list = sheet.getRange(fixRow + 1, col, sheet.getLastRow() - fixRow, 2).getValues();//[WORKAROUND] Assume "SKU" next to "簡稱"
  
  return list;
}

function getStorageSpreadSheetName(){
  var spreadSheet = getStorageSpreadSheet();
  return spreadSheet.getName();
}

function getLogisticSpreadSheetName(){
  var spreadSheet = getLogisticSpreadSheet();
  return spreadSheet.getName();
}