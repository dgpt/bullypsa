function Rect(_x, _y, _width, _height) {
    return {
        x: _x, y: _y, width: _width, height: _height,
    }
}

function NineSlice(image) {
    var img = image;
    return {
        topLeft:undefined, top:undefined, topRight:undefined,
        right:undefined, bottomRight:undefined, bottom:undefined,
        bottomLeft:undefined, left:undefined, center:undefined,

        cached: false,
        cache: undefined,

        setDimensions: function(rect) {
            var x = rect.x;
            var y = rect.y;
            var w = rect.width;
            var h = rect.height;
            var x2 = x + w;
            var y2 = y + h;

            this.center = rect;
            this.right = Rect(x2, y, img.width - x2, h);
            this.left = Rect(0, y, x, h);

            this.topLeft = Rect(0, 0, x, y);
            this.top = Rect(x, 0, w, y);
            this.topRight = Rect(x2, 0, img.width - x2, y);

            this.bottomRight = Rect(x2, y2, img.width - x2, img.height - y2);
            this.bottom = Rect(x, y2, w, img.height - y2);
            this.bottomLeft = Rect(0, y2, x, img.height - y2);
        },

        copyDimensions: function(slice) {
            this.topLeft = slice.topLeft;
            this.top = slice.top;
            this.topRight = slice.topRight;
            this.right = slice.right;
            this.bottomRight = slice.bottomRight;
            this.bottom = slice.bottom;
            this.bottomLeft = slice.bottomLeft;
            this.left = slice.left;
            this.center = slice.center;
        },

        render: function(gc, x, y, width, height) {
            gc.drawImage(img, this.left.x, this.left.y, this.left.width, this.left.height, x, y+this.topLeft.height, this.left.width, height-this.topLeft.height + 1); //Left
            gc.drawImage(img, this.top.x, this.top.y, this.top.width, this.top.height, x+this.topLeft.width, y, width-this.topLeft.width + 1, this.top.height); //Top
            gc.drawImage(img, this.right.x, this.right.y, this.right.width, this.right.height, x+width, y+this.topRight.height, this.right.width, height-this.topRight.height + 1); //Right
            gc.drawImage(img, this.bottom.x, this.bottom.y, this.bottom.width, this.bottom.height, x+this.bottomLeft.width, y+height, width-this.bottomLeft.width + 1, this.bottom.height); //Bottom
            gc.drawImage(img, this.topLeft.x, this.topLeft.y, this.topLeft.width, this.topLeft.height, x, y, this.topLeft.width, this.topLeft.height); //TopLeft
            gc.drawImage(img, this.topRight.x, this.topRight.y, this.topRight.width, this.topRight.height, x+width, y, this.topRight.width, this.topRight.height); //TopRight
            gc.drawImage(img, this.bottomRight.x, this.bottomRight.y, this.bottomRight.width, this.bottomRight.height, x+width, y+height, this.bottomRight.width, this.bottomRight.height); //BottomRight
            gc.drawImage(img, this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.width, this.bottomLeft.height, x, y+height, this.bottomRight.width, this.bottomRight.height); //BottomLeft
            if (this.center) gc.drawImage(img, this.center.x, this.center.y, this.center.width, this.center.height, x+this.left.width, y+this.top.height, width-this.left.width + 2, height-this.top.height + 2); //Center
        },

        renderCache: function(x, y, width, height) {
            if (!this.cached) {
                var c = document.createElement('canvas');
                c.width = width + this.right.width;
                c.height = height + this.bottom.height;
                var ctx = c.getContext('2d');

                this.render(ctx, 0, 0, width, height);

                this.cache = c;
                this.cached = true;
            }

            var src = this.cache.toDataURL();
            return src;
        },
    }
}
