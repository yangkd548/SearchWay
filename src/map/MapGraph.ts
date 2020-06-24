module Dylan {

    export class MapGraph {
        private _width: number;
        public get width(): number {
            return this._width;
        }

        private _height: number;
        public get height(): number {
            return this._height;
        }

        protected _startPoint: MapPoint;
        public SetStartPoint(x:number, y:number):void {
            this._startPoint = this.GetPoint(x, y);
            this._startPoint.ResetWeight();
        }
        public get startPoint(): MapPoint {
            return this._startPoint;
        }

        protected _endPoint: MapPoint;
        public SetEndPoint(x:number, y:number):void {
            this._endPoint = this.GetPoint(x, y);
            this._endPoint.ResetWeight();
        }
        public get endPoint(): MapPoint {
            return this._endPoint;
        }

        private grids: MapPoint[][] = [];

        public SetMap(width: number, height: number, reset: boolean = false): void {
            let needResetPoints = reset || this._width != width || this._height != height;
            this._width = width;
            this._height = height;
            for (let x = 0; x < width; x++) {
                if (!this.grids[x]) {
                    this.grids.push([]);
                }
                for (let y = 0; y < height; y++) {
                    if (!this.grids[x][y]) {
                        this.grids[x][y] = new MapPoint();
                    }
                    else if (needResetPoints) {
                        this.grids[x][y].Reset();
                    }
                    this.grids[x][y].SetValue(this, x, y);
                }
            }
        }

        public Reset(): void {
            this.SetMap(this.width, this.height, true);
        }

        public GetNeighbors(origin: MapPoint, oppoFirst: boolean = false): Array<MapPoint> {
            let parent = origin.parent;
            let result: MapPoint[] = [];
            let posArr = [[origin.x, origin.y - 1], [origin.x + 1, origin.y], [origin.x, origin.y + 1], [origin.x - 1, origin.y]];
            let length = posArr.length;
            let pointArr: MapPoint[] = [];
            for (let i = 0; i < length; i++) {
                let pos = posArr[i];
                pointArr.push(this.GetPoint(pos[0], pos[1]));
            }
            //为能够达到按照从中心点，顺时针搜索，需要从父节点开始按照顺时针进行添加，遇到障碍就停止
            let fromIndex = parent ? (pointArr.indexOf(parent) + (oppoFirst ? 2 : 0)) : 0;
            let has: boolean = false;
            for (let i = 0; i < length; i++) {
                let index = (i + fromIndex) % length;
                let point: MapPoint = pointArr[index];
                if (point != null) {
                    result.push(point);
                }
            }
            return result;
        }

        public GetPoint(x: number, y: number): MapPoint {
            if (x >= this.width || y >= this.height) return null;
            return this.grids[x] ? this.grids[x][y] : null;
        }
    }
}