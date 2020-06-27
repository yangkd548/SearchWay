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
        public SetStartPoint(x: number, y: number): void {
            this._startPoint = this.GetPoint(x, y);
            this._startPoint.ResetWeight();
        }
        public get startPoint(): MapPoint {
            return this._startPoint;
        }

        protected _endPoint: MapPoint;
        public SetEndPoint(x: number, y: number): void {
            this._endPoint = this.GetPoint(x, y);
            this._endPoint.ResetWeight();
        }
        public get endPoint(): MapPoint {
            return this._endPoint;
        }

        private grids: MapPoint[][] = [];

        public SetMap(width: number, height: number, formatHandler: Laya.Handler = null): void {
            let needReset = formatHandler || this._width != width || this._height != height;
            if (needReset && !formatHandler) formatHandler = this.resetPointHandler;
            this._width = width;
            this._height = height;
            for (let x = 0; x < width; x++) {
                if (!this.grids[x]) {
                    this.grids.push([]);
                }
                for (let y = 0; y < height; y++) {
                    this.grids[x][y] = this.grids[x][y] || new MapPoint();
                    if (needReset) {
                        formatHandler.runWith(this.grids[x][y]);
                    }
                    this.grids[x][y].SetValue(this, x, y);
                }
            }
        }

        private clearPointHandler = new Laya.Handler(this, (point: MapPoint) => { point.Clear(); }, null, false);
        private resetPointHandler = new Laya.Handler(this, (point: MapPoint) => { point.Reset(); }, null, false);

        public Clear(): void {
            this.SetMap(this.width, this.height, this.clearPointHandler);
        }

        public Reset(): void {
            this.SetMap(this.width, this.height, this.resetPointHandler);
        }

        public GetNeighbors(origin: MapPoint, oppoFirst: boolean = false): Array<MapPoint> {
            let relativePosArr = [[origin.x, origin.y - 1], [origin.x + 1, origin.y], [origin.x, origin.y + 1], [origin.x - 1, origin.y]];
            let edges: MapPoint[] = [];
            for (let i = 0; i < relativePosArr.length; i++) {
                let pos = relativePosArr[i];
                let point = this.GetPoint(pos[0], pos[1]);
                if (!point || point == this.startPoint || point.weight == Infinity) {
                    continue;
                }
                edges.push(point);
            }
            //这纯粹是为了栅格上的审美目的：使用棋盘格模式，翻转其他瓷砖的边缘，这样沿着对角线的路径最终会变成阶梯，而不是先做所有的东西移动，然后再做所有的南北移动（那样就变成折线路径）。
            if ((origin.x + origin.y) % 2 == 0) {
                edges.reverse();
            }
            return edges;
            //这纯粹是为了栅格上的审美目的：当前遍历的节点，整体按照顺时针顺序排列（需要从父节点开始按照顺时针进行添加，遇到障碍就停止）
            // let result: MapPoint[] = [];
            // let parent = origin.parent;
            // let fromIndex = parent ? (edges.indexOf(parent) + (oppoFirst ? 2 : 0)) : 0;
            // let has: boolean = false;
            // for (let i = 0; i < edges.length; i++) {
            //     let index = (i + fromIndex) % length;
            //     result.push(edges[index]);
            // }
            // return result;
        }

        public GetPoint(x: number, y: number): MapPoint {
            if (x >= this.width || y >= this.height) return null;
            return this.grids[x] ? this.grids[x][y] : null;
        }

        public GetCost(from: MapPoint, to: MapPoint): number {
            return from.cost + to.weight;
        }

        //常用的获取预期值的方式：曼哈顿距离
        public GetHeuristicDis(point1: MapPoint, point2: MapPoint): number {
            return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
        }

        //用于一次性展示所有格子的消耗
        public SetFinalCost(): void {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    this.GetPoint(x, y).SetPreCost();
                }
            }
        }

        public ResetFinialCost(): void {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    this.GetPoint(x, y).ResetPreCost();
                }
            }
        }

    }
}