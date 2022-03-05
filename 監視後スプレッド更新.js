function  UpdStockManageFile_group1(){
  var monitorSts = updateStockManageFileBygroup(1,arguments.callee.name,1);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
    deleteTrigger(arguments.callee.name);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_group2(){
  var monitorSts = updateStockManageFileBygroup(2,arguments.callee.name,1);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_group3(){
  var monitorSts = updateStockManageFileBygroup(3,arguments.callee.name,1);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_group4(){
  var monitorSts = updateStockManageFileBygroup(4,arguments.callee.name,1);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_group5(){
  var monitorSts = updateStockManageFileBygroup(5,arguments.callee.name,1);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_err_group1(){
  var monitorSts = updateStockManageFileBygroup(1,arguments.callee.name,3);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_err_group2(){
  //更新時に複数回の巡回処理トリガーを削除
  deleteTriggerEvery6m("ontime_err_monitor_group2");
  var monitorSts = updateStockManageFileBygroup(2,arguments.callee.name,3);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_err_group3(){
  var monitorSts = updateStockManageFileBygroup(3,arguments.callee.name,3);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_err_group4(){
  var monitorSts = updateStockManageFileBygroup(4,arguments.callee.name,3);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

function  UpdStockManageFile_err_group5(){
  var monitorSts = updateStockManageFileBygroup(5,arguments.callee.name,3);
  if (monitorSts!==2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name+"の監視結果更新処理が完了しました。");
}

/**
 * 処理済みWORKファイルもとに、監視管理ファイルに日本在庫サイトURLの背景色を更新
 */
function  updateStockManageFileBygroup(groupNo,triggerFuntionName,targetSts){
  initConstFromProp();
  showTriggers();
  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var siteWorkFileSheet = ss_stockManageFile.getSheetByName(siteWorkFlieSheetName);

  var lastRow = siteWorkFileSheet.getLastRow();
  var siteWorkFileList = siteWorkFileSheet.getRange(3,1,lastRow-2,23).getValues();

  // Timeクラスをインスタンス化して処理の開始時間を取得
  const time = new Time();

  //処理中断情報を取得
  var properties = PropertiesService.getScriptProperties();
  var nowRow_i = properties.getProperty(triggerFuntionName+"_stopAt_Level1_i");
  var nowRow_j = properties.getProperty(triggerFuntionName+"_stopAt_Level2_j");
  Logger.log("nowRow_i="+nowRow_i);
  Logger.log("nowRow_j="+nowRow_j);

  if (!nowRow_i){
    Logger.log("グループ"+groupNo+"の在庫情報更新処理が始めました。");
    nowRow_i = 1;
    nowRow_j = 1;
    var setTriggerFlg = properties.getProperty(triggerFuntionName+"_setTriggerFlg");
    Logger.log("setTriggerFlg"+setTriggerFlg);
    if (setTriggerFlg==1){
      Logger.log("トリガーが既に存在する。"+triggerFuntionName+"_setTriggerFlg");
    }else{
    　//6分ごとのトリガーを設定する。
      setTriggersEvery6m(triggerFuntionName);
      properties.setProperty(triggerFuntionName+"_setTriggerFlg", 1);
      Utilities.sleep(60 * 1000);
      return 2; //中断;
    }
  } else {
　　Logger.log("グループ"+groupNo+"の在庫情報更新処理が再開しました。");
  } 
  var result;
  for (i=nowRow_i-1;i<siteWorkFileList.length;i++){
     var monitorGroup = siteWorkFileList[i][8];
     var siteWorkFileID = siteWorkFileList[i][3];
    Logger.log(siteWorkFileID+"の更新処理が始めました。");
     if(monitorGroup==groupNo) {
       var statusCol;
       var startTimeCol;
       var endTimeCol;
       if(targetSts==3){
         statusCol=22;
         startTimeCol=23;
         endTimeCol=24;
       } else {
         statusCol=13;
         startTimeCol=14;
         endTimeCol=15;

       }

       siteWorkFileSheet.getRange(3+i,statusCol).setValue("在庫状況反映中");
       
       //処理開始時間は初回のみ設定
       if (nowRow_j==1) {
          siteWorkFileSheet.getRange(3+i,startTimeCol).setValue(getDateString(new Date()));
       }
       result = updateStockManageFile(siteWorkFileSheet,siteWorkFileID,time,i+1,nowRow_j,triggerFuntionName,statusCol);
       if (result==2) {
         break;
       }
       siteWorkFileSheet.getRange(3+i,statusCol).setValue("在庫状況反映済み");
       siteWorkFileSheet.getRange(3+i,endTimeCol).setValue(getDateString(new Date()));
       nowRow_j=1;
     }
  }
  return result;
}

/**
 * 監視Workファイルの内容もとに、在庫管理ファイルを更新する。
 * 途中で行追加を考慮し、元の位置に更新することではなく、
 * 商品URLをマッチングして更新する。
 */
function updateStockManageFile(siteWorkFileSheet,siteWorkFileID,time,stopi,nowRow_j,triggerFuntionName,statusCol){
    var ss_WorkFile = SpreadsheetApp.openById(siteWorkFileID);
    var workSheet = ss_WorkFile.getSheetByName("work");

    var monitorList = [];
    var lastRow = workSheet.getLastRow();
    if (lastRow>3) {
       monitorList = workSheet.getRange(4,1,lastRow-3,9).getValues();
    } else {
      return　3;
    }
    Logger.log(monitorList);
    Logger.log("監視対象リストよりファイル更新処理を実施");
    Logger.log("stopi="+stopi);
    Logger.log("nowRow_j="+nowRow_j);
    Logger.log("monitorList.length="+monitorList.length);
    for (j=nowRow_j-1;j<monitorList.length;j++) {
      var monitorFileUrl = monitorList[j][2];
      var monitorFile = getSpreadSheetByUrl(monitorFileUrl);
      var monitorSheet = monitorFile.getSheetByName(monitorList[j][3]);
      var color = "";
      
      var targetColumn = monitorList[j][5];
      var motoRow = monitorList[j][4];
      var targetRow = findRow(monitorSheet,monitorList[j][6],targetColumn);
      //監視対象URLが削除、変更された場合色更新しない。
      if (targetRow==0) {
        continue;
      }
  
      var status = monitorList[j][7];
      Logger.log("status="+status);

      // 経過時間の取得
      const elaspedTime = time.getElapsedTime();
      console.log('elaspedTime' + elaspedTime);

      if (elaspedTime > 240) {
        Logger.log("処理が一時停止しました。");
        //何行まで処理したかなどを「スクリプトのプリロパティ」に保存する
         var properties = PropertiesService.getScriptProperties();
         properties.setProperty(triggerFuntionName+"_stopAt_Level1_i", stopi);
         properties.setProperty(triggerFuntionName+"_stopAt_Level2_j", j+1);
        siteWorkFileSheet.getRange(3+i,statusCol).setValue("処理中断(数分後再開)");
        return 2;
      }

      var stopFlg=0;
      switch (status) {
        case 0:
          color = statusColor_wait;
          break;
        case 1:
          color = statusColor_ok;
          break;
        case 2:
          color = statusColor_ng;
          break;
        case 3:
          color = statusColor_err;
          break;
        default:
          stopFlg = 1;
          color = statusColor_err;
      }
      Logger.log("targetRow"+targetRow);
      Logger.log("targetColumn"+targetColumn);
      //何等かの原因でステータスが取ってない状態なら、背景色は更新しない
      if (stopFlg==0){
        monitorSheet.getRange(targetRow,targetColumn).setBackground(color);
        workSheet.getRange(4+j,8).setBackground(color);
      }

    }
    return 1;
}

function findRow(sheet,val,col){

  var dat = sheet.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得

  for(var i=1;i<dat.length;i++){
    if(dat[i][col-1] === val){
      return i+1;
    }
  }
  return 0;
}