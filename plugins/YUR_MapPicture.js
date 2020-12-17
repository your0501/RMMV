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
맵에 들어올 시 나오는 픽쳐를 설정합니다.

<mapPictureBlendMode:합성방법> (기본값: 0)
0: 일반, 1: 가산, 2: 곱하기, 3: 스크린
맵 그림의 합성방법을 지정합니다.

<mapPictureOpacity:불투명도> (기본값: 255)
맵 그림의 불투명도를 지정합니다.


 설정방법
 
     노트태그는 맵에 "노트"란에 입력합니다.
     
     1. mapPictureName을 원하는 그림으로 설정합니다.
         (그림 이름이 "light"라면, <mapPictureName:light> )
         
     2. mapPictureBlendMode를 원하는 값으로 설정합니다. (선택)
         (일반으로 한다면, <mapPictureBlendMode:0> )

     3. mapPictureOpacity를 원하는 값으로 설정합니다. (선택)
         (122의 값으로 한다면, <mapPictureOpacity:122> )
  
   올바른 값을 설정했다면, 맵에 들어올 때 
   설정한 그림이 표시됩니다.
 
 주의사항
     이 플러그인을 사용한다면,
     플러그인 매니저에 지정한
     그림 번호에 그림을 표시하기 때문에,
     
     그 번호에 그림을 표시하고 맵을 이동하면
     그 그림이 사라집니다.

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
