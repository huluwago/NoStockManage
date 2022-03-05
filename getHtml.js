/**静的サイト用関数
 * @param str url (required) 実行するURL
 * @return str html 
 */
function static_web_site(url) {
  var options = {
    'method': 'get',
    //'headers': headers,
    "muteHttpExceptions" : true,
    "validateHttpsCertificates" : false,
    "followRedirects" : false
  }
  try{
    var html = UrlFetchApp.fetch(url,options).getContentText('UTF-8');
    return html
  } catch(e){
    // 例外エラー処理
    Logger.log('Error:')
    Logger.log(e)
    return "itserror";
  }

}

/**動的サイト用関数
 * @param str url (required) 実行するURL
 * @return str html 
 */
function dynamic_web_site(url) {
  //事前API設定
  //set_property()

  // 結果を取得し、確認してみる
  var html = request_phantom_api(url);
  //
  return html
}
