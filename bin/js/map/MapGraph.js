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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraph.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: false,
            configurable: true
        });
        MapGraph.prototype.SetStartPoint = function (x, y) {
            this._startPoint = this.GetPoint(x, y);
            this._startPoint.ResetWeight();
        };
        Object.defineProperty(MapGraph.prototype, "startPoint", {
            get: function () {
                return this._startPoint;
            },
            enumerable: false,
            configurable: true
        });
        MapGraph.prototype.SetEndPoint = function (x, y) {
            this._endPoint = this.GetPoint(x, y);
            this._endPoint.ResetWeight();
        };
        Object.defineProperty(MapGraph.prototype, "endPoint", {
            get: function () {
                return this._endPoint;
            },
            enumerable: false,
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
                    this.grids[x][y].SetValue(this, x, y);
                }
            }
        };
        MapGraph.prototype.Reset = function () {
            this.SetMap(this.width, this.height, true);
        };
        MapGraph.prototype.GetNeighbors = function (origin, oppoFirst) {
            if (oppoFirst === void 0) { oppoFirst = false; }
            var relativePosArr = [[origin.x, origin.y - 1], [origin.x + 1, origin.y], [origin.x, origin.y + 1], [origin.x - 1, origin.y]];
            var edges = [];
            for (var i = 0; i < relativePosArr.length; i++) {
                var pos = relativePosArr[i];
                var point = this.GetPoint(pos[0], pos[1]);
                if (point && point.weight != Infinity) {
                    edges.push(point);
                }
            }
            //这纯粹是为了栅格上的审美目的：使用棋盘格模式，翻转其他瓷砖的边缘，这样沿着对角线的路径最终会变成阶梯，而不是先做所有的东西移动，然后再做所有的南北移动（那样就变成折线路径）。
            if ((origin.x + origin.y) % 2 == 0) {
                edges.reverse();
            }
            return edges;
            //这纯粹是为了栅格上的审美目的：当前遍历的节点，整体按照顺时针顺序排列（需要从父节点开始按照顺时针进行添加，遇到障碍就停止）
            // let result: MapPoint[] = [];
            // let parent = origin.parent;
            // let fromIndex = parent ? (edges.indexOf(parent) + (oppoFirst ? 2 : 0)) : 0;
            // let has: boolean = false;
            // for (let i = 0; i < edges.length; i++) {
            //     let index = (i + fromIndex) % length;
            //     result.push(edges[index]);
            // }
            // return result;
        };
        MapGraph.prototype.GetPoint = function (x, y) {
            if (x >= this.width || y >= this.height)
                return null;
            return this.grids[x] ? this.grids[x][y] : null;
        };
        MapGraph.prototype.GetCost = function (from, to) {
            return from.cost + to.weight;
        };
        return MapGraph;
    }());
    Dylan.MapGraph = MapGraph;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=MapGraph.js.map