module Dylan{
    export class DijkstraSearch extends BfsSearch{
        protected DoSearchOneStep(): void {
            if (!this.isInit || this.isOver || this.isSucc) return;
            // console.log("-------");
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());

            this.curPoint.SetIsVisited();
            // console.log("---- 基准点：", this.curPoint.x, this.curPoint.y);
            let neighbors: MapPoint[] = this.mapGraph.GetNeighbors(this.curPoint, this.oppoFirst);
            for (let next of neighbors) {
                if (next.isUnvisited) {
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
            this.EmitReDraw();

            this.frontier.push(this.startPoint)
            let came_from = {}
            came_from[this.startPoint.id] = null;
            let cost_so_far = {}
            cost_so_far[this.startPoint.id] = 0;

            while (this.frontier.length > 0) {
                this.SetCurPoint(this.frontier.shift());

                if (this.curPoint == this.endPoint)
                    break;
                //GetNeighbors --> edges_from
                for (let next of this.mapGraph.GetNeighbors(this.curPoint)) {
                    let new_cost = cost_so_far[this.curPoint.id] + this.mapGraph.cost(this.curPoint, next);
                    if ((!cost_so_far[next.id]) || new_cost < cost_so_far[next.id]) {
                        cost_so_far[next.id] = new_cost;
                        let priority = new_cost;
                        this.frontier.push(next, priority);
                        came_from[next.id] = this.curPoint;//父子关系
                    }
                }
            }
        }
    }
}