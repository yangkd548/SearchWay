var Dylan;
(function (Dylan) {
    var E_ClimbDir;
    (function (E_ClimbDir) {
        E_ClimbDir[E_ClimbDir["Clockwise"] = 1] = "Clockwise";
        E_ClimbDir[E_ClimbDir["None"] = 0] = "None";
        E_ClimbDir[E_ClimbDir["CounterClockwise"] = -1] = "CounterClockwise";
    })(E_ClimbDir = Dylan.E_ClimbDir || (Dylan.E_ClimbDir = {}));
    var MapPoint = /** @class */ (function () {
        function MapPoint(graph, x, y) {
            //地图MapGraph增加设置当前节点类的接口，就可以根据不同算法，使用不同的节点类了！！！
            this.climbDir = E_ClimbDir.None;
            this._x = -1;
            this._y = -1;
            //权值（权重）
            this.OriginWeight = 1;
            this._weight = this.OriginWeight;
            this.f = 0;
            this.dir = Dylan.E_MoveDir.NONE;
            this.isClimb = false;
            this._isProcess = false;
            // public CanelIsProcess():void{
            //     this.SetIsUnvisited();
            // }
            this._isVisited = false;
            this.SetValue(graph, x, y);
        }
        Object.defineProperty(MapPoint.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPoint.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPoint.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetValue = function (graph, x, y) {
            x = Math.min(graph.width - 1, Math.max(0, x));
            y = Math.min(graph.height - 1, Math.max(0, y));
            this._x = x;
            this._y = y;
            this._id = this.x + this.y * graph.width;
        };
        Object.defineProperty(MapPoint.prototype, "key", {
            get: function () {
                return this._x + "_" + this._y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPoint.prototype, "weight", {
            get: function () {
                return this._weight;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetWeight = function (weight) {
            if (weight >= 1 && this._weight <= Infinity && this._weight != weight) {
                this._weight = weight;
                return true;
            }
        };
        MapPoint.prototype.ResetWeight = function () {
            this._weight = this.OriginWeight;
        };
        Object.defineProperty(MapPoint.prototype, "preParent", {
            get: function () {
                return this._preParent;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetPreParent = function () {
            this._preParent = this.parent;
        };
        MapPoint.prototype.ResetPreParent = function () {
            this._preParent = null;
        };
        Object.defineProperty(MapPoint.prototype, "preCost", {
            get: function () {
                return this._preCost;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetPreCost = function () {
            this._preCost = this.cost;
        };
        MapPoint.prototype.ResetPreCost = function () {
            this._preCost = 0;
        };
        MapPoint.prototype.GetNextWeight = function () {
            switch (this._weight) {
                case this.OriginWeight:
                    return Infinity;
                    break;
                case Infinity:
                    return -1;
                    break;
                default:
                    return this.OriginWeight;
                    break;
            }
        };
        Object.defineProperty(MapPoint.prototype, "isProcess", {
            get: function () {
                return this._isProcess;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetIsProcess = function () {
            this._isProcess = true;
            this._isVisited = false;
        };
        Object.defineProperty(MapPoint.prototype, "isVisited", {
            get: function () {
                return this._isVisited;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetIsVisited = function () {
            this._isVisited = true;
            this._isProcess = false;
        };
        // public CanelIsVisited(): void {
        //     this.SetIsProcess();
        // }
        MapPoint.prototype.SetIsUnvisited = function () {
            this._isProcess = false;
            this._isVisited = false;
        };
        Object.defineProperty(MapPoint.prototype, "isUnvisited", {
            get: function () {
                return !this._isVisited && !this._isProcess;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.Clear = function () {
            this.cost = 0;
            this._isProcess = false;
            this._isVisited = false;
            this.parent = null;
        };
        // private ResetBase(): void {
        //     this._x = -1;
        //     this._y = -1;
        // }
        // public Reset(): void {
        //     this.Clear();
        //     this.ResetBase();
        // }
        //暂时没用到
        MapPoint.prototype.IsSamePos = function (other) {
            return other && this.x == other.x && this.y == other.y;
        };
        MapPoint.PointCostChanged = "PointCostChanged";
        return MapPoint;
    }());
    Dylan.MapPoint = MapPoint;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=MapPoint.js.map