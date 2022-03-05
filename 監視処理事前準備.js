/**
 * 在庫ワード管理一覧のサイトごとに、該当するWorkファイルを作成し、
 * Workファイル一覧のシートに関連情報を設定する。
 *
 */
function makeWorkSheets() {
  Logger.log("WORKファイル削除処理が始まりました。");
  initConstFromProp();
  clearStopPropertys();

  var ss_stockManageFile = SpreadsheetApp.openById(
    "1wjOlngRQSLDS9BkrOfqRQoNmHe2XikeLlwsQPSkoI64"
  );
  var wordManageSheet = ss_stockManageFile.getSheetByName(wordManageSheetName);
  var siteWorkFileSheet = ss_stockManageFile.getSheetByName(
    siteWorkFlieSheetName
  );

  // コピー元テンプレートファイルのID
  var templateFile = DriveApp.getFileById(templateFileID);
  var OutputFolder = DriveApp.getFolderById(workFolderId);
  var makeDate = getDateString(new Date());
  //
  var lastRow = wordManageSheet.getLastRow();

  var wordManageList = wordManageSheet
    .getRange(3, 1, lastRow - 2, 10)
    .getValues();

  //generationManage(workFolderId);
  //Workファイル一覧のシートを初期化する
  siteWorkFileSheet.getRange(3, 1, 100, 24).clearContent();

  for (i = 0; i < wordManageList.length; i++) {
    var fileName = "work_" + wordManageList[i][1] + "_" + makeDate;
    var monitorGroupId = wordManageList[i][9];
    //    Logger.log("monitorGroupId="+monitorGroupId);
    // コピー出力するフォルダのID
    var CopiedFile = templateFile.makeCopy(fileName, OutputFolder);

    //コピーしたシートのID取得
    var CopiedFileId = CopiedFile.getId();
    var CopiedFileURL = CopiedFile.getUrl();

    //
    //wordManageSheet.getRange(3+i,11).setValue(CopiedFileId);
    //コピー先に関連情報を設定
    var newSpreadsheet = SpreadsheetApp.openById(CopiedFileId);
    var configSheet = newSpreadsheet.getSheetByName("設定");
    //Workファイルの設定シートを更新する。
    var uri = new URI(wordManageList[i][2]);
    var siteDomain = uri.hostname().replace("www.", "");
    configSheet.getRange("B1").setValue(siteDomain);
    configSheet.getRange("B2").setValue(wordManageList[i][3]);
    configSheet.getRange("B3").setValue(wordManageList[i][4]);
    configSheet.getRange("B4").setValue(wordManageList[i][5]);
    configSheet.getRange("B5").setValue(wordManageList[i][6]);
    configSheet.getRange("B6").setValue(wordManageList[i][7]);
    configSheet.getRange("B7").setValue(wordManageList[i][8]);

    //Workファイル一覧のシートに設定する。
    siteWorkFileSheet.getRange(3 + i, 1).setValue(i + 1);
    siteWorkFileSheet.getRange(3 + i, 2).setValue(fileName);
    siteWorkFileSheet.getRange(3 + i, 3).setValue(CopiedFileURL);
    siteWorkFileSheet.getRange(3 + i, 4).setValue(CopiedFileId);
    siteWorkFileSheet.getRange(3 + i, 9).setValue(monitorGroupId);
  }
  Logger.log("WORKファイル削除処理が完了しました。");
}

function generationManage(workFolderId) {
  //  Logger.log(workFolderId);
  //フォルダ２削除
  var workFolder = DriveApp.getFolderById(workFolderId);
  var folder2 = workFolder.getFoldersByName("2");
  while (folder2.hasNext()) {
    var folder = folder2.next();
    var folderName = folder.getName();
    folder.setTrashed(true);
  }

  //フォルダ１⇒フォルダ２ の名前変更
  var folder1 = workFolder.getFoldersByName("1");
  while (folder1.hasNext()) {
    var folder = folder1.next();
    folder.setName("2");
  }

  //フォルダ０⇒フォルダ１　の名前変更
  var folder0 = workFolder.getFoldersByName("0");
  while (folder0.hasNext()) {
    var folder = folder0.next();
    folder.setName("1");
  }

  //フォルダ０作成
  //FileIdListのファイル⇒フォルダ0
  var newFolder = workFolder.createFolder("0");
  var newFolderId = newFolder.getId();
  //   Logger.log(newFolderId);

  //ファイル移動
  var files = workFolder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    var name = file.getName();
    if (name.match(/work/)) {
      file.moveTo(newFolder);
    }
  }
}

/**
 * ワーニングスプレッドシートファイルごとに、
 * 在庫管理ファイルの監視対象一覧を読み込み、各シートに該当する商品ＵＲＬ関連情報を取得して出力する。
 *
 */
function makeStockCheckList() {
  Logger.log("監視対象収集処理が始まりました。");
  initConstFromProp();
  var triggerFuntionName = "makeStockCheckList";

  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var siteWorkFileSheet = ss_stockManageFile.getSheetByName(
    siteWorkFlieSheetName
  );
  var targetInfoList = [];

  var lastRow = siteWorkFileSheet.getLastRow();
  var siteWorkFileList = siteWorkFileSheet
    .getRange(3, 4, lastRow - 2, 4)
    .getValues();
  //  Logger.log(siteWorkFileList);

  /**中断処理①　Start******************/
  //処理開始時間
  var startTime = new Date();

  // Timeクラスをインスタンス化して処理の開始時間を取得
  const time = new Time();

  //処理中断情報を取得
  var properties = PropertiesService.getScriptProperties();
  var nowRow = properties.getProperty("makeStockCheckList_stopAt_r");
  Logger.log("nowRow=" + nowRow);

  //処理開始位置の初期化
  var strWorkFileName = "";
  if (!nowRow) {
    //中断再開ではなく、処理が始まったところの場合
    nowRow = 1;
    strWorkFileName = siteWorkFileList[1];

    var setTriggerFlg = properties.getProperty(
      triggerFuntionName + "_setTriggerFlg"
    );
    Logger.log("setTriggerFlg" + setTriggerFlg);
    if (setTriggerFlg == 1) {
      Logger.log(
        "トリガーが既に存在する。" + triggerFuntionName + "_setTriggerFlg"
      );
    } else {
      //6分ごとのトリガーを設定する。
      setTriggersEvery6m(triggerFuntionName);
      properties.setProperty(triggerFuntionName + "_setTriggerFlg", 1);
      Utilities.sleep(60 * 1000);
      return 2; //中断;
    }

    Logger.log(strWorkFileName + "の監視対象商品ＵRLの取得が始めました。");
  } else {
    strWorkFileName = siteWorkFileList[nowRow - 1];
    Logger.log(
      strWorkFileName +
        "の" +
        nowRow +
        "番目商品の在庫情報取得処理が再開しました。"
    );
  }

  /**中断処理②　End *****************************/

  for (r = nowRow - 1; r < siteWorkFileList.length; r++) {
    var ss_WorkFile = SpreadsheetApp.openById(siteWorkFileList[r][0]);
    var workSheet = ss_WorkFile.getSheetByName("work");
    var configSheet = ss_WorkFile.getSheetByName("設定");
    targetInfoList = [];

    //処理ステータス更新
    siteWorkFileSheet.getRange(r + 3, 6).setValue("処理中");
    siteWorkFileSheet.getRange(r + 3, 7).setValue(getDateString(new Date()));

    //
    var siteDomain = configSheet.getRange("B1").getValue();
    //開始時刻（startTime）と現時点の処理時点の時間を比較する
    var diff = parseInt((new Date() - startTime) / (1000 * 60));

    // 経過時間の取得
    const elaspedTime = time.getElapsedTime();
    console.log("elaspedTime" + elaspedTime);

    //    if(diff >= 4){
    if (elaspedTime > 240) {
      Logger.log("処理が一時停止しました。");
      Logger.log("stop at:" + strWorkFileName + ":" + (r + 1));
      //処理ステータス更新
      siteWorkFileSheet.getRange(r + 3, 6).setValue("処理中断(数分後再開)");
      //何行まで処理したかなどを「スクリプトのプリロパティ」に保存する
      properties.setProperty("makeStockCheckList_stopAt_r", r + 1);
      //       //トリガー(1分後)を登録する
      //       setTrigger("makeStockCheckList", "makeStockCheckList");
      return;
    }

    //すべての監視対象ファイルから指定ドメインの商品URLを取得
    getAllTargetInfo(targetInfoList, siteDomain);

    if (targetInfoList.length > 0) {
      workSheet.getRange(4, 1, 4000, 7).clearContent();
      workSheet
        .getRange(4, 1, targetInfoList.length, 7)
        .setValues(targetInfoList);
    }
    siteWorkFileSheet.getRange(r + 3, 5).setValue(targetInfoList.length);

    //処理ステータス更新
    siteWorkFileSheet.getRange(r + 3, 6).setValue("処理完了");
    siteWorkFileSheet.getRange(r + 3, 8).setValue(getDateString(new Date()));
  }
  //全て実行終えたらトリガーや何行目まで実行したかなどのデータは
  //不要なためを削除する
  deleteTriggerEvery6m(triggerFuntionName);
  var properties = PropertiesService.getScriptProperties();
  var triggerSetFlg = arguments.callee.name + "_setTriggerFlg";
  properties.deleteProperty(triggerSetFlg);
  properties.deleteProperty("makeStockCheckList_stopAt_r");
  Logger.log("監視対象収集処理が終了しました。");
  return;
}

function getAllTargetInfo(targetInfoList, siteDomain) {
  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var targetFileSheet = ss_stockManageFile.getSheetByName(targetFileSheetName);

  var lastrow = targetFileSheet.getLastRow();
  var targetFileUrlList = targetFileSheet
    .getRange(3, 3, lastrow - 2, 1)
    .getValues();
  //Logger.log("targetFileUrlList.length"+targetFileUrlList.length);
  //Logger.log(targetFileUrlList);
  //対象ファイルごとのループ処理
  for (index = 0; index < targetFileUrlList.length; index++) {
    //Logger.log("監視対象ファイル処理："+(index+1));
    if (!targetFileUrlList[index][0]) {
      break;
    }
    var ss_targetFile = getSpreadSheetByUrl(targetFileUrlList[index][0]);
    var targetSheets = ss_targetFile.getSheets();
    for (j = 0; j < targetSheets.length; j++) {
      //対象シートから在庫サイトの列を探し、該当するドメインのURLの場合、そのURLと関連情報を取得
      getTargetInfoFromSheet(targetInfoList, targetSheets[j], siteDomain);
    }
    //Logger.log("監視対象ファイル処理ｓｓｓｓｓ："+(index+1));
    //Logger.log("targetFileUrlList.length="+targetFileUrlList.length);
  }
  //return targetInfoList;
}

function getTargetInfoFromSheet(targetInfoList, sheet, siteDomain) {
  //Logger.log(sheet.getParent().getName());
  //Logger.log(sheet.getName());
  var textFinder = sheet.createTextFinder(targetKeyword);
  var targetKeywordCell = textFinder.findNext();
  var targetKeywordColumn = 0;
  var targetKeywordRow = 0;
  if (targetKeywordCell) {
    targetKeywordColumn = targetKeywordCell.getColumn();
    targetKeywordRow = targetKeywordCell.getRow();
  } else {
    return;
  }

  //Logger.log("targetKeywordColumn="+targetKeywordColumn);
  //Logger.log("targetKeywordRow="+targetKeywordRow);
  //Logger.log("＃＃＃＃＃＃＃＃＃siteDomain="+siteDomain);

  var targetUrlList = sheet
    .getRange(
      targetKeywordRow + 1,
      targetKeywordColumn,
      sheet.getLastRow() - targetKeywordRow,
      1
    )
    .getDisplayValues();
  //Logger.log("＃＃＃＃＃＃＃targetUrlList＃＃siteDomain=");
  //Logger.log(targetUrlList);
  for (i = 0; i < targetUrlList.length; i++) {
    var targetInfoSubList = [];
    if (targetUrlList[i][0].indexOf(siteDomain) != -1) {
      var fileName = sheet.getParent().getName();
      var fileUrl = sheet.getParent().getUrl();
      var sheetName = sheet.getName();
      var targetUrlRow = targetKeywordRow + i + 1;
      var targetUrlColumn = targetKeywordColumn;
      var targetUrl = targetUrlList[i][0];
      targetInfoSubList.push(targetInfoList.length + 1);
      targetInfoSubList.push(fileName);
      targetInfoSubList.push(fileUrl);
      targetInfoSubList.push(sheetName);
      targetInfoSubList.push(targetUrlRow);
      targetInfoSubList.push(targetUrlColumn);
      targetInfoSubList.push(targetUrl);
      targetInfoList.push(targetInfoSubList);
      //sheet.getRange(targetUrlRow,targetUrlColumn).setBackground(statusColor_wait);
    }
  }
  //Logger.log(targetInfoList);
  //return targetInfoList;
}
