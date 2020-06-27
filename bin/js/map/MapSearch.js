var Dylan;
(function (Dylan) {
    var E_DriveMode;
    (function (E_DriveMode) {
        E_DriveMode[E_DriveMode["Auto"] = 0] = "Auto";
        E_DriveMode[E_DriveMode["Click"] = 1] = "Click";
    })(E_DriveMode = Dylan.E_DriveMode || (Dylan.E_DriveMode = {}));
    var E_SearchType;
    (function (E_SearchType) {
        E_SearchType[E_SearchType["DFS"] = 0] = "DFS";
        E_SearchType[E_SearchType["BFS"] = 1] = "BFS";
        E_SearchType[E_SearchType["DIJKSTRA"] = 2] = "DIJKSTRA";
        E_SearchType[E_SearchType["GBFS"] = 3] = "GBFS";
        E_SearchType[E_SearchType["Astar"] = 4] = "Astar";
        E_SearchType[E_SearchType["Bstar"] = 5] = "Bstar"; //B*算法
    })(E_SearchType = Dylan.E_SearchType || (Dylan.E_SearchType = {}));
    var MapSearch = /** @class */ (function () {
        function MapSearch() {
            this.DFS = new Dylan.DfsSearch();
            this.BFS = new Dylan.BfsSearch();
            this.DIJKSTRA = new Dylan.DijkstraSearch();
            this.GBFS = new Dylan.GbfsSearch();
            this.Astar = new Dylan.AstarSearch();
            this.Bstar = new Dylan.BstarSearch();
            //驱动方式：0-间隔帧自动驱动；1-鼠标点击驱动
            this._driveMode = E_DriveMode.Auto;
            this._isPause = false;
        }
        MapSearch.prototype.SetDriveMode = function (mode) {
            this._driveMode = mode;
        };
        Object.defineProperty(MapSearch.prototype, "isPause", {
            get: function () {
                return this._isPause;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapSearch.prototype, "curSearch", {
            get: function () {
                return this._curSearch;
            },
            enumerable: false,
            configurable: true
        });
        MapSearch.prototype.SetSearchType = function (type) {
            if (this._curSearch) {
                this._curSearch.enable = false;
                Dylan.GEventMgr.Emit(MapSearch.SearchReset);
            }
            switch (type) {
                case E_SearchType.DFS:
                    this._curSearch = this.DFS;
                    break;
                case E_SearchType.BFS:
                    this._curSearch = this.BFS;
                    break;
                case E_SearchType.DIJKSTRA:
                    this._curSearch = this.DIJKSTRA;
                    break;
                case E_SearchType.GBFS:
                    this._curSearch = this.GBFS;
                    break;
                case E_SearchType.Astar:
                    this._curSearch = this.Astar;
                    break;
                case E_SearchType.Bstar:
                    this._curSearch = this.Bstar;
                    break;
            }
            this._curSearch.enable = true;
            return this._curSearch;
        };
        Object.defineProperty(MapSearch.prototype, "isInit", {
            get: function () {
                return this._curSearch.isInit;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapSearch.prototype, "isRunning", {
            get: function () {
                return this._curSearch.isRunning;
            },
            enumerable: false,
            configurable: true
        });
        MapSearch.prototype.SetMap = function (width, height) {
            this._curSearch.SetMap(width, height);
        };
        MapSearch.prototype.Reset = function () {
            this._curSearch.Reset();
            this.ClearDrive();
        };
        MapSearch.prototype.SetStartPoint = function (fromX, fromY) {
            this._curSearch.SetStart(fromX, fromY);
        };
        MapSearch.prototype.SetEndPoint = function (toX, toY) {
            this._curSearch.SetEndPoint(toX, toY);
        };
        MapSearch.prototype.GetPoint = function (x, y) {
            return this._curSearch.mapGraph.GetPoint(x, y);
        };
        MapSearch.prototype.SwitchStart = function () {
            if (this.isRunning) {
                this.Finish();
            }
            else {
                this.Start();
            }
        };
        MapSearch.prototype.SwitchPause = function () {
            if (this.isRunning) {
                if (this.isPause) {
                    this.Resume();
                }
                else {
                    this.Pause();
                }
            }
        };
        MapSearch.prototype.Start = function () {
            if (this.DoStart()) {
                this.StartDrive();
            }
        };
        MapSearch.prototype.Finish = function () {
            this.Pause();
            while (this.isRunning) {
                this.DoSearch();
            }
        };
        MapSearch.prototype.SearchSteps = function (step) {
            this._curSearch.SearchSteps(step);
        };
        MapSearch.prototype.DoStart = function () {
            if (this._curSearch.Start()) {
                Dylan.GEventMgr.Emit(MapSearch.SearchStart);
                return true;
            }
            return false;
        };
        MapSearch.prototype.Pause = function () {
            if (this._isPause || !this.isRunning)
                return;
            this._isPause = true;
            this.ClearDrive();
            Dylan.GEventMgr.Emit(MapSearch.SearchPause);
        };
        MapSearch.prototype.ClearDrive = function () {
            switch (this._driveMode) {
                case E_DriveMode.Auto:
                    Laya.timer.clearAll(this);
                    break;
                case E_DriveMode.Click:
                    Laya.stage.offAll();
                    break;
            }
        };
        MapSearch.prototype.Resume = function () {
            if (!this._isPause || !this.isRunning)
                return;
            this._isPause = false;
            this.StartDrive();
            Dylan.GEventMgr.Emit(MapSearch.SearchResume);
        };
        MapSearch.prototype.StartDrive = function () {
            switch (this._driveMode) {
                case E_DriveMode.Auto:
                    Laya.timer.frameLoop(1, this, this.DriveSearch);
                    break;
                case E_DriveMode.Click:
                    Laya.stage.on(Laya.Event.CLICK, this, this.ClickSearch);
                    break;
            }
        };
        MapSearch.prototype.DriveSearch = function () {
            this.DoSearch();
            this._curSearch.AddDriveTimes();
        };
        MapSearch.prototype.ClickSearch = function () {
            this.DoSearch();
        };
        MapSearch.prototype.DoSearch = function () {
            this._curSearch.SearchCustomSteps();
            if (!this.isRunning) {
                this.ClearDrive();
                Dylan.GEventMgr.Emit(MapSearch.SearchStop);
            }
        };
        MapSearch.prototype.SetPointWeight = function (x, y, weight) {
            this._curSearch.SetPointWeight(x, y, weight);
        };
        MapSearch.SearchStart = "SearchStart";
        MapSearch.SearchStop = "SearchStop";
        MapSearch.SearchReset = "SearchReset";
        MapSearch.SearchPause = "SearchPause";
        MapSearch.SearchResume = "SearchResume";
        return MapSearch;
    }());
    Dylan.MapSearch = MapSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=MapSearch.js.map