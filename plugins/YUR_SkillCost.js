// =======================================
// YUR_SkillCost
// =================================
// The MIT License (MIT)
// Copyright (c) 2020 your0501
// ====================================
// Free for commercial and non commercial use.
// ==========================================
/*:
 * @plugindesc 스킬 코스트를 커스텀할 수 있습니다. 
 ver 0.1
 * @author your0501
 *
 * @help 플러그인 커맨드는 없습니다.
 =============
 스킬 노트태그
 =============
 <skillHpCost:수치>
 스킬이 HP를 코스트로 사용합니다.
 
 <skillMpCost:수치>
 <skillTpCost:수치>
 스킬이 MP, TP를 코스트로 사용합니다.
 스킬 설정에서 설정하는 MP, TP와 합산됩니다.
 
 =============
 고급 사용자
 =============
 (노트태그를 열고 닫을 때 '<'와 '>' 문자를 사용하므로, 코드에서 
 해당 문자를 사용할 수 없습니다. 다른 코드로 대체하십시오.)
 
 
 <skillConditionEval:코드>
 스킬 사용 조건을 커스텀할 수 있습니다.
 eval의 결과로 true가 반환될 시 사용 가능하게 합니다.
 
 <skillCostEval:코드>
 스킬 코스트를 커스텀할 수 있습니다.
 
 
 
 
 
 [2020-11-08] ver 0.1
 최초 작성
 *
 * @param HpCost
 * @text HP 코스트 부족시 스킬 사용
 * @desc HP를 코스트로 하는 스킬을 사용할 때, 
 현재 HP가 코스트보다 적어도 사용 가능하게 할 지 정합니다.
 * @type Boolean
 * @default false
 *
 * @param HpCostDead
 * @parent HpCost
 * @text HP 코스트로 기절 허용
 * @desc 코스트보다 적을 때 스킬 사용 시, 
 기절을 허용 할 지 정합니다.
 * @type Boolean
 * @default false
 *
 * @param HpCostColor
 * @text HP 코스트 색깔
 * @desc 스킬 창에서 HP 코스트 색깔을 정합니다.
 * @type text
 * @default #ff784c
 *
 * @param SkillList
 * @text 스킬 리스트 창 표시 변경
 * @desc 스킬 코스트가 여러개인 경우에도 
 모두 표시합니다.
 * @type Boolean
 * @default true
 *
 * @param SkillListDisable
 * @parent SkillList
 * @text 스킬 리스트 창 표시 제거
 * @desc 스킬 리스트 창을 변경하지 않습니다
 * @type Boolean
 * @default false
 */
 
 
var Imported = Imported || {};
Imported.YUR_SkillCost = true;
  
var Youri = Youri || {};
Youri.Param = Youri.Param || {};

Youri.Param.skillCost = {};
Youri.skillCost = {};

Youri.Param.skillCost = function Parse( object ) {try { object = JSON.parse( object );} catch (e) { object = object;} finally {if ( Array.isArray( object ) ) { var l = object.length; for ( var i = 0; i < l; i++ ) { object[i] = Parse( object[i] ); };} else if ( typeof object === 'object' ) { for ( var key in object ) { object[key] = Parse( object[key] ); }; }}return object;}(PluginManager.parameters('YUR_SkillCost'));


(function() {
    // ==============================================
    // Game_BattlerBase
    // ======================================================
    Game_BattlerBase.prototype.skillHpCost_YUR = function(skill) {
        if (!isNaN(Number(skill.meta.skillHpCost))) {
            return skill.meta.skillHpCost;
        } else {
            return 0;
        };
    }; 

    var Game_BattlerBase_prototype_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        var cost = Game_BattlerBase_prototype_skillMpCost.call(this, skill);
        if (!isNaN(Number(skill.meta.skillMpCost))) {
            cost += Math.floor(Number(skill.meta.skillMpCost) * this.mcr);
        }
        return cost;
    };

    var Game_BattlerBase_prototype_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        var cost = Game_BattlerBase_prototype_skillTpCost.call(this, skill);
        if (!isNaN(Number(skill.meta.skillTpCost))) {
            cost += Number(skill.meta.skillTpCost);
        };
        return cost;
    };

    Game_BattlerBase.prototype.skillConditionEval_YUR = function(skill) {
        if (!!skill.meta.skillConditionEval) {
            return String(skill.meta.skillConditionEval);
        } else {
            return "true";
        };
    };
    
    Game_BattlerBase.prototype.skillCostEval_YUR = function(skill) {
        if (!!skill.meta.skillCostEval) {
            return String(skill.meta.skillCostEval);
        } else {
            return "true";
        };
    };

    var Game_BattlerBase_prototype_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        var condition = Game_BattlerBase_prototype_canPaySkillCost.call(this, skill);
        var skillEval = true;
        var hpCost = (Youri.Param.skillCost.HpCost)? this._hp >= this.skillHpCost_YUR(skill): true;
        try {
            skillEval = eval(this.skillConditionEval_YUR(skill));
        } catch(e) {
            console.error(`skillConditionEval 오류, 스킬 번호: ${skill.id}`);
        };
        
        return condition && skillEval && hpCost;
        
    };

    var Game_BattlerBase_prototype_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        Game_BattlerBase_prototype_paySkillCost.call(this, skill);
        try {
            eval(this.skillCostEval_YUR(skill));
        } catch(e) {
            console.error(`skillCostEval 오류, 스킬 번호: ${skill.id}`);
        };
        var hp = this._hp - this.skillHpCost_YUR(skill);
        this._hp = (hp > 0)? hp : (Youri.Param.skillCost.HpCostDead? 0: 1);
    };

    // ==================================
    // Window_SkillList
    // =================================
    if (!Youri.Param.skillCost.SkillListDisable) {
        if (!Youri.Param.skillCost.SkillList) {
                let hpCost = this._actor.skillHpCost_YUR(skill);
                let tpCost = this._actor.skillTpCost(skill);
                let mpCost = this._actor.skillMpCost(skill);
                let tpSpacing = tpCost? this.textWidth(`${tpCost} `): 0;
                let mpSpacing = mpCost? this.textWidth(`${mpCost} `): 0;
                if (tpCost > 0) {
                    this.changeTextColor(this.tpCostColor());
                    this.drawText(`${tpCost}`, x, y, width, 'right');
                } 
                if (mpCost > 0) {
                    this.changeTextColor(this.mpCostColor());
                    this.drawText(`${mpCost}`, x - tpSpacing, y, width, 'right');
                }
                if (hpCost > 0) {
                    this.changeTextColor(Youri.Param.skillCost.HpCostColor);
                    this.drawText(`${hpCost}`, x - mpSpacing - tpSpacing, y, width, 'right');
                };
            };
        } else {
            var Window_SkillList_prototype_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
            Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
                if (this._actor.skillHpCost_YUR(skill) > 0) {
                    this.changeTextColor(Youri.Param.skillCost.HpCostColor);
                    this.drawText(this._actor.skillHpCost_YUR(skill), x, y, width, 'right');
                } else {
                    Window_SkillList_prototype_drawSkillCost.call(this, skill, x, y, width);
                };
            };
        };
    };
})();
