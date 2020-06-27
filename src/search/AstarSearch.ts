module Dylan {
    export class AstarSearch extends DijkstraSearch {
        
        protected DoSearchOneStep(): void {
            if (!this.isInit || this.isOver || this.isSucc) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (let next of this.mapGraph.GetNeighbors(this.curPoint)) {
                let newCost = this.mapGraph.GetCost(this.curPoint, next);
                if (!next.cost || newCost < next.cost) {
                    next.cost = newCost;
                    next.f = newCost + this.mapGraph.GetHeuristicDis(this.endPoint, next);
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        }

        protected AddFrontierPoint(point: MapPoint): void {
            super.AddFrontierPoint(point);
            let lastPos = this.frontier.indexOf(point);
            if(lastPos != -1){
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "f", point, 0, lastPos);
        }

    }
}