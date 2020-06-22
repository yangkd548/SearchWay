module Dylan{
    export class BfsSearch extends BaseSearch {
        private readonly oppoFirst:boolean = false;

        public DoSearch(): void {
            switch (this.searchStep) {
                case E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.SearchOnePoint();
                    }
                    break;
                case E_SearchStep.OnceRound:
                    if (this.driveTimes % 10 == 0) {
                        this.SearchOneRound();
                    }
                    break;
                case E_SearchStep.OnceSide:
                    if (this.driveTimes % 3 == 0) {
                        this.SearchOneSide();
                    }
                    break;
            }
        }

        private SearchOneRound(): void {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            while (this._frontier.length > 0) {
                let next = this._frontier[0];
                if (Math.abs(next.x - this._start.x) + Math.abs(next.y - this._start.y) > this.fromStartDis) {
                    break;
                }
                this.DoSearchOnePoint();
            }
            if (this._frontier.length == 0) {
                Laya.timer.clear(this, this.SearchOneRound);
                this.fromStartDis = 0;
            }
        }

        private SearchOneSide(): void {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            if (this._frontier.length > 0) {
                let flag = null;
                while (this._frontier.length > 0) {
                    let next = this._frontier[0];
                    let newFlag = (next.x - this._start.x) / (next.y - this._start.y + 0.001) > 0;
                    if (flag == null) {
                        flag = newFlag;
                    }
                    else if (flag != newFlag) {
                        break;
                    }
                    this.DoSearchOnePoint();
                }
            }
            if (this._frontier.length == 0) {
                Laya.timer.clear(this, this.SearchOneSide);
            }
        }

        protected DoSearchOnePoint(): void {
            // console.log("-------");
            this._cur = this._frontier.shift();
            this._cur.SetIsVisited();
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            let neighbors:MapPoint[] = this._mapGraph.GetNeighbors(this._cur, this.oppoFirst);
            //查找周围顶点
            for (let next of neighbors) {
                //没有访问过
                if (next.isUnvisited) {
                    this.PushQueue(next);
                    if (this._end == next) {
                        this._cur = this._end;
                        this._isSucc = true;
                        break;
                    }
                }
            }
            this.EmitReDraw();
            if (this._isSucc) this.Clear();
        }
    }
}