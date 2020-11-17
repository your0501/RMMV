/*:
 * @plugindesc 문자를 깨뜨립니다.
 ver 0.1
 * @author your0501
 *
 * @help 아마 연출용 플러그인입니다.
 
 주의: 일부 메시지 플러그인과 호환이 되지 않을 수도 있습니다.
 조건 스위치가 켜져 있을 때 한글을 어느정도 깨뜨립니다.
 대사창에서만 적용됩니다.
 예) 동해물과 백두산이 -> 동는　물과 백둟닽산이왓
 
 랜덤 한글 켤 시
 예) 동해물과 백두산이 -> 뛷봝옣펝 쎚쒗쿼껉
 *
 * @param switche
 * @text 조건 스위치
 * @desc 이게 켜져있으면 한글을 깨뜨립니다.
 * @type switch
 * @default 1
 *
 * @param random
 * @text 랜덤 한글 스위치
 * @desc 조건 스위치가 켜져있을 때, 이것도 켜져 있으면
 한글을 완전히 랜덤으로 출력합니다.
 * @type switch
 * @default 2
 */

var Imported = Imported || {};
Imported.YUR_BrokenHangul = true;
  
var Youri = Youri || {};
Youri.Param = Youri.Param || {};

Youri.Param.brokenHangul = {};
Youri.brokenHangul = {};

Youri.Param.brokenHangul = function Parse( object ) {try { object = JSON.parse( object );} catch (e) { object = object;} finally {if ( Array.isArray( object ) ) { var l = object.length; for ( var i = 0; i < l; i++ ) { object[i] = Parse( object[i] ); };} else if ( typeof object === 'object' ) { for ( var key in object ) { object[key] = Parse( object[key] ); }; }}return object;}(PluginManager.parameters('YUR_BrokenHangul'));

(function(___) {
    
var Window_BaseprototypeprocessNormalCharacter = Window_Base.prototype.processNormalCharacter 

Window_Base.prototype.processNormalCharacter = function(textState) {
    if (___.Param.brokenHangul.switche && $gameSwitches.value(___.Param.brokenHangul.switche)) {
        var c = textState.text[textState.index++];
        var w = this.textWidth(c);
        
        var type = Math.floor(Math.random() * 7);
        var code = c.charCodeAt(0); 
        
        if (0xAC00 <= code && code <= 0xD7A3) {
            
            switch(type) {
                case 0:
                    c += String.fromCharCode(code + Math.randomInt(200) - 400);
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    break;
                case 1:
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    c = String.fromCharCode(Math.randomInt(11171)+0xAC00);
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    break;
                case 2:
                    c += String.fromCharCode(code + Math.randomInt(300) - 600);
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    break;
                case 3:
                    c += String.fromCharCode(code + Math.randomInt(7) - 13);
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    break;
                case 4:
                    textState.x += w;
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    break;
                default:
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    break;
            }
            
            if (___.Param.brokenHangul.random && $gameSwitches.value(___.Param.brokenHangul.random)) {
                c = String.fromCharCode(Math.randomInt(11171)+0xAC00)
                this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
            }
        } else { 
            textState.index--
            Window_BaseprototypeprocessNormalCharacter.call(this, textState);
        }
        
        textState.x += w;
    } else {
        Window_BaseprototypeprocessNormalCharacter.call(this, textState);
    }
    
};

})(Youri);
