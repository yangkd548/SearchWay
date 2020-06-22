var Dylan;
(function (Dylan) {
    var MapGraph = /** @class */ (function () {
        function MapGraph() {
            this.grids = [];
        }
        Object.defineProperty(MapGraph.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapGraph.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        MapGraph.prototype.SetMap = function (width, height, reset) {
            if (reset === void 0) { reset = false; }
            var needResetPoints = reset || this._width != width || this._height != height;
            this._width = width;
            this._height = height;
            for (var x = 0; x < width; x++) {
                if (!this.grids[x]) {
                    this.grids.push([]);
                }
                for (var y = 0; y < height; y++) {
                    if (!this.grids[x][y]) {
                        this.grids[x][y] = new Dylan.MapPoint();
                    }
                    else if (needResetPoints) {
                        this.grids[x][y].Reset();
                    }
                    this.grids[x][y].SetValue(x, y);
                }
            }
        };
        MapGraph.prototype.ResetMap = function () {
            this.SetMap(this.width, this.height, true);
        };
        MapGraph.prototype.GetNeighbors = function (origin, oppoFirst) {
            if (oppoFirst === void 0) { oppoFirst = false; }
            var parent = origin.parent;
            var result = [];
            var posArr = [[origin.x, origin.y - 1], [origin.x + 1, origin.y], [origin.x, origin.y + 1], [origin.x - 1, origin.y]];
            var length = posArr.length;
            var pointArr = [];
            for (var i = 0; i < length; i++) {
                var pos = posArr[i];
                pointArr.push(this.GetPoint(pos[0], pos[1]));
            }
            //为能够达到按照从中心点，顺时针搜索，需要从父节点开始按照顺时针进行添加，遇到障碍就停止
            var fromIndex = parent ? (pointArr.indexOf(parent) + (oppoFirst ? 2 : 0)) : 0;
            var has = false;
            for (var i = 0; i < length; i++) {
                var index = (i + fromIndex) % length;
                var point = pointArr[index];
                if (point != null) {
                    result.push(point);
                }
            }
            return result;
        };
        MapGraph.prototype.GetPoint = function (x, y) {
            if (x >= this.width || y >= this.height)
                return null;
            return this.grids[x] ? this.grids[x][y] : null;
        };
        MapGraph.prototype.Clear = function () {
            for (var x = 0; x < this.width; x++) {
                this.grids.push([]);
                for (var y = 0; y < this.height; y++) {
                    this.grids[x][y].Clear();
                }
            }
        };
        return MapGraph;
    }());
    Dylan.MapGraph = MapGraph;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=MapGraph.js.map