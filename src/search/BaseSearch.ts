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

        public get startPoint(): MapPoint {
            return this.mapGraph.startPoint;
        }
        public SetStart(fromX: number, fromY: number): void {
            this.mapGraph.SetStartPoint(fromX, fromY);
            this.EmitReDraw();
        }

        public get endPoint(): MapPoint {
            return this.mapGraph.endPoint;
        }
        public SetEndPoint(toX: number, toY: number): void {
            this.mapGraph.SetEndPoint(toX, toY);
            this.EmitReDraw();
        }

        private _curPoint: MapPoint;
        protected SearchSetCurPoint(value: MapPoint): void {
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

        public abstract get isOver(): boolean;

        protected _isSucc: boolean = false;
        protected get isSucc(): boolean {
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
            if(this.isSucc) return;
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

        public set enable(value: boolean) {
            if (value) {
                GEventMgr.On(MapPoint.PointCostChanged, this, this.EmitReDraw);
            }
            else {
                GEventMgr.Off(MapPoint.PointCostChanged, this, this.EmitReDraw);
                this.Reset();
            }
        }

        public SetMap(width: number, height: number, reset: boolean = false): void {
            this.mapGraph.SetMap(width, height, reset);
            this.EmitReDraw();
        }

        protected EmitReDraw(): void {
            GEventMgr.Emit(BaseSearch.SearchReDraw, this);
        }

        public Start(): boolean {
            if (!this.isRunning && this.isInit) {
                this._isStarted = true;
                return true;
            }
            return false;
        }

        public abstract SearchCustomSteps(): void;

        //TODO:考虑一下，如何组织这个方法
        public AutoSearch(): void {
            this.DoSearchSteps();
        }

        protected DoSearchSteps(step: number = 1): void {
            for (let i = 0; i < step; i++) {
                if (this.SearchOneStep()) break;
            }
        }

        protected DoSearchToStep(step: number): void {
            this.Reset();
            this.DoSearchSteps(step);
        }

        protected SearchOneStep(): boolean {
            this.Start();
            if (this.isOver) return true;
            this.DoSearchOneStep();
            if (this.isOver) return true;
            return false;
        }

        protected abstract DoSearchOneStep(): void;

        public IsWayPoint(point: MapPoint): boolean {
            if (!this.isSucc) return false;
            let warPoint = this.endPoint;
            while (warPoint.parent) {
                if (warPoint == point) {
                    return true;
                }
                else {
                    warPoint = warPoint.parent;
                }
            }
            return false;
        }

        protected AddProcessPoint(point: MapPoint): void {
            point.parent = this._curPoint;
            point.SetIsProcess();
        }

        protected CheckSucc(point: MapPoint): void {
            if(this._isSucc) return;
            this._isSucc = this.mapGraph.endPoint == point;
        }

        public SetPointWeight(x: number, y: number, weight: number) {
            let point = this.mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.startPoint || point == this.endPoint) return;
                point.SetWeight(weight);
            }
        }

        public Reset(): void {
            this._step = 0;
            this._maxStep = 0;
            this._isSucc = false;
            this._curPoint = null;
            this.driveTimes = 0;
            this.mapGraph.Reset();
            this.EmitReDraw();
        }
    }
}