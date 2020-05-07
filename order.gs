function submitOrder(id, tag, data){
  
  var SpreadSheet = SpreadsheetApp.openById(id);
  var Sheet = SpreadSheet.getSheetByName(tag);
  
  var curRow = Sheet.getLastRow() + 1;
  
  var map = findKeyList(Sheet, parseInt(PropertiesService.getScriptProperties().getProperty("titleRow_LogisticSheet")));
  
  var datas = new Array();
  
  var list = data.list;
  
  //remove list from data
  delete data.list;
  
  //list all data for each row
  for (var index in list){
    datas.push(Object.assign(list[index], data));
  }
  
  Logger.log(datas);
  
  for (var index in datas){
    
    //list data
    var vals = new Array();
    for(var col in map){
      var key = map[col];
      if (datas[index].hasOwnProperty(key)){
        vals.push(datas[index][key]);
      }
      else{
        vals.push("");
      }
    }
    
    //set an order to sheet
    Sheet.getRange(curRow, parseInt(PropertiesService.getScriptProperties().getProperty("startCol_LogisticSheet")), 1, Sheet.getMaxColumns()).setValues([vals]);
    
    curRow = Sheet.getLastRow() + 1;
  }
  
  submitStorages(datas);
  
  return true;
}

//submit whole bunchs of storage information for each sotrageID
function submitStorages(datas){
  
  var storages = new Map();
  
  for (var index in datas){
    var sku, date, amount, storageID;
    
    if (datas[index].hasOwnProperty("入庫倉庫")){
      storageID = datas[index]["入庫倉庫"];
      amount = parseInt(datas[index]["數量"]);
    }
    else
    {
      storageID = datas[index]["出庫倉庫"];
      amount = -1 * parseInt(datas[index]["數量"]);//export hence minus
    }
    
    sku = datas[index]["SKU"];
    date = datas[index]["出入庫日期"];
    
    if (storages.has(storageID)){
      storages.get(storageID).push([sku, amount]);
    }
    else{
      storages.set(storageID, [[sku, amount]]);
    }
    
  }
  
  var keys = storages.keys();
  
  for (var key = keys.next().value; key; key = keys.next().value){
    addStorages(date, key, storages.get(key));
  }
}

function addStorages(date, storageID, storage){
  
  var sheet = getStorageSheet(storageID);
  
  var time = date.split(" ");//[WORKAROUND] based on time format "2020/4/29 上午 12:07:18"
  
  var fixCol = parseInt(PropertiesService.getScriptProperties().getProperty("fixCol_storageSheet"));
  
  var skuRow = findRowByKey(sheet, "SKU", 1, fixCol, PropertiesService.getScriptProperties().getProperty("fixRow_storageSheet"));
  
  var todayRow = getRowByDate(sheet, new Date().getTime());
  var dateRow = getRowByDate(sheet, new Date(time[0]).getTime());
  
  var keys = sheet.getRange(skuRow, fixCol + 1, 1, sheet.getLastColumn() - fixCol).getValues();
  var vals = sheet.getRange(dateRow, fixCol + 1, todayRow - dateRow + 1, sheet.getLastColumn() - fixCol).getValues();
  
  for (var index in storage){
    
    //Find column
    var col = -1;
    for (var idx in keys[0]){
      if (keys[0][idx] == storage[index][0]){col = idx;}
    }
    
    for (var row = 0; row < todayRow - dateRow + 1; row++){
      var val = vals[row][col];
      if (val == "") val = 0;
      vals[row][col] = parseInt(val) + storage[index][1];
    }
  }
  
  sheet.getRange(dateRow, fixCol + 1, todayRow - dateRow + 1, sheet.getLastColumn() - fixCol).setValues(vals);
}

function sendImportOrder(time, number, commodity, sku, storage_num, event, storage, note){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = {
    "出入庫日期":time,
    "表單號碼":number,
    "表單":"進貨單",
    "填寫人":user,
    "時間":new Date().toLocaleString(),
    "事件":event,
    "備註":note,
    "list":[{
      "產品":commodity,
      "SKU":sku,
      "數量":storage_num,
      "入庫倉庫":storage
    }]
  };
  
  var response = submitOrder("1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg", "入庫紀錄", data);
  
  Logger.log(response);
  
  if (response == true){
    return "true";
  }    
  
  return "false";
}

function sendExportOrder(time, storage, number, event, note, commodities, skus, storageNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  for (var index in commodities){
    data.push({"產品":commodities[index], "SKU":skus[index], "數量":storageNums[index]});
  }
  
  var data = {
    "出入庫日期":time,
    "出庫倉庫":storage,
    "表單號碼":number,
    "表單":"出貨單",
    "填寫人":user,
    "時間":new Date().toLocaleString(),
    "事件":event,
    "備註":note,
    "list":data
      };
  
  var response = submitOrder("1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg", "出庫紀錄", data);
  
  Logger.log(response);
  
  if (response == true){
    return "true";
  }    
  
  return "false";
}

function sendReturnOrder(time, number, event, note, commodities, skus, storages, storageNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  for (var index in commodities){
    data.push({"產品":commodities[index], "SKU":skus[index], "入庫倉庫":storages[index], "數量":storageNums[index]});
  }
  
  var data = {
    "出入庫日期":time,
    "表單號碼":number,
    "表單":"返貨單",
    "填寫人":user,
    "時間":new Date().toLocaleString(),
    "事件":event,
    "備註":note,
    "list":data
      };
  
  var response = submitOrder("1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg", "入庫紀錄", data);
  
  Logger.log(response);
  
  if (response == true){
    return "true";
  }    
  
  return "false";
}

function sendRequisiteOrder(time, number, event, note, commodities, skus, storages, storageNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  for (var index in commodities){
    data.push({"產品":commodities[index], "SKU":skus[index], "出庫倉庫":storages[index], "數量":storageNums[index]});
  }
  
  var data = {
    "出入庫日期":time,
    "表單號碼":number,
    "表單":"領用單",
    "填寫人":user,
    "時間":new Date().toLocaleString(),
    "事件":event,
    "備註":note,
    "list":data
      };
  
  var response = submitOrder("1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg", "出庫紀錄", data);
  
  Logger.log(response);
  
  if (response == true){
    return "true";
  }    
  
  return "false";
}

function sendTransferOrder(time, number, event, note, commodity, sku, storageEx, storageExNum, storageIms, storageImNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  data.push({"出庫倉庫":storageEx, "數量":storageExNum});
  
  for (var index in storageIms){
    data.push({"入庫倉庫":storageIms[index], "數量":storageImNums[index]});
  }
  
  var data = {
    "出入庫日期":time,
    "表單號碼":number,
    "表單":"調貨單",
    "產品":commodity,
    "SKU":sku,
    "填寫人":user,
    "時間":new Date().toLocaleString(),
    "事件":event,
    "備註":note,
    "list":data
      };
  
  var response = submitOrder("1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg", "調庫紀錄", data);
  
  Logger.log(response);
  
  if (response == true){
    return "true";
  }    
  
  return "false";
}