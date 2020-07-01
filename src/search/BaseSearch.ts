module Dylan {
    export enum E_SearchStep {
        None = 0,
        OncePoint,
        OnceRound,
        OnceSide,
        OnceAll
    }

    export abstract class BaseSearch {
        public static readonly SearchFinish: string = "SearchFinish";
        public static readonly SearchReDraw: string = "SearchReDraw";

        private static readonly _mapGraph: MapGraph = new MapGraph();
        public get mapGraph(): MapGraph {
            return BaseSearch._mapGraph;
        }

        private EmitReDraw(): void {
            GEventMgr.Emit(BaseSearch.SearchReDraw, this);
        }

        public SetMap(width: number, height: number): void {
            this.mapGraph.SetMap(width, height);
            this.EmitReDraw();
        }

        //算法之外的设置，应该是静态变量
        private static _isPreprocessInfo: boolean = false;
        public get isPreprocessInfo(): boolean {
            return BaseSearch._isPreprocessInfo;
        }
        public set isPreprocessInfo(value: boolean) {
            BaseSearch._isPreprocessInfo = value;
            if(value){
                this.DoPreprocessInfo();
            }
            else{
                this.mapGraph.ResetPreCost();
            }
        }
        private _curPreprocessInfo: boolean = false;
        //尝试 不考虑终点，遍历地图
        private DoPreprocessInfo(): void {
            if (BaseSearch._isPreprocessInfo) {
                this._curPreprocessInfo = true;
                this.Start();
                while (this.isRunning) {
                    this.DoSearchOneStep();
                }
                this.mapGraph.SetPreCost();
                this.Clear();
            }
        }
        public get startPoint(): MapPoint {
            return this.mapGraph.startPoint;
        }
        public SetStart(fromX: number, fromY: number): void {
            this.mapGraph.SetStartPoint(fromX, fromY);
            this.DoPreprocessInfo();
            this.EmitReDraw();
        }

        public get endPoint(): MapPoint {
            return this.mapGraph.endPoint;
        }
        public SetEndPoint(toX: number, toY: number): void {
            this.mapGraph.SetEndPoint(toX, toY);
            this.EmitReDraw();
        }

        protected _curPoint: MapPoint;
        protected SetCurPoint(value: MapPoint): void {
            this._curPoint = value;
        }
        public get curPoint(): MapPoint {
            return this._curPoint;
        }

        private _isStarted: boolean = false;
        protected get isStarted(): boolean {
            return this._isStarted;
        }
        public get isRunning(): boolean {
            return this._isStarted && !this.isOver && !this.isSucc;
        }

        protected abstract get isOver(): boolean;

        protected _isSucc: boolean = false;
        public get isSucc(): boolean {
            return this._isSucc;
        }

        public get isInit(): boolean {
            return this.mapGraph.startPoint != null;
        }

        private _step: number = 0;
        protected get step(): number {
            return this._step;
        }
        protected AddStep(): void {
            if (this.isSucc) return;
            this._step++;
        }
        protected SubStep(): void {
            this._step--;
        }

        protected _maxStep: number = 0;
        public SearchSteps(step: number): void {
            if (this._maxStep) {
                step = Math.min(this._maxStep, step);
            }
            if (step >= this._step) {
                this.DoSearchSteps(step - this._step);
            }
            else {
                this.DoSearchToStep(step);
            }
        }

        //驱动执行的步数：0-逐点驱动，1-逐环驱动，2-逐边驱动
        protected searchStep: E_SearchStep = E_SearchStep.None;

        //执行的次数，用于针对性给不同步数，做帧间隔设置（即设置执行速度）
        protected driveTimes: number = 0;
        public AddDriveTimes(): void {
            this.driveTimes++;
        }

        //只允许被继承的一种写法，同类修饰符abstract
        // protected constructor() { }

        public set enable(value: boolean) {
            if (value) {
                GEventMgr.On(MapPoint.PointCostChanged, this, this.EmitReDraw);
            }
            else {
                GEventMgr.Off(MapPoint.PointCostChanged, this, this.EmitReDraw);
                this.Clear();
            }
        }

        public Start(): boolean {
            if (!this.isRunning && this.isInit) {
                this._isStarted = true;
                return true;
            }
            return false;
        }

        // public abstract SearchCustomSteps(): void;

        protected DoSearchSteps(step: number = 1): void {
            for (let i = 0; i < step; i++) {
                if (!this.SearchOneStep()) break;
            }
        }

        protected DoSearchToStep(step: number): void {
            this.Clear();
            this.DoSearchSteps(step);
        }

        public SearchOneStep(): boolean {
            this.Start();
            if (!this.isRunning) return false;
            this.DoSearchOneStep();
            this.EmitReDraw();
            if (!this.isRunning) return false;
            return true;
        }

        protected abstract DoSearchOneStep(): void;

        public IsWayPoint(cur: MapPoint, end:MapPoint = null): boolean {
            if (!this.isSucc) return false;
            if(cur == this.startPoint) return true;
            let wayPoint = end || this.endPoint;
            while (wayPoint.parent) {
                if (wayPoint == cur) {
                    return true;
                }
                else {
                    wayPoint = wayPoint.parent;
                }
            }
            return false;
        }

        protected AddFrontierPoint(point: MapPoint): void {
            this.CheckSucc(point);
            if(this.isSucc) return;
            if (point != this.startPoint) {
                point.parent = this._curPoint;
            }
            point.SetIsProcess();
        }

        protected CheckSucc(point: MapPoint): void {
            if (this._curPreprocessInfo || this._isSucc) return;
            this._isSucc = this.mapGraph.endPoint == point;
        }

        public SetPointWeight(x: number, y: number, weight: number) {
            let point = this.mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.startPoint || point == this.endPoint) return;
                if (point.SetWeight(weight)) {
                    this.DoPreprocessInfo();
                    this.EmitReDraw();
                }
            }
        }

        public ResetAllWeight():void{
            this.mapGraph.ResetAllWeight();
            this.DoPreprocessInfo();
            this.EmitReDraw();
        }

        public Clear():void{
            this._curPreprocessInfo = false;
            this._step = 0;
            this._maxStep = 0;
            this._isSucc = false;
            this._curPoint = null;
            this.driveTimes = 0;
            this.mapGraph.Clear();
            this.EmitReDraw();
        }
    }
}