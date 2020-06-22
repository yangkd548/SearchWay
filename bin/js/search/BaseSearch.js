var Dylan;
(function (Dylan) {
    var E_SearchStep;
    (function (E_SearchStep) {
        E_SearchStep[E_SearchStep["OncePoint"] = 0] = "OncePoint";
        E_SearchStep[E_SearchStep["OnceRound"] = 1] = "OnceRound";
        E_SearchStep[E_SearchStep["OnceSide"] = 2] = "OnceSide";
        E_SearchStep[E_SearchStep["OnceAll"] = 3] = "OnceAll";
    })(E_SearchStep = Dylan.E_SearchStep || (Dylan.E_SearchStep = {}));
    var BaseSearch = /** @class */ (function () {
        function BaseSearch() {
            this._mapGraph = new Dylan.MapGraph();
            this._frontier = [];
            this.fromStartDis = 0;
            //驱动执行的步数：0-逐点驱动，1-逐环驱动，2-逐边驱动
            this.searchStep = E_SearchStep.OncePoint;
            //执行的次数，用于针对性给不同步数，做帧间隔设置（即设置执行速度）
            this.driveTimes = 0;
            this._isSucc = false;
        }
        Object.defineProperty(BaseSearch.prototype, "mapGraph", {
            get: function () {
                return this._mapGraph;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "start", {
            get: function () {
                return this._start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "end", {
            get: function () {
                return this._end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "cur", {
            get: function () {
                return this._cur;
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.AddDriveTimes = function () {
            this.driveTimes++;
        };
        Object.defineProperty(BaseSearch.prototype, "enable", {
            set: function (value) {
                if (value) {
                    Dylan.GEventMgr.On(Dylan.MapPoint.PointCostChanged, this, this.EmitReDraw);
                }
                else {
                    Dylan.GEventMgr.Off(Dylan.MapPoint.PointCostChanged, this, this.EmitReDraw);
                }
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.SetMap = function (width, height, reset) {
            if (reset === void 0) { reset = false; }
            this._mapGraph.SetMap(width, height, reset);
            this.EmitReDraw();
        };
        BaseSearch.prototype.ResetMap = function () {
            this._mapGraph.ResetMap();
            this.EmitReDraw();
        };
        BaseSearch.prototype.SetStart = function (fromX, fromY) {
            this._start = this._mapGraph.GetPoint(fromX, fromY);
            this._start.ResetWeight();
            this.EmitReDraw();
        };
        BaseSearch.prototype.SetEnd = function (toX, toY) {
            this._end = this._mapGraph.GetPoint(toX, toY);
            this._end.ResetWeight();
            this.EmitReDraw();
        };
        BaseSearch.prototype.EmitReDraw = function () {
            Dylan.GEventMgr.Emit(BaseSearch.SearchReDraw, this);
        };
        BaseSearch.prototype.Start = function () {
            this.PushQueue(this._start);
            return this.isInit;
        };
        BaseSearch.prototype.SearchOnePoint = function () {
            if (this._frontier.length > 0) {
                this.DoSearchOnePoint();
            }
        };
        Object.defineProperty(BaseSearch.prototype, "isOver", {
            get: function () {
                return this._frontier.length == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isSucc", {
            get: function () {
                return this._isSucc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isInit", {
            get: function () {
                return this._start != null;
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.Clear = function () {
            // if (!this.isInit) return;
            this._isSucc = false;
            this.driveTimes = 0;
            this._frontier.splice(0);
            this._mapGraph.Clear();
            this._start = null;
            this._end = null;
            this._cur = null;
        };
        BaseSearch.prototype.IsWarPoint = function (point) {
            var warPoint = this.end;
            while (warPoint.parent) {
                if (warPoint == point) {
                    return true;
                }
                else {
                    warPoint = warPoint.parent;
                }
            }
            return false;
        };
        BaseSearch.prototype.PushQueue = function (point) {
            if (!this.isInit)
                return;
            // console.log("++++ 基准点：", point.x, point.y);
            point.parent = this._cur;
            point.SetInQueue();
            this._frontier.push(point);
        };
        BaseSearch.prototype.SetPointWeight = function (x, y, weight) {
            var point = this._mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.start || point == this.end)
                    return;
                point.SetWeight(weight);
            }
        };
        BaseSearch.SearchFinish = "SearchFinish";
        BaseSearch.SearchReDraw = "SearchReDraw";
        return BaseSearch;
    }());
    Dylan.BaseSearch = BaseSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BaseSearch.js.map