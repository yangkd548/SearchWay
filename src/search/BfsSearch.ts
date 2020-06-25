module Dylan {
    export class BfsSearch extends BfsBaseSearch {

        protected DoSearchOneStep(): void {
            if (!this.isInit || this.isOver || this.isSucc) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (let next of this.mapGraph.GetNeighbors(this.curPoint)) {
                if (next.isUnvisited) {
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
            this.EmitReDraw();
        }
        
        protected AddFrontierPoint(point: MapPoint): void {
            super.AddFrontierPoint(point);
            this.frontier.push(point);
        }
    }
}