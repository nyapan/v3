//import { v3 } from "./class_v3.js";

/**
 * v3 adaptor
 */

  function set_v3_script(type, filepath){
    
    var script = document.createElement("script");
    // 要素ノードの属性値設定、HTML5はtypeプロパティは不要
    script.src = filepath;
    script.type = type;
    var head = document.getElementsByTagName("head");
    head[0].appendChild(script);
  }
  
  // function set_v3_json_js(){
  //   set_v3_script("text/javascript", "./v3_json.js");
  // }
  
  function get_js(file_path){
    var req = new XMLHttpRequest();
    req.addEventListener("load", function(){eval(req.responseText);});
    req.open("GET", file_path);
    req.send("");
  }

  