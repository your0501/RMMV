/*:
 * @plugindesc 아이템 툴팁 윈도우를 확장합니다.
 * @author Youri Plugin
 *
 * @help 


 *
 * @param ItemWindow
 * @text 아이템 창 변경 여부
 * @type boolean
 * @desc 아이템 창을 변경할까요?
 * @default true
 *
 * @param SkillWindow
 * @text 스킬 창 변경 여부
 * @type boolean
 * @desc 스킬 창을 변경할까요?
 * @default true
 *
 * @param ItemBattleWindow
 * @text 전투 아이템 창 변경 여부
 * @type boolean
 * @desc 전투중 아이템 창을 변경할까요?
 * @default true
 *
 * @param SkillBattleWindow
 * @text 전투 스킬 창 변경 여부
 * @type boolean
 * @desc 전투중 스킬 창을 변경할까요?
 * @default true
*/

Window_Base.prototype.standardFontFace = function() {
return 'GameFont';
    
};

// =======================================
// Window_SkillList
// =======================================


Window_SkillList.prototype.maxCols = function() {
    return 1;
};

// =======================================
// Window_SkillType
// =======================================


Window_SkillType.prototype.windowWidth = function() {
    return Graphics.boxWidth / 4;
};


// =======================================
// Window_BattleSkill
// ===============

Window_BattleSkill.prototype.maxCols = () => 1;

// =======================================
// Window_SkillType
// ===============

Window_SkillType.prototype.maxCols = () => 1;


// =======================================
// Window_EquipCommand
// ===============


Window_ShopNumber.prototype.windowWidth = function() {
    return 408;
};


Window_ShopBuy.prototype.windowWidth = function() {
    return 408;
};



// =======================================
// Window_EquipCommand
// ===============




function Window_EquipCommandVertical() {
    this.initialize.apply(this, arguments);
}

Window_EquipCommandVertical.prototype = Object.create(Window_Command.prototype);
Window_EquipCommandVertical.prototype.constructor = Window_EquipCommandVertical;

Window_EquipCommandVertical.prototype.initialize = function(x, y, width) {
    this._windowWidth = width;
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_EquipCommandVertical.prototype.windowWidth = function() {
    return this._windowWidth;
};

Window_EquipCommandVertical.prototype.numVisibleRows = function() {
    return 4;
};

Window_EquipCommandVertical.prototype.makeCommandList = function() {
    this.addCommand(TextManager.equip2,   'equip');
    this.addCommand(TextManager.optimize, 'optimize');
    this.addCommand(TextManager.clear,    'clear');
};


// =======================================
// Window_SkillStatusSmall
// =======================================

function Window_SkillStatusSmall() {
    this.initialize.apply(this, arguments);
}

Window_SkillStatusSmall.prototype = Object.create(Window_SkillStatus.prototype);
Window_SkillStatusSmall.prototype.constructor = Window_SkillStatusSmall;

Window_SkillStatusSmall.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
};


Window_SkillStatusSmall.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        
        var w = this.width - this.padding * 2;
        var h = this.height - this.padding * 2;
        var y = 0; // 2 - this.lineHeight() * 1.5;
        var x = 0;//w - 162 - this.textPadding();
        
        var actor = this._actor;
        var lineHeight = this.lineHeight()
        
        this.drawActorFace (actor, 0, 0, 144, h);
        
        this.drawActorName (actor, x, y + lineHeight * 0);
        this.drawActorIcons(actor, x, y + lineHeight * 1);
        this.drawActorHp   (actor, x, y + lineHeight * 2, w);
        this.drawActorMp   (actor, x, y + lineHeight * 3, w);
    }
};



// =======================================
// Window_HelpExtra
// =======================================


function Window_HelpExtra() {
    this.initialize.apply(this, arguments);
}

Window_HelpExtra.prototype = Object.create(Window_Help.prototype);
Window_HelpExtra.prototype.constructor = Window_Help;

Window_HelpExtra.prototype.standardFontSize = function() {
    return 20;
};

Window_HelpExtra.prototype.makeFontBigger = function() {
    if (this.contents.fontSize <= 64) {
        this.contents.fontSize += 4;
    }
};

Window_HelpExtra.prototype.makeFontSmaller = function() {
    if (this.contents.fontSize >= 8) {
        this.contents.fontSize -= 4;
    }
};

Window_HelpExtra.prototype.initialize = function(x, y, w, h) {
    var width = !isNaN(Number(w))? w : Graphics.boxWidth / 2;
    var height = !isNaN(Number(h))? h : Graphics.boxHeight;
    var xx = !isNaN(Number(x))? x : width
    var yy = !isNaN(Number(y))? y : 0
    Window_Base.prototype.initialize.call(this, xx, yy, width, height);
    this._text = '';
    //this._isUpdating = false;
    //this._item = null;
};

Window_HelpExtra.prototype.setText = function(text) {
    if (this._text !== text) {
        var text = text.replace(/\\n/g, '\n');
        this._text = text;
        this.refresh();
    }
};


Window_HelpExtra.prototype.refresh = function() {
    //this._item = null;
    this.contents.clear();
    var lineHeight = this.lineHeight()
    this.drawTextEx(this._text, 0, 0);
};


/*
Window_HelpExtra.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (Graphics.frameCount % 10 == 0 && this._isUpdating) {
        if (this._item) {this.setText(this._item ? (this.makeToolTip(this._item)) : '');}

    }
};
*/

Window_HelpExtra.prototype.setItem = function(item) {
    //this._item = item;
    this.setText(item ? (this.makeToolTip(item)) : '');
    //this._isUpdating = !!(item? item.meta.toolTipUpdate: false);
};






Window_HelpExtra.prototype.getNoteDesc = function(item) {
    var note = item.note;
    var re = /<desc>\n(.*)\n<\/desc>/gis
    var match = re.exec(note);
    return match? match[1]: item.description //받은 문자열 사이에 있는 아무 문자열을 리턴
}

TextManager.xparam = function(paramId) {
    return ["명중률", "회피율", "치명타 확률", "치명 회피율", "마법 회피율", "마법 반사 확률", "공격 반사 확률", "HP 재생률", "MP 재생률", "TP 재생률"][paramId] || '';
};

TextManager.sparam = function(paramId) {
    return ["피공격률", "보호 효과율", "회복 효과율", "포션 회복률", "MP 소비율", "TP 충전률", "물리 피해율", "마법 피해율", "바닥 피해율", "경험치 획득률"][paramId] || '';
};


Window_HelpExtra.prototype.makeItemDetail = function(item) {
    var description = "";
    description += `${item.meta.detail? item.meta.detail + "\n" : ""}`



    var paramPlus = item.NIP? item.NIP.paramPlus : []
    var paramBase = item.NIP? item.NIP.paramBase: item.params

    for (var [index, value] of paramBase.entries()) {

        if (value !== 0) { 
            var random = item.meta["paramRandom"+index] || 0;
            
            description += `${TextManager.param(index)}: ${(value < 0)? "" : "+"}${value}`
            if (random) {
                description += `\\c[24]${(random < 0)? "" : "+"}${Math.randomInt(random)}\\c[0]`
            }
            //console.log(paramPlus)
            if (paramPlus[index]) {
                description += `\\c[4]${(random < 0)? "" : "+"}${paramPlus[index]}\\c[0]`
            }
            description += "\n"
        }
    }
    for (var index in item.traits) {
        var trait = item.traits[index]
        if (trait.code == 21 && trait.value != 0) {
            description += `${TextManager.param(trait.dataId)}: ${(trait.value < 0)? "" : "*"}${Math.round(trait.value*400)/4}%\n`
        }
        else if (trait.code == 22 && trait.value != 0) {
            description += `${TextManager.xparam(trait.dataId)}: ${(trait.value < 0)? "" : "+"}${Math.round(trait.value*400)/4}%\n`
        }
        else if (trait.code == 23 && trait.value != 1) {
            description += `${TextManager.sparam(trait.dataId)}: ${(trait.value < 0)? "" : "*"}${Math.round(trait.value*400)/4}%\n`
        }
    }
    return description;
}

Window_HelpExtra.prototype.makeWeaponDetail = function(item) {
    var description = "";
    description += `${item.meta.reqLevel? `요구 레벨: ${item.meta.reqLevel}\n`: ""}`
    description += `무기분류: ${$dataSystem.weaponTypes[item.wtypeId]}\n`
    return description;
}

Window_HelpExtra.prototype.makeArmorDetail = function(item) {
    var description = "";

    description += `${item.meta.reqLevel? `요구 레벨: ${item.meta.reqLevel}\n`: ""}`
    description += `장비분류: ${$dataSystem.armorTypes[item.atypeId]}\n`
    description += `장착위치: ${$dataSystem.equipTypes[item.etypeId]}\n`
    return description;
}



Window_HelpExtra.prototype.makeToolTip = function(item) {
    if (!item) return "";
    var description = this.getNoteDesc(item) + "\n\n";
    
    if (DataManager.isWeapon(item)) {
        description += this.makeWeaponDetail(item)
    } else if (DataManager.isArmor(item)) {
        description += this.makeArmorDetail(item)
    }
    
    if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
        description += this.makeItemDetail(item);
    }
    //description += "\\c[24]공격력 +15%\n치명타 확률 +5%"
    return description
}


Window_HelpExtra.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
    textState.x += w;
    if (this.width - (this.standardPadding()) * 2  - w <= textState.x) {
        textState.x = textState.left;
        textState.height = this.calcTextHeight(textState, false);
        textState.y += this.contents.fontSize + 8;
    }
    
};



// =======================================
// Scene_Item
// =======================================


Scene_Item.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_HelpExtra();
    this.addWindow(this._helpWindow);
};

Scene_Item.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory();
    var w = this._categoryWindow;
    w.setHelpWindow(this._helpWindow);
    w.y = 0;
    w.windowWidth = () => Graphics.boxWidth - this._helpWindow.width;
    this._categoryWindow.width = Graphics.boxWidth - this._helpWindow.width;

    this._categoryWindow.refresh()
    this._categoryWindow.select(0);
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Item.prototype.createItemWindow = function() {
    var ww = Graphics.boxWidth - this._helpWindow.width;;
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_ItemList(0, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.maxCols = () => 1;
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
};



// =======================================
// Scene_Skill
// =======================================


Scene_Skill.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_HelpExtra();
    this.addWindow(this._helpWindow);
};


Scene_Skill.prototype.createSkillTypeWindow = function() {
    var wy = 0;this._helpWindow.height;
    this._skillTypeWindow = new Window_SkillType(0, wy, Graphics.boxWidth / 2);
    this._skillTypeWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setHandler('skill',    this.commandSkill.bind(this));
    this._skillTypeWindow.setHandler('cancel',   this.popScene.bind(this));
    this._skillTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._skillTypeWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._skillTypeWindow);
};

Scene_Skill.prototype.createStatusWindow = function() {
    var wx = this._skillTypeWindow.width;
    var wy = 0;this._helpWindow.height;
    var ww = Graphics.boxWidth / 4;
    var wh = this._skillTypeWindow.height;
    this._statusWindow = new Window_SkillStatusSmall(wx, wy, ww, wh);
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);
};

Scene_Skill.prototype.createItemWindow = function() {
    var wx = 0;
    var wy = this._statusWindow.y + this._statusWindow.height;
    var ww = Graphics.boxWidth / 2;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};


// =======================================
// Scene_Shop
// =======================================



Scene_Shop.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_HelpExtra();
    this.addWindow(this._helpWindow);
};


Scene_Shop.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.width = Graphics.boxWidth - this._helpWindow.width;
    this._goldWindow.y = this._goldWindow.height;
    this.addWindow(this._goldWindow);
};

Scene_Shop.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_ShopCommand(Graphics.boxWidth - this._helpWindow.width, this._purchaseOnly);
    this._commandWindow.y = 0;
    this._commandWindow.setHandler('buy',    this.commandBuy.bind(this));
    this._commandWindow.setHandler('sell',   this.commandSell.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Shop.prototype.createDummyWindow = function() {
    var wy = this._goldWindow.y + this._goldWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth / 2, wh);
    this.addWindow(this._dummyWindow);
};


Scene_Shop.prototype.createStatusWindow = function() {
    var wx = this._numberWindow.width+1000;
    var wy = this._dummyWindow.y;
    var ww = Graphics.boxWidth - wx;
    var wh = this._dummyWindow.height;
    this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
    this._statusWindow.opacity = 0;
    this.addWindow(this._statusWindow);
};

// =======================================
// Scene_Equip
// =======================================

/*

Scene_Equip.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_HelpExtra();
    this.addWindow(this._helpWindow);
};

Scene_Equip.prototype.createCommandWindow = function() {
    var wx = 0;
    var wy = 0;
    var ww = Graphics.boxWidth / 4;
    this._commandWindow = new Window_EquipCommandVertical(wx, wy, ww);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler('equip',    this.commandEquip.bind(this));
    this._commandWindow.setHandler('optimize', this.commandOptimize.bind(this));
    this._commandWindow.setHandler('clear',    this.commandClear.bind(this));
    this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
    this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._commandWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.createStatusWindow = function() {
    var wx = Graphics.boxWidth / 4;
    var wy = 0;
    var ww = Graphics.boxWidth / 4;
    var wh = 128;
    this._statusWindow = new Window_SkillStatusSmall(wx, wy, ww, wh);
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);


};

*/
// =======================================
// Scene_Battle
// =======================================


Scene_Battle.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_HelpExtra();
    this._helpWindow.visible = false;
    this._helpWindow.height -= this._statusWindow.height;
    this.addWindow(this._helpWindow);
};


Scene_Battle.prototype.createSkillWindow = function() {
    var wx = 0;
    var wy = 0;
    var ww = Graphics.boxWidth / 2;
    var wh = Graphics.boxHeight - this._statusWindow.height;
    this._skillWindow = new Window_BattleSkill(wx, wy, ww, wh);
    
    /*this._itemWindow.setHelpWindow(this._helpWindow);
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);*/
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.createItemWindow = function() {
    var wx = 0;
    var wy = 0;
    var ww = Graphics.boxWidth / 2;
    var wh = Graphics.boxHeight - this._statusWindow.height;
    this._itemWindow = new Window_BattleItem(wx, wy, ww, wh);
    
    /*
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);*/
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};