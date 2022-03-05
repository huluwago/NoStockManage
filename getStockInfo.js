function getStockStatus(targetUrl,sitekbn,parsePattern,stockCheckWord,parseHtmlFrom,parseHtmlTo) {
  var stockStatus = ""; 
//  Logger.log("sitekbn:" + sitekbn);
//  Logger.log("parsePattern:" + parsePattern);
//  Logger.log("stockCheckWord:" + stockCheckWord);
//  Logger.log("parseHtmlFrom:" + parseHtmlFrom);
//  Logger.log("parseHtmlTo:" + parseHtmlTo);

  var targetHtml;
  //パターンにょって、それぞれの方法でURLからＨTMLを取得してスクレイピングする
  //1:静的なサイト//2:動的なサイト
  //1:ワード含む判断 //2:情報取得して判断
    switch (true) {
      //1:静的なサイト
      case sitekbn == "1":
        targetHtml = static_web_site(targetUrl);
        if(parsePattern == 1){
          stockStatus = checkStsByWord(targetHtml,stockCheckWord);
        } else {
          stockStatus = checkStsByContent(targetHtml,stockCheckWord,parseHtmlFrom,parseHtmlTo);
        }
        break
      //2:動的なサイト
      case sitekbn == "2":
        targetHtml = dynamic_web_site(targetUrl);
        if(parsePattern == 1){
          stockStatus = checkStsByWord(targetHtml,stockCheckWord);
        } else {
          stockStatus = checkStsByContent(targetHtml,stockCheckWord,parseHtmlFrom,parseHtmlTo);
        }
        break
      //3:楽天
      case sitekbn == "3":
        targetHtml = dynamic_web_site(targetUrl);
        stockStatus = checkStsByWordForRakuten(targetHtml,stockCheckWord);
//        var retryNum = 0;
//        var waitTime = 0.5;
//        while (stockStatus==3 || retryNum>2) {
//          retryNum = retryNum +1

//          Logger.log("楽天の検索でエラーが発生したので、30秒後にリトライする");
//          Utilities.sleep(waitTime * 1000);
//          targetHtml = dynamic_web_site(targetUrl);
//          stockStatus = checkStsByWordForRakuten(targetHtml,stockCheckWord);
//        }
        break
       case sitekbn == "4":
         targetHtml = static_web_site(targetUrl);
         stockStatus = checkStsByContentForYahooAuc(targetHtml,stockCheckWord,parseHtmlFrom,parseHtmlTo);
        break
      default:
        break
    }
    return stockStatus;
  
}

/**
 * HTMLを解析し、指定Wordが存在するかをチェックして、ステータスを判定する。
 * IN：HTML、在庫ワード、HTML解析時のFROM、HTML解析時のTo
 * OUT：ステータス　（0：在庫なし、1：在庫あり）
 */
function checkStsByWord(html,word){
  Logger.log("checkStsByWord　が始まる");
  if (html.indexOf(word) != -1) {
   return 1;
  } else if(html.indexOf("itserror") != -1){
   return 3;    
  } else {
   return 2;
  }
}

/**
 * HTMLを解析し、指定Wordが存在するかをチェックして、ステータスを判定する。
 * IN：HTML、在庫ワード、HTML解析時のFROM、HTML解析時のTo
 * OUT：ステータス　（0：在庫なし、1：在庫あり）
 */
function checkStsByWordForRakuten(html,word){
  Logger.log("checkStsByWordForRakuten　が始まる");
  var errInfo = "アクセスが集中し、ページを閲覧しにくい状態になっております";
  if (html.indexOf(word) != -1) {
   return 1;
  } else if ((html.indexOf(errInfo) != -1)||((html.indexOf("itserror") != -1))){
    return 3;
  } else {
    return 2;
  }
}

/**
 * HTMLを解析し、指定Wordが存在するかをチェックして、ステータスを判定する。
 * IN：HTML、在庫ワード、HTML解析時のFROM、HTML解析時のTo
 * OUT：ステータス　（0：在庫なし、1：在庫あり）
 */
function checkStsByContent(html,stockCheckWord,fromText,toText){
  Logger.log("checkStsByContent　が始まる");
  if(html.indexOf("itserror") != -1){
    return 3;
  }
  var strKeyword = Parser.data(html)
   .from(fromText)
   .to(toText)
   .build();
//  Logger.log("stockCheckWord=" + stockCheckWord);
//  Logger.log("fromText=" + fromText);
//  Logger.log("toText=" + toText);
//  Logger.log("#################strKeyword");
//  Logger.log(strKeyword);
  if (stockCheckWord == strKeyword){
    return 1;
  } else {
    return 2;
  }
}

/**
 * HTMLを解析し、指定Wordが存在するかをチェックして、ステータスを判定する。
 * IN：HTML、在庫ワード、HTML解析時のFROM、HTML解析時のTo
 * OUT：ステータス　（2：在庫なし、1：在庫あり）
 */
function checkStsByContentForYahooAuc(html,stockCheckWord,fromText,toText){
  Logger.log("checkStsByContentForYahooAuc　が始まる");
  if(html.indexOf("itserror") != -1){
    return 3;
  }
  var strAuctionFinish = "このオークションは終了しています";
  if (html.indexOf(strAuctionFinish) != -1){
    return 2;
  }
  var strKeyword = Parser.data(html)
   .from(fromText)
   .to(toText)
   .build();
//  Logger.log("stockCheckWord=" + stockCheckWord);
//  Logger.log("fromText=" + fromText);
//  Logger.log("toText=" + toText);
//  Logger.log("#################strKeyword");
//  Logger.log(strKeyword);
  if (stockCheckWord == strKeyword){
    return 1;
  } else {
    return 2;
  }
}
