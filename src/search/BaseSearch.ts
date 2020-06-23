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

        protected _curPoint: MapPoint;
        public get curPoint(): MapPoint {
            return this._curPoint;
        }

        protected fromStartDis: number = 0;

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

        public Reset(): void {
            this._maxStep = 0;
            this._isSucc = false;
            this._curPoint = null;
            this.driveTimes = 0;
            this.mapGraph.Reset();
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

        protected _step: number = 0;
        protected set step(value: number) {
            this._step = value;
        }
        protected _maxStep: number = 0;
        public SearchSteps(step: number): void {
            if (this._maxStep) {
                console.log("原始：", step, " MAX:", this._maxStep);
                step = Math.min(this._maxStep, step);
                console.log("调整：", step);
            }
            this.DoSearchSteps(step - this._step);
        }

        protected DoSearchSteps(step: number = 1): void {
            let count = Math.abs(step);
            console.log(`000 ----${count}执行 +++：`, step, "  当前步骤：", this._step);
            for (let i = 0; i < count; i++) {
                if (step > 0) {
                    this.Start();
                    if (this.isOver) break;
                    this.SearchOneStep();
                    if (this.isOver) break;
                }
                else {
                    if (!this._isStarted) break;
                    this.FallBackOneStep();
                    if (!this._isStarted) break;
                }
            }
            console.log(`111 ----${count}执行 +++：`, step, "  当前步骤：", this._step);
        }

        protected abstract SearchOneStep(): void;
        protected abstract FallBackOneStep(): void;

        private _isStarted: boolean = false;
        protected get isStarted(): boolean {
            return this._isStarted;
        }
        public get isRunning(): boolean {
            return this._isStarted && !this.isOver && !this.isSucc;
        }

        public abstract get isOver(): boolean;

        private _isSucc: boolean = false;
        protected get isSucc(): boolean {
            return this._isSucc && this._step >= this._maxStep;
        }

        public get isInit(): boolean {
            return this.mapGraph.startPoint != null;
        }

        public IsWarPoint(point: MapPoint): boolean {
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

        protected ProcessAddChildPoint(point: MapPoint): void {
            point.parent = this._curPoint;
            point.SetIsProcess();
        }

        protected CheckSucc(point: MapPoint): void {
            this._isSucc = this.mapGraph.endPoint == point;
        }

        protected ProcessTailUnvisited(point: MapPoint): void {
            //父子关系，还要利用，不能置空
            // point.parent = null;
            point.SetIsUnvisited();
        }

        protected CheckFallOrigin(point: MapPoint): boolean {
            this._isStarted = !(this.mapGraph.startPoint == point);
            return this._isStarted;
        }

        public SetPointWeight(x: number, y: number, weight: number) {
            let point = this.mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.startPoint || point == this.endPoint) return;
                point.SetWeight(weight);
            }
        }
    }
}