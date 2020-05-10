import { V3Property } from './v3_property.js';

/**
 * v3.js core class
 */

export class V3Core extends V3Property {

  constructor()
  {
    super();
    // 定義リストを取得
    this.get_definition("../../data/definitionList.json", 1);

    this.body = d3.select("body").selectAll(this.tag_div).remove();
    this.head = d3.select("head");
    this.data = null;
    this.definition = null;
    this.drag_target = null;
    this.dragover_event = null;
    this.dragover_target_list = null;
    this.dragover_count = {};
    this.dragover_target_area = null;
    

    // d3でのドラッグイベントは以下を使用する
    this.drag = d3.drag().on("start", this.dragstarted).on("drag", this.dragged);
  }
  
/**
 * jsライブラリ読み込み
 */
  get_js(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.send("");
    eval(req.responseText);
  }
  
  /**
   * v3定義のjson配列からD3.jsでDOMを生成する
   * @param {*} definition_list 
   */
  make_dom(definition_list){
    var instance = this;
    var default_text_on = this.definition.default_text_on;
    var tag_div = this.tag_div;
    var tmp_dragover_target = [];
    definition_list.forEach(function(definition){
      // d3イベント処理判定用
      var call_drag = (typeof definition.event == "undefined" ? "" : instance.switch_call_event(definition.event));
      var attr_drag_option = (typeof definition.event == "undefined" ? "" : instance.switch_event_option(definition.event));

      // ドラッグオーバーターゲット指定保持
      if(typeof definition.ondragover != "undefined" ){
        tmp_dragover_target.push(definition.id);
      }

      var d3_script =
        "d3.select(definition.parent)" + 
        (typeof definition.tag == "undefined" ? ".append(tag_div)" : ".append(definition.tag)") + 
        (typeof definition.type == "undefined" ? "" : ".attr(\"type\", definition.type)") + 
        (typeof definition.src == "undefined" ? "" : ".attr(\"src\", definition.src)") + 
        (typeof definition.id == "undefined" ? "" : ".attr(\"id\", definition.id)") + 
        (typeof definition.name == "undefined" ? "" : ".attr(\"name\", definition.name)") + 
        (typeof definition.class == "undefined" ? "" : ".attr(\"class\", definition.class)") +
        (typeof definition.style == "undefined" ? "" : ".attr(\"style\", definition.style)") +
        (typeof definition.note == "undefined" ? "" : ".attr(\"title\", definition.note)") + 
        (typeof definition.onclick == "undefined" ? "" : ".attr(\"onclick\", definition.onclick)") +
        (typeof definition.onchange == "undefined" ? "" : ".attr(\"onchange\", definition.onchange)") +
        (typeof definition.draggable == "undefined" ? "" : ".attr(\"draggable\", definition.draggable)") +
        (typeof definition.ondrag == "undefined" ? "" : ".attr(\"ondrag\", definition.ondrag)") +
        (typeof definition.ondragstart == "undefined" ? "" : ".attr(\"ondragstart\", definition.ondragstart)") +
        (typeof definition.ondragend == "undefined" ? "" : ".attr(\"ondragend\", definition.ondragend)") +
        (typeof definition.onmousedown == "undefined" ? "" : ".attr(\"onmousedown\", definition.onmousedown)") +
        (typeof definition.ondragover == "undefined" ? "" : ".attr(\"ondragover\", definition.ondragover)") +
        (typeof definition.ondragleave == "undefined" ? "" : ".attr(\"ondragleave\", definition.ondragleave)") +
        (typeof definition.onmouseup == "undefined" ? "" : ".attr(\"onmouseup\", definition.onmouseup)") +
        (typeof definition.onmouseover == "undefined" ? "" : ".attr(\"onmouseover\", definition.onmouseover)") +
        (typeof definition.onmouseout == "undefined" ? "" : ".attr(\"onmouseout\", definition.onmouseout)") +
        (typeof definition.onmouseup == "undefined" ? "" : ".attr(\"onmouseup\", definition.onmouseup)") +
        (typeof definition.accept == "undefined" ? "" : ".attr(\"accept\", definition.accept)") +
        attr_drag_option + 
        (default_text_on == true ?  (typeof definition.text == "undefined" ? "" : ".text(definition.text)") : 
          (typeof definition.text_on != "undefined" && definition.text_on == true ? ".text(definition.text)" : "")) +
          call_drag
          ;
        eval(d3_script);
    });
    this.dragover_target_list = tmp_dragover_target;
  }

  /**
   * scriptタグを生成する
   */
  make_dom_script(script_list){
    let head = this._head
    script_list.foreach(function(script){
      d3.select(head)
        .append("script")
        .attr("src", script.src)
        .attr("type", script.type)
    });
  }

  switch_function(json, function_num){
    switch(function_num){
      case 1:
        // json is definitionList.json
        this.definition_list = json;
        this.get_definition(Object.values(json.definition_list[0])[0], 2);
          break;
      case 2:
        // json = 取得した定義JSON
        this.definition = json;
        json.data == "jsonfile" ? this.get_definition(json.data_path, 3) : this.load_definition(this.definition);
        break;
      case 3:
        // 
        this.data = json;
        // ページ定義ロード
        this.load_definition(this.definition);

        this.switch_function(json.definition_list, 4);

      case 4:
        // データ反映
        if(typeof this.definition.dom_copy_from_id != "undefined" && typeof this.definition.dom_copy_to_id != "undefined" &&
          this.definition.dom_copy_from_id != "" && this.definition.dom_copy_to_id != ""){
          this.reflection_page(json, this.definition.dom_copy_from_id, this.definition.dom_copy_to_id);
        }else{
          //　データ適用
          this.reflection_page(json, this.definition.gadjet_template[1].id, this.definition.gadjet[1].id);
        }
          break;
      default:
    }
  }

  /**
   * 定義JSONファイルを読み込む
   */
  get_definition(file_path, function_num){
    var instance = this;
    var req = new XMLHttpRequest();
    req.addEventListener("load", function(){instance.switch_function(JSON.parse(req.responseText), function_num)});
    req.open("GET", file_path);
    req.send("");
  }

  /**
   * v3定義読み込み
   */
  load_definition(json){

    // 定義JSONにjs指定がある場合読み込み

    // 定義JSONにcss指定がある場合読み込み
    if( typeof json.css_path != "undefined" && json.css_path != ""){
      d3.select("#v3_css").attr("href", json.css_path);
    }

    // フレームDOM作成 container-fluid
    this.make_dom(json.frame);
    // ガジェットDOM作成 container
    this.make_dom(json.gadjet);
    // ガジェットテンプレートDOM作成 row
    this.make_dom(json.gadjet_template);
    // パーツDOM作成 col
    this.make_dom(json.part);
  }

  copySelection( target, to, index ) {
    let node = target.node();
    let copy = to.append(node.nodeName);

    Object.keys(node.attributes).forEach(function(key) {
        copy.attr(node.attributes[key].name, node.attributes[key].value + (node.attributes[key].name == "id" ? "_" + index : ""));
    });
    copy.html(target.html());
    copy.style("visibility", "visible");

    // 子要素のIDに連番をつける
    let copy_node = copy.node();
    copy_node.childNodes.forEach(function(_child){
      _child.id = _child.id.replace("[idx]",index);
    });

    return copy;
  }

  /**
   * データを読み込みページを構成する
   */
  reflection_page(json, from_id, to_id){
    var instance = this;
    var gadjet_index = 0;
    var from = d3.select("#"+from_id);
    var to = d3.select("#"+to_id);
    json.forEach(function(_json){
      gadjet_index++;
      var copy_dom = instance.copySelection( from, to, gadjet_index);
      if(copy_dom.style("top").replace("px","") < 0 ){
        copy_dom.style("top", gadjet_index * copy_dom.style("height").replace("px", "") + 2);
      }
      Object.keys(_json).forEach(function(key){
        copy_dom.select("#"+key).text(_json[key]);
      })
    });
  }
  
  /**
   * onclickイベント等からの画面遷移
   * ・定義JSONを読み込みDOMを生成
   * @param {*} element 
   */
  link_page(element){
    // Bodyのリセット
    this.body = d3.selectAll("body").selectAll(this.tag_div).remove();
    // 定義読み込み
    this.get_definition(d3.select(element).text(), 2);
  }

  change_part_text(target_part, text){
    d3.select(target_part).text(text);
  }
  
  read_csv_file(file){
    var instance = this;
    let reader = new FileReader();
    reader.onload = function () {
      instance.switch_function(instance.csv2json(reader.result), 4);
    }
    reader.readAsText(file);
  }

  /**
   * imgファイル読み込み
   * @param {*} file 
   * @param {*} target 
   */
  read_img_file(file, target){
    let reader = new FileReader();
      let image = new Image();
      reader.onload = function () {
        d3.select(target).attr('src', reader.result);
        image.src = reader.result;
        image.onload = function(){
          d3.select(target + "_size").text("画像サイズ：横"+image.naturalWidth+"px-縦"+image.naturalHeight+"px");
        }
    }

    // 画像の読み込み
    reader.readAsDataURL(file);
  }

  /**
   * ドラッグイベント実行判定
   * @param {*} e 
   */
  isdrag(){
//    console.log("dragover_count:"+this.dragover_count);
    return (this.dragover_target_list == null ? true : 
              (this.dragover_event == null ? false : 
              (this.dragover_target_list.indexOf(this.dragover_event.target.id) >= 0 ? 
              ( Object.keys(this.dragover_count).length >= 1 ? true : false) :
                  false)));
  }

  //ドラッグスタート時に呼び出される関数
  dragstarted(d) {
      // イベントターゲットを保持
      this.drag_target = event.target;
      // elementの位置とイベント地点の差分を保持
      this.elementX = event.x - event.target.style.left.replace("px","");
      this.elementY = event.y - event.target.style.top.replace("px","");

    return false;
  }
 
  //ドラッグ中に呼び出される関数
  dragged(d) {
    if( this.isdrag() ){
      console.log("dragged:"+event.target.id);
      console.log("dragover_event.target.id:"+this.dragover_event.target.id);
      d3.select(d).style("visibility", "hidden");
      d3.select(d).style("left", (event.x - this.elementX)  +'px');
      d3.select(d).style("top", (event.y - this.elementY) +'px');
      //オプション実行
      if(typeof d.draggable != "undefine" && d.draggable == true){
        v3.recoding_coordinate(d);
      }  
    }
    // ドラッグ先から外に出た場合（座標がマイナスになったら）強制的に0にする
    if(d3.select(d.parentNode).select("#" + d.id + "_coordinate_x").text() < 0 ){
      d3.select(d).style("left", "0px");
      d3.select(d).style("visibility", "visible");
    }
    if(d3.select(d.parentNode).select("#" + d.id + "_coordinate_y").text() < 0 ){
      d3.select(d).style("top", "0px");
      d3.select(d).style("visibility", "visible");
    }
    
    return false;
  }
 
  //ドラッグ終了時に呼び出される関数
  dragended(d) {
    if( this.isdrag() ){
      console.log("dragended:"+event.target.id);
      // 処理を記載
      d3.select(d).style("left", (event.x - this.elementX) +'px');
      d3.select(d).style("top", (event.y - this.elementY) +'px');
      d3.select(d).style("visibility", "visible");
      //オプション実行
      if(typeof d.draggable != "undefine" && d.draggable == true){
        v3.recoding_coordinate(d);
      } 
    }
    this.dragover_event = null;
    delete this.dragover_count[event.target.id];
    return false;
  }
  
  /**
   * ドラッグ対象のドラッグ先での座標を表示
   * @param {*} element 
   */
  recoding_coordinate(element){
    
    // var dragover_target_x = parseInt(this.dragover_target_area.x);
    // var dragover_target_y = parseInt(this.dragover_target_area.y);
    console.log("left:"+event.target.getBoundingClientRect().x  + " top:"+event.target.getBoundingClientRect().y - this.dragover_target_area.y);
    // console.log("x:"+dragover_target_x+ " y:" + dragover_target_y);
    d3.select(element.parentNode).select("#" + element.id + "_coordinate_x").text(event.target.getBoundingClientRect().x - this.dragover_target_area.x + parseInt(event.target.style.width.replace("px","") / 2) );
    d3.select(element.parentNode).select("#" + element.id + "_coordinate_y").text(event.target.getBoundingClientRect().y - this.dragover_target_area.y + parseInt(event.target.style.height.replace("px","") / 2));
  }

  // ドラッグ先対象に乗った場合
  dragover(d){
    event.preventDefault();
    if(this.drag_target.id != event.target.id){
      this.dragover_event = event;
      this.dragover_count[this.dragover_event.target.id] = "1";

      // ドラッグ先の領域取得
      this.dragover_target_area = event.target.getBoundingClientRect();
    }else{
      if(Object.keys(this.dragover_count).length >= 1 ){
        d3.select(event.target).style("visibility", "hidden");
      }
    }
  }

  // ドラッグ先対象から離れた場合
  dragleave(d){
    event.preventDefault();
    delete this.dragover_count[event.target.id];
    d3.select(this.drag_target).style("visibility", "visible");
  }

  
  /**
   * 定義からイベント種類判定(D3イベント)
   * @param {*} json 
   */
  switch_call_event(json){
    var call_event = "";
    json.forEach(function(event){
      switch(event.on){
        case "drag":
          call_event = ".call(instance.drag)";
          break;
          default:
      }
    });
    return call_event;
  }

  // /**
  //  * 定義からイベント種類にてオプション判定（D3イベント）
  //  * @param {*} json 
  //  */
  switch_event_option(json){
    var event_option = "";
    json.forEach(function(e){
      switch(e.on){
        case "drag":
          event_option = ".attr(\"dragOption\",\"" + e.option + "\")";
          break;
          default:
      }
    });
    return event_option;
  }

  /**
   * csvからjson配列を生成
   * @param {*} csv_list 
   */
  csv2json(csv){
    var json_list = [];
    var csv_list = csv.split("\n"); 
    var items = csv_list[0].split(',');
   
    for (var i = 1; i < csv_list.length - 1; i++) {
      var json = new Object();
      var csv = csv_list[i].split(',');
      for (var j = 0; j < items.length; j++) {
        json[items[j].replace("[idx]",i)] = csv[j];
      }
      json_list.push(json);
    }
    
    // d3.csv("resource.csv", function(data,i) {
    //   return {
    //     name: i + "_" + data.name, // nameの前に「インデックス番号_」を追加
    //     sales: data.sales
    //   };
    // }).then(function(data) {
    //   console.log(data);
    //   // グラフを描画
    // });


    return json_list;
  }

  /**
   * clickイベントを発火
   * @param {*} target 
   */
  fire_click(target){

    document.getElementById(target).click();
  }

  change_style(target, style_key, style_value){
    d3.select(target).style(style_key, style_value);

  }

}