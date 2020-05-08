/**
 * KMR
 * v3 階層構造　　　　　　  定義　　　　　　　　position   　　     用途　  　　　　　　　　DOM生成タイミング
 * v3_definition      　　　                   v3共通定義　　　　　　　初回読み込み時
 *    frame　　　　　　　　 container-fluid    　表示区画枠を定義　　　　初回読み込み時
 *      gadjet　　　　　　　      ガジェット　　　　　　　　初回読み込み時
 *        gadjet_template　ガジェットテンプレート　　初回読み込み時_テンプレとして値が空のDOM生成し、非表示で保持_データバインドにてコピーして使用する
 *          parts　　　　　　ガジェット構成パーツ
 *   　connection　　　　　　通信定義（ガジェットが読み込まれた時点でガジェット単位にインスタンスを生成する）
 * 　　transition　　　　　　画面遷移定義（パーツに紐づく遷移先を設定＝frameになるかな？）
 * 
 */


