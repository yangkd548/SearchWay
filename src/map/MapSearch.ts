module Dylan {
    import Sprite = Laya.Sprite;
    import Handler = Laya.Handler;

    export enum E_DriveMode {
        Auto = 0,
        Click
    }

    export enum E_SearchType {
        DFS = 0,//深度优先(depth first searth)
        BFS,	//breadth广度优先（宽度优先）(breadth first search)
        DIJKSTRA,//DIJKSTRA 算法(迪杰斯特算法)
        GBFS,	//贪婪最佳优先搜索（Greedy Best First Search算法）（渴望优先）（目标优先）
        Astar,	//A*算法
        Bstar	//B*算法
    }

    export class MapSearch {
        public static readonly SearchStart: string = "SearchStart";
        public static readonly SearchStop: string = "SearchStop";
        public static readonly SearchPause: string = "SearchPause";
        public static readonly SearchResume: string = "SearchResume";

        private readonly DFS = new DfsSearch();
        private readonly BFS = new BfsSearch();
        private readonly DIJKSTRA = new DijkstraSearch();
        private readonly GBFS = new GbfsSearch();
        private readonly Astar = new AstarSearch();
        private readonly Bstar = new BstarSearch();

        //驱动方式：0-间隔帧自动驱动；1-鼠标点击驱动
        private _driveMode: E_DriveMode = E_DriveMode.Auto;
        public SetDriveMode(mode: E_DriveMode): void {
            this._driveMode = mode;
        }
        public get driveMode(): E_DriveMode {
            return this._driveMode;
        }

        private _isPause: boolean = false;
        public get isPause(): boolean {
            return this._isPause;
        }

        private _searchType: E_SearchType = E_SearchType.DFS;
        public get searchType(): E_SearchType {
            return this._searchType;
        }
        private curSearch: BaseSearch = this.SetSearchType();
        public SetSearchType(type: E_SearchType = this.searchType): BaseSearch {
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
        }

        public get isInit(): boolean {
            return this.curSearch.isInit;
        }

        public get isRunning(): boolean {
            return !this.curSearch.isOver;
        }

        public SetMap(width: number, height: number): void {
            this.curSearch.SetMap(width, height);
        }

        public ResetMap(): void {
            this.curSearch.ResetMap();
        }

        public SetStartPoint(fromX: number, fromY: number): void {
            this.curSearch.SetStart(fromX, fromY);
        }

        public SetEndPoint(toX: number, toY: number): void {
            this.curSearch.SetEnd(toX, toY);
        }

        public GetPoint(x: number, y: number): MapPoint {
            return this.curSearch.mapGraph.GetPoint(x, y);
        }

        public SwitchStart(): void {
            if (this.isRunning) {
                this.Finish();
            }
            else {
                this.Start();
            }
        }

        public SwitchPause(): void {
            if (this.isRunning) {
                if (this.isPause) {
                    this.Resume();
                }
                else {
                    this.Pause();
                }
            }
        }

        private Start(): void {
            if (this.curSearch.Start()) {
                this.StartDrive();
                GEventMgr.Emit(MapSearch.SearchStart);
            }
        }

        private Finish(): void {
            this.Pause();
            while (!this.curSearch.isOver) {
                this.curSearch.DoSearch();
            }
            this.Clear();
        }

        private _step: number = 0;
        public PlayBySlider(step: number): void {
            for (let i = this._step; i < step; i++) {
                this.curSearch.DoSearch();
            }
        }

        private Pause(): void {
            if (this._isPause || !this.isRunning) return;
            this._isPause = true;
            switch (this._driveMode) {
                case E_DriveMode.Auto:
                    Laya.timer.clearAll(this);
                    break;
                case E_DriveMode.Click:
                    Laya.stage.offAll();
                    break;
            }
            GEventMgr.Emit(MapSearch.SearchPause);
        }

        private Resume(): void {
            if (!this._isPause || !this.isRunning) return;
            this._isPause = false;
            this.StartDrive();
            GEventMgr.Emit(MapSearch.SearchResume);
        }

        private StartDrive(): void {
            switch (this._driveMode) {
                case E_DriveMode.Auto:
                    Laya.timer.frameLoop(1, this, this.DriveSearch);
                    break;
                case E_DriveMode.Click:
                    Laya.stage.on(Laya.Event.CLICK, this, this.ClickSearch);
                    break;
            }
        }

        private DriveSearch(): void {
            this.DoSearch();
            this.curSearch.AddDriveTimes();
            if (this.curSearch.isOver) {
                this.Clear();
                Laya.timer.clear(this, this.DriveSearch);
            }
        }

        private ClickSearch(): void {
            this.DoSearch();
            if (this.curSearch.isOver) {
                this.Clear();
                Laya.stage.off(Laya.Event.CLICK, this, this.ClickSearch);
            }
        }

        private DoSearch(): void {
            this.curSearch.DoSearch();
        }

        public SetPointWeight(x: number, y: number, weight: number) {
            this.curSearch.SetPointWeight(x, y, weight);
        }

        private Clear(): void {
            // if (!this.curSearch.isInit) return;
            this.curSearch.Clear();
            GEventMgr.Emit(MapSearch.SearchStop);
        }
    }
}