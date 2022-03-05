function act_monitor_group1() {
  var monitorSts = monitorByGroup(1, arguments.callee.name, 1);
  Logger.log(arguments.callee.name + "の監視処理結果＝" + monitorSts);
  if (monitorSts !== 2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name + "の監視処理完了");
}

function act_monitor_group2() {
  var monitorSts = monitorByGroup(2, arguments.callee.name, 1);
  Logger.log(arguments.callee.name + "の監視処理結果＝" + monitorSts);
  if (monitorSts !== 2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name + "の監視処理完了");
}

function act_monitor_group3() {
  var monitorSts = monitorByGroup(3, arguments.callee.name, 1);
  Logger.log(arguments.callee.name + "の監視処理結果＝" + monitorSts);
  if (monitorSts !== 2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name + "の監視処理完了");
}

/**
 *
 */
function act_monitor_group4() {
  var monitorSts = monitorByGroup(4, arguments.callee.name, 1);
  Logger.log(arguments.callee.name + "の監視処理結果＝" + monitorSts);
  if (monitorSts !== 2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name + "の監視処理完了");
}

function act_monitor_group5() {
  var monitorSts = monitorByGroup(5, arguments.callee.name, 1);
  Logger.log(arguments.callee.name + "の監視処理結果＝" + monitorSts);
  if (monitorSts !== 2) {
    deleteTriggerEvery6m(arguments.callee.name);
    var properties = PropertiesService.getScriptProperties();
    var triggerFuntionName = arguments.callee.name + "_setTriggerFlg";
    properties.deleteProperty(triggerFuntionName);
  }
  Logger.log(arguments.callee.name + "の監視処理完了");
}

/**
 * 在庫監視WORKファイル一覧もとに、指定グループ番号に該当するWORKファイルから
 * 該当する在庫状況を取得する所定
 */
function monitorByGroup(groupNo, triggerFuntionName, targetSts) {
  initConstFromProp();
  showTriggers();
  //在庫監視WORKファイル一覧のシート
  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var siteWorkFileSheet = ss_stockManageFile.getSheetByName(
    siteWorkFlieSheetName
  );
  //在庫監視WORKファイル一覧を取得
  var lastRow = siteWorkFileSheet.getLastRow();
  var siteWorkFileList = siteWorkFileSheet
    .getRange(3, 1, lastRow - 2, 24)
    .getValues();
  Logger.log(siteWorkFileList);

  //処理対象のWORKファイル
  var targetSiteWorkFileSheetList = [];

  //在庫監視WORKファイル一覧から、指定グループのWORKファイル一覧を取得
  for (i = 0; i < siteWorkFileList.length; i++) {
    var siteWorkFileName = siteWorkFileList[i][1];
    var siteWorkFileID = siteWorkFileList[i][3];
    var monitorGroup = siteWorkFileList[i][8];

    var subList = [];
    subList[0] = i + 3;
    subList[1] = siteWorkFileID;
    subList[2] = siteWorkFileName;
    if (monitorGroup == groupNo) {
      targetSiteWorkFileSheetList.push(subList);
    }
  }
  //Logger.log(targetSiteWorkFileSheetList);

  //処理対象のWORKファイルリストの監視処理を実行
  var monitorSts = "";
  if (targetSiteWorkFileSheetList.length > 0) {
    monitorSts = monitoring(
      targetSiteWorkFileSheetList,
      triggerFuntionName,
      targetSts
    );
  }
  //deleteTrigger(triggerFuntionName);
  //deleteTriggerEvery6m(triggerFuntionName);

  return monitorSts;
}

/**
 * 在庫監視Workファイル（複数）に対して、順次に在庫情報を取得する。
 * 5分超過する場合、処理中断して一分待ってから処理を継続すうｒ。
 */
function monitoring(
  targetSiteWorkFileSheetList,
  triggerFuntionName,
  targetSts
) {
  //処理開始時間
  var groupStartTime = new Date();

  // Timeクラスをインスタンス化して処理の開始時間を取得
  const time = new Time();

  //在庫監視WORKファイル一覧のシート (ステータス、時刻を出力するため)
  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var siteWorkFileSheet = ss_stockManageFile.getSheetByName(
    siteWorkFlieSheetName
  );

  //処理中断情報を取得
  var properties = PropertiesService.getScriptProperties();
  var nowRow_Level1_m = properties.getProperty(
    triggerFuntionName + "_stopAt_Level1_m"
  );
  var nowRow_Level2_n = properties.getProperty(
    triggerFuntionName + "_stopAt_Level2_n"
  );
  Logger.log("nowRow_Level1_m=" + nowRow_Level1_m);
  Logger.log("monitoring処理開始");
  Logger.log("triggerFuntionName" + triggerFuntionName);
  Logger.log("targetSts" + targetSts);

  //処理開始位置の初期化
  var strWorkFileName = "";

  if (!nowRow_Level1_m) {
    //中断再開ではなく、処理が始まったところの場合
    nowRow_Level1_m = 1;
    nowRow_Level2_n = 1;
    strWorkFileName = targetSiteWorkFileSheetList[0][2];

    Logger.log(strWorkFileName + "の在庫情報取得処理が始めました。");
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
  } else {
    strWorkFileName = targetSiteWorkFileSheetList[nowRow_Level1_m - 1][2];
    Logger.log(
      strWorkFileName +
        "の" +
        nowRow_Level2_n +
        "番目商品の在庫情報取得処理が再開しました。"
    );
  }

  //同Group内のWORKファイルを順次に実施
  for (m = nowRow_Level1_m - 1; m < targetSiteWorkFileSheetList.length; m++) {
    //在庫監視WORKファイル一覧のシートの何番目にいるか
    var rowInsiteWorkFile = targetSiteWorkFileSheetList[m][0];
    var errCount;

    //在庫監視WORKファイル
    var siteWorkFileID = targetSiteWorkFileSheetList[m][1];
    var ss_WorkFile = SpreadsheetApp.openById(siteWorkFileID);
    var workSheet = ss_WorkFile.getSheetByName("work");
    var configSheet = ss_WorkFile.getSheetByName("設定");

    //在庫情報取得用のオプション設定を取得
    var sitekbn = configSheet.getRange("B2").getValue();
    var waitTime = configSheet.getRange("B3").getValue();
    var parsePattern = configSheet.getRange("B4").getValue();
    var stockCheckWord = configSheet.getRange("B5").getValue();
    var parseHtmlFrom = configSheet.getRange("B6").getValue();
    var parseHtmlTo = configSheet.getRange("B7").getValue();

    //Workファイルから商品URLのリストを取得
    var itemUrlList = [];
    var lastRow = workSheet.getLastRow();
    Logger.log("lastRow=" + lastRow);
    if (lastRow > 3) {
      itemUrlList = workSheet.getRange(4, 1, lastRow - 3, 9).getValues();
    } else {
      continue;
    }
    //エラー巡回監視時に、エラー明細のみフィルタする
    if (targetSts == 3) {
      itemUrlList = itemUrlList.filter(function (value) {
        return value[7] == "3";
      });
    }

    //  Logger.log("在庫サイトURL：");
    Logger.log("####################################################");
    Logger.log(itemUrlList);

    //ステータス関連情報設定
    var strStatus;
    if (itemUrlList.length < 1) {
      strStatus = "処理対象なし";
    } else {
      strStatus = "処理中";
    }

    //巡回回数取得
    var errLoopCheckNum = siteWorkFileSheet
      .getRange(rowInsiteWorkFile, 18)
      .getValue();
    Logger.log("#######errLoopCheckNum=");
    Logger.log(errLoopCheckNum);
    if (errLoopCheckNum == "") {
      errLoopCheckNum = 0;
    }

    //処理ステータス更新
    if (targetSts == 3) {
      siteWorkFileSheet.getRange(rowInsiteWorkFile, 19).setValue(strStatus);
    } else {
      siteWorkFileSheet.getRange(rowInsiteWorkFile, 10).setValue(strStatus);
      workSheet.getRange("B2").setValue(strStatus);
    }

    //処理開始時の日時は通常初回の場合のみ設定する。エラー巡回の場合、直近を出力
    if (nowRow_Level2_n == 1) {
      var workFileStartTime = getDateString(new Date());
      if (targetSts == 3) {
        //エラー巡回監視
        Logger.log("エラー巡回監視が始まりました。");
        workSheet.getRange("E2").setValue(workFileStartTime);
        //siteWorkFileSheet.getRange(rowInsiteWorkFile,16).setValue(itemUrlList.length);
        siteWorkFileSheet
          .getRange(rowInsiteWorkFile, 18)
          .setValue(errLoopCheckNum + 1);
        siteWorkFileSheet
          .getRange(rowInsiteWorkFile, 20)
          .setValue(workFileStartTime);
        siteWorkFileSheet.getRange(rowInsiteWorkFile, 21, 1, 5).clearContent();
        siteWorkFileSheet.getRange(rowInsiteWorkFile, 17).setValue("0");
      } else {
        //通常監視
        Logger.log("監視処理が始まりました。");
        workSheet.getRange("C2").setValue(workFileStartTime);
        siteWorkFileSheet
          .getRange(rowInsiteWorkFile, 11)
          .setValue(workFileStartTime);
        //初期化
        workSheet.getRange("D2").setValue("");
        workSheet.getRange(4, 8, lastRow - 3, 2).clear();
        siteWorkFileSheet.getRange(rowInsiteWorkFile, 16).setValue("0");
        siteWorkFileSheet.getRange(rowInsiteWorkFile, 12, 1, 12).clearContent();
      }
    } else {
      //エラー件数を継続で加算するため、スプレッドシートから取得
      if (targetSts == 3) {
        errCount = siteWorkFileSheet.getRange(rowInsiteWorkFile, 17).getValue();
      } else {
        errCount = siteWorkFileSheet.getRange(rowInsiteWorkFile, 16).getValue();
      }
      if (!errCount) {
        errCount = 0;
      }
    }
    Logger.log("itemUrlList.length" + itemUrlList.length);
    //処理対象なしの場合、リターン
    if (itemUrlList.length < 1) {
      properties.deleteProperty(triggerFuntionName + "_stopAt_Level1_m");
      properties.deleteProperty(triggerFuntionName + "_stopAt_Level2_n");
      Logger.log("監視対象がありません。");
      return 3;
    }

    //****************************************************************** */

    //workファイルから取得した商品URLリストを繰り返して在庫確認を行う

    for (n = nowRow_Level2_n - 1; n < itemUrlList.length; n++) {
      var itemUrl = itemUrlList[n][6];
      Logger.log(n + 1 + "番目キーワドの処理が開始しました。");
      Logger.log("商品URL：" + itemUrl);
      //開始時刻（startTime）と現時点の処理時点の時間を比較する
      var diff = parseInt((new Date() - groupStartTime) / (1000 * 60));
      Logger.log("diff:" + diff);

      // 経過時間の取得
      const elaspedTime = time.getElapsedTime();
      console.log("elaspedTime" + elaspedTime);

      //Ｇroup事の在庫情報取得処理が5分経過した時点、処理一時停止
      var maxTime = 240;
      //楽天の場合最大時間をリセットする
      if (waitTime > 29) {
        maxTime = 210;
      }
      Logger.log("maxTime=" + maxTime);
      //      if(diff >= 4){
      if (elaspedTime > maxTime) {
        Logger.log("処理が一時停止しました。");
        Logger.log(
          "stop at:" + targetSiteWorkFileSheetList[m][0] + ":" + (n + 1)
        );
        workSheet.getRange("B2").setValue("処理中断(数分後再開)");
        if (targetSts == 3) {
          siteWorkFileSheet
            .getRange(rowInsiteWorkFile, 19)
            .setValue("処理中断(数分後再開)");
        } else {
          siteWorkFileSheet
            .getRange(rowInsiteWorkFile, 10)
            .setValue("処理中断(数分後再開)");
        }

        //何行まで処理したかなどを「スクリプトのプリロパティ」に保存する
        properties.setProperty(triggerFuntionName + "_stopAt_Level1_m", m + 1);
        properties.setProperty(triggerFuntionName + "_stopAt_Level2_n", n + 1);
        //トリガー(1分後)を登録する
        //setTrigger(triggerFuntionName, triggerFuntionName);
        return 2; //中断
      }

      //2件目以降は指定待ち時間を待ってから実行する
      if (n > 0) {
        Logger.log("Waiting：" + waitTime + "秒");
        Utilities.sleep(waitTime * 1000);
      }

      //getStockStatusで在庫情報を取得。
      var stockStatus = getStockStatus(
        itemUrl,
        sitekbn,
        parsePattern,
        stockCheckWord,
        parseHtmlFrom,
        parseHtmlTo
      );
      Logger.log("在庫状況：");
      Logger.log(stockStatus);
      if (stockStatus == 3) {
        errCount = errCount + 1;
      }

      //

      //在庫監視Workファイルに出力する
      workSheet.getRange(itemUrlList[n][0] + 3, 8).setValue(stockStatus);
      if (targetSts == 3) {
        workSheet.getRange(itemUrlList[n][0] + 3, 8).setFontColor("blue");
        siteWorkFileSheet.getRange(rowInsiteWorkFile, 17).setValue(errCount);

        //エラー巡回監視の場合、1回巡回が完了した時点で、エラーが残っているかをチェック
        //エラーが残っている場合、該当ファイルの巡回は最初から再実行する。
        if (
          n == itemUrlList.length - 1 &&
          errCount > 0 &&
          errLoopCheckNum < 3
        ) {
          Logger.log("ループ再実行" + errLoopCheckNum + "回目");
          errLoopCheckNum = errLoopCheckNum + 1;
          siteWorkFileSheet
            .getRange(rowInsiteWorkFile, 18)
            .setValue(errLoopCheckNum);
          errCount = 0;
          n = -1;
        }
      } else {
        siteWorkFileSheet.getRange(rowInsiteWorkFile, 16).setValue(errCount);
      }
    } //一つのＷorkファイルの複数商品を処理するループの完了
    //************************************************************************************************* */
    //処理位置情報の初期化
    nowRow_Level2_n = 1;
    //在庫監視Workファイルの処理完了時の情報設定
    strStatus = "処理完了";
    strTime = getDateString(new Date());

    //Ｗorkファイルごとに処理完了時にステータス情報を更新する。
    if (targetSts == 3) {
      siteWorkFileSheet.getRange(rowInsiteWorkFile, 19).setValue(strStatus);
      siteWorkFileSheet.getRange(rowInsiteWorkFile, 21).setValue(strTime);
    } else {
      workSheet.getRange("B2").setValue(strStatus);
      siteWorkFileSheet.getRange(rowInsiteWorkFile, 10).setValue(strStatus);
      workSheet.getRange("D2").setValue(strTime);
      siteWorkFileSheet.getRange(rowInsiteWorkFile, 12).setValue(strTime);
    }
  } //同じグループ複数ファイルのループ完了
  //全て実行終えたらトリガーや何行目まで実行したかなどのデータは
  //不要なためを削除する
  //deleteTrigger(triggerFuntionName);
  properties.deleteProperty(triggerFuntionName + "_stopAt_Level1_m");
  properties.deleteProperty(triggerFuntionName + "_stopAt_Level2_n");
  return 1; //正常終了
}
