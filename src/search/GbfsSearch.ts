module Dylan {
    export class GbfsSearch extends DijkstraSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (let next of this.mapGraph.GetNeighbors(this.curPoint)) {
                if (next.parent == null) {
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        }

        public AddFrontierPoint(point: MapPoint): void {
            BaseBfsSearch.prototype.AddFrontierPoint.call(this, point);
            point.heuristic = this.mapGraph.GetHeuristicDis(this.endPoint, point);
            let lastPos = this.frontier.indexOf(point);
            if (lastPos != -1) {
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "heuristic", point, 0, lastPos);
        }
    }
}