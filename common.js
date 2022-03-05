//在庫管理ファイルのID
var stockManageFileId = "";
//在庫ワード管理一覧のシート名
var wordManageSheetName = "";
//サイト別監視用WORKファイル一覧のシート名
var siteWorkFlieSheetName = "";
//監視対象ファイル一覧のシート名
var targetFileSheetName = "";

//監視対象一覧のシート名
var monitoringSheetName = "";
//ワーニングスプレッドシートのテンプレートファイルID
var templateFileID = "";
//ワーニングスプレッドシートのフォルダID
var workFolderId= "";
//監視対象の日本在庫サイトの列のタイトル名
var targetKeyword = "";

//在庫状況表示色　在庫確認待ち（初期状態）
var statusColor_wait = "";
//在庫状況表示色　在庫あり
var statusColor_ok = "";
//在庫状況表示色　在庫なし
var statusColor_ng = "";
//在庫状況表示色　監視処理エラー 
var statusColor_err = "";

function  initConstFromProp(){
  var properties = PropertiesService.getScriptProperties();

  stockManageFileId = properties.getProperty("stockManageFileId");
  wordManageSheetName = properties.getProperty("wordManageSheetName");
  siteWorkFlieSheetName = properties.getProperty("siteWorkFlieSheetName");
  targetFileSheetName = properties.getProperty("targetFileSheetName");
  monitoringSheetName = properties.getProperty("monitoringSheetName");
  templateFileID = properties.getProperty("templateFileID");
  workFolderId= properties.getProperty("workFolderId");
  targetKeyword = properties.getProperty("targetKeyword");
  statusColor_wait = properties.getProperty("statusColor_wait");
  statusColor_ok = properties.getProperty("statusColor_ok");
  statusColor_ng = properties.getProperty("statusColor_ng");
  statusColor_err = properties.getProperty("statusColor_err");
}



/**
 * 日付フォーマットを取得 秒まで
 *
 * @param date triggerKey
 * @return String　日付
 */
//日付フォーマット
function getFullDateString (date) {
  var dateString = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + 
  ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  return dateString
}

/**
 * 日付フォーマットを取得
 *
 * @param date triggerKey
 * @return String　日付
 */
//日付フォーマット
function getDateString (date) {
  var dateString = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + 
  ('0' + date.getMinutes()).slice(-2);
  return dateString
}

function getSheetByUrl(url) {
  url = "https://docs.google.com/spreadsheets/d/1vSnJeow49yEZL0v63mePqtShNTOxJ5juOn_0_E-v7mE/edit#gid=1955050067";
  if(!url) {
    throw "input error"
  }

  // URLの3階層目からスプレッドシートID取得
  var regExpSpreadsheetId = new RegExp("https?://.*?/.*?/.*?/(.*?)(?=/)");
  var spreadsheetId = url.match(regExpSpreadsheetId)[1];

  // gidパラメータからシートID取得
  var regExpGid = new RegExp("gid=(.*?)(&|$)");
  var gid = url.match(regExpGid)[1];

  // 一致するシートオブジェクト取得
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheets = spreadsheet.getSheets();
  for (i=0;i<sheets.length;i++) {
    if (sheets[i].getSheetId()===Number(gid)) {
      return sheets[i]
    }
  }
  return null
}

function getSpreadSheetByUrl(url) {
  if(!url) {
    throw "input error"
  }

  // URLの3階層目からスプレッドシートID取得
  var regExpSpreadsheetId = new RegExp("https?://.*?/.*?/.*?/(.*?)(?=/)");
  var spreadsheetId = url.match(regExpSpreadsheetId)[1];

  // 一致するシートオブジェクト取得
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId)

  return spreadsheet
}

/**
 * 指定したkeyに保存されているトリガーIDを使って、トリガーを削除する
 *
 * @param string triggerKey
 * @return void
 */
function deleteTrigger(triggerKey) {
    var triggerId = PropertiesService.getScriptProperties().getProperty(triggerKey);
    Logger.log("deleteTrigger triggerId="+triggerId);
    if(!triggerId) return;
    
    ScriptApp.getProjectTriggers().filter(function(trigger){
      return trigger.getUniqueId() == triggerId;
    })
    .forEach(function(trigger) {
        ScriptApp.deleteTrigger(trigger);
        Logger.log("deleteTrigger-----");
    });
    PropertiesService.getScriptProperties().deleteProperty(triggerKey);
  }

/**
 * トリガーを発行する
 *
 * @param string triggerKey
 * @param string funcName
 * @return void
 */
function setTrigger(triggerKey, funcName){
  //既に同名で保存しているトリガーがあったら削除
  deleteTrigger(triggerKey);
  
  //１分後にトリガーを登録する
  var date = new Date();
  date.setMinutes(date.getMinutes() + 1);
  var triggerId = ScriptApp.newTrigger(funcName).timeBased().at(date).create().getUniqueId();
  Logger.log('setTrigger function_name "%s".', funcName);
  
  //あとでトリガーを削除するために「スクリプトのプロパティ」にトリガーIDを保存しておく
  PropertiesService.getScriptProperties().setProperty(triggerKey, triggerId);
}

/**
 * ファイル書き出し
 * @param {string} fileName ファイル名
 * @param {string} content ファイルの内容
 */
function createFile(fileName, content) {

  var time = new Date();
  var strTime = getFullDateString(time);
  fileName = fileName + "_" + strTime;
  var folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty("LOG_FOLDER_ID"));
  var contentType = 'text/plain';
  var charset = 'utf-8';

  // Blob を作成する
  var blob = Utilities.newBlob('', contentType, fileName)
                      .setDataFromString(content, charset);

  // ファイルに保存
  folder.createFile(blob);
}


function setTriggersEvery6m(funcName) {
  //既に同名で保存しているトリガーがあったら削除
  deleteTriggerEvery6m(funcName);
  Logger.log("トリガー設定:"+funcName);
  //5分後にトリガーを登録する
   var date = new Date();
   date.setMinutes(date.getMinutes() + 5);
// 6分毎に実行するトリガーを設定   
    ScriptApp.newTrigger(funcName).timeBased().everyMinutes(5).create()

}

function delelteTri(){
  var funcName = "	UpdStockManageFile_group3";
  deleteTriggerEvery6m(funcName);
}


/**
 * トリガーの削除
 */
function deleteTriggerEvery6m(funcName) {
  //funcName = "t_monitor_group1"
  const triggers = ScriptApp.getProjectTriggers();
  for(const trigger of triggers){
    if(trigger.getHandlerFunction() == funcName){
       Logger.log("トリガー削除:"+funcName);
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

function checkTrigger(funcName){
  const triggers = ScriptApp.getProjectTriggers();
  for(const trigger of triggers){
    if(trigger.getHandlerFunction() == funcName){
       Logger.log("トリガー「"+funcName+"」が既に存在している");
       return true;
    }
  }
  return false;
}

/**
 * 経過時間を取得するクラス
 * 
 */
class Time {
  constructor() {
    this.start = new Date();
  }

  getElapsedTime() {
    const now = new Date();
    const s = (now - this.start) / 1000; //ミリ秒から秒数へ変更
    return s;
  }
}
