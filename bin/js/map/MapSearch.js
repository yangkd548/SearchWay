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
            this._searchType = E_SearchType.DFS;
            this.curSearch = this.SetSearchType();
            this._step = 0;
        }
        MapSearch.prototype.SetDriveMode = function (mode) {
            this._driveMode = mode;
        };
        Object.defineProperty(MapSearch.prototype, "driveMode", {
            get: function () {
                return this._driveMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSearch.prototype, "isPause", {
            get: function () {
                return this._isPause;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSearch.prototype, "searchType", {
            get: function () {
                return this._searchType;
            },
            enumerable: true,
            configurable: true
        });
        MapSearch.prototype.SetSearchType = function (type) {
            if (type === void 0) { type = this.searchType; }
            if (this.curSearch) {
                this.curSearch.enable = false;
            }
            switch (type) {
                case E_SearchType.DFS:
                    this.curSearch = this.DFS;
                    break;
                case E_SearchType.BFS:
                    this.curSearch = this.BFS;
                    break;
                case E_SearchType.DIJKSTRA:
                    this.curSearch = this.DIJKSTRA;
                    break;
                case E_SearchType.GBFS:
                    this.curSearch = this.GBFS;
                    break;
                case E_SearchType.Astar:
                    this.curSearch = this.Astar;
                    break;
                case E_SearchType.Bstar:
                    this.curSearch = this.Bstar;
                    break;
            }
            this.curSearch.enable = true;
            return this.curSearch;
        };
        Object.defineProperty(MapSearch.prototype, "isInit", {
            get: function () {
                return this.curSearch.isInit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSearch.prototype, "isRunning", {
            get: function () {
                return !this.curSearch.isOver;
            },
            enumerable: true,
            configurable: true
        });
        MapSearch.prototype.SetMap = function (width, height) {
            this.curSearch.SetMap(width, height);
        };
        MapSearch.prototype.ResetMap = function () {
            this.curSearch.ResetMap();
        };
        MapSearch.prototype.SetStartPoint = function (fromX, fromY) {
            this.curSearch.SetStart(fromX, fromY);
        };
        MapSearch.prototype.SetEndPoint = function (toX, toY) {
            this.curSearch.SetEnd(toX, toY);
        };
        MapSearch.prototype.GetPoint = function (x, y) {
            return this.curSearch.mapGraph.GetPoint(x, y);
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
            if (this.curSearch.Start()) {
                this.StartDrive();
                Dylan.GEventMgr.Emit(MapSearch.SearchStart);
            }
        };
        MapSearch.prototype.Finish = function () {
            this.Pause();
            while (!this.curSearch.isOver) {
                this.curSearch.DoSearch();
            }
            this.Clear();
        };
        MapSearch.prototype.PlayBySlider = function (step) {
            for (var i = this._step; i < step; i++) {
                this.curSearch.DoSearch();
            }
        };
        MapSearch.prototype.Pause = function () {
            if (this._isPause || !this.isRunning)
                return;
            this._isPause = true;
            switch (this._driveMode) {
                case E_DriveMode.Auto:
                    Laya.timer.clearAll(this);
                    break;
                case E_DriveMode.Click:
                    Laya.stage.offAll();
                    break;
            }
            Dylan.GEventMgr.Emit(MapSearch.SearchPause);
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
            this.curSearch.AddDriveTimes();
            if (this.curSearch.isOver) {
                this.Clear();
                Laya.timer.clear(this, this.DriveSearch);
            }
        };
        MapSearch.prototype.ClickSearch = function () {
            this.DoSearch();
            if (this.curSearch.isOver) {
                this.Clear();
                Laya.stage.off(Laya.Event.CLICK, this, this.ClickSearch);
            }
        };
        MapSearch.prototype.DoSearch = function () {
            this.curSearch.DoSearch();
        };
        MapSearch.prototype.SetPointWeight = function (x, y, weight) {
            this.curSearch.SetPointWeight(x, y, weight);
        };
        MapSearch.prototype.Clear = function () {
            // if (!this.curSearch.isInit) return;
            this.curSearch.Clear();
            Dylan.GEventMgr.Emit(MapSearch.SearchStop);
        };
        MapSearch.SearchStart = "SearchStart";
        MapSearch.SearchStop = "SearchStop";
        MapSearch.SearchPause = "SearchPause";
        MapSearch.SearchResume = "SearchResume";
        return MapSearch;
    }());
    Dylan.MapSearch = MapSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=MapSearch.js.map