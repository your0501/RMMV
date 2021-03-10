/**
 * The bitmap used for the window contents.
 *
 * @property contents
 * @type Bitmap
 */
Object.defineProperty(Window.prototype, 'contents', {
    get: function() {
        return this._windowContentsSprite.bitmap;
    },
    set: function(value) {
        this._windowContentsSprite.bitmap = value;
    },
    configurable: true
});

/**
 * The opacity of the window contents (0 to 255).
 *
 * @property contentsOpacity
 * @type Number
 */
Object.defineProperty(Window.prototype, 'contentsOpacity', {
    get: function() {
        return this._windowContentsSprite.alpha * 255;
    },
    set: function(value) {
        this._windowContentsSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});








