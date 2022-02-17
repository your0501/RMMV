Window_NameEdit.prototype.charWidth = function() {
    var text = '\uff21'
    return this.textWidth(text);
};


Window_NameEdit.prototype.itemRect = function(index) {
    return {
        x: this.left() + index * this.charWidth(),
        y: 0,
        width: this.charWidth(),
        height: this.lineHeight()
    };
};

Window_NameEdit.prototype.refresh = function() {
    this.contents.clear();
    this.drawActorFace(this._actor, 0, -36);
    for (var i = 0; i < this._maxLength; i++) {
        this.drawUnderline(i);
    }
    for (var j = 0; j < this._name.length; j++) {
        this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    
};

Window_NameEdit.prototype.initialize = function(actor, maxLength) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = 24//(Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = actor;
    this._name = actor.name().slice(0, this._maxLength);
    this._index = this._name.length;
    this._maxLength = maxLength;
    this._defaultName = this._name;
    this.deactivate();
    this.refresh();
    ImageManager.reserveFace(actor.faceName());
};
Window_NameEdit.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_NameEdit.prototype.windowWidth = function() {
    return 672+this.standardPadding()*2;
};



Window_NameInput.prototype.table = function() {

    return Window_NameInput.HANGUL
};

Window_NameInput.LATIN1 =
        [ 'A','B','C','D','E',  'a','b','c','d','e',
          'F','G','H','I','J',  'f','g','h','i','j',
          'K','L','M','N','O',  'k','l','m','n','o',
          'P','Q','R','S','T',  'p','q','r','s','t',
          'U','V','W','X','Y',  'u','v','w','x','y',
          'Z','[',']','^','_',  'z','{','}','|','~',
          '0','1','2','3','4',  '!','#','$','%','&',
          '5','6','7','8','9',  '(',')','*','+','-',
          '/','=','@','<','>',  ':',';','Page','Page','OK' ];
Window_NameInput.LATIN2 =
        [ 'Á','É','Í','Ó','Ú',  'á','é','í','ó','ú',
          'À','È','Ì','Ò','Ù',  'à','è','ì','ò','ù',
          'Â','Ê','Î','Ô','Û',  'â','ê','î','ô','û',
          'Ä','Ë','Ï','Ö','Ü',  'ä','ë','ï','ö','ü',
          'Ā','Ē','Ī','Ō','Ū',  'ā','ē','ī','ō','ū',
          'Ã','Å','Æ','Ç','Ð',  'ã','å','æ','ç','ð',
          'Ñ','Õ','Ø','Š','Ŵ',  'ñ','õ','ø','š','ŵ',
          'Ý','Ŷ','Ÿ','Ž','Þ',  'ý','ÿ','ŷ','ž','þ',
          'Ĳ','Œ','ĳ','œ','ß',  '«','»','Page','Page','OK' ];


Window_NameInput.HANGUL = new Array(19).fill(new Array(588).fill(0))

Window_NameInput.HANGUL = Window_NameInput.HANGUL.map((value, index) => (value.map((value2, index2) => String.fromCharCode(0xAC00 + index2 + index * 28 * 21))).concat(
["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "이", "전", "", "다", "음", "", "결", "정"])
)


       
Window_NameInput.prototype.windowHeight = function() {
    return this.fittingHeight(22);
};
       
Window_NameInput.prototype.maxCols = function() {
    return 28;
};

Window_NameInput.prototype.maxItems = function() {
    return 28*22;
};

Window_NameInput.prototype.lineHeight = function() {
    return 20;
};

Window_NameInput.prototype.standardFontSize = function() {
    return 16;
};

Window_NameInput.prototype.itemRect = function(index) {
    return {
        x: index % 28 * 24,
        y: Math.floor(index / 28) * this.lineHeight(),
        width: 24,
        height: this.lineHeight()
    };
};


Window_NameInput.prototype.refresh = function() {
    var table = this.table();
    this.contents.clear();
    this.resetTextColor();
    for (var i = 0; i < 588+28; i++) {
        var rect = this.itemRect(i);
        rect.x += 3;
        rect.width -= 6;
        this.drawText(table[this._page][i], rect.x, rect.y, rect.width, 'center');
    }
    this.drawText(`${this._page + 1} / ${table.length}`, 0, 21 * this.lineHeight(), this.contentsWidth(), 'center');
};
         
Window_NameInput.prototype.processOk = function() {
    if (this.character()) {
        this.onNameAdd();
    } else if (this.isPageChange()) {
        SoundManager.playOk();
        this.cursorPagedown();
    } else if (this.isPageChange2()) {
        SoundManager.playOk();
        this.cursorPageup();
    }  else if (this.isOk()) {
        this.onNameOk();
    }
};

Window_NameInput.prototype.isPageChange2 = function() {
    return this._index === 609 || this._index === 608;
};

Window_NameInput.prototype.isPageChange = function() {
    return this._index === 612 || this._index === 611;
};

Window_NameInput.prototype.isOk = function() {
    return this._index === 615 || this._index === 614;
};

Window_NameInput.prototype.character = function() {
    return this._index < 588 ? this.table()[this._page][this._index] : '';
};



Window_NameInput.prototype.cursorDown = function(wrap) {
    if (this._index < 588 || wrap) {
        this._index = (this._index + 28) % 616;
    }
};

Window_NameInput.prototype.cursorUp = function(wrap) {
    if (this._index >= 28 || wrap) {
        this._index = (this._index + 588) % 616;
    }
};

Window_NameInput.prototype.cursorRight = function(wrap) {
    if (this._index % 28 < 27) {
        this._index++;
    } else if (wrap) {
        this._index -= 27;
    }
};

Window_NameInput.prototype.cursorLeft = function(wrap) {
    if (this._index % 28 > 0) {
        this._index--;
    } else if (wrap) {
        this._index += 27;
    }
};
