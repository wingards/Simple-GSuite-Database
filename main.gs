function onOpen(){
  
  //試算表ID - 營銷資料表
  PropertiesService.getScriptProperties().setProperty("CommoditySpreadSheetID", "1Apa9Lx70VN7nLwm04RV9JttnkgF0hJ4sARj3bG9hPxg");
  
  var spreadSheet = getCommoditySpreadSheet();
  var sheet = spreadSheet.getSheetByName("專案索引");
  
  var entries = sheet.getRange(0, 0, sheet.getLastRow());
  
  //試算表ID - 倉儲表
  PropertiesService.getScriptProperties().setProperty("StorageSpreadSheetID", entries[0][1]);
  //試算表ID - 出入庫紀錄
  PropertiesService.getScriptProperties().setProperty("LogisticSpreadSheetID", entries[1][1]);
  
  //產品總表-標題列
  PropertiesService.getScriptProperties().setProperty("fixRow_commoditySheet", 1);
  
  //倉儲表-固定欄數
  PropertiesService.getScriptProperties().setProperty("fixCol_storageSheet", 1);
  //倉儲表-商品資訊列數
  PropertiesService.getScriptProperties().setProperty("fixRow_storageSheet", 10);
  
  //出入庫紀錄-標題列
  PropertiesService.getScriptProperties().setProperty("titleRow_LogisticSheet", 1);
  //出入庫紀錄-起始欄
  PropertiesService.getScriptProperties().setProperty("startCol_LogisticSheet", 1);
}

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

//營銷資料表
function getCommoditySpreadSheet(){
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("CommoditySpreadSheetID"));
}

//倉儲表
function getStorageSpreadSheet(){
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("StorageSpreadSheetID"));
}

//出入庫紀錄
function getLogisticSpreadSheet(){
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("LogisticSpreadSheetID"));
}

function getCommoditySheet(){
  
  var sheetTag = "產品總表";
  
  var spreadSheet = getCommoditySpreadSheet();
  var sheet = spreadSheet.getSheetByName(sheetTag);
  
  return sheet;
}

function getCommonSheet(){
  
  var sheetTag = "常用產品";
  
  var spreadSheet = getCommoditySpreadSheet();
  var sheet = spreadSheet.getSheetByName(sheetTag);
  
  return sheet;
}

function getStorageEventSheet(){
  
  var sheetTag = "倉庫事件";
  
  var spreadSheet = getCommoditySpreadSheet();
  var sheet = spreadSheet.getSheetByName(sheetTag);
  
  return sheet;
}

function getStorageSheet(storageID){

  var spreadSheet = getStorageSpreadSheet();
  var sheet = spreadSheet.getSheetByName(storageID);
  
  return sheet;
}

// find the index of column by given key
function findColumnIndex(sheet, key, row = 1){
  
  var maxColumn = sheet.getMaxColumns();
  
  for (var i = 1; i <= maxColumn; i++){
    if (sheet.getRange(row, i).getValue() == key){
      return i;
    }
  }
  
  return -1;
}

function findRowByKey(sheet, key, startRow, col, size){
  
  var vals = sheet.getRange(parseInt(startRow), parseInt(col), parseInt(size)).getValues();
  
  for (var row in vals){
    if (vals[row][0] == key){
      return parseInt(row) + startRow;
    }
  }
  
  return -1;
}

function findValueByKey(sheet, keyTitle, valTitle, key, startRow, size){
  
  //Find column index of key
  var keyCol = findColumnIndex(sheet, keyTitle);
  
  //Find column index of value
  var valCol = findColumnIndex(sheet, valTitle);
  
  var valRow = findRowByKey(sheet, key, startRow, keyCol, size);
  
  if (valRow != -1){
    return sheet.getRange(valRow, valCol).getValue();
  }
  
  return "";
}

function getImportEventIDByEvent(event){
  
  var sheet = getStorageEventSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "入庫簡稱", "入庫事件代號", event, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getExportEventIDByEvent(event){
  
  var sheet = getStorageEventSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "出庫簡稱", "出庫事件代號", event, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getTransferEventIDByEvent(event){
  
  var sheet = getStorageEventSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "換庫簡稱", "換庫事件代號", event, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getStorageIDByStorage(storage){
  
  var sheet = getStorageEventSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "倉庫簡稱", "倉庫代號", storage, fixRow + 1, sheet.getLastRow() - fixRow);
}

function getSKUByCommodity(commodity){
  
  var sheet = getCommonSheet();
  
  var fixRow = 1;
  
  return findValueByKey(sheet, "簡稱", "SKU", commodity, fixRow + 1, sheet.getLastRow() - fixRow);
}