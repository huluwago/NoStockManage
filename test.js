/**
 * HTMLを解析し、指定Wordが存在するかをチェックして、ステータスを判定する。
 * IN：HTML、在庫ワード、HTML解析時のFROM、HTML解析時のTo
 * OUT：ステータス　（0：在庫なし、1：在庫あり）
 */
function test_checkStsByWordForRakuten(){
  //var targetUrl = "https://item.rakuten.co.jp/jism/4549576178806-41-53498-n/";
  //var targetUrl = "https://item.rakuten.co.jp/tabletpckoubou/at61468/";
  var targetUrl = "https://item.rakuten.co.jp/jism/4549576178806-41-53498-n/";
  //var targetUrl = "https://item.rakuten.co.jp/gadgetmart/0840104267103/";
  var html = dynamic_web_site(targetUrl);
  createFile("temp",html);
  var word = "new-cart-button"
  Logger.log("checkStsByWordForRakuten　が始まる");
  var errInfo = "アクセスが集中し、ページを閲覧しにくい状態になっております";
  if (html.indexOf(word) != -1) {
    Logger.log("return 1");
   return 1;
  } else if ((html.indexOf(errInfo) != -1)||((html.indexOf("itserror") != -1))){
     Logger.log("return 3");
    return 3;
  } else {
    Logger.log("return 2");    
    return 2;
  }
}



function myFunction() {
  var ss_stockManageFile = SpreadsheetApp.openById(stockManageFileId);
  var wordManageSheet = ss_stockManageFile.getSheetByName(wordManageSheetName);

  var fileName = wordManageSheet.getParent().getName();
  Logger.log(fileName);
}


/**在庫状況を取得する
 * 情報取得パターンによりそれぞれの方法で情報を取得する。
 */

//1:静的なサイト
//2:動的なサイト

//1:ワード含む判断
//2:情報取得して判断

//テストデータ　サイト情報
//var targetUrl = "https://item.rakuten.co.jp/jism/4549576178806-41-53498-n/";
//var sitekbn = "3";
//var parsePattern = "1";
//var stockCheckWord = "new-cart-button";
//var getHtmlFrom = "a";
//var getHtmlTo = "b"

//var targetUrl = "https://jp.mercari.com/search?keyword=&status=on_sale&page=1";
//var sitekbn = "2";
//var parsePattern = "2";
//var stockCheckWord = "this";
//var getHtmlFrom = "https://static.mercdn.net/c!/w=240/thumb/photos/";
//var getHtmlTo = "_1.jpg?"


function test3(){
  var stockStatus = getStockStatus(targetUrl);
  Logger.log("stockStatus="+stockStatus);
}