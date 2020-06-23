module Dylan {
    export class DfsSearch extends BaseSearch {
        private readonly oppoFirst: boolean = true;

        private _isOver:boolean = false;
        public get isOver(): boolean {
            return this._isOver;
        }

        public SearchCustomSteps(): void {
            switch (this.searchStep) {
                case E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.DoSearchSteps();
                    }
                    break;
                default:
                    this.DoSearchSteps();
                    break;
            }
        }

        protected SearchOneStep(): void {
            // console.log("-------");
            if(!this.isInit || this.isOver || this.isSucc) return;
            if (this._curPoint == null) {
                this._curPoint = this.startPoint;
            }
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            let hasUnvisited = false;
            //查找周围顶点
            let neighbors: MapPoint[] = this.mapGraph.GetNeighbors(this._curPoint, this.oppoFirst);
            for (let next of neighbors) {
                //没有访问过
                if (next.isUnvisited) {
                    this.ProcessAddChildPoint(next);
                    this.CheckSucc(next);
                    hasUnvisited = true;
                    break;
                }
            }
            this.EmitReDraw();
            if (!this.isSucc) {
                if (!hasUnvisited) {
                    //执行回溯（先回溯一步，不行再回溯一步...）
                    this.Recall();
                }
            }
        }

        protected ProcessAddChildPoint(point: MapPoint): void {
            super.ProcessAddChildPoint(point);
            this._curPoint = point;
        }

        private Recall(): void {
            this._curPoint.SetIsVisited();
            if (this._curPoint.parent == null) {
                this._isOver = true;
            }
            else {
                this._curPoint = this._curPoint.parent;
            }
        }

        protected FallBackOneStep(): void {
            // while (this._frontier.length > 0) {
            //     let tailPoint = this._frontier[this._frontier.length - 1];
            //     if (tailPoint.parent == this._curPoint) {
            //         this.ProcessTailUnvisited(tailPoint);
            //     }
            //     else{
            //         break;
            //     }
            // }
            // this._frontier.unshift(this._curPoint);
            // this._curPoint.SetIsProcess();
            // this._curPoint = this._curPoint.parent;
        }

        protected ProcessTailUnvisited(point:MapPoint):void{
            super.ProcessAddChildPoint(point);
            // this._frontier.pop();
        }

        public Reset(): void {
            this._isOver = false;
            super.Reset();
        }
    }
}