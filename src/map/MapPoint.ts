module Dylan {
    
    export enum E_ClimbDir{
        Clockwise = 1,
        None = 0,
        NoClockwise = -1
    }

    export class MapPoint {
        public static readonly PointCostChanged: string = "PointCostChanged";

        //地图MapGraph增加设置当前节点类的接口，就可以根据不同算法，使用不同的节点类了！！！
        public climbDir:E_ClimbDir = E_ClimbDir.None;

        constructor(graph: MapGraph, x: number, y: number) {
            this.SetValue(graph, x, y);
        }

        private _x: number = -1;
        public get x(): number {
            return this._x;
        }

        private _y: number = -1;
        public get y(): number {
            return this._y;
        }

        private _id: number;
        public get id(): number {
            return this._id;
        }

        private SetValue(graph: MapGraph, x: number, y: number): void {
            x = Math.min(graph.width - 1, Math.max(0, x));
            y = Math.min(graph.height - 1, Math.max(0, y));
            this._x = x;
            this._y = y;
            this._id = this.x + this.y * graph.width;
        }

        public get key(): string {
            return this._x + "_" + this._y;
        }

        //权值（权重）
        private readonly OriginWeight: number = 1;
        private _weight: number = this.OriginWeight;
        public get weight(): number {
            return this._weight;
        }
        public SetWeight(weight: number): boolean {
            if (weight >= 1 && this._weight <= Infinity && this._weight != weight) {
                this._weight = weight;
                return true;
            }
        }
        public ResetWeight(): void {
            this._weight = this.OriginWeight;
        }

        public parent: MapPoint;

        private _preParent: MapPoint;
        public get preParent(): MapPoint {
            return this._preParent
        }
        public SetPreParent(): void {
            this._preParent = this.parent;
        }
        public ResetPreParent(): void {
            this._preParent = null;
        }

        public cost: number;

        private _preCost: number;
        public get preCost(): number {
            return this._preCost;
        }
        public SetPreCost(): void {
            this._preCost = this.cost;
        }
        public ResetPreCost(): void {
            this._preCost = 0;
        }

        //启发式，预期值（预计剩余路程）
        public heuristic: number;
        public f: number = 0;

        public dir:E_MoveDir = E_MoveDir.NONE;
        public isClimb:boolean = false;
        public cross: MapPoint;

        public GetNextWeight(): number {
            switch (this._weight) {
                case this.OriginWeight:
                    return Infinity;
                    break;
                case Infinity:
                    return -1;
                    break;
                default:
                    return this.OriginWeight;
                    break;
            }
        }

        public _isProcess: boolean = false;
        public get isProcess(): boolean {
            return this._isProcess;
        }
        public SetIsProcess(): void {
            this._isProcess = true;
            this._isClosed = false;
        }
        // public CanelIsProcess():void{
        //     this.SetIsUnvisited();
        // }

        private _isClosed: boolean = false;
        public get isClosed(): boolean {
            return this._isClosed;
        }
        public SetIsClosed(): void {
            this._isClosed = true;
            this._isProcess = false;
        }
        // public CanelIsVisited(): void {
        //     this.SetIsProcess();
        // }

        // public SetIsOpened(): void {
        //     this._isProcess = false;
        //     this._isClosed = false;
        // }
        public get isOpened(): boolean {
            return !this._isClosed && !this._isProcess;
        }

        public Clear(): void {
            this.cost = 0;
            this._isProcess = false;
            this._isClosed = false;
            this.parent = null;
        }

        // private ResetBase(): void {
        //     this._x = -1;
        //     this._y = -1;
        // }

        // public Reset(): void {
        //     this.Clear();
        //     this.ResetBase();
        // }

        //暂时没用到
        public IsSamePos(other: MapPoint): boolean {
            return other && this.x == other.x && this.y == other.y;
        }
    }
}