module Dylan {

    export enum E_ClimbRot {
        Clockwise = 1,
        None = 0,
        NoClockwise = -1
    }

    export class MapPoint {
        public static GetFormatDir(dir: E_MoveDir): E_MoveDir {
            dir = dir % 4;
            if (dir < 0) dir += 4;
            return dir;
        }

        public static readonly PointCostChanged: string = "PointCostChanged";

        public isRollBack: boolean = false;
        public rollCount = 0;

        private _climbRot: E_ClimbRot = E_ClimbRot.None;
        public get climbRot(): E_ClimbRot {
            return this._climbRot;
        }
        public set climbRot(value: E_ClimbRot) {
            this._climbRot = value;
        }

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
        public heuristic: number = 0;
        public f: number = 0;

        //当前点的爬行方向，如果比原始方向-1或+1，则为可自由状态
        //如果可自由状态，再次-1或+1，仍是可自由状态
        //+1或-1，变为原方向，则关闭
        public _canFree: boolean = false;
        public get canFree(): boolean {
            return this._canFree;
        }

        private _curClimbDir: E_MoveDir = E_MoveDir.NONE;
        public get curClimbDir(): E_MoveDir {
            return this._curClimbDir;
        }
        public SetCurClimbDir(value: E_MoveDir) {
            this._curClimbDir = MapPoint.GetFormatDir(value);
            let change = this.climbRot == E_ClimbRot.Clockwise ? -1 : 1;
            if (this.parent.canFree) {
                log("AAA 自由判定 -------- ：", this.curClimbDir, this.branch.key, MapPoint.GetFormatDir(this.branch.curClimbDir - change), "  *********  ", this.branch.curClimbDir, change);                
                this._canFree = this.curClimbDir != MapPoint.GetFormatDir(this.branch.curClimbDir - change);
            }
            else {
                log("自由判定 -------- ：", this.curClimbDir, this.branch.key, MapPoint.GetFormatDir(this.branch.curClimbDir + change), "  *********  ", this.branch.curClimbDir, change);
                this._canFree = this.curClimbDir == MapPoint.GetFormatDir(this.branch.curClimbDir + change);
            }
        }

        public forwardDir: E_MoveDir = E_MoveDir.NONE;
        public root: MapPoint;
        public branch: MapPoint;

        private _isClimb: boolean = false;
        public get isClimb(): boolean {
            return this._isClimb;
        }
        public set isClimb(value: boolean) {
            this._isClimb = value;
            if (!value) {
                this.climbRot = E_ClimbRot.None;
            }
        }

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
            this._isProcess = false;
            this._isClosed = false;
            this.parent = null;
            this.cost = 0;
            this.isClimb = false;
            this.forwardDir = null;
            this.root = null;
            this.heuristic = 0;
            this.f = 0;

            this._climbRot = E_ClimbRot.None;
            this.isRollBack = false;
            this.rollCount = 0;
            this._canFree = false;
            this._curClimbDir = E_MoveDir.NONE;
            this.branch = null;

            //不用在这里重置的变量
            /**
             * this._x
             * this._y
             * this._id
             * this._preCost
             * this._preParent
             * this._weight
             */
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