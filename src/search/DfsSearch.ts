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
            if (!this.isInit || this.isOver || this.isSucc) return;
            this.AddStep();
            if (this.curPoint == null) {
                this.SetCurPoint(this.startPoint);
            }
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