// =======================================
// YUR_ConditionalMessage
// =================================
// The MIT License (MIT)
// Copyright (c) 2020 your0501
// ====================================
// Free for commercial and non commercial use.
// ==========================================
/*:
 * @plugindesc 대사 창에 나오는 메시지에 조건을 붙입니다.
 ver 0.1
 * @author your0501
 *
 * @help 플러그인 커맨드는 없습니다.

 메시지 창에서,
 
 \스위치[스위치번호|메시지]
 (스위치번호) 번 스위치가 켜져 있을때 (메시지)로 바뀝니다.
 
 \스위치![스위치번호|메시지]
 (스위치번호) 번 스위치가 꺼져 있을때 (메시지)로 바뀝니다.
 
 \스위치?[스위치번호|메시지1|메시지2]
 (스위치번호) 번 스위치가 켜져 있으면 (메시지1),
 꺼져 있으면 (메시지2)로 바꿉니다.
 
 */
 
var Imported = Imported || {};
Imported.YUR_ConditionalMessage = true;
  
var Youri = Youri || {};
Youri.Param = Youri.Param || {};

Youri.Param.conditionMessage = {};
Youri.conditionMessage = {};



(function(){
var alias__Window_Base__convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = alias__Window_Base__convertEscapeCharacters.call(this, text)
    text = text.replace(/\x1b스위치\[(\d+)\|(.*)\]/gi, function() {
        return $gameSwitches.value(parseInt(arguments[1]))? arguments[2] : ""; 
    }.bind(this));
    text = text.replace(/\x1b!스위치\[(\d+)\|(.*)\]/gi, function() {
        return $gameSwitches.value(parseInt(arguments[1]))? "" : arguments[2]; 
    }.bind(this));
    text = text.replace(/\x1b스위치?\[(\d+)\|(.*)\|(.*)\]/gi, function() {
        return $gameSwitches.value(parseInt(arguments[1]))? arguments[2] : arguments[3]; 
    }.bind(this));
    return text;
};
})();