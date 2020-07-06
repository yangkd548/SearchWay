var Dylan;
(function (Dylan) {
    // 上下左右
    var E_MoveDir;
    (function (E_MoveDir) {
        E_MoveDir[E_MoveDir["NONE"] = -1] = "NONE";
        E_MoveDir[E_MoveDir["UP"] = 0] = "UP";
        E_MoveDir[E_MoveDir["RIGHT"] = 1] = "RIGHT";
        E_MoveDir[E_MoveDir["DOWN"] = 2] = "DOWN";
        E_MoveDir[E_MoveDir["LEFT"] = 3] = "LEFT";
    })(E_MoveDir = Dylan.E_MoveDir || (Dylan.E_MoveDir = {}));
    var MapGraph = /** @class */ (function () {
        function MapGraph() {
            this.grids = [];
            this.clearPointHandler = new Laya.Handler(this, function (point) { point.Clear(); }, null, false);
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
        MapGraph.prototype.SetMap = function (width, height, formatHandler) {
            if (formatHandler === void 0) { formatHandler = null; }
            var needReset = formatHandler || this._width != width || this._height != height;
            if (needReset && !formatHandler)
                formatHandler = this.clearPointHandler;
            this._width = width;
            this._height = height;
            for (var x = 0; x < width; x++) {
                if (!this.grids[x]) {
                    this.grids.push([]);
                }
                for (var y = 0; y < height; y++) {
                    var point = this.GetPoint(x, y);
                    if (!point) {
                        point = this.grids[x][y] = new Dylan.MapPoint(this, x, y);
                    }
                    if (needReset) {
                        formatHandler.runWith(point);
                    }
                }
            }
        };
        MapGraph.prototype.Clear = function () {
            this.SetMap(this.width, this.height, this.clearPointHandler);
        };
        // private resetPointHandler = new Laya.Handler(this, (point: MapPoint) => { point.Reset(); }, null, false);
        // public Reset(): void {
        //     this.SetMap(this.width, this.height, this.resetPointHandler);
        // }
        MapGraph.prototype.GetNeighbors = function (origin, oppoFirst) {
            if (oppoFirst === void 0) { oppoFirst = false; }
            var edges = [];
            for (var i = 0; i < MapGraph.relativePosArr.length; i++) {
                var pos = MapGraph.relativePosArr[i];
                var point = this.GetPoint(origin.x + pos[0], origin.y + pos[1]);
                if (!point || point == this.startPoint || point.weight == Infinity) {
                    continue;
                }
                edges.push(point);
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
        MapGraph.prototype.GetPointByDir = function (origin, dir) {
            var posArr;
            switch (dir) {
                case E_MoveDir.UP:
                    posArr = MapGraph.relativePosArr[0];
                    break;
                case E_MoveDir.RIGHT:
                    posArr = MapGraph.relativePosArr[1];
                    break;
                case E_MoveDir.DOWN:
                    posArr = MapGraph.relativePosArr[2];
                    break;
                case E_MoveDir.LEFT:
                    posArr = MapGraph.relativePosArr[3];
                    break;
                default:
                    return null;
            }
            return this.GetPoint(origin.x + posArr[0], origin.y + posArr[1]);
            ;
        };
        MapGraph.prototype.GetCost = function (from, to) {
            return (from ? from.cost : 0) + to.weight;
        };
        //常用的获取预期值的方式：曼哈顿距离
        MapGraph.prototype.GetHeuristicDis = function (point1, point2) {
            return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
        };
        //用于一次性展示所有格子的消耗
        MapGraph.prototype.SetPreCost = function () {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    this.GetPoint(x, y).SetPreCost();
                }
            }
        };
        MapGraph.prototype.ResetPreCost = function () {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    this.GetPoint(x, y).ResetPreCost();
                }
            }
        };
        MapGraph.prototype.SetPreParent = function () {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    this.GetPoint(x, y).ResetPreParent();
                }
            }
        };
        MapGraph.prototype.ResetAllWeight = function () {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    this.GetPoint(x, y).ResetWeight();
                }
            }
        };
        MapGraph.relativePosArr = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        return MapGraph;
    }());
    Dylan.MapGraph = MapGraph;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=MapGraph.js.map