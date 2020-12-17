// =======================================
// YUR_MapPicture.js
// =================================
// The MIT License (MIT)
// Copyright (c) 2020 your0501
// ====================================
// Free for commercial and non commercial use.
// ==========================================
/*:
 * @plugindesc 특정한 맵에 진입할 시 설정한 그림을 표시합니다.
 * @author your0501
 *
 * @help
맵 노트태그

<mapPictureName:픽쳐이름> (이름에 공백이 있으면 오류가 날 수 있습니다)

<mapPictureBlendMode:합성방법> (기본값: 0)
0: 일반, 1: 가산, 2: 곱하기, 3: 스크린

<mapPictureOpacity:불투명도> (기본값: 255)

 올바른 값을 설정했다면,
 맵에 들어올 때 
 플러그인 매니저에 설정한 번호로
 설정한 그림이 표시됩니다.

 *
 * @param number
 * @text 그림 번호
 * @desc 몇 번 그림을 사용할까요? 기본값: 20
 * @type number
 * @min 1
 * @max 99
 * @default 20
 */

var Imported = Imported || {};
Imported.YUR_MapPicture = true;

var Youri = Youri || {};
Youri.Param = Youri.Param || {};

Youri.Param.mapPicture = {};
Youri.mapPicture = {};

Youri.Param.mapPicture = function Parse(object) {
    try {
        object = JSON.parse(object);
    } catch (e) {
        object = object;
    }
    finally {
        if (Array.isArray(object)) {
            var l = object.length;
            for (var i = 0; i < l; i++) {
                object[i] = Parse(object[i]);
            };
        } else if (typeof object === 'object') {
            for (var key in object) {
                object[key] = Parse(object[key]);
            };
        }
    }
    return object;
}(PluginManager.parameters('YUR_MapPicture'));


var Scene_Map_prototype_start = Scene_Map.prototype.start;

Scene_Map.prototype.start = function () {
    Scene_Map_prototype_start.call(this)
    if (this._transfer) {
        const pictureId = Number(Youri.Param.mapPicture.number) || 20;
        const pictureName = $dataMap.meta.mapPictureName;
        if (pictureName) {
            const blendMode = !isNaN(Number($dataMap.meta.mapPictureBlendMode)) ? Number($dataMap.meta.mapPictureBlendMode) : 0;
            const opacity = !isNaN(Number($dataMap.meta.mapPictureOpacity)) ? Number($dataMap.meta.mapPictureOpacity) : 255;
            $gameScreen.showPicture(pictureId, pictureName, 0, 0, 0, 100, 100, opacity, blendMode)
        } else {
            $gameScreen.erasePicture(pictureId);
        }
    }
};
