function setConfigurePropertys() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var configureSheet = spreadsheet.getActiveSheet();
  var properties = PropertiesService.getScriptProperties();

  //日本在庫サイトURL列のタイトル名
  properties.setProperty(
    "targetKeyword",
    configureSheet.getRange("C2").getValue()
  );

  //在庫管理ツールのファイルID
  properties.setProperty(
    "stockManageFileId",
    configureSheet.getRange("C3").getValue()
  );

  //在庫ワード管理のシート名
  properties.setProperty(
    "wordManageSheetName",
    configureSheet.getRange("C4").getValue()
  );

  //サイト別監視用WORKファイル一覧のシート名
  properties.setProperty(
    "siteWorkFlieSheetName",
    configureSheet.getRange("C5").getValue()
  );

  //監視対象ファイル一覧のシート名
  properties.setProperty(
    "targetFileSheetName",
    configureSheet.getRange("C6").getValue()
  );

  //Workファイル　テンプレートファイルID
  properties.setProperty(
    "templateFileID",
    configureSheet.getRange("C7").getValue()
  );

  //Workファイル　格納フォルダのID
  properties.setProperty(
    "workFolderId",
    configureSheet.getRange("C8").getValue()
  );

  //在庫状況表示色　在庫確認待ち（初期状態）
  properties.setProperty(
    "statusColor_wait",
    configureSheet.getRange("C9").getBackground()
  );

  //在庫状況表示色　在庫あり
  properties.setProperty(
    "statusColor_ok",
    configureSheet.getRange("C10").getBackground()
  );

  //在庫状況表示色　在庫なし
  properties.setProperty(
    "statusColor_ng",
    configureSheet.getRange("C11").getBackground()
  );

  //在庫状況表示色　監視処理エラー
  properties.setProperty(
    "statusColor_err",
    configureSheet.getRange("C12").getBackground()
  );

  //Phantom APIのAPI-KEY
  properties.setProperty(
    "PHANTOM_API_KEY",
    configureSheet.getRange("C13").getValue()
  );

  //ログフォルダのID
  properties.setProperty(
    "LOG_FOLDER_ID",
    configureSheet.getRange("C14").getValue()
  );

  configureSheet
    .getRange("C18")
    .setValue(getDateString(new Date()) + ":初期設定が完了しました。");
}

function getPropertys() {
  var properties = PropertiesService.getScriptProperties();
  Logger.log(properties.getKeys());
  var keyList = properties.getKeys();

  for (var i = 0; i < keyList.length; i++) {
    Logger.log(keyList[i]);
    Logger.log(properties.getProperty(keyList[i]));
  }
}

function clearPropertys() {
  var properties = PropertiesService.getScriptProperties();
  properties.deleteAllProperties();
}

function clearStopPropertys() {
  var properties = PropertiesService.getScriptProperties();
  Logger.log(properties.getKeys());
  var keyList = properties.getKeys();

  for (var i = 0; i < keyList.length; i++) {
    Logger.log(keyList[i]);
    Logger.log(properties.getProperty(keyList[i]));
    var key = keyList[i];
    if (key.indexOf("stopAt") > 0 || key.indexOf("setTriggerFlg") > 0) {
      Logger.log("中断保存情報を削除" + key);
      properties.deleteProperty(keyList[i]);
    }
  }
  Logger.log("中断保存情報削除処理が完了しました");
}

//function getStockStatus(targetUrl,sitekbn,parsePattern,stockCheckWord,parseHtmlFrom,parseHtmlTo) {
function monitorTest() {
  initConstFromProp();
  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var testSheet = ss_stockManageFile.getSheetByName("在庫監視テストシート");

  //
  var lastRow = testSheet.getLastRow();
  var targetList = testSheet.getRange(3, 1, lastRow - 2, 10).getValues();
  for (i = 0; i < targetList.length; i++) {
    var targetUrl = targetList[i][9];
    var sitekbn = targetList[i][3];
    var parsePattern = targetList[i][5];
    var stockCheckWord = targetList[i][6];
    var parseHtmlFrom = targetList[i][7];
    var parseHtmlTo = targetList[i][8];

    Logger.log("targetUrl=" + targetUrl);

    if (!targetUrl) {
      continue;
    }
    Logger.log("sitekbn=" + sitekbn);
    Logger.log("parsePattern=" + parsePattern);
    Logger.log("stockCheckWord=" + stockCheckWord);
    Logger.log("parseHtmlFrom=" + parseHtmlFrom);
    Logger.log("parseHtmlTo=" + parseHtmlTo);
    var status = getStockStatus(
      targetUrl,
      sitekbn,
      parsePattern,
      stockCheckWord,
      parseHtmlFrom,
      parseHtmlTo
    );
    Logger.log("status is " + status);
    var color;
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
        color = statusColor_err;
    }
    testSheet.getRange(3 + i, 11).setValue(status);
    testSheet.getRange(3 + i, 11).setBackground(color);
  }
}
