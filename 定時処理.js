/**
 *　監視処理の事前準備
 */
function ontime_prepare(){
  makeWorkSheets();
  makeStockCheckList();
}

/**
 * グループ別の在庫監視処理
 */
function ontime_monitor_group1(){
   var monitorSts = monitorByGroup(1,arguments.callee.name,1);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}


function ontime_monitor_group2(){
   var monitorSts = monitorByGroup(2,arguments.callee.name,1);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

function ontime_monitor_group3(){
   var monitorSts = monitorByGroup(3,arguments.callee.name,1);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

function ontime_monitor_group4(){
   var monitorSts = monitorByGroup(4,arguments.callee.name,1);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

function ontime_monitor_group5(){
   var monitorSts = monitorByGroup(5,arguments.callee.name,1);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

/**
 * 監視処理エラー対象の巡回監視
 */
function ontime_err_monitor_group1(){
   var monitorSts = monitorByGroup(1,arguments.callee.name,3);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

function ontime_err_monitor_group2(){
   var monitorSts = monitorByGroup(2,arguments.callee.name,3);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     //複数巡回処理のトリガーが同じ名前で、削除すると後続も削除されるので、削除しない。
     //巡回結果更新処理に削除する。
     //deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

function ontime_err_monitor_group3(){
   var monitorSts = monitorByGroup(3,arguments.callee.name,3);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

function ontime_err_monitor_group4(){
   var monitorSts = monitorByGroup(4,arguments.callee.name,3);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

function ontime_err_monitor_group5(){
   var monitorSts = monitorByGroup(5,arguments.callee.name,3);
   Logger.log(arguments.callee.name+"の監視処理結果＝"+monitorSts);
   if (monitorSts!==2) {
     deleteTriggerEvery6m(arguments.callee.name);
     var properties = PropertiesService.getScriptProperties();
     var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
     properties.deleteProperty(triggerFuntionName);
   }
   Logger.log(arguments.callee.name+"の監視処理完了");
}

