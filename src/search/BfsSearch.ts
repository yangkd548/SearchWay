module Dylan {
    export class BfsSearch extends BaseBfsSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (let next of this.mapGraph.GetNeighbors(this.curPoint)) {
                if (next.isOpened) {
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        }
        
        protected AddFrontierPoint(point: MapPoint): void {
            super.AddFrontierPoint(point);
            if(this.isSucc) return;
            this.frontier.push(point);
        }
    }
}