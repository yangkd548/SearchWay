module Dylan {
    export class BstarSearch extends DijkstraSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            let curRunPoint: MapPoint = this.frontier.shift() as MapPoint;
            this.SetCurPoint(curRunPoint);
            let forward = this.GetForwardPoint(this.curPoint, this.endPoint);
            // this.CheckSucc(forward);
            // if(this.isSucc) return;
            if (forward.weight != Infinity && forward != this.curPoint.parent) {
                if (!forward.cost) {
                    //向前走一步
                    forward.isClimb = false;
                    this.AddFrontierPoint(forward);
                }
                else {
                    log("当前分支，发生合并--------终止查找");
                    //或者对比cost和newCost，然后，替换父节点？？？
                }
            }
            else {
                if (this.curPoint.isClimb) {
                    //继续绕，找到1个点，设为绕爬点(4个方向，找到障碍物的下一个可走节点，weight!=Infinity即可，一定不是forward方向，可以是parent)
                    for (let i = 1; i <= 4; i++) {
                        if (curRunPoint.climbDir == 0) return;
                        let next = this.GetPointByDir(this.curPoint.dir + curRunPoint.climbDir * i);
                        if (next && next.weight != Infinity) {
                            this.AddFrontierPoint(next);
                            break;
                        }
                    }
                }
                else {
                    //分叉走，找到2个点，都设为 绕爬点
                    let wise = this.GetClockwise();
                    let noWise = this.GetCounterClockwise();

                }
            }
        }

        public AddFrontierPoint(point: MapPoint): void {
            BaseBfsSearch.prototype.AddFrontierPoint.call(this, point);
            if (this.curPoint) {
                point.cost = this.mapGraph.GetCost(this.curPoint, point);
                point.f = point.cost + this.mapGraph.GetHeuristicDis(point, this.endPoint) * 1.01;
            }
            let lastPos = this.frontier.indexOf(point);
            if (lastPos != -1) {
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "f", point, 0, lastPos);
        }

        // 确定移动时的 方向（上下左右）
        private GetForwardPoint(cur: MapPoint, end: MapPoint): MapPoint {
            const disX = Math.abs(cur.x - end.x); //取绝对值
            const disY = Math.abs(cur.y - end.y); //取绝对值
            let dir = E_MoveDir.NONE;
            if (disX >= disY) {
                if (cur.x >= end.x) {
                    dir = E_MoveDir.LEFT;
                } else {
                    dir = E_MoveDir.RIGHT;
                    this.mapGraph.GetPoint
                }
            } else {
                if (cur.y >= end.y) {
                    dir = E_MoveDir.DOWN;
                } else {
                    dir = E_MoveDir.UP;
                }
            }
            cur.dir = dir;
            return this.GetPointByDir(dir);
        }

        private GetClockwise(): MapPoint {
            let point = this.GetPointByDir(this.curPoint.dir + 1);
            point.climbDir = E_ClimbDir.Clockwise;
            return point;
        }

        private GetCounterClockwise(): MapPoint {
            let point = this.GetPointByDir(this.curPoint.dir - 1);
            point.climbDir = E_ClimbDir.CounterClockwise;
            return point;
        }

        private GetPointByDir(dir: E_MoveDir): MapPoint {
            return this.mapGraph.GetPointByDir(this.curPoint, dir % 4);
        }

    }
}