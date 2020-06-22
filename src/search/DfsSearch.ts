module Dylan {
    export class DfsSearch extends BaseSearch {
        private readonly oppoFirst: boolean = true;

        public DoSearch(): void {
            switch (this.searchStep) {
                case E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.SearchOnePoint();
                    }
                    break;
            }
        }

        protected DoSearchOnePoint(): void {
            // console.log("-------");
            if (this._cur == null) {
                this._cur = this.start;
            }
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            let hasUnvisited = false;
            //查找周围顶点
            let neighbors: MapPoint[] = this._mapGraph.GetNeighbors(this._cur, this.oppoFirst);
            for (let next of neighbors) {
                //没有访问过
                if (next.isUnvisited) {
                    this.PushQueue(next);
                    if (this._end == next) {
                        this._cur = this._end;
                        this._isSucc = true;
                    }
                    hasUnvisited = true;
                    this._cur.SetInQueue();
                    this._cur = next;
                    break;
                }
            }
            this.EmitReDraw();
            if (this._isSucc) {
                this.Clear();
            }
            else {
                if (!hasUnvisited) {
                    //执行回溯（先回溯一步，不行再回溯一步...）
                    this.Recall();
                }
            }
        }

        private Recall(): void {
            this._cur.SetIsVisited();
            if(this._cur.parent == null){
                this._frontier.splice(0);
            }
            else{
                this._cur = this._cur.parent;
            }
        }
    }
}