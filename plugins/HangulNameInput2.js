

const __charWidth = Window_NameEdit.prototype.charWidth;
Window_NameEdit.prototype.charWidth = function() {
    return $gameSystem.isKorean() ? this.textWidth("뷁") : __charWidth.call(this);
};

Window_NameInput.prototype.table = function() {
    return [Window_NameInput.HANGUL1, 
    
    Window_NameInput.HANGUL2, 
    Window_NameInput.HANGUL3, ]
};

Window_NameInput.HANGUL1 =
        [ 'ㅃ','ㅉ','ㄸ','ㄲ','ㅆ',        '','','','ㅒ','ㅖ',
          'ㅂ','ㅈ','ㄷ','ㄱ','ㅅ',  'ㅛ','ㅕ','ㅑ','ㅐ','ㅔ',
          'ㅁ','ㄴ','ㅇ','ㄹ','ㅎ',  'ㅗ','ㅓ','ㅏ','ㅣ','',
            '','ㅋ','ㅌ','ㅊ','ㅍ',  'ㅠ','ㅜ','ㅡ','','',
          '','','','','',  '←','Del','공백','Page','OK' ];

Window_NameInput.HANGUL2 =
        [ 'A','B','C','D','E',  'a','b','c','d','e',
          'F','G','H','I','J',  'f','g','h','i','j',
          'K','L','M','N','O',  'k','l','m','n','o',
          'P','Q','R','S','T',  'p','q','r','s','t',
          ':',';','☆','','',  '←','Del','공백','Page','OK' ];

Window_NameInput.HANGUL3 =
        [ 'U','V','W','X','Y',  'u','v','w','x','y',
          'Z','[',']','^','_',  'z','{','}','|','~',
          '0','1','2','3','4',  '!','#','$','%','&',
          '5','6','7','8','9',  '(',')','*','+','-',
          '/','=','@','<','>',  '←','Del','공백','Page','OK' ];

Window_NameInput.prototype.maxItems = function() {
    return 50;
};

Window_NameInput.prototype.windowHeight = function() {
    return this.fittingHeight(5);
};

Window_NameInput.prototype.character = function() {
    return this._index < 45 ? this.table()[this._page][this._index] : (this._index == 47? " ": "");
};

Window_NameInput.prototype.isDelete = function() {
    return this._index === 46;
};

Window_NameInput.prototype.isBackSpace = function() {
    return this._index === 45;
};

Window_NameInput.prototype.isSpace = function() {
    return this._index === 47;
};

Window_NameInput.prototype.isPageChange = function() {
    return this._index === 48;
};

Window_NameInput.prototype.isOk = function() {
    return this._index === 49;
};


Window_NameInput.prototype.cursorDown = function(wrap) {
    if (this._index < 40 || wrap) {
        this._index = (this._index + 10) % 50;
    }
};

Window_NameInput.prototype.cursorUp = function(wrap) {
    if (this._index >= 10 || wrap) {
        this._index = (this._index + 40) % 50;
    }
};


Window_NameInput.prototype.processCancel = function() {
    this.processBackJamo();
};

Window_NameInput.prototype.processDel = function() {
    this.processBack();
};

Window_NameInput.prototype.processOk = function() {
    if (this.character() || this.isSpace()) {
        this.onNameAdd();
    } else if (this.isPageChange()) {
        SoundManager.playOk();
        this.cursorPagedown();
    } else if (this.isDelete()) {
        this.processDel()
    } else if (this.isBackSpace()) {
        this.processBackJamo()
    } else if (this.isOk()) {
        this.onNameOk();
    }
};

Window_NameInput.prototype.onNameAdd = function() {
    let name = this._editWindow.name();
    for (let i = 0; i < name.length; i++) {
        this._editWindow.back()
    }
    let shortname = name.slice(-1)
    let basename = name.slice(0, -1)
    name = basename + johap(bunhae(shortname + this.character()))
    for (let i = 0; i < name.length; i++) {
        this._editWindow.add(name[i])
    }
    SoundManager.playOk();

};

Window_NameInput.prototype.processBackJamo = function() {
    let name = this._editWindow.name();
    for (let i = 0; i < name.length; i++) {
        this._editWindow.back()
    }
    name = johap(bunhae(name).slice(0, -1))
    for (let i = 0; i < name.length; i++) {
        this._editWindow.add(name[i])
    }
    SoundManager.playCancel();
};














function bunhaeChar(char) {
    const code = char.charCodeAt(0) - 0xAC00;
    if (!(0 <= code && code < 11172)) {
        return char
    }
    const jongseongCode = code % 28
    const jungseongCode = (code - code % 28) / 28 % 21
    const  choseongCode = ((code - code % 28) / 28 - (code - code % 28) / 28 % 21) / 21
    
    //console.log([code, choseongCode, jungseongCode, jongseongCode])
    return 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[choseongCode] +
                'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'[jungseongCode] +
                (jongseongCode? ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'[jongseongCode] : '')
}

function isJaeum(char) {
    if ("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".indexOf(char) !== -1) {
        return true
    } return false
} 

function isMoeum(char) {
    if ("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".indexOf(char) !== -1) {
        return true
    } return false
} 

function isNoJongseong(char) {
     const code = char.charCodeAt(0);
     if ((code - 0xAC00) % 28 == 0 && isHangul(char)) {
        return true
    } return false
} 

function isHangul(char) {
     const code = char.charCodeAt(0);
     if (0xAC00 <= code && code <= 0xAC00 + 11172) {
        return true
    } return false
} 

function isJaeumCannotBeJoungseong(char) {
    if ("ㄸㅃㅉ".indexOf(char) !== -1) {
        return true
    } return false
} 

function couldBeJohapped(two) {
    if (reverseDict[two]) {
        return true
    } return false
} 

function johap(string) {
    const johapList = []
    let pointer = ""
    for (let i = 0; i < string.length; i++) {
        let char = string[i]
        let nextChar = string[i + 1]
        
        if (pointer == "") { // 공백이면 그저 다음 문자를 포인터에 삽입
            if (isJaeum(char) || isMoeum(char)) {
                pointer = char
            } else {
                johapList.push(char)
            }
            
        } else if (isMoeum(pointer)) {
            if (couldBeJohapped(pointer + char)) {
                pointer = johapJong(pointer + char);
                johapList.push(pointer);
                pointer = ""
            } else {
                johapList.push(pointer);
                pointer = char
            }
        } else if (isJaeum(pointer)) { // 이전이 자음이고
            if (isJaeum(char)) { // 지금이 자음이고
                if (!isMoeum(nextChar) || !nextChar) { // 다음도 자음이라면
                    if (couldBeJohapped(pointer+char)) { // 이전과 현재가 이중모음 가능하다면 이중모음화
                        johapList.push(johapJong(pointer+char));
                        pointer = ""
                    } else {
                        johapList.push(pointer);
                        pointer = char
                    }
                } else {
                    johapList.push(pointer);
                    pointer = char
                }
            } else if (isMoeum(char)) {
                pointer = johapChar(pointer, char);
            } else {
                johapList.push(pointer)
                pointer = char
            }
        } else if (isNoJongseong(pointer)) {
            if (isJaeum(char) && !isJaeumCannotBeJoungseong(char)) {
                pointer = johapCharTwo(pointer, char)
            } else if (isJaeumCannotBeJoungseong(char)) {
                johapList.push(pointer);
                pointer = char;
            } else if (isMoeum(char)) {
                let b = bunhaeChar(pointer);
                if (couldBeJohapped(b[1] + char)) {
                    pointer = johapChar(b[0], johapJong(b[1] + char))
                } else {
                    johapList.push(pointer)
                    johapList.push(char)
                    pointer = ""
                }
            } else {
                johapList.push(pointer)
                johapList.push(char)
                pointer = ""
                
            }
        } else if (isHangul(pointer)) { // 그냥 한글이지만 위에서 받침있는 경우를 이미 했음.
            if (isJaeum(char)) {
                let b = bunhaeChar(pointer);
                if (couldBeJohapped(b[2] + char) && !isMoeum(nextChar)) {
                    pointer = johapChar(b[0], b[1], johapJong(b[2] + char));
                    johapList.push(pointer);
                    pointer = ""
                } else {
                    johapList.push(pointer);
                    pointer = char
                }
            } else if (isMoeum(char)) {
                let b = bunhaeChar(pointer);
                johapList.push(johapChar(b[0], b[1]));
                pointer = johapChar(b[2], char);
            } else {
                johapList.push(pointer)
                johapList.push(char)
                pointer = ""
            }

        } else {
            johapList.push(pointer);
            pointer = char
        }
        
    }
    console.log(johapList.join(""), pointer)
    return (johapList.join("")+pointer)
}

function johapChar(cho, jung = "", jong = " ") {
    const cho2 = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.indexOf(cho)
    const jung2 = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.indexOf(jung)
    const jong2 = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'.indexOf(jong)
    if (jung2 >= 0) {
        return String.fromCharCode(cho2 * 21 * 28 + jung2 * 28 + jong2 + 0xAC00)
    }
    return cho
}


function johapCharTwo(two, jong = " ") {
    const jong2 = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'.indexOf(jong)
    return String.fromCharCode(two.charCodeAt(0) + jong2)
    
}

function johapJong(two) {
    if (reverseDict[two]) {
        return reverseDict[two]
    } return two
}

const dict = {"ㄳ":"ㄱㅅ","ㄵ":"ㄴㅈ","ㄶ":"ㄴㅎ","ㄺ":"ㄹㄱ","ㄻ":"ㄹㅁ","ㄼ":"ㄹㅂ","ㄽ":"ㄹㅅ","ㄾ":"ㄹㅌ","ㄿ":"ㄹㅍ","ㅀ":"ㄹㅎ","ㅄ":"ㅂㅅ","ㅘ":"ㅗㅏ","ㅙ":"ㅗㅐ","ㅚ":"ㅗㅣ","ㅝ":"ㅜㅓ","ㅞ":"ㅜㅔ","ㅟ":"ㅜㅣ","ㅢ":"ㅡㅣ"};
const reverseDict = {"ㄱㅅ":"ㄳ","ㄴㅈ":"ㄵ","ㄴㅎ":"ㄶ","ㄹㄱ":"ㄺ","ㄹㅁ":"ㄻ","ㄹㅂ":"ㄼ","ㄹㅅ":"ㄽ","ㄹㅌ":"ㄾ","ㄹㅍ":"ㄿ","ㄹㅎ":"ㅀ","ㅂㅅ":"ㅄ","ㅗㅏ":"ㅘ","ㅗㅐ":"ㅙ","ㅗㅣ":"ㅚ","ㅜㅓ":"ㅝ","ㅜㅔ":"ㅞ","ㅜㅣ":"ㅟ","ㅡㅣ":"ㅢ"}
function bunhae(string) {
    const list = []

    for (let i = 0; i < string.length; i++) {
        let char = bunhaeChar(string[i]);
        char = char.replaceAll(/[ㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄㅘㅙㅚㅝㅞㅟㅢ]/g, a => dict[a])
        list.push(char)
        
    }return list.join("")
}


