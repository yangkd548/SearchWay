module Dylan {
	import Label = Laya.Label;
	import Handler = Laya.Handler;
	import Rectangle = Laya.Rectangle;
	import ComboBox = Laya.ComboBox;

	enum EditPointType {
		None = 0,
		Start,
		End
	}

	export class SearchWayPage extends ui.page.SearchWayPageUI implements IPage {
		private readonly GridWidth: number = 20;
		private readonly GridHeight: number = 20;
		private readonly LineColor: string = "#ffffff";
		private readonly LineWidth: number = 1;

		private readonly GridColorVisited: string = "#ffff00";
		private readonly GridColorCur: string = "#ff00ff";
		private readonly GridColorInQueue: string = "#aabbcc";
		private readonly GridColorWay: string = "#ffc0cb";
		private readonly GridColorStart: string = "#ff0000";
		private readonly GridColorEnd: string = "#00ff00";
		private readonly GridColorNoVisited_1: string = "#ffffff";
		private readonly GridColorNoVisited_Max: string = "#000000";
		private readonly GridColorNoVisited_weight: string = "#888888";

		private defaultWeightValue: number = 1;
		private curSetWeight: number;

		private readonly invalidPos: Laya.Vector2 = new Laya.Vector2(-1, -1);
		private lastEditWeightPos: Laya.Vector2 = new Laya.Vector2();
		private curEditWeightPos: Laya.Vector2 = new Laya.Vector2();

		private curEditPoint: EditPointType = EditPointType.None;

		constructor() {
			super();
			//设置页面宽度，才能保证大页面所有区域都响应鼠标事件
			this.width = Laya.stage.width;
			this.height = Laya.stage.height;

			this.functionTab.selectHandler = new Handler(this, this.OnSelectFunctionTab, [this.functionTab]);

			//基础 设置页
			this.mapWidth.on(Laya.Event.ENTER, this, this.OnSetMapRange, [this.mapWidth]);
			this.mapHeight.on(Laya.Event.ENTER, this, this.OnSetMapRange, [this.mapHeight]);
			this.startX.on(Laya.Event.ENTER, this, this.OnSetMapStartPoint, [this.startX]);
			this.startY.on(Laya.Event.ENTER, this, this.OnSetMapStartPoint, [this.startY]);
			this.endX.on(Laya.Event.ENTER, this, this.OnSetMapEndPoint, [this.endX]);
			this.endY.on(Laya.Event.ENTER, this, this.OnSetMapEndPoint, [this.endY]);

			this.mapWidth.on(Laya.Event.BLUR, this, this.OnSetMapRange, [this.mapWidth]);
			this.mapHeight.on(Laya.Event.BLUR, this, this.OnSetMapRange, [this.mapHeight]);
			this.startX.on(Laya.Event.BLUR, this, this.OnSetMapStartPoint, [this.startX]);
			this.startY.on(Laya.Event.BLUR, this, this.OnSetMapStartPoint, [this.startY]);
			this.endX.on(Laya.Event.BLUR, this, this.OnSetMapEndPoint, [this.endX]);
			this.endY.on(Laya.Event.BLUR, this, this.OnSetMapEndPoint, [this.endY]);

			this.startX.on(Laya.Event.FOCUS, this, this.OnSetEditStart, [this.startX]);
			this.startY.on(Laya.Event.FOCUS, this, this.OnSetEditStart, [this.startY]);
			this.endX.on(Laya.Event.FOCUS, this, this.OnSetEditEnd, [this.endX]);
			this.endY.on(Laya.Event.FOCUS, this, this.OnSetEditEnd, [this.endY]);
			this.mapSp.on(Laya.Event.RIGHT_CLICK, this, this.OnEditSpePoint, [true]);

			//通行成本 设置页
			this.mapSp.on(Laya.Event.MOUSE_DOWN, this, this.OnEnableEditWeight);
			this.mapSp.on(Laya.Event.MOUSE_UP, this, this.OnDisableEditWeight);
			this.costRadioGroup.selectHandler = new Laya.Handler(this, this.OnSelectCostRadioGroup);
			this.resetWeightBtn.on(Laya.Event.CLICK, this, this.Reset);

			//运行 设置页
			this.driveCombo.selectHandler = new Handler(this, this.OnSelectDriveCombo, [this.driveCombo]);
			this.searchCombo.selectHandler = new Handler(this, this.OnSelectSearchCombo, [this.searchCombo]);
			this.stepCombo.selectHandler = new Handler(this, this.OnSelectStepCombo, [this.stepCombo]);
			this.isPreprocessCheck.clickHandler = new Handler(this, this.OnSetPreprocessCheck, [this.isPreprocessCheck]);
			this.showDirCheck.clickHandler = new Handler(this, this.OnShowDirCheck, [this.showDirCheck]);
			this.showCostCheck.clickHandler = new Handler(this, this.OnShowCostCheck, [this.showCostCheck]);
			this.showNeighborsCheck.clickHandler = new Handler(this, this.OnShowNeighborsCheck, [this.showNeighborsCheck]);
			this.startBtn.on(Laya.Event.CLICK, this, this.OnSwitchStart);
			this.pauseBtn.on(Laya.Event.CLICK, this, this.OnSwitchPause);
			this.clearBtn.on(Laya.Event.CLICK, this, this.OnClearMap);
			this.resetBtn.on(Laya.Event.CLICK, this, this.Reset);

			//长显示组件
			this.slider.changeHandler = new Laya.Handler(this, this.OnSliderChange);
			this.scroll.changeHandler = new Laya.Handler(this, this.OnSliderChange);

			//运行反馈 监听
			GEventMgr.On(MapSearch.SearchStart, this, this.OnSearchStart);
			GEventMgr.On(MapSearch.SearchStop, this, this.OnSearchStop);
			GEventMgr.On(MapSearch.SearchReset, this, this.OnSearchReset);
			GEventMgr.On(MapSearch.SearchPause, this, this.OnSearchPause);
			GEventMgr.On(MapSearch.SearchResume, this, this.OnSearchResume);
			GEventMgr.On(BaseSearch.SearchReDraw, this, this.ReDrawMap);
		}

		public OnAddStage(args?: any): void {
			//默认显示
			this.functionTab.selectedIndex = 2;
			//由此页面，设置搜索配置（如果多个页面的话，还是得MapSearch类提供获取当前配置的public接口）
			this.driveCombo.selectedIndex = E_DriveMode.Auto;
			this.searchCombo.selectedIndex = E_SearchType.Astar;

			this.startBtn.text.text = "开始";
			this.startBtn.disabled = true;

			this.pauseBtn.text.text = "暂停";
			this.pauseBtn.disabled = true;

			this.OnSetMapRange();
			this.OnSetMapStartPoint();
			this.OnSetMapEndPoint();
			this.ResetSearch();
		}

		public OnRemoveStage(): void { }

		private OnSelectFunctionTab(tab: Laya.Tab): void {
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
		}

		private OnSetMapRange(): void {
			if (!isNaN(Number(this.mapWidth.text)) && !isNaN(Number(this.mapHeight.text))) {
				let nMapWidth = Number(this.mapWidth.text);
				let nMapHeight = Number(this.mapHeight.text);
				GMapSearch.SetMap(nMapWidth, nMapHeight);
				this.mapSp.width = this.GridWidth * nMapWidth;
				this.mapSp.height = this.GridHeight * nMapHeight;
				let parent = this.mapSp.parent as Laya.Box;
				this.mapSp.x = (parent.width - this.mapSp.width) / 2;
				this.mapSp.y = (parent.height - this.mapSp.height) / 2 - 30;

				let max = nMapWidth * nMapHeight;
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
		}

		private OnSetMapStartPoint(): void {
			if (!isNaN(Number(this.startX.text)) && !isNaN(Number(this.startY.text))) {
				GMapSearch.SetStartPoint(Number(this.startX.text), Number(this.startY.text));
			}
		}

		private OnSetMapEndPoint(): void {
			if (!isNaN(Number(this.endX.text)) && !isNaN(Number(this.endY.text))) {
				GMapSearch.SetEndPoint(Number(this.endX.text), Number(this.endY.text));
			}
		}

		private OnSetEditStart(): void {
			this.curEditPoint = EditPointType.Start
		}

		private OnSetEditEnd(): void {
			this.curEditPoint = EditPointType.End;
		}

		private OnEditSpePoint(isAutoSwitch:boolean = false): void {
			let vec2 = this.GetClickMapSpPoint();
			if (vec2) {
				switch (this.curEditPoint) {
					case EditPointType.None:
					case EditPointType.Start:
						this.startX.text = vec2.x.toString();
						this.startY.text = vec2.y.toString();
						GMapSearch.SetStartPoint(vec2.x, vec2.y);
						if(isAutoSwitch == true){
							this.curEditPoint = EditPointType.End;
						}
						break;
					case EditPointType.End:
						this.endX.text = vec2.x.toString();
						this.endY.text = vec2.y.toString();
						GMapSearch.SetEndPoint(vec2.x, vec2.y);
						if(isAutoSwitch == true){
							this.curEditPoint = EditPointType.Start;
						}
						break;
				}
			}
		}

		//左键点击，设置通行权值
		//或
		//左键点击，设置起点或终点，仅支持拖动
		private OnEnableEditWeight(): void {
			if (GMapSearch.isRunning) return;
			let vec2 = this.GetClickMapSpPoint();
			if (vec2) {
				let point = GMapSearch.GetPoint(vec2.x, vec2.y);
				if (point == GMapSearch.curSearch.startPoint) {
					this.curEditPoint = EditPointType.Start;
					this.mapSp.on(Laya.Event.MOUSE_MOVE, this, this.OnEditSpePoint);
				}
				else if (point == GMapSearch.curSearch.endPoint) {
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
		}

		private OnDisableEditWeight(): void {
			CopyVec2(this.lastEditWeightPos, this.invalidPos);
			this.mapSp.off(Laya.Event.MOUSE_MOVE, this, this.OnEditWeight);
			this.curEditPoint = EditPointType.None;
			this.mapSp.off(Laya.Event.MOUSE_MOVE, this, this.OnEditSpePoint);
		}

		private OnEditWeight(): Laya.Vector2 {
			let vec2 = this.GetClickMapSpPoint();
			if (vec2) {
				if (Vec2Equal(this.lastEditWeightPos, this.invalidPos) || !Vec2Equal(this.lastEditWeightPos, vec2)) {
					CopyVec2(this.lastEditWeightPos, vec2);
					GMapSearch.SetPointWeight(vec2.x, vec2.y, this.curSetWeight);
					return vec2;
				}
			}
			return null;
		}

		private GetClickMapSpPoint(): Laya.Vector2 {
			// if (this.mapSp.mouseX % this.GridWidth % (this.GridWidth - 1) && this.mapSp.mouseY % this.GridHeight % (this.GridHeight - 1)) {
			this.curEditWeightPos.x = Math.floor(this.mapSp.mouseX / this.GridWidth);
			this.curEditWeightPos.y = Math.floor(this.mapSp.mouseY / this.GridHeight);
			return this.curEditWeightPos;
			// }
			// return null;
		}

		private OnSelectCostRadioGroup(index: number): void {
			this.defaultWeightValue = index + 1;
		}

		private OnSliderChange(value): void {
			GMapSearch.SearchSteps(value);
		}

		//重置寻路数据
		private Clear(): void {
			GMapSearch.Clear();
			this.ResetSearch();
		}

		//重置寻路数据（包含重置权值）
		private Reset(): void {
			GMapSearch.Reset();
			this.ResetSearch();
		}

		private ResetSearch(): void {
			this.OnSearchStop();
			this.startBtn.disabled = false;
		}

		private OnSelectDriveCombo(cb: ComboBox): void {
			GMapSearch.SetDriveMode(cb.selectedIndex);
		}

		private OnSelectSearchCombo(cb: ComboBox): void {
			GMapSearch.SetSearchType(cb.selectedIndex);
		}

		private OnSelectStepCombo(cb: ComboBox): void {
			// GMapSearch.SetSearchType(cb.selectedIndex);
		}

		private OnSetPreprocessCheck(): void {
			GMapSearch.curSearch.isPreprocessInfo = this.isPreprocessCheck.selected;
			this.ReDrawMap();
		}

		private OnShowDirCheck(): void {
			this.ReDrawMap();
		}

		private OnShowCostCheck(): void {
			this.ReDrawMap();
		}

		private isShowNeighbors: boolean = false;
		private OnShowNeighborsCheck(): void {
			this.isShowNeighbors;
		}

		private OnClearMap(): void {
			this.Clear();
			GTipsMgr.Show("设置完成！", 1);
		}

		private OnSwitchStart(): void {
			GMapSearch.SwitchStart();
		}

		private OnSwitchPause(): void {
			GMapSearch.SwitchPause();
		}

		public OnSearchStart(): void {
			this.startBtn.text.text = "停止";
			this.startBtn.disabled = false;
			this.pauseBtn.text.text = "暂停";
			this.pauseBtn.disabled = false;
			this.mapSp.mouseThrough = true;
			this.OnDisableEditWeight();
		}

		private OnSearchStop(): void {
			this.startBtn.text.text = "开始";
			this.startBtn.disabled = true;
			this.pauseBtn.text.text = "暂停";
			this.pauseBtn.disabled = true;
			this.mapSp.mouseThrough = false;
		}

		private OnSearchReset(): void {
			this.Clear();
		}

		private OnSearchPause(): void {
			this.pauseBtn.text.text = "恢复";
		}

		private OnSearchResume(): void {
			this.pauseBtn.text.text = "暂停";
		}

		private ReDrawMap(): void {
			this.mapSp.graphics.clear();
			let search = GMapSearch.curSearch;
			for (let x = 0; x < search.mapGraph.width; x++) {
				let curX = x * this.GridWidth;
				for (let y = 0; y < search.mapGraph.height; y++) {
					let curY = y * this.GridHeight;
					let point = search.mapGraph.GetPoint(x, y);
					let curColor: string;
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
								if (point.isVisited) {
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
					let gx = curX + this.LineWidth;
					let gy = curY + this.LineWidth;
					this.mapSp.graphics.drawRect(gx, gy, this.GridWidth - this.LineWidth * 2, this.GridHeight - this.LineWidth * 2, curColor);
					if (this.showCostCheck.selected) {
						let cost = search.isPreprocessInfo ? point.preCost : point.cost;
						if (cost) {
							this.mapSp.graphics.fillText(cost.toString(), curX + this.GridWidth / 2, curY + this.GridHeight / 4, "10px Arial", "#92CCD8", "center");
						}
					}
				}
			}
		}

	}
}