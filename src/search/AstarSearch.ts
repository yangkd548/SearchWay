module Dylan {
    export class AstarSearch extends DijkstraSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (let next of this.mapGraph.GetNeighbors(this.curPoint)) {
                let newCost = this.mapGraph.GetCost(this.curPoint, next);
                if (!next.cost || newCost < next.cost) {
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        }

        public AddFrontierPoint(point: MapPoint): void {
            BaseBfsSearch.prototype.AddFrontierPoint.call(this, point);
            if (this.curPoint) {
                point.cost = this.mapGraph.GetCost(this.curPoint, point);
                point.f = point.cost + this.mapGraph.GetHeuristicDis(this.endPoint, point) * 1.3;//1.01即可实现部分走斜线的功效
            }
            let lastPos = this.frontier.indexOf(point);
            if (lastPos != -1) {
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "f", point, 0, lastPos);
            for (let i in this.frontier) {
                log(i, this.frontier[i].f, this.frontier[i].key);
            }
        }

    }
}