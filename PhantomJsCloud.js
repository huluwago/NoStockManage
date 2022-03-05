/**Phantom APIリクエスト関数
 * 引数で渡されたURLを用いてPhantom APIリクエストを実施し、HTMLデータを返す。
 * @param str target_url (required) スクレイピング対象のURL
 * @return str
 */
function request_phantom_api(target_url) {
  // optionsを設定
  var options = {
    url: target_url,
    renderType: "HTML",
    outputAsJson: true,
    waitInterval : 0
  };
  var pay_load = encodeURIComponent(JSON.stringify(options));

  // API_KEYの呼び出し
  var API_KEY = PropertiesService.getScriptProperties().getProperty("PHANTOM_API_KEY");

  // リクエストを行うURLを設定
  var api_url = "https://phantomjscloud.com/api/browser/v2/"+ API_KEY +"/?request=" + pay_load;
   Logger.log(api_url)

  try{
  // 結果を取得
    var response = UrlFetchApp.fetch(api_url).getContentText();
    Logger.log("フェッチ完了")

      // JSONデータをパースして、欲しいデータを取得

    var data = JSON.parse(response)["content"]["data"];

    return data;

  } catch(error) {
    //console.error(printError(error));
    if(error.message.match(/402/)){
      Logger.log("API_KEYを使い切ったので残数0にしました。¥n%s",API_KEY);
      return "itserror402";
    } else {
      return "itserror"
    }
  } finally {
    
  }
}

function printError(error) {
  return "[名前] " + error.name + "\n" +
    "[場所] " + error.fileName + "(" + error.lineNumber + "行目)\n" +
    "[メッセージ]" + error.message + "\n" +
    "[StackTrace]\n" + error.stack;
}
