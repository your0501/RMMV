// =======================================
// YUR_SaveSlot.js
// =================================
// The MIT License (MIT)
// Copyright (c) 2020 your0501
// ====================================
// Free for commercial and non commercial use.
// ==========================================
/*:
 * @plugindesc 세이브 슬롯 수를 조정합니다.
 ver 0.1
 * @author your0501
 *
 * @help 세이브 슬롯 수를 조정합니다. 
 최소 1개, 최대 99개까지 가능합니다.
 *
 * @param slot
 * @text 슬롯 개수
 * @desc 슬롯의 개수입니다.
 * @type number
 * @min 1
 * @max 99
 * @default 1
 */

var Imported = Imported || {};
Imported.YUR_SaveSlot = true;
  
var Youri = Youri || {};
Youri.Param = Youri.Param || {};

Youri.Param.saveSlot = {};
Youri.saveSlot = {};

Youri.Param.saveSlot.slot = Number(PluginManager.parameters('YUR_SaveSlot')["slot"]) || 20;



(function(__) {
    
    DataManager.maxSavefiles = function() {
        return __;
    };

    Window_SavefileList.prototype.maxVisibleItems = function() {
        return this.maxItems() > 4? 5 : this.maxItems();
    };


})(Youri.Param.saveSlot.slot);
