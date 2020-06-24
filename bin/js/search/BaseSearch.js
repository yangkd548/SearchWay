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
            this._isStarted = false;
            this._isSucc = false;
            this._step = 0;
            this._maxStep = 0;
            //驱动执行的步数：0-逐点驱动，1-逐环驱动，2-逐边驱动
            this.searchStep = E_SearchStep.None;
            //执行的次数，用于针对性给不同步数，做帧间隔设置（即设置执行速度）
            this.driveTimes = 0;
        }
        Object.defineProperty(BaseSearch.prototype, "mapGraph", {
            get: function () {
                return BaseSearch._mapGraph;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "startPoint", {
            get: function () {
                return this.mapGraph.startPoint;
            },
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        BaseSearch.prototype.SetEndPoint = function (toX, toY) {
            this.mapGraph.SetEndPoint(toX, toY);
            this.EmitReDraw();
        };
        BaseSearch.prototype.SetCurPoint = function (value) {
            this._curPoint = value;
        };
        Object.defineProperty(BaseSearch.prototype, "curPoint", {
            get: function () {
                return this._curPoint;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isStarted", {
            get: function () {
                return this._isStarted;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isRunning", {
            get: function () {
                return this._isStarted && !this.isOver && !this.isSucc;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isSucc", {
            get: function () {
                return this._isSucc;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "isInit", {
            get: function () {
                return this.mapGraph.startPoint != null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseSearch.prototype, "step", {
            get: function () {
                return this._step;
            },
            enumerable: false,
            configurable: true
        });
        BaseSearch.prototype.AddStep = function () {
            if (this.isSucc)
                return;
            this._step++;
        };
        BaseSearch.prototype.SubStep = function () {
            this._step--;
        };
        BaseSearch.prototype.SearchSteps = function (step) {
            if (this._maxStep) {
                step = Math.min(this._maxStep, step);
            }
            if (step >= this._step) {
                this.DoSearchSteps(step - this._step);
            }
            else {
                this.DoSearchToStep(step);
            }
        };
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
            enumerable: false,
            configurable: true
        });
        BaseSearch.prototype.SetMap = function (width, height, reset) {
            if (reset === void 0) { reset = false; }
            this.mapGraph.SetMap(width, height, reset);
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
        BaseSearch.prototype.DoSearchSteps = function (step) {
            if (step === void 0) { step = 1; }
            for (var i = 0; i < step; i++) {
                if (this.SearchOneStep())
                    break;
            }
        };
        BaseSearch.prototype.DoSearchToStep = function (step) {
            this.Reset();
            this.DoSearchSteps(step);
        };
        BaseSearch.prototype.SearchOneStep = function () {
            this.Start();
            if (this.isOver)
                return true;
            this.DoSearchOneStep();
            if (this.isOver)
                return true;
            return false;
        };
        BaseSearch.prototype.IsWayPoint = function (point) {
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
        BaseSearch.prototype.AddFrontierPoint = function (point) {
            point.parent = this._curPoint;
            point.SetIsProcess();
            this.CheckSucc(point);
        };
        BaseSearch.prototype.CheckSucc = function (point) {
            if (this._isSucc)
                return;
            this._isSucc = this.mapGraph.endPoint == point;
        };
        BaseSearch.prototype.SetPointWeight = function (x, y, weight) {
            var point = this.mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.startPoint || point == this.endPoint)
                    return;
                point.SetWeight(weight);
            }
        };
        BaseSearch.prototype.Reset = function () {
            this._step = 0;
            this._maxStep = 0;
            this._isSucc = false;
            this._curPoint = null;
            this.driveTimes = 0;
            this.mapGraph.Reset();
            this.EmitReDraw();
        };
        BaseSearch.SearchFinish = "SearchFinish";
        BaseSearch.SearchReDraw = "SearchReDraw";
        BaseSearch._mapGraph = new Dylan.MapGraph();
        return BaseSearch;
    }());
    Dylan.BaseSearch = BaseSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BaseSearch.js.map