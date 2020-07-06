var Dylan;
(function (Dylan) {
    var E_ClimbRot;
    (function (E_ClimbRot) {
        E_ClimbRot[E_ClimbRot["Clockwise"] = 1] = "Clockwise";
        E_ClimbRot[E_ClimbRot["None"] = 0] = "None";
        E_ClimbRot[E_ClimbRot["NoClockwise"] = -1] = "NoClockwise";
    })(E_ClimbRot = Dylan.E_ClimbRot || (Dylan.E_ClimbRot = {}));
    var MapPoint = /** @class */ (function () {
        function MapPoint(graph, x, y) {
            this.isRollBack = false;
            this.rollCount = 0;
            this._climbRot = E_ClimbRot.None;
            this._x = -1;
            this._y = -1;
            //权值（权重）
            this.OriginWeight = 1;
            this._weight = this.OriginWeight;
            //启发式，预期值（预计剩余路程）
            this.heuristic = 0;
            this.f = 0;
            //当前点的爬行方向，如果比原始方向-1或+1，则为可自由状态
            //如果可自由状态，再次-1或+1，仍是可自由状态
            //+1或-1，变为原方向，则关闭
            this._canFree = false;
            this._curClimbDir = Dylan.E_MoveDir.NONE;
            this.forwardDir = Dylan.E_MoveDir.NONE;
            this._isClimb = false;
            this._isProcess = false;
            // public CanelIsProcess():void{
            //     this.SetIsUnvisited();
            // }
            this._isClosed = false;
            this.SetValue(graph, x, y);
        }
        MapPoint.GetFormatDir = function (dir) {
            dir = dir % 4;
            if (dir < 0)
                dir += 4;
            return dir;
        };
        Object.defineProperty(MapPoint.prototype, "climbRot", {
            get: function () {
                return this._climbRot;
            },
            set: function (value) {
                this._climbRot = value;
            },
            enumerable: false,
            configurable: true
        });
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
        Object.defineProperty(MapPoint.prototype, "canFree", {
            get: function () {
                return this._canFree;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPoint.prototype, "curClimbDir", {
            get: function () {
                return this._curClimbDir;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetCurClimbDir = function (value) {
            this._curClimbDir = MapPoint.GetFormatDir(value);
            if (this.parent.canFree) {
                if (this.curClimbDir == MapPoint.GetFormatDir(this.branch.curClimbDir + (this.climbRot == E_ClimbRot.Clockwise ? -1 : 1))) {
                    this._canFree = false;
                }
            }
            else {
                if (this.curClimbDir == MapPoint.GetFormatDir(this.branch.curClimbDir - (this.climbRot == E_ClimbRot.Clockwise ? -1 : 1))) {
                    this._canFree = true;
                }
            }
        };
        Object.defineProperty(MapPoint.prototype, "isClimb", {
            get: function () {
                return this._isClimb;
            },
            set: function (value) {
                this._isClimb = value;
                if (!value) {
                    this.climbRot = E_ClimbRot.None;
                }
            },
            enumerable: false,
            configurable: true
        });
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
            this._isClosed = false;
        };
        Object.defineProperty(MapPoint.prototype, "isClosed", {
            get: function () {
                return this._isClosed;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.SetIsClosed = function () {
            this._isClosed = true;
            this._isProcess = false;
        };
        Object.defineProperty(MapPoint.prototype, "isOpened", {
            // public CanelIsVisited(): void {
            //     this.SetIsProcess();
            // }
            // public SetIsOpened(): void {
            //     this._isProcess = false;
            //     this._isClosed = false;
            // }
            get: function () {
                return !this._isClosed && !this._isProcess;
            },
            enumerable: false,
            configurable: true
        });
        MapPoint.prototype.Clear = function () {
            this._isProcess = false;
            this._isClosed = false;
            this.parent = null;
            this.cost = 0;
            this.isClimb = false;
            this.forwardDir = null;
            this.root = null;
            this.heuristic = 0;
            this.f = 0;
            this._climbRot = E_ClimbRot.None;
            this.isRollBack = false;
            this.rollCount = 0;
            this._canFree = false;
            this._curClimbDir = Dylan.E_MoveDir.NONE;
            this.branch = null;
            //不用在这里重置的变量
            /**
             * this._x
             * this._y
             * this._id
             * this._preCost
             * this._preParent
             * this._weight
             */
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