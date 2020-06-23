var Dylan;
(function (Dylan) {
    var E_SearchStep;
    (function (E_SearchStep) {
        E_SearchStep[E_SearchStep["None"] = 0] = "None";
        E_SearchStep[E_SearchStep["OncePoint"] = 1] = "OncePoint";
        E_SearchStep[E_SearchStep["OnceRound"] = 2] = "OnceRound";
        E_SearchStep[E_SearchStep["OnceSide"] = 3] = "OnceSide";
        E_SearchStep[E_SearchStep["OnceAll"] = 4] = "OnceAll";
    })(E_SearchStep = Dylan.E_SearchStep || (Dylan.E_SearchStep = {}));
    var BaseSearch = /** @class */ (function () {
        function BaseSearch() {
            this.fromStartDis = 0;
            //驱动执行的步数：0-逐点驱动，1-逐环驱动，2-逐边驱动
            this.searchStep = E_SearchStep.None;
            //执行的次数，用于针对性给不同步数，做帧间隔设置（即设置执行速度）
            this.driveTimes = 0;
            this._step = 0;
            this._maxStep = 0;
            this._isStarted = false;
            this._isSucc = false;
        }
        Object.defineProperty(BaseSearch.prototype, "mapGraph", {
            get: function () {
                return BaseSearch._mapGraph;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "startPoint", {
            get: function () {
                return this.mapGraph.startPoint;
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.SetStart = function (fromX, fromY) {
            this.mapGraph.SetStartPoint(fromX, fromY);
            this.EmitReDraw();
        };
        Object.defineProperty(BaseSearch.prototype, "endPoint", {
            get: function () {
                return this.mapGraph.endPoint;
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.SetEndPoint = function (toX, toY) {
            this.mapGraph.SetEndPoint(toX, toY);
            this.EmitReDraw();
        };
        Object.defineProperty(BaseSearch.prototype, "curPoint", {
            get: function () {
                return this._curPoint;
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
                    this.Reset();
                }
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.SetMap = function (width, height, reset) {
            if (reset === void 0) { reset = false; }
            this.mapGraph.SetMap(width, height, reset);
            this.EmitReDraw();
        };
        BaseSearch.prototype.Reset = function () {
            this._maxStep = 0;
            this._isSucc = false;
            this._curPoint = null;
            this.driveTimes = 0;
            this.mapGraph.Reset();
            this.EmitReDraw();
        };
        BaseSearch.prototype.EmitReDraw = function () {
            Dylan.GEventMgr.Emit(BaseSearch.SearchReDraw, this);
        };
        BaseSearch.prototype.Start = function () {
            if (!this.isRunning && this.isInit) {
                this._isStarted = true;
                return true;
            }
            return false;
        };
        //TODO:考虑一下，如何组织这个方法
        BaseSearch.prototype.AutoSearch = function () {
            this.DoSearchSteps();
        };
        Object.defineProperty(BaseSearch.prototype, "step", {
            set: function (value) {
                this._step = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.SearchSteps = function (step) {
            if (this._maxStep) {
                console.log("原始：", step, " MAX:", this._maxStep);
                step = Math.min(this._maxStep, step);
                console.log("调整：", step);
            }
            this.DoSearchSteps(step - this._step);
        };
        BaseSearch.prototype.DoSearchSteps = function (step) {
            if (step === void 0) { step = 1; }
            var count = Math.abs(step);
            console.log("000 ----" + count + "\u6267\u884C +++\uFF1A", step, "  当前步骤：", this._step);
            for (var i = 0; i < count; i++) {
                if (step > 0) {
                    this.Start();
                    if (this.isOver)
                        break;
                    this.SearchOneStep();
                    if (this.isOver)
                        break;
                }
                else {
                    // console.log("this._isStarted: ", this._isStarted);
                    if (!this._isStarted)
                        break;
                    this.FallBackOneStep();
                    console.log("回退---------");
                    if (!this._isStarted)
                        break;
                }
            }
            console.log("111 ----" + count + "\u6267\u884C +++\uFF1A", step, "  当前步骤：", this._step);
        };
        Object.defineProperty(BaseSearch.prototype, "isStarted", {
            get: function () {
                return this._isStarted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isRunning", {
            get: function () {
                return this._isStarted && !this.isOver && !this.isSucc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isSucc", {
            get: function () {
                return this._isSucc && this._step >= this._maxStep;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isInit", {
            get: function () {
                return this.mapGraph.startPoint != null;
            },
            enumerable: true,
            configurable: true
        });
        BaseSearch.prototype.IsWarPoint = function (point) {
            if (!this.isSucc)
                return false;
            var warPoint = this.endPoint;
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
        BaseSearch.prototype.ProcessAddChildPoint = function (point) {
            point.parent = this._curPoint;
            point.SetIsProcess();
        };
        BaseSearch.prototype.CheckSucc = function (point) {
            this._isSucc = this.mapGraph.endPoint == point;
        };
        BaseSearch.prototype.ProcessTailUnvisited = function (point) {
            //父子关系，还要利用，不能置空
            // point.parent = null;
            point.SetIsUnvisited();
        };
        BaseSearch.prototype.CheckFallOrigin = function (point) {
            this._isStarted = !(this.mapGraph.startPoint == point);
            return this._isStarted;
        };
        BaseSearch.prototype.SetPointWeight = function (x, y, weight) {
            var point = this.mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.startPoint || point == this.endPoint)
                    return;
                point.SetWeight(weight);
            }
        };
        BaseSearch.SearchFinish = "SearchFinish";
        BaseSearch.SearchReDraw = "SearchReDraw";
        BaseSearch._mapGraph = new Dylan.MapGraph();
        return BaseSearch;
    }());
    Dylan.BaseSearch = BaseSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BaseSearch.js.map