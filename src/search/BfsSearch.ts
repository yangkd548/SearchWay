module Dylan {
    export class BfsSearch extends BaseSearch {
        private readonly oppoFirst: boolean = false;
        private _frontier: MapPoint[] = [];
        private _visiteOrder: MapPoint[] = [];

        public get isOver(): boolean {
            return this._frontier.length == 0;
        }

        protected CheckSucc(point: MapPoint): void {
            super.CheckSucc(point);
            if (this.isSucc && !this._maxStep) {
                this._maxStep = this._visiteOrder.length;
            }
        }

        public Start(): boolean {
            if (super.Start()) {
                this.ProcessAddChildPoint(this.startPoint);
                return true;
            }
            return false;
        }

        public SearchCustomSteps(): void {
            switch (this.searchStep) {
                case E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.DoSearchSteps();
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
                default:
                    this.DoSearchSteps();
                    break;
            }
        }

        private SearchOneRound(): void {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            while (this._frontier.length > 0) {
                let next = this._frontier[0];
                if (Math.abs(next.x - this.mapGraph.startPoint.x) + Math.abs(next.y - this.mapGraph.startPoint.y) > this.fromStartDis) {
                    break;
                }
                this.SearchOneStep();
            }
            if (this.isOver) {
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
                    let newFlag = (next.x - this.mapGraph.startPoint.x) / (next.y - this.mapGraph.startPoint.y + 0.001) > 0;
                    if (flag == null) {
                        flag = newFlag;
                    }
                    else if (flag != newFlag) {
                        break;
                    }
                    this.SearchOneStep();
                }
            }
            if (this.isOver) {
                Laya.timer.clear(this, this.SearchOneSide);
            }
        }

        protected SearchOneStep(): void {
            if (!this.isInit || this.isOver || this.isSucc) return;
            // console.log("-------");
            this._curPoint = this._frontier.shift();
            this._curPoint.SetIsVisited();
            this._visiteOrder.push(this._curPoint);
            this.step = this._visiteOrder.length;
            // console.log("---- 基准点：", this._curPoint.x, this._curPoint.y);
            let neighbors: MapPoint[] = this.mapGraph.GetNeighbors(this._curPoint, this.oppoFirst);
            //查找周围顶点
            for (let next of neighbors) {
                //没有访问过
                if (next.isUnvisited) {
                    this.ProcessAddChildPoint(next);
                    this.CheckSucc(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
            this.EmitReDraw();
        }

        protected ProcessAddChildPoint(point: MapPoint): void {
            super.ProcessAddChildPoint(point);
            // if(this._frontier.indexOf(point)!=-1){
            //     console.log("----添加了相同点！！！----:",point.x, point.y,"   变色",false);
            // }
            this._frontier.push(point);
            // if (this.curPoint) console.log(this._processOrder.length, "  ++++ 基准点：", point.x, point.y, " ------ 父节点：  ", this.curPoint.x, this.curPoint.y, "   长度：", this._frontier.length);
            // else console.log("++++ 基准点：", point.x, point.y, " ------ 无 父节点！！！！！");
        }

        protected FallBackOneStep(): void {
            if (this.step == 0) return;
            let orderPoint: MapPoint = this._visiteOrder.pop();
            this.step = this._visiteOrder.length;
            let tail = this._frontier[this._frontier.length - 1];
            if (tail.parent != orderPoint) {
                this._curPoint = orderPoint;
            }
            else {
                let last: MapPoint;
                while (this._frontier.length > 0) {
                    let tail = this._frontier[this._frontier.length - 1];
                    if (!last || tail.parent == last.parent) {
                        this._curPoint = tail.parent;
                        this.ProcessTailUnvisited(tail);
                        this.CheckFallOrigin(last);
                        if (!this.isStarted) {
                            break;
                        }
                        last = tail;
                    }
                    else {
                        break;
                    }
                }
            }
            if (this.isStarted) {
                this._curPoint.SetIsProcess();
                this._frontier.unshift(this._curPoint);
            }
            this.EmitReDraw();
        }

        protected ProcessTailUnvisited(point: MapPoint): void {
            super.ProcessTailUnvisited(point);
            this._frontier.pop();
        }

        public Reset(): void {
            this._frontier.splice(0);
            this._visiteOrder.splice(0);
            super.Reset();
        }
    }
}