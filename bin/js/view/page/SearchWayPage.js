var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dylan;
(function (Dylan) {
    var Handler = Laya.Handler;
    var EditPointType;
    (function (EditPointType) {
        EditPointType[EditPointType["None"] = 0] = "None";
        EditPointType[EditPointType["Start"] = 1] = "Start";
        EditPointType[EditPointType["End"] = 2] = "End";
    })(EditPointType || (EditPointType = {}));
    var SearchWayPage = /** @class */ (function (_super) {
        __extends(SearchWayPage, _super);
        function SearchWayPage() {
            var _this = _super.call(this) || this;
            _this.GridWidth = 20;
            _this.GridHeight = 20;
            _this.LineColor = "#ffffff";
            _this.LineWidth = 1;
            _this.GridColorVisited = "#ffff00";
            _this.GridColorCur = "#ff00ff";
            _this.GridColorInQueue = "#aabbcc";
            _this.GridColorWay = "#ffc0cb";
            _this.GridColorStart = "#ff0000";
            _this.GridColorEnd = "#00ff00";
            _this.GridColorNoVisited_1 = "#ffffff";
            _this.GridColorNoVisited_Max = "#000000";
            _this.GridColorNoVisited_weight = "#888888";
            _this.defaultWeightValue = 1;
            _this.invalidPos = new Laya.Vector2(-1, -1);
            _this.lastEditWeightPos = new Laya.Vector2();
            _this.curEditWeightPos = new Laya.Vector2();
            _this.curEditPoint = EditPointType.None;
            _this.isShowNeighbors = false;
            //设置页面宽度，才能保证大页面所有区域都响应鼠标事件
            _this.width = Laya.stage.width;
            _this.height = Laya.stage.height;
            _this.functionTab.selectHandler = new Handler(_this, _this.OnSelectFunctionTab, [_this.functionTab]);
            //基础 设置页
            _this.mapWidth.on(Laya.Event.ENTER, _this, _this.OnSetMapRange, [_this.mapWidth]);
            _this.mapHeight.on(Laya.Event.ENTER, _this, _this.OnSetMapRange, [_this.mapHeight]);
            _this.startX.on(Laya.Event.ENTER, _this, _this.OnSetMapStartPoint, [_this.startX]);
            _this.startY.on(Laya.Event.ENTER, _this, _this.OnSetMapStartPoint, [_this.startY]);
            _this.endX.on(Laya.Event.ENTER, _this, _this.OnSetMapEndPoint, [_this.endX]);
            _this.endY.on(Laya.Event.ENTER, _this, _this.OnSetMapEndPoint, [_this.endY]);
            _this.mapWidth.on(Laya.Event.BLUR, _this, _this.OnSetMapRange, [_this.mapWidth]);
            _this.mapHeight.on(Laya.Event.BLUR, _this, _this.OnSetMapRange, [_this.mapHeight]);
            _this.startX.on(Laya.Event.BLUR, _this, _this.OnSetMapStartPoint, [_this.startX]);
            _this.startY.on(Laya.Event.BLUR, _this, _this.OnSetMapStartPoint, [_this.startY]);
            _this.endX.on(Laya.Event.BLUR, _this, _this.OnSetMapEndPoint, [_this.endX]);
            _this.endY.on(Laya.Event.BLUR, _this, _this.OnSetMapEndPoint, [_this.endY]);
            _this.startX.on(Laya.Event.FOCUS, _this, _this.OnSetEditStart, [_this.startX]);
            _this.startY.on(Laya.Event.FOCUS, _this, _this.OnSetEditStart, [_this.startY]);
            _this.endX.on(Laya.Event.FOCUS, _this, _this.OnSetEditEnd, [_this.endX]);
            _this.endY.on(Laya.Event.FOCUS, _this, _this.OnSetEditEnd, [_this.endY]);
            _this.mapSp.on(Laya.Event.RIGHT_CLICK, _this, _this.OnEditSpePoint, [true]);
            //通行成本 设置页
            _this.mapSp.on(Laya.Event.MOUSE_DOWN, _this, _this.OnEnableEditWeight);
            _this.mapSp.on(Laya.Event.MOUSE_UP, _this, _this.OnDisableEditWeight);
            _this.costRadioGroup.selectHandler = new Laya.Handler(_this, _this.OnSelectCostRadioGroup);
            _this.resetWeightBtn.on(Laya.Event.CLICK, _this, _this.Reset);
            //运行 设置页
            _this.driveCombo.selectHandler = new Handler(_this, _this.OnSelectDriveCombo, [_this.driveCombo]);
            _this.searchCombo.selectHandler = new Handler(_this, _this.OnSelectSearchCombo, [_this.searchCombo]);
            _this.stepCombo.selectHandler = new Handler(_this, _this.OnSelectStepCombo, [_this.stepCombo]);
            _this.isPreprocessCheck.clickHandler = new Handler(_this, _this.OnSetPreprocessCheck, [_this.isPreprocessCheck]);
            _this.showDirCheck.clickHandler = new Handler(_this, _this.OnShowDirCheck, [_this.showDirCheck]);
            _this.showCostCheck.clickHandler = new Handler(_this, _this.OnShowCostCheck, [_this.showCostCheck]);
            _this.showNeighborsCheck.clickHandler = new Handler(_this, _this.OnShowNeighborsCheck, [_this.showNeighborsCheck]);
            _this.startBtn.on(Laya.Event.CLICK, _this, _this.OnSwitchStart);
            _this.pauseBtn.on(Laya.Event.CLICK, _this, _this.OnSwitchPause);
            _this.clearBtn.on(Laya.Event.CLICK, _this, _this.OnClearMap);
            _this.resetBtn.on(Laya.Event.CLICK, _this, _this.Reset);
            //长显示组件
            _this.slider.changeHandler = new Laya.Handler(_this, _this.OnSliderChange);
            _this.scroll.changeHandler = new Laya.Handler(_this, _this.OnSliderChange);
            //运行反馈 监听
            Dylan.GEventMgr.On(Dylan.MapSearch.SearchStart, _this, _this.OnSearchStart);
            Dylan.GEventMgr.On(Dylan.MapSearch.SearchStop, _this, _this.OnSearchStop);
            Dylan.GEventMgr.On(Dylan.MapSearch.SearchReset, _this, _this.OnSearchReset);
            Dylan.GEventMgr.On(Dylan.MapSearch.SearchPause, _this, _this.OnSearchPause);
            Dylan.GEventMgr.On(Dylan.MapSearch.SearchResume, _this, _this.OnSearchResume);
            Dylan.GEventMgr.On(Dylan.BaseSearch.SearchReDraw, _this, _this.ReDrawMap);
            return _this;
        }
        SearchWayPage.prototype.OnAddStage = function (args) {
            //默认显示
            this.functionTab.selectedIndex = 2;
            //由此页面，设置搜索配置（如果多个页面的话，还是得MapSearch类提供获取当前配置的public接口）
            this.driveCombo.selectedIndex = Dylan.E_DriveMode.Auto;
            this.searchCombo.selectedIndex = Dylan.E_SearchType.Astar;
            this.startBtn.text.text = "开始";
            this.startBtn.disabled = true;
            this.pauseBtn.text.text = "暂停";
            this.pauseBtn.disabled = true;
            this.OnSetMapRange();
            this.OnSetMapStartPoint();
            this.OnSetMapEndPoint();
            this.ResetSearch();
        };
        SearchWayPage.prototype.OnRemoveStage = function () { };
        SearchWayPage.prototype.OnSelectFunctionTab = function (tab) {
            switch (tab.selectedIndex) {
                case 0:
                    this.baseSetBox.visible = true;
                    this.gridSetBox.visible = false;
                    this.testBox.visible = false;
                    break;
                case 1:
                    this.baseSetBox.visible = false;
                    this.gridSetBox.visible = true;
                    this.testBox.visible = false;
                    break;
                case 2:
                    this.baseSetBox.visible = false;
                    this.gridSetBox.visible = false;
                    this.testBox.visible = true;
                    break;
            }
        };
        SearchWayPage.prototype.OnSetMapRange = function () {
            if (!isNaN(Number(this.mapWidth.text)) && !isNaN(Number(this.mapHeight.text))) {
                var nMapWidth = Number(this.mapWidth.text);
                var nMapHeight = Number(this.mapHeight.text);
                Dylan.GMapSearch.SetMap(nMapWidth, nMapHeight);
                this.mapSp.width = this.GridWidth * nMapWidth;
                this.mapSp.height = this.GridHeight * nMapHeight;
                var parent_1 = this.mapSp.parent;
                this.mapSp.x = (parent_1.width - this.mapSp.width) / 2;
                this.mapSp.y = (parent_1.height - this.mapSp.height) / 2 - 30;
                var max = nMapWidth * nMapHeight;
                this.slider.y = this.mapSp.y + this.mapSp.height + 30;
                this.slider.width = Math.min(360, Math.max(200, this.mapSp.width - 40));
                // this.slider.max = nMapWidth * nMapHeight;
                // this.slider.value = this.slider.min = 0;
                this.slider.setSlider(0, nMapWidth * nMapHeight, 0);
                this.slider.tick = 1;
                this.scroll.x = this.slider.x;
                this.scroll.y = this.slider.y + 40;
                this.scroll.width = this.slider.width;
                this.scroll.setScroll(0, max, 0);
                this.scroll.tick = 1;
            }
        };
        SearchWayPage.prototype.OnSetMapStartPoint = function () {
            if (!isNaN(Number(this.startX.text)) && !isNaN(Number(this.startY.text))) {
                Dylan.GMapSearch.SetStartPoint(Number(this.startX.text), Number(this.startY.text));
            }
        };
        SearchWayPage.prototype.OnSetMapEndPoint = function () {
            if (!isNaN(Number(this.endX.text)) && !isNaN(Number(this.endY.text))) {
                Dylan.GMapSearch.SetEndPoint(Number(this.endX.text), Number(this.endY.text));
            }
        };
        SearchWayPage.prototype.OnSetEditStart = function () {
            this.curEditPoint = EditPointType.Start;
        };
        SearchWayPage.prototype.OnSetEditEnd = function () {
            this.curEditPoint = EditPointType.End;
        };
        SearchWayPage.prototype.OnEditSpePoint = function (isAutoSwitch) {
            if (isAutoSwitch === void 0) { isAutoSwitch = false; }
            var vec2 = this.GetClickMapSpPoint();
            if (vec2) {
                switch (this.curEditPoint) {
                    case EditPointType.None:
                    case EditPointType.Start:
                        this.startX.text = vec2.x.toString();
                        this.startY.text = vec2.y.toString();
                        Dylan.GMapSearch.SetStartPoint(vec2.x, vec2.y);
                        if (isAutoSwitch == true) {
                            this.curEditPoint = EditPointType.End;
                        }
                        break;
                    case EditPointType.End:
                        this.endX.text = vec2.x.toString();
                        this.endY.text = vec2.y.toString();
                        Dylan.GMapSearch.SetEndPoint(vec2.x, vec2.y);
                        if (isAutoSwitch == true) {
                            this.curEditPoint = EditPointType.Start;
                        }
                        break;
                }
            }
        };
        //左键点击，设置通行权值
        //或
        //左键点击，设置起点或终点，仅支持拖动
        SearchWayPage.prototype.OnEnableEditWeight = function () {
            if (Dylan.GMapSearch.isRunning)
                return;
            var vec2 = this.GetClickMapSpPoint();
            if (vec2) {
                var point = Dylan.GMapSearch.GetPoint(vec2.x, vec2.y);
                if (point == Dylan.GMapSearch.curSearch.startPoint) {
                    this.curEditPoint = EditPointType.Start;
                    this.mapSp.on(Laya.Event.MOUSE_MOVE, this, this.OnEditSpePoint);
                }
                else if (point == Dylan.GMapSearch.curSearch.endPoint) {
                    this.curEditPoint = EditPointType.End;
                    this.mapSp.on(Laya.Event.MOUSE_MOVE, this, this.OnEditSpePoint);
                }
                else {
                    this.curSetWeight = point.GetNextWeight();
                    if (this.curSetWeight == -1) {
                        this.curSetWeight = this.defaultWeightValue;
                    }
                    this.OnEditWeight();
                    this.mapSp.on(Laya.Event.MOUSE_MOVE, this, this.OnEditWeight);
                }
            }
        };
        SearchWayPage.prototype.OnDisableEditWeight = function () {
            Dylan.CopyVec2(this.lastEditWeightPos, this.invalidPos);
            this.mapSp.off(Laya.Event.MOUSE_MOVE, this, this.OnEditWeight);
            this.curEditPoint = EditPointType.None;
            this.mapSp.off(Laya.Event.MOUSE_MOVE, this, this.OnEditSpePoint);
        };
        SearchWayPage.prototype.OnEditWeight = function () {
            var vec2 = this.GetClickMapSpPoint();
            if (vec2) {
                if (Dylan.Vec2Equal(this.lastEditWeightPos, this.invalidPos) || !Dylan.Vec2Equal(this.lastEditWeightPos, vec2)) {
                    Dylan.CopyVec2(this.lastEditWeightPos, vec2);
                    Dylan.GMapSearch.SetPointWeight(vec2.x, vec2.y, this.curSetWeight);
                    return vec2;
                }
            }
            return null;
        };
        SearchWayPage.prototype.GetClickMapSpPoint = function () {
            // if (this.mapSp.mouseX % this.GridWidth % (this.GridWidth - 1) && this.mapSp.mouseY % this.GridHeight % (this.GridHeight - 1)) {
            this.curEditWeightPos.x = Math.floor(this.mapSp.mouseX / this.GridWidth);
            this.curEditWeightPos.y = Math.floor(this.mapSp.mouseY / this.GridHeight);
            return this.curEditWeightPos;
            // }
            // return null;
        };
        SearchWayPage.prototype.OnSelectCostRadioGroup = function (index) {
            this.defaultWeightValue = index + 1;
        };
        SearchWayPage.prototype.OnSliderChange = function (value) {
            Dylan.GMapSearch.SearchSteps(value);
        };
        //重置寻路数据
        SearchWayPage.prototype.Clear = function () {
            Dylan.GMapSearch.Clear();
            this.ResetSearch();
        };
        //重置寻路数据（包含重置权值）
        SearchWayPage.prototype.Reset = function () {
            Dylan.GMapSearch.Reset();
            this.ResetSearch();
        };
        SearchWayPage.prototype.ResetSearch = function () {
            this.OnSearchStop();
            this.startBtn.disabled = false;
        };
        SearchWayPage.prototype.OnSelectDriveCombo = function (cb) {
            Dylan.GMapSearch.SetDriveMode(cb.selectedIndex);
        };
        SearchWayPage.prototype.OnSelectSearchCombo = function (cb) {
            Dylan.GMapSearch.SetSearchType(cb.selectedIndex);
        };
        SearchWayPage.prototype.OnSelectStepCombo = function (cb) {
            // GMapSearch.SetSearchType(cb.selectedIndex);
        };
        SearchWayPage.prototype.OnSetPreprocessCheck = function () {
            Dylan.GMapSearch.curSearch.isPreprocessInfo = this.isPreprocessCheck.selected;
            this.ReDrawMap();
        };
        SearchWayPage.prototype.OnShowDirCheck = function () {
            this.ReDrawMap();
        };
        SearchWayPage.prototype.OnShowCostCheck = function () {
            this.ReDrawMap();
        };
        SearchWayPage.prototype.OnShowNeighborsCheck = function () {
            this.isShowNeighbors;
        };
        SearchWayPage.prototype.OnClearMap = function () {
            this.Clear();
            Dylan.GTipsMgr.Show("设置完成！", 1);
        };
        SearchWayPage.prototype.OnSwitchStart = function () {
            Dylan.GMapSearch.SwitchStart();
        };
        SearchWayPage.prototype.OnSwitchPause = function () {
            Dylan.GMapSearch.SwitchPause();
        };
        SearchWayPage.prototype.OnSearchStart = function () {
            this.startBtn.text.text = "停止";
            this.startBtn.disabled = false;
            this.pauseBtn.text.text = "暂停";
            this.pauseBtn.disabled = false;
            this.mapSp.mouseThrough = true;
            this.OnDisableEditWeight();
        };
        SearchWayPage.prototype.OnSearchStop = function () {
            this.startBtn.text.text = "开始";
            this.startBtn.disabled = true;
            this.pauseBtn.text.text = "暂停";
            this.pauseBtn.disabled = true;
            this.mapSp.mouseThrough = false;
        };
        SearchWayPage.prototype.OnSearchReset = function () {
            this.Clear();
        };
        SearchWayPage.prototype.OnSearchPause = function () {
            this.pauseBtn.text.text = "恢复";
        };
        SearchWayPage.prototype.OnSearchResume = function () {
            this.pauseBtn.text.text = "暂停";
        };
        SearchWayPage.prototype.ReDrawMap = function () {
            this.mapSp.graphics.clear();
            var search = Dylan.GMapSearch.curSearch;
            for (var x = 0; x < search.mapGraph.width; x++) {
                var curX = x * this.GridWidth;
                for (var y = 0; y < search.mapGraph.height; y++) {
                    var curY = y * this.GridHeight;
                    var point = search.mapGraph.GetPoint(x, y);
                    var curColor = void 0;
                    if (point == search.startPoint) {
                        curColor = this.GridColorStart;
                    }
                    else if (point == search.endPoint) {
                        curColor = this.GridColorEnd;
                    }
                    else if (search.IsWayPoint(point)) {
                        curColor = this.GridColorWay;
                    }
                    else if (point == search.curPoint) {
                        curColor = this.GridColorCur;
                    }
                    else if (point.isProcess) {
                        curColor = this.GridColorInQueue;
                    }
                    else {
                        switch (point.weight) {
                            case 1:
                                if (point.isClosed) {
                                    curColor = this.GridColorVisited;
                                }
                                else {
                                    curColor = this.GridColorNoVisited_1;
                                }
                                break;
                            case Infinity:
                                curColor = this.GridColorNoVisited_Max;
                                break;
                            default:
                                curColor = this.GridColorNoVisited_weight;
                                break;
                        }
                    }
                    var gx = curX + this.LineWidth;
                    var gy = curY + this.LineWidth;
                    this.mapSp.graphics.drawRect(gx, gy, this.GridWidth - this.LineWidth * 2, this.GridHeight - this.LineWidth * 2, curColor);
                    if (this.showCostCheck.selected) {
                        var cost = search.isPreprocessInfo ? point.preCost : point.cost;
                        if (cost) {
                            this.mapSp.graphics.fillText(cost.toString(), curX + this.GridWidth / 2, curY + this.GridHeight / 4, "10px Arial", "#92CCD8", "center");
                        }
                    }
                }
            }
        };
        return SearchWayPage;
    }(ui.page.SearchWayPageUI));
    Dylan.SearchWayPage = SearchWayPage;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=SearchWayPage.js.map