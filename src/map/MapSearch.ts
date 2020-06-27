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
        public static readonly SearchReset: string = "SearchReset";
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

        private _isPause: boolean = false;
        public get isPause(): boolean {
            return this._isPause;
        }

        private _searchType: E_SearchType;
        private _curSearch: BaseSearch;
        public get curSearch():BaseSearch{
            return this._curSearch;
        }
        public SetSearchType(type: E_SearchType): BaseSearch {
            if (this._curSearch) {
                this._curSearch.enable = false;
                GEventMgr.Emit(MapSearch.SearchReset);
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
        }

        public get isInit(): boolean {
            return this._curSearch.isInit;
        }

        public get isRunning(): boolean {
            return this._curSearch.isRunning;
        }

        public SetMap(width: number, height: number): void {
            this._curSearch.SetMap(width, height);
        }

        public Clear():void{
            this.ClearDrive();
            this._curSearch.Clear();
        }

        public Reset():void{
            this.Clear();
            this.curSearch.ResetAllWeight();
        }

        public SetStartPoint(fromX: number, fromY: number): void {
            this._curSearch.SetStart(fromX, fromY);
        }

        public SetEndPoint(toX: number, toY: number): void {
            this._curSearch.SetEndPoint(toX, toY);
        }

        public GetPoint(x: number, y: number): MapPoint {
            return this._curSearch.mapGraph.GetPoint(x, y);
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
            if (this.DoStart()) {
                this.StartDrive();
            }
        }

        private Finish(): void {
            this.Pause();
            while (this.isRunning) {
                this.DoSearch();
            }
        }

        public SearchSteps(step: number): void {
            this._curSearch.SearchSteps(step);
        }

        private DoStart(): boolean {
            if(this._curSearch.Start()){
                GEventMgr.Emit(MapSearch.SearchStart);
                return true;
            }
            return false;
        }

        private Pause(): void {
            if (this._isPause || !this.isRunning) return;
            this._isPause = true;
            this.ClearDrive();
            GEventMgr.Emit(MapSearch.SearchPause);
        }

        private ClearDrive():void{
            switch (this._driveMode) {
                case E_DriveMode.Auto:
                    Laya.timer.clearAll(this);
                    break;
                case E_DriveMode.Click:
                    Laya.stage.offAll();
                    break;
            }
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
            this._curSearch.AddDriveTimes();
        }

        private ClickSearch(): void {
            this.DoSearch();
        }

        private DoSearch(): void {
            this._curSearch.SearchCustomSteps();
            if (!this.isRunning) {
                this.ClearDrive();
                GEventMgr.Emit(MapSearch.SearchStop);
            }
        }

        public SetPointWeight(x: number, y: number, weight: number) {
            this._curSearch.SetPointWeight(x, y, weight);
        }
    }
}