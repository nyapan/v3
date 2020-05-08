
/**
 * V3Property
 */
export class V3Property {

  
  constructor() {
    this.tag_div = "div";
    this._js_list = [];
    this._page = {
      "default_text_on": null,
      "frame": null,
      "gadjet": null,
      "gadjet_template": null,
      "part": null,
    }
    
    this._v3_definition = {
      "page": this._page,
      "transition": "transition_001",
      "v3_model": null
    }
  }

  set body(body_value){
    this._body = body_value;
  }

  set head(head_value){
    this._head = head_value;
  }

  get body(){
    return this._body;
  }

  get head(){
    return this._head;
  }

  get default_tag(){
    return this._default_tag;
  }

  set add_js_list(js_file_psth){
    this._js_list += js_file_psth;
  }

  get js_list(){
    return this._js_list;
  }

  set definition_list(json_list){
    this._definition_list = json_list;
  }

  get definition_list(){
    return this._definition_list;
  }

  get v3_definition(){
    return this._v3_definition;
  }

  set v3_definition(json){
    this._page.default_text_on = json.default_text_on;
    this._page.frame = json.frame_list;
    this._page.gadjet = json.gadjet_definition_list;
    this._page.gadjet_template = json.gadjet_template_list;
    this._page.part = json.part_list;
  }
}