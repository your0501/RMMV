// =======================================
// YUR_EnemyHpWindow.js
// =================================
// The MIT License (MIT)
// Copyright (c) 2020 your0501
// ====================================
// Free for commercial and non commercial use.
// ==========================================
//v1.1
/*:
 * @plugindesc 전투에서 적에게 체력 창을 표시합니다.
 * @author your0501
 *
 * @help
 [적 노트태그]
 
 <BarOffsetX: 숫자>
 <BarOffsetY: 숫자>
 창 오프셋을 지정합니다.]
 
 <disableHp>
 HP창을 표시하지 않습니다.
 
 * @param hide_window
 * @text 창 투명 여부
 * @desc HP창의 테두리를 없애 
 게이지와 숫자만 나오게 합니다.
 * @type Boolean
 * @default false
*/
 
 var Imported = Imported || {};
Imported.YUR_EnemyHpWindow = true;
  
var Youri = Youri || {};
Youri.Param = Youri.Param || {};

Youri.Param.enemyHpWindow = {};
Youri.enemyHpWindow = {};

Youri.Param.enemyHpWindow = function Parse( object ) {try { object = JSON.parse( object );} catch (e) { object = object;} finally {if ( Array.isArray( object ) ) { var l = object.length; for ( var i = 0; i < l; i++ ) { object[i] = Parse( object[i] ); };} else if ( typeof object === 'object' ) { for ( var key in object ) { object[key] = Parse( object[key] ); }; }}return object;}(PluginManager.parameters('YUR_EnemyHpWindow'));


(function(){

function Enemy_Window() { 
    this.initialize.apply(this, arguments);
};
 
Enemy_Window.prototype = Object.create(Window_Base.prototype);
Enemy_Window.prototype.constructor = Enemy_Window;
 
Enemy_Window.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.deactivate();
    this.opacity = 0;
    this._infoWindows = {};
    this.create_infos();
};
 
Enemy_Window.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.contents.clear();
};

Enemy_Window.prototype.create_infos = function() {
    for(var i = 0; i < $gameTroop._enemies.length; i++){
        if (!$gameTroop._enemies[i]) continue;
        
        
        var x = $gameTroop._enemies[i]._screenX;
        var y = $gameTroop._enemies[i]._screenY;
        
        var id = $gameTroop._enemies[i].enemyId();
        
        if ($dataEnemies[id].meta.disableHp) continue;
        x += Number($dataEnemies[id].meta.BarOffsetX) || 0;
        y += Number($dataEnemies[id].meta.BarOffsetY) || 0;
        
        var info = new Window_Enemy_Info(x, y, $gameTroop._enemies[i])
        this._infoWindows[i] = info
        this.addChild(info)
    }
}

 
function Window_Enemy_Info() { 
    this.initialize.apply(this, arguments);
};
 
Window_Enemy_Info.prototype = Object.create(Window_Base.prototype);
Window_Enemy_Info.prototype.constructor = Window_Enemy_Info;
 
Window_Enemy_Info.prototype.initialize = function(x, y, enemy) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this.deactivate();
    
    this.width = this.windowWidth();
    this.height = this.windowHeight();

    this.x -= Math.floor(this.width / 2)
    this.y -= this.height
    
    var width = 256;
    var height = this.lineHeight() * 4
    
    if (Youri.Param.enemyHpWindow.hide_window) {
        this.opacity = 0;
    }
    this._hpData = 0;
    this._mpData = 0;
    this._enemy = enemy || null;
};
 
Window_Enemy_Info.prototype.windowWidth = function() {
    return 160
};

Window_Enemy_Info.prototype.windowHeight = function() {
    return this.fittingHeight(3)
};
 
 
Window_Enemy_Info.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.contents.clear();
    this.draw_infos();
};

Window_Enemy_Info.prototype.lineHeight = function() {
    return 24;
};


Window_Enemy_Info.prototype.standardFontSize = function() {
    return 18;
};

Window_Enemy_Info.prototype.drawGauge = function(x, y, width, height, rate, color1, color2, line_thickness) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y;
    var l = line_thickness || 1;
    this.contents.fillRect(x, gaugeY, width, height, this.background_color());
    this.contents.gradientFillRect(x, gaugeY, fillW, height, color1, color2);
};

Window_Enemy_Info.prototype.hp_guage_color = function(rate) {
    switch (Math.ceil(rate * 4)) {
        case 4:
            return '#ff6666';
        case 3:
            return '#ff7c4c';
        case 2:
            return '#ff8800';
        default :
            return '#ffcc00';
            
    }
};

Window_Enemy_Info.prototype.mp_guage_color = function(rate) {
    switch (Math.ceil(rate * 4)) {
        case 4:
            return '#6666ff';
        case 3:
            return '#ff00ff';
        case 2:
            return '#8f66ff';
        default :
            return '#e066ff';
            
    }
};

Window_Enemy_Info.prototype.background_border_color = function() {
    return '#000000';
};

Window_Enemy_Info.prototype.background_color = function() {
    return '#202020';
};


Window_Enemy_Info.prototype.draw_infos = function() {

    if (!this._enemy) return;
    
    var current_hp = this._enemy.hp;
    var current_mp = this._enemy.mp;

    if (this._enemy._hidden || current_hp <= 0) {
        this.opacity = 0;
        return;
    } else if (Youri.Param.enemyHpWindow.hide_window) {
        this.opacity = 0;
    } else {
        this.opacity = 200;
    };
    
    var enemyId = this._enemy._enemyId;
    

    this._hpData = this._hpData || 0;
    this._mpData = this._mpData || 0;
    
    var max_hp = this._enemy.mhp;
    var max_mp = this._enemy.mmp;
    var name = this._enemy.name();
    
    var hp_space = max_hp / 75 || 1;
    var mp_space = max_mp / 75 || 1;
    
    if (this._hpData > current_hp + hp_space) {
        this._hpData -= hp_space
    } else if (this._hpData < current_hp - hp_space) {
        this._hpData += hp_space
    } else {
        this._hpData = current_hp
    }
    
    if (this._mpData > current_mp + mp_space) {
        this._mpData -= mp_space
    } else if (this._mpData < current_mp - mp_space) {
        this._mpData += mp_space
    } else {
        this._mpData = current_mp
    }
    
    var hp_show = Math.floor(this._hpData);
    var mp_show = Math.floor(this._mpData);

    var hp_rate = this._hpData / max_hp || 0;
    var mp_rate = this._mpData / max_mp || 0;
    
    var width = this.windowWidth() - this.standardPadding() * 2;
    var height = 8;
    
    var x = 0;
    var y = 0;
    
    var l = (this.lineHeight() - height)/2;
    var y2 = y + this.lineHeight();
    var y3 = y2 + this.lineHeight();
    
    var y2_ = y + this.lineHeight() + l;
    var y3_ = y2_ + this.lineHeight();
    
    this.changeTextColor(this.systemColor());
    
    this.drawGauge(x, y2_, width, height, hp_rate, this.hp_guage_color(hp_rate), this.hp_guage_color(hp_rate), l);
    this.drawGauge(x, y3_, width, height, mp_rate, this.mp_guage_color(mp_rate), this.mp_guage_color(mp_rate), l);
    
    this.drawText(TextManager.hpA, x, y2, width, 'left'); 
    this.drawText(TextManager.mpA, x, y3, width, 'left'); 
    
    this.changeTextColor(this.normalColor());
    this.drawText(name, x, y, width, 'left'); 
    this.drawText(hp_show, x, y2, width, 'right'); 
    this.drawText(mp_show, x, y3, width, 'right'); 
    



};
 
//alias

var _Scene_Battle_prototype_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_prototype_createAllWindows.call(this);
    this.createInfo()
    

};

Scene_Battle.prototype.createInfo = function() {
    this._info = new Enemy_Window(0, 0, Graphics.boxWeight, Graphics.boxHeight);
    this.addChild(this._info);
};


var _Scene_Battle_prototype_commandSkill = Scene_Battle.prototype.commandSkill
Scene_Battle.prototype.commandSkill = function() {
    _Scene_Battle_prototype_commandSkill.call(this)
    this._info.hide();
};

var _Scene_Battle_prototype_commandItem = Scene_Battle.prototype.commandItem;
Scene_Battle.prototype.commandItem = function() {
    _Scene_Battle_prototype_commandItem.call(this);
    this._info.hide();
};

var _Scene_Battle_prototype_onSkillOk = Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onSkillOk = function() {
    _Scene_Battle_prototype_onSkillOk.call(this);
    this._info.show();
};

var _Scene_Battle_prototype_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
Scene_Battle.prototype.onSkillCancel = function() {
    _Scene_Battle_prototype_onSkillCancel.call(this);
    this._info.show();
};

var _Scene_Battle_prototype_onItemOk = Scene_Battle.prototype.onItemOk;
Scene_Battle.prototype.onItemOk = function() {
    _Scene_Battle_prototype_onItemOk.call(this);
    this._info.show();
};

var _Scene_Battle_prototype_onItemCancel = Scene_Battle.prototype.onItemCancel;
Scene_Battle.prototype.onItemCancel = function() {
    _Scene_Battle_prototype_onItemCancel.call(this);
    this._info.show();
};

var _Scene_Battle_prototype_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel = function() {
    _Scene_Battle_prototype_onEnemyCancel.call(this);
    if (['skill', 'item'].includes(this._actorCommandWindow.currentSymbol())) this._info.hide();
};

var _Scene_Battle_prototype_onActorCancel = Scene_Battle.prototype.onActorCancel;
Scene_Battle.prototype.onActorCancel = function() {
    _Scene_Battle_prototype_onActorCancel.call(this);
    if (['skill', 'item'].includes(this._actorCommandWindow.currentSymbol())) this._info.hide();
};

var _Sprite_Enemy_prototype_updateFrame = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
    _Sprite_Enemy_prototype_updateFrame.call(this);
};




})();





