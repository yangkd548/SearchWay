module Dylan {
    export class BstarSearch extends DijkstraSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            let curRunPoint: MapPoint = this.frontier.shift() as MapPoint;
            this.SetCurPoint(curRunPoint);
            let forward = this.GetForwardPoint(this.curPoint, this.endPoint);
            this.CheckSucc(forward);
            if (this.isSucc) return;

            if (!this.DealNext(forward)) {
                //如果当前自有节点的climbDir == 0，表示需要分叉
                //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
                if (this.curPoint.isClimb || this.curPoint.climbDir != E_ClimbDir.None) {
                    //继续绕，找到1个点，设为绕爬点(4个方向，找到障碍物的下一个可走节点，weight!=Infinity即可，一定不是forward方向，可以是parent)
                    let count: number = this.frontier.length;
                    for (let i = 1; i <= 3; i++) {
                        let next = this.GetPointByDir(this.curPoint.dir + curRunPoint.climbDir * i);
                        if (next) {
                            if (this.DealNext(next, this.curPoint.climbDir)) break;
                        }
                    }
                }
                else {
                    //分叉走，找到2个点，都设为 绕爬点
                    //如果当前自有节点的climbDir == 0，表示需要分叉
                    //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
                    let wise = this.GetClockwise();
                    let noWise = this.GetCounterClockwise();
                    if (wise) this.AddFrontierPoint(wise);
                    if (noWise) this.AddFrontierPoint(noWise);
                    if(!wise || !noWise){
                        let climbDir:E_ClimbDir = (wise?0:E_ClimbDir.Clockwise) + (noWise?0:E_ClimbDir.NoClockwise);
                        let next = this.curPoint.parent;
                        this.PushParent(next);
                    }
                }
            }
        }

        private DealNext(next: MapPoint, climbDir: E_ClimbDir = E_ClimbDir.None): boolean {
            if (!this.IsClosed(next) && next.weight != Infinity && next.parent != this.curPoint) {
                if (!next.cost) {
                    //向前走一步
                    next.isClimb = false;
                    this.AddFrontierPoint(next);
                }
                else {
                    if (this.IsWayPoint(next, this.curPoint)) {
                        //遇到未关闭的递归父节点，回溯，并让父节点帮忙找
                        this.PushParent(next);
                    }
                    else {
                        //遇到其他分支节点 递归到分叉点，都设为关闭的
                        this.CloseBranch();
                    }
                }
                if (!next.isClosed) {
                    next.climbDir = climbDir;
                }
            }
            else {
                return false;
            }
            return true;
        }

        private PushParent(parent:MapPoint):void{
            this.CloseWayPoint(parent, this.curPoint, true);
            this.AddFrontierPoint(parent);//-----------------------------并让父节点帮忙找????
        }

        private IsClosed(point: MapPoint): boolean {
            if (point.isClosed) {
                //遇到 已结束的节点，递归到分叉点，都设为关闭的
                this.CloseBranch();
            }
            return point.isClosed;
        }

        private CloseBranch(): void {
            this.CloseWayPoint(this.curPoint.cross, this.curPoint);
        }

        private CloseWayPoint(start: MapPoint, end: MapPoint, ignoreStart: boolean = false): void {
            do {
                end.SetIsClosed();
                end = end.parent;
            }
            while (end != start);
            if (!ignoreStart) start.SetIsClosed();
        }

        protected AddFrontierPoint(point: MapPoint): void {
            this.CheckSucc(point);
            if (this.isSucc) return;
            if (point != this.startPoint) {
                point.parent = this.curPoint;
            }
            point.SetIsProcess();
            this.frontier.push(point);
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
            if (point) point.climbDir = E_ClimbDir.Clockwise;
            return point;
        }

        private GetCounterClockwise(): MapPoint {
            let point = this.GetPointByDir(this.curPoint.dir - 1);
            if (point) point.climbDir = E_ClimbDir.NoClockwise;
            return point;
        }

        private GetPointByDir(dir: E_MoveDir): MapPoint {
            return this.mapGraph.GetPointByDir(this.curPoint, dir % 4);
        }

    }
}