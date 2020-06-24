module Dylan {
    export class DfsSearch extends BaseSearch {
        private readonly oppoFirst: boolean = true;

        private _isOver: boolean = false;
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

        protected DoSearchOneStep(): void {
            // console.log("-------");
            if (!this.isInit || this.isOver || this.isSucc) return;
            this.AddStep();
            console.log(this.step, this._isSucc, this.step >= this._maxStep);
            if (this.curPoint == null) {
                this.SetCurPoint(this.startPoint);
            }
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            let hasUnvisited = false;
            let neighbors: MapPoint[] = this.mapGraph.GetNeighbors(this.curPoint, this.oppoFirst);
            for (let next of neighbors) {
                if (next.isUnvisited) {
                    hasUnvisited = true;
                    this.AddFrontierPoint(next);
                    break;
                }
            }
            if (!this.isSucc && !hasUnvisited) {
                this.Recall();
            }
            this.EmitReDraw();
        }

        protected AddFrontierPoint(point: MapPoint): void {
            super.AddFrontierPoint(point);
            this.SetCurPoint(point);
        }

        private Recall(): void {
            this.curPoint.SetIsVisited();
            if (this.curPoint.parent == null) {
                this._isOver = true;
            }
            else {
                this.SetCurPoint(this.curPoint.parent);
            }
        }

        public Reset(): void {
            this._isOver = false;
            super.Reset();
        }
    }
}