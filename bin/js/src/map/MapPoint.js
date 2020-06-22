var Dylan;
(function (Dylan) {
    var MapPoint = /** @class */ (function () {
        function MapPoint() {
            //权值（权重）
            this.OriginWeight = 1;
            this._weight = this.OriginWeight;
            this._inQueue = false;
            this._isVisited = false;
        }
        Object.defineProperty(MapPoint.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapPoint.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapPoint.prototype, "weight", {
            get: function () {
                return this._weight;
            },
            enumerable: true,
            configurable: true
        });
        MapPoint.prototype.SetWeight = function (weight) {
            if (weight >= 1 && this._weight <= Number.MAX_VALUE) {
                this._weight = weight;
                Dylan.GEventMgr.Emit(MapPoint.PointCostChanged);
            }
        };
        MapPoint.prototype.ResetWeight = function () {
            this._weight = this.OriginWeight;
        };
        MapPoint.prototype.GetNextWeight = function () {
            switch (this._weight) {
                case this.OriginWeight:
                    return Number.MAX_VALUE;
                    break;
                case Number.MAX_VALUE:
                    return -1;
                    break;
                default:
                    return this.OriginWeight;
                    break;
            }
        };
        Object.defineProperty(MapPoint.prototype, "inQueue", {
            get: function () {
                return this._inQueue;
            },
            enumerable: true,
            configurable: true
        });
        MapPoint.prototype.SetInQueue = function () {
            this._inQueue = true;
            this._isVisited = false;
        };
        Object.defineProperty(MapPoint.prototype, "isVisited", {
            get: function () {
                return this._isVisited;
            },
            enumerable: true,
            configurable: true
        });
        MapPoint.prototype.SetIsVisited = function () {
            this._isVisited = true;
            this._inQueue = false;
        };
        Object.defineProperty(MapPoint.prototype, "isUnvisited", {
            get: function () {
                return !this.isVisited && !this._inQueue;
            },
            enumerable: true,
            configurable: true
        });
        MapPoint.prototype.SetValue = function (x, y, weight) {
            if (weight === void 0) { weight = 1; }
            this._x = x;
            this._y = y;
            this._weight = weight;
        };
        Object.defineProperty(MapPoint.prototype, "key", {
            get: function () {
                return this._x + "_" + this._y;
            },
            enumerable: true,
            configurable: true
        });
        // private _cost:number = 1;
        // public get cost():number{
        //     return this._cost;
        // }
        MapPoint.prototype.Clear = function () {
            this.SetValue(-1, -1, this.weight);
            this._inQueue = false;
            this._isVisited = false;
            this.parent = null;
        };
        MapPoint.prototype.Reset = function () {
            this._weight = this.OriginWeight;
            this.Clear();
        };
        MapPoint.PointCostChanged = "PointCostChanged";
        return MapPoint;
    }());
    Dylan.MapPoint = MapPoint;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=MapPoint.js.map