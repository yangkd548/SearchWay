module Dylan {

    export class MapPoint {
        public static readonly PointCostChanged: string = "PointCostChanged";

        private _x: number;
        public get x(): number {
            return this._x;
        }

        private _y: number;
        public get y(): number {
            return this._y;
        }

        //权值（权重）
        private readonly OriginWeight: number = 1;
        private _weight: number = this.OriginWeight;
        public get weight(): number {
            return this._weight;
        }
        public SetWeight(weight: number): void {
            if(weight>=1 && this._weight <= Number.MAX_VALUE){
                this._weight = weight;
                GEventMgr.Emit(MapPoint.PointCostChanged);
            }            
        }

        public ResetWeight():void{
            this._weight = this.OriginWeight;
        }

        public GetNextWeight():number{
            switch (this._weight) {
                case this.OriginWeight:
                    return Number.MAX_VALUE;
                    break;
                case Number.MAX_VALUE:
                    return -1;
                    break;
                default:
                    return this.OriginWeight;
                    break;
            }
        }

        public _inQueue: boolean = false;
        public get inQueue(): boolean {
            return this._inQueue;
        }
        public SetInQueue(): void {
            this._inQueue = true;
            this._isVisited = false;
        }

        private _isVisited: boolean = false;
        public get isVisited(): boolean {
            return this._isVisited;
        }
        public SetIsVisited(): void {
            this._isVisited = true;
            this._inQueue = false;
        }

        public get isUnvisited(): boolean {
            return !this.isVisited && !this._inQueue;
        }

        public parent: MapPoint;

        public SetValue(x: number, y: number, weight: number = 1): void {
            this._x = x;
            this._y = y;
            this._weight = weight;
        }

        public get key(): string {
            return this._x + "_" + this._y;
        }

        // private _cost:number = 1;
        // public get cost():number{
        //     return this._cost;
        // }

        public Clear(): void {
            this.SetValue(-1, -1, this.weight);
            this._inQueue = false;
            this._isVisited = false;
            this.parent = null;
        }

        public Reset(): void {
            this._weight = this.OriginWeight;
            this.Clear();
        }
    }
}