function sendImportPostRequest(time, number, commodity, sku, storage_num, event, storage, note){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var param = {
    parameter:{
      "sheetID":"1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg",
      "sheetTag":"入庫紀錄",
      "data":{
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
          "入庫倉庫":storage}
        ]
      }
    }
  };
  var options = {
    "method" : "post",
    "contentType": "application/json",
    "headers":{"Authorization":"Bearer " + ScriptApp.getOAuthToken()},
    "payload" : JSON.stringify(param)
  };
  
  //APISheet.gs url
  var url = "https://script.google.com/a/connact.tw/macros/s/AKfycbw5BEbe0z9k4o1CH4FGAoLmXzdTRdLsAMGc6VJbAPHwUGY3QPeE/exec";
  
  //Send Post Request
  var response = UrlFetchApp.fetch(url, options);
  
  Logger.log(response);
  
  if (response == "true"){
    return "true";
  }    
  
  return "false";
}

function sendExportPostRequest(time, storage, number, event, note, commodities, skus, storageNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  for (var index in commodities){
    data.push({"產品":commodities[index], "SKU":skus[index], "數量":storageNums[index]});
  }
  
  var param = {
    parameter:{
      "sheetID":"1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg",
      "sheetTag":"出庫紀錄",
      "data":{
        "出入庫日期":time,
        "出庫倉庫":storage,
        "表單號碼":number,
        "表單":"出貨單",
        "填寫人":user,
        "時間":new Date().toLocaleString(),
        "事件":event,
        "備註":note,
        "list":data
      }
    }
  };
  var options = {
    "method" : "post",
    "contentType": "application/json",
    "headers":{"Authorization":"Bearer " + ScriptApp.getOAuthToken()},
    "payload" : JSON.stringify(param)
  };
  
  //APISheet.gs url
  var url = "https://script.google.com/a/connact.tw/macros/s/AKfycbw5BEbe0z9k4o1CH4FGAoLmXzdTRdLsAMGc6VJbAPHwUGY3QPeE/exec";
  
  //Send Post Request
  var response = UrlFetchApp.fetch(url, options);
  
  Logger.log(response);
  
  if (response == "true"){
    return "true";
  }    
  
  return "false";
}

function sendReturnPostRequest(time, number, event, note, commodities, skus, storages, storageNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  for (var index in commodities){
    data.push({"產品":commodities[index], "SKU":skus[index], "入庫倉庫":storages[index], "數量":storageNums[index]});
  }
  
  var param = {
    parameter:{
      "sheetID":"1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg",
      "sheetTag":"入庫紀錄",
      "data":{
        "出入庫日期":time,
        "表單號碼":number,
        "表單":"返貨單",
        "填寫人":user,
        "時間":new Date().toLocaleString(),
        "事件":event,
        "備註":note,
        "list":data
      }
    }
  };
  var options = {
    "method" : "post",
    "contentType": "application/json",
    "headers":{"Authorization":"Bearer " + ScriptApp.getOAuthToken()},
    "payload" : JSON.stringify(param)
  };
  
  //APISheet.gs url
  var url = "https://script.google.com/a/connact.tw/macros/s/AKfycbw5BEbe0z9k4o1CH4FGAoLmXzdTRdLsAMGc6VJbAPHwUGY3QPeE/exec";
  
  //Send Post Request
  var response = UrlFetchApp.fetch(url, options);
  
  Logger.log(response);
  
  if (response == "true"){
    return "true";
  }    
  
  return "false";
}

function sendRequisitePostRequest(time, number, event, note, commodities, skus, storages, storageNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  for (var index in commodities){
    data.push({"產品":commodities[index], "SKU":skus[index], "出庫倉庫":storages[index], "數量":storageNums[index]});
  }
  
  var param = {
    parameter:{
      "sheetID":"1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg",
      "sheetTag":"出庫紀錄",
      "data":{
        "出入庫日期":time,
        "表單號碼":number,
        "表單":"領用單",
        "填寫人":user,
        "時間":new Date().toLocaleString(),
        "事件":event,
        "備註":note,
        "list":data
      }
    }
  };
  var options = {
    "method" : "post",
    "contentType": "application/json",
    "headers":{"Authorization":"Bearer " + ScriptApp.getOAuthToken()},
    "payload" : JSON.stringify(param)
  };
  
  //APISheet.gs url
  var url = "https://script.google.com/a/connact.tw/macros/s/AKfycbw5BEbe0z9k4o1CH4FGAoLmXzdTRdLsAMGc6VJbAPHwUGY3QPeE/exec";
  
  //Send Post Request
  var response = UrlFetchApp.fetch(url, options);
  
  Logger.log(response);
  
  if (response == "true"){
    return "true";
  }    
  
  return "false";
}

function sendTransferPostRequest(time, number, event, note, commodity, sku, storageEx, storageExNum, storageIms, storageImNums){
  
  var time = new Date(time).toLocaleString();
  var user = Session.getActiveUser().getEmail();
  
  var data = new Array();
  
  data.push({"出庫倉庫":storageEx, "數量":storageExNum});
  
  for (var index in storageIms){
    data.push({"入庫倉庫":storageIms[index], "數量":storageImNums[index]});
  }
  
  var param = {
    parameter:{
      "sheetID":"1oGAr86k9d3BfuSc_fe798jVIZ3Eq-dkwRoS6_kt2KJg",
      "sheetTag":"調庫紀錄",
      "data":{
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
      }
    }
  };
  var options = {
    "method" : "post",
    "contentType": "application/json",
    "headers":{"Authorization":"Bearer " + ScriptApp.getOAuthToken()},
    "payload" : JSON.stringify(param)
  };
  
  //APISheet.gs url
  var url = "https://script.google.com/a/connact.tw/macros/s/AKfycbw5BEbe0z9k4o1CH4FGAoLmXzdTRdLsAMGc6VJbAPHwUGY3QPeE/exec";
  
  //Send Post Request
  var response = UrlFetchApp.fetch(url, options);
  
  Logger.log(response);
  
  if (response == "true"){
    return "true";
  }    
  
  return "false";
}