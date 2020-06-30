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
            this._curPreprocessInfo = false;
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
        BaseSearch.prototype.EmitReDraw = function () {
            Dylan.GEventMgr.Emit(BaseSearch.SearchReDraw, this);
        };
        BaseSearch.prototype.SetMap = function (width, height) {
            this.mapGraph.SetMap(width, height);
            this.EmitReDraw();
        };
        Object.defineProperty(BaseSearch.prototype, "isPreprocessInfo", {
            get: function () {
                return BaseSearch._isPreprocessInfo;
            },
            set: function (value) {
                BaseSearch._isPreprocessInfo = value;
                if (value) {
                    this.DoPreprocessInfo();
                }
                else {
                    this.mapGraph.ResetPreCost();
                }
            },
            enumerable: false,
            configurable: true
        });
        //尝试 不考虑终点，遍历地图
        BaseSearch.prototype.DoPreprocessInfo = function () {
            if (BaseSearch._isPreprocessInfo) {
                this._curPreprocessInfo = true;
                this.Start();
                while (this.isRunning) {
                    this.DoSearchOneStep();
                }
                this.mapGraph.SetPreCost();
                this.Clear();
            }
        };
        Object.defineProperty(BaseSearch.prototype, "startPoint", {
            get: function () {
                return this.mapGraph.startPoint;
            },
            enumerable: false,
            configurable: true
        });
        BaseSearch.prototype.SetStart = function (fromX, fromY) {
            this.mapGraph.SetStartPoint(fromX, fromY);
            this.DoPreprocessInfo();
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
            //只允许被继承的一种写法，同类修饰符abstract
            // protected constructor() { }
            set: function (value) {
                if (value) {
                    Dylan.GEventMgr.On(Dylan.MapPoint.PointCostChanged, this, this.EmitReDraw);
                }
                else {
                    Dylan.GEventMgr.Off(Dylan.MapPoint.PointCostChanged, this, this.EmitReDraw);
                    this.Clear();
                }
            },
            enumerable: false,
            configurable: true
        });
        BaseSearch.prototype.Start = function () {
            if (!this.isRunning && this.isInit) {
                this._isStarted = true;
                return true;
            }
            return false;
        };
        // public abstract SearchCustomSteps(): void;
        BaseSearch.prototype.DoSearchSteps = function (step) {
            if (step === void 0) { step = 1; }
            for (var i = 0; i < step; i++) {
                if (!this.SearchOneStep())
                    break;
            }
        };
        BaseSearch.prototype.DoSearchToStep = function (step) {
            this.Clear();
            this.DoSearchSteps(step);
        };
        BaseSearch.prototype.SearchOneStep = function () {
            this.Start();
            if (!this.isRunning)
                return false;
            this.DoSearchOneStep();
            this.EmitReDraw();
            if (!this.isRunning)
                return false;
            return true;
        };
        BaseSearch.prototype.IsWayPoint = function (cur, end) {
            if (end === void 0) { end = null; }
            if (!this.isSucc)
                return false;
            if (cur == this.startPoint)
                return true;
            var wayPoint = end || this.endPoint;
            while (wayPoint.parent) {
                if (wayPoint == cur) {
                    return true;
                }
                else {
                    wayPoint = wayPoint.parent;
                }
            }
            return false;
        };
        BaseSearch.prototype.AddFrontierPoint = function (point) {
            this.CheckSucc(point);
            if (this.isSucc)
                return;
            if (point != this.startPoint) {
                point.parent = this._curPoint;
            }
            point.SetIsProcess();
        };
        BaseSearch.prototype.CheckSucc = function (point) {
            if (this._curPreprocessInfo || this._isSucc)
                return;
            this._isSucc = this.mapGraph.endPoint == point;
        };
        BaseSearch.prototype.SetPointWeight = function (x, y, weight) {
            var point = this.mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.startPoint || point == this.endPoint)
                    return;
                if (point.SetWeight(weight)) {
                    this.DoPreprocessInfo();
                    this.EmitReDraw();
                }
            }
        };
        BaseSearch.prototype.ResetAllWeight = function () {
            this.mapGraph.ResetAllWeight();
            this.DoPreprocessInfo();
            this.EmitReDraw();
        };
        BaseSearch.prototype.Clear = function () {
            this._curPreprocessInfo = false;
            this._step = 0;
            this._maxStep = 0;
            this._isSucc = false;
            this._curPoint = null;
            this.driveTimes = 0;
            this.mapGraph.Clear();
            this.EmitReDraw();
        };
        BaseSearch.SearchFinish = "SearchFinish";
        BaseSearch.SearchReDraw = "SearchReDraw";
        BaseSearch._mapGraph = new Dylan.MapGraph();
        //算法之外的设置，应该是静态变量
        BaseSearch._isPreprocessInfo = false;
        return BaseSearch;
    }());
    Dylan.BaseSearch = BaseSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BaseSearch.js.map