function doGet(e) {
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    return HtmlService.createHtmlOutputFromFile('Mainpage').setTitle("首頁").setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  
  var page = e.parameter['page'];
  
  var title = {
    "import":"進貨單",
    "export":"出貨單",
    "return":"返貨單",
    "requisition":"領貨單",
    "transfer":"調貨單",
  }
  
  // else, use page parameter to pick an html file from the script
  return HtmlService.createHtmlOutputFromFile(page).setTitle(title[page]);
}

function getScriptUrl() {
 return ScriptApp.getService().getUrl();
}

function getCommonSheet(){
  var sheetID = "1Apa9Lx70VN7nLwm04RV9JttnkgF0hJ4sARj3bG9hPxg";
  var sheetTag = "常用產品";
  
  var spreadSheet = SpreadsheetApp.openById(sheetID);
  var sheet = spreadSheet.getSheetByName(sheetTag);
  
  return sheet;
}

function getStorageSheet(){
  var sheetID = "1Apa9Lx70VN7nLwm04RV9JttnkgF0hJ4sARj3bG9hPxg";
  var sheetTag = "倉庫事件";
  
  var spreadSheet = SpreadsheetApp.openById(sheetID);
  var sheet = spreadSheet.getSheetByName(sheetTag);
  
  return sheet;
}

function findColumnIndex(sheet, commodity){
  
  var maxColumn = sheet.getMaxColumns();
  
  for (var i = 1; i <= maxColumn; i++){
    if (sheet.getRange(1, i).getValue() == commodity){
      return i;
    }
  }
  
  return -1;
}

function findValueByKey(sheet, keyTitle, valTitle, key, startRow, size){
  
  //Find column index of key
  var keyCol = findColumnIndex(sheet, keyTitle);
  
  //Find column index of value
  var valCol = findColumnIndex(sheet, valTitle);
  
  var vals = sheet.getRange(startRow, keyCol, size).getValues();
  
  for ( var row in vals){
    if(vals[row][0] == key){
      var valRow = parseInt(row) + startRow;
      return sheet.getRange(valRow, valCol).getValue();
    }
  }
  
  return "";
}

function getImportEventIDByEvent(event){
  
  var sheet = getStorageSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "入庫簡稱", "入庫事件代號", event, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getExportEventIDByEvent(event){
  
  var sheet = getStorageSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "出庫簡稱", "出庫事件代號", event, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getTransferEventIDByEvent(event){
  
  var sheet = getStorageSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "換庫簡稱", "換庫事件代號", event, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getStorageIDByStorage(storage){
  
  var sheet = getStorageSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "倉庫簡稱", "倉庫代號", storage, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getSKUByCommodity(commodity){
  
  var sheet = getCommonSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "簡稱", "SKU", commodity, fixRow + 1, sheet.getLastRow() - fixRow);
}