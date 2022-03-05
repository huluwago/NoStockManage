function ontime_setTriggerFromSheet1(){
  var sheetName = "トリガー設定（1回目）";
  clearTriggers(sheetName);
  setTriggerFromSheet(1,sheetName);
}

function ontime_setTriggerFromSheet2(){
  var sheetName = "トリガー設定（2回目）";
  clearTriggers(sheetName);
  setTriggerFromSheet(1,sheetName);
}

function act_setTriggerFromSheet(){
  var sheetName = "トリガー設定";
  clearTriggers(sheetName);
  setTriggerFromSheet(2,sheetName);
}

function act_setTriggerFromSheet1(){
  var sheetName = "トリガー設定（1回目）";
  clearTriggers(sheetName);
  setTriggerFromSheet(2,sheetName);
}

function act_setTriggerFromSheet2(){
  var sheetName = "トリガー設定（2回目）";
  clearTriggers(sheetName);
  setTriggerFromSheet(2,sheetName);
}

function setTriggerFromSheet(syoriKbn,sheetName) {
  initConstFromProp();
  const funcName_prepare = "ontime_prepare";
  const funcName_monitor = "ontime_monitor_";
  const funcName_updStockManageFile = "UpdStockManageFile_";
  const funcName_errMonitor = "ontime_err_monitor_";
  const funcName_updStockManageFileErr = "UpdStockManageFile_err_";

  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var wordManageSheet = ss_stockManageFile.getSheetByName(sheetName);

  //トリガーリスト
  var triggerList = [];

  //一回目
  //事前準備処理の予定時刻
  var time1_prepareHM = wordManageSheet.getRange("C3").getValue();
  makeTriggerList(time1_prepareHM,triggerList,funcName_prepare,"");

  //監視処理の予定時刻
  var time1_monitorList =  wordManageSheet.getRange("C6:J10").getValues();
  Logger.log(time1_monitorList);
  for (i=0;i<time1_monitorList.length;i++){
    var strGroup = "group"+(i+1);

    //監視処理のトリガー
    makeTriggerList(time1_monitorList[i][0],triggerList,funcName_monitor,strGroup);

    //監視後更新処理のトリガー
    makeTriggerList(time1_monitorList[i][1],triggerList,funcName_updStockManageFile,strGroup);

    //エラー巡回監視処理(一回目)のトリガー
    makeTriggerList(time1_monitorList[i][2],triggerList,funcName_errMonitor,strGroup);

    //エラー巡回監視処理(二回目)のトリガー
    makeTriggerList(time1_monitorList[i][3],triggerList,funcName_errMonitor,strGroup);

    //エラー巡回監視処理(三回目)のトリガー
    makeTriggerList(time1_monitorList[i][4],triggerList,funcName_errMonitor,strGroup);

    //エラー巡回監視処理(四回目)のトリガー
    makeTriggerList(time1_monitorList[i][5],triggerList,funcName_errMonitor,strGroup);

    //エラー巡回監視処理(五回目)のトリガー
    makeTriggerList(time1_monitorList[i][6],triggerList,funcName_errMonitor,strGroup);

    makeTriggerList(time1_monitorList[i][7],triggerList,funcName_updStockManageFileErr,strGroup);

  }
  Logger.log(triggerList);
  if(triggerList.length>20){
    wordManageSheet.getRange("B12").setValue("トリガー設定可能な上限数を超えました。設定を減らして、代わりに別のアカウントで設定してくさい。");
    return;
  }

  var result = setTriggerList(triggerList,syoriKbn); 
  if (result){
    wordManageSheet.getRange("B12").setValue(getDateString(new Date()) + ":トリガーの設定が完了しました。");
  } else {
    wordManageSheet.getRange("B12").setValue("過去時刻が含まれているので、処理終了。時刻を修正してください。");
  }
  
}

function  makeTriggerList(timeHM,triggerList,funcName,strGroup){
  var time = new Date();
  var triggerSubList = [];
  if (timeHM !== "") {
    triggerSubList.push(funcName+strGroup);
    triggerSubList.push(timeHM);
    triggerList.push(triggerSubList);
  }
  return triggerList;
}

function checkHM(triggerList){
  var result;
  for (m=0;m<triggerList.length;m++) {
    var targetTimeHM = triggerList[m][1];
    var targetHour = parseInt(targetTimeHM.split(":")[0]);
    var targetMinute = parseInt(targetTimeHM.split(":")[1]);

    var time = new Date();
    var nowHour = time.getHours();
    var nowMinutes = time.getMinutes();

    if(targetHour > nowHour){
      result = true;
    } else if(targetHour < nowHour){
      Logger.log("targetHour < nowHour");
      result = false;
      break;
    } else {
      //targetHour = nowHour
      if (targetMinute > nowMinutes) {
        result = true;
      } else {
        Logger.log("targetHour = nowHour and targetMinute > nowMinutes");
        result = false;
        break;
      }
    }
  }
  Logger.log(result);
  return result;
}

/**
 * トリガー設定処理
 * 画面から設定する場合（syoriKbn＝２）、当日のトリガーを設定
 * 当日の場合、設定時刻は過去の場合、設定しない
 * 
 * 
 */
function setTriggerList(triggerList,syoriKbn){
  var result = true;
  if (syoriKbn==1){
    Logger.log("定時トリガー設定処理（syoriKbn=1）");
  } else {
    Logger.log("画面からトリガーを設定する処理（syoriKbn=2）");
    //
    result =  checkHM(triggerList);
    if (!result){
      return result;
    }
  }

  for (j=0;j<triggerList.length;j++) {
    var funcName = triggerList[j][0];
    var strHM = triggerList[j][1];
    Logger.log("funcName"+funcName);
    Logger.log("strHM"+strHM);
    var intHour = parseInt(strHM.split(":")[0]);
    var intMinute = parseInt(strHM.split(":")[1]);

    var time = new Date();
    time.setDate(time.getDate());
    time.setHours(intHour);
    time.setMinutes(intMinute);
    Logger.log("intHour"+intHour);
    Logger.log("intMinute"+intMinute);
    Logger.log("time#########################");
    Logger.log(time);
    ScriptApp.newTrigger(funcName).timeBased().at(time).create();
  }
  return result;
}
function act_clearTriggers(){
  var sheetName = "トリガー設定";
  clearTriggers(sheetName);
}


function act_clearTriggers1(){
  var sheetName = "トリガー設定（1回目）";
  clearTriggers(sheetName);
}

function act_clearTriggers2(){
  var sheetName = "トリガー設定（2回目）";
  clearTriggers(sheetName);
}

function clearTriggers(sheetName){
  initConstFromProp();
  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var wordManageSheet = ss_stockManageFile.getSheetByName(sheetName);
  const triggers = ScriptApp.getProjectTriggers();
  for(const trigger of triggers){
    var funcName = trigger.getHandlerFunction();
    if (funcName.indexOf("ontime_setTrigger")==(-1)){
      ScriptApp.deleteTrigger(trigger);
      Logger.log("トリガー削除:"+trigger.getHandlerFunction());
    }
  }
  wordManageSheet.getRange("B12").setValue(getDateString(new Date()) + ":トリガーが削除されました。");
}

function showTriggers(){
  const triggers = ScriptApp.getProjectTriggers();
  Logger.log("トリガー数："+triggers.length);
  for(const trigger of triggers){
    var funcName = trigger.getHandlerFunction();
    Logger.log(funcName);
  }

}


