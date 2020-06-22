module Dylan {
    export enum E_SearchStep {
        OncePoint = 0,
        OnceRound,
        OnceSide,
        OnceAll
    }

    export abstract class BaseSearch {
        public static readonly SearchFinish: string = "SearchFinish";
        public static readonly SearchReDraw: string = "SearchReDraw";

        protected _mapGraph: MapGraph = new MapGraph();
        public get mapGraph(): MapGraph {
            return this._mapGraph;
        }

        protected _frontier: MapPoint[] = [];
        protected _start: MapPoint;
        public get start(): MapPoint {
            return this._start;
        }
        protected _end: MapPoint;
        public get end(): MapPoint {
            return this._end;
        }
        protected _cur: MapPoint;
        public get cur(): MapPoint {
            return this._cur;
        }

        protected fromStartDis: number = 0;

        //驱动执行的步数：0-逐点驱动，1-逐环驱动，2-逐边驱动
        protected searchStep: E_SearchStep = E_SearchStep.OncePoint;

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
            }
        }

        public SetMap(width: number, height: number, reset: boolean = false): void {
            this._mapGraph.SetMap(width, height, reset);
            this.EmitReDraw();
        }

        public ResetMap(): void {
            this._mapGraph.ResetMap();
            this.EmitReDraw();
        }

        public SetStart(fromX: number, fromY: number): void {
            this._start = this._mapGraph.GetPoint(fromX, fromY);
            this._start.ResetWeight();
            this.EmitReDraw();
        }

        public SetEnd(toX: number, toY: number): void {
            this._end = this._mapGraph.GetPoint(toX, toY);
            this._end.ResetWeight();
            this.EmitReDraw();
        }

        protected EmitReDraw(): void {
            GEventMgr.Emit(BaseSearch.SearchReDraw, this);
        }

        public Start(): boolean {
            this.PushQueue(this._start);
            return this.isInit;
        }

        public abstract DoSearch(): void;

        protected SearchOnePoint(): void {
            if (this._frontier.length > 0) {
                this.DoSearchOnePoint();
            }
        }

        protected abstract DoSearchOnePoint(): void;

        public get isOver(): boolean {
            return this._frontier.length == 0;
        }

        protected _isSucc: boolean = false;
        public get isSucc(): boolean {
            return this._isSucc;
        }

        public get isInit(): boolean {
            return this._start != null;
        }

        public Clear(): void {
            // if (!this.isInit) return;
            this._isSucc = false;
            this.driveTimes = 0;
            this._frontier.splice(0);
            this._mapGraph.Clear();
            this._start = null;
            this._end = null;
            this._cur = null;
        }

        public IsWarPoint(point: MapPoint): boolean {
            let warPoint = this.end;
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

        protected PushQueue(point: MapPoint): void {
            if (!this.isInit) return;
            // console.log("++++ 基准点：", point.x, point.y);
            point.parent = this._cur;
            point.SetInQueue();
            this._frontier.push(point);
        }

        public SetPointWeight(x: number, y: number, weight: number) {
            let point = this._mapGraph.GetPoint(x, y);
            if (point) {
                if (point == this.start || point == this.end) return;
                point.SetWeight(weight);
            }
        }
    }
}