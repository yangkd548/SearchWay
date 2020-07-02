module Dylan {
    export class BstarSearch extends DijkstraSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            log("\n------------------- 开始查找：", this.curPoint.key);

            if (!this.curPoint.isClimb) {
                //走过的节点（isProcess == true），可以再次选择？？？？？？？？？？？？？？？？？？？？？？？？？？
                //关闭的节点，不可以再选择！！！
                //没有走的节点，一定可以！先判断这个！！！！！！！！
                let forward = this.GetForwardPoint(this.curPoint, this.endPoint);
                if (this.ForwardIsBlock(forward)) {
                    //遇到障碍
                    this.BranchMove();
                }
                else {
                    if (forward.isOpened) {//等同于cost==0
                        //向前走一步
                        this.AddFrontierPoint(forward);
                    }
                    else {
                        this.DearHasCostPoint(forward);
                    }
                }
            }
            else {
                //当前为绕爬点，
                //绕爬点，通过绕爬选出的点，还是绕爬点
                //绕爬点，可以走最佳点，最佳点跟绕爬点，不是一个点，这个最佳点就是自由点了！！！
                if (this.curPoint.climbDir == E_ClimbDir.None) {
                    //遇到障碍
                    this.BranchMove();
                }
                else {
                    //执行绕爬
                    this.ClimbMove(this.curPoint);
                }
            }
        }

        private ForwardIsBlock(forward: MapPoint = null): boolean {
            if (!forward) {
                forward = this.GetPointByDir(this.curPoint.forward);
            }
            return !(forward != null && forward.weight != Infinity && forward.isClosed);
        }

        //执行分叉前进
        private BranchMove(): void {
            //分叉走，找到2个点，都设为 绕爬点
            //如果当前自有节点的climbDir == 0，表示需要分叉
            //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
            let wise = this.GetClockwise();
            let noWise = this.GetCounterClockwise();
            if (wise) this.AddBranchPoint(wise);
            if (noWise) this.AddBranchPoint(noWise);
            if (!wise || !noWise) {
                let next = this.curPoint.parent;
                next.climbDir = (wise ? 0 : E_ClimbDir.Clockwise) + (noWise ? 0 : E_ClimbDir.NoClockwise);
                next.isClimb = true;
                this.PushParent(next);
                console.log("回退------", next.key);
            }
        }

        private ClimbMove(point: MapPoint): void {
            let fromDir = this.GetMoveDir(point, point.parent)
            //绕爬点，从父节点开始（不含），按绕爬方向找可以走的点（如果是父节点，则执行，父节点处理）
            for (let i = 1; i <= 3; i++) {
                let next = this.GetPointByDir(fromDir + this.curPoint.climbDir * i);
                if (next) {
                    console.log(`找到 绕行点（${this.curPoint.climbDir}）,待进一步处理：${next.key}`);
                    if (this.TryClimbMove(next)) break;
                }
            }
        }

        protected SetCurPoint(value: MapPoint): void {
            this._curPoint = value;
            this.curPoint.forward = this.GetMoveDir(this.curPoint, this.endPoint);
        }

        private AddBranchPoint(point: MapPoint): void {
            this.SetBranchCross(point);
            this.AddFrontierPoint(point);
        }

        private SetBranchCross(point: MapPoint): void {
            point.cross = this.curPoint.cross || point;
        }

        private TryClimbMove(next: MapPoint): boolean {
            //这里的关闭（this.IsClosed(next)），可能会被GetPointByDir的返回约束，拦截了，考虑一下？？？？？？？？？？？？？？？？
            if (next != null && !this.IsClosed(next) && next.parent != this.curPoint) {
                if (!next.cost) {
                    //向前走一步
                    this.AddFrontierPoint(next);
                    this.PostClimbPoint(next);
                }
                else {
                    this.DearHasCostPoint(next);
                }
            }
            else {
                return false;
            }
            return true;
        }

        private PostClimbPoint(point: MapPoint): void {
            if (!point.isClosed) {
                let forward = this.GetForwardPoint(this.curPoint, this.endPoint);
                //如果绕爬点，与Forward点相同，则设为自由点
                if (point == forward) {
                    //绕爬点，这时 自由了
                    point.isClimb = false;
                }
                else {
                    point.climbDir = this.curPoint.climbDir;
                    this.SetBranchCross(point);
                }
            }
        }

        private DearHasCostPoint(next: MapPoint): void {
            if (this.IsWayPoint(next, this.curPoint)) {
                //遇到未关闭的递归父节点，回溯，并让父节点帮忙找
                this.PushParent(next);
            }
            else {
                //遇到其他分支节点 递归到自己的分叉点，路径点设为关闭的
                this.CloseBranch();
            }
        }

        private PushParent(parent: MapPoint): void {
            this.CloseWayPoint(parent, true);
            this.AddFrontierPoint(parent);//-----------------------------并让父节点帮忙找????
        }

        private IsClosed(point: MapPoint): boolean {
            if (point.isClosed) {
                //遇到 已结束的节点，递归到分叉点，都设为关闭的？？？？？？？
                //是 应该关闭吗？？？？？
                //还是 根本不会遇到 已经关闭的点（逻辑在外层已经过滤了呢？？？？？）
                this.CloseBranch();
            }
            return point.isClosed;
        }

        private CloseBranch(): void {
            this.CloseWayPoint(this.curPoint.cross);
        }

        private CloseWayPoint(end: MapPoint, ignoreEnd: boolean = false): void {
            let start = this.curPoint;
            do {
                start.SetIsClosed();
                start = start.parent;
            }
            while (start != end);
            if (!ignoreEnd) end.SetIsClosed();
        }

        protected AddFrontierPoint(point: MapPoint): void {
            //关闭的点，不再加入process队列，是否正确？？？？？？？？？？
            if (point.isClosed) return;
            this.CheckSucc(point);
            if (this.curPoint && this.curPoint.parent != point) {
                this.SetPointParent(point);
            }
            if (this.isSucc) return;
            point.SetIsProcess();
            this.frontier.push(point);
        }

        // 确定移动时的 方向（上下左右）
        private GetForwardPoint(cur: MapPoint, end: MapPoint): MapPoint {
            cur.forward = this.GetMoveDir(cur, end);
            let point = this.GetPointByDir(cur.forward);
            if (point) {
                log("找到 前进方向：", point.key);
            }
            else {
                log("前进方向，受阻 ！！！");
            }
            return point;
        }

        private GetMoveDir(from: MapPoint, to: MapPoint): E_MoveDir {
            const disX = Math.abs(from.x - to.x); //取绝对值
            const disY = Math.abs(from.y - to.y); //取绝对值
            let dir = E_MoveDir.NONE;
            if (disX >= disY) {
                if (from.x >= to.x) {
                    dir = E_MoveDir.LEFT;
                } else {
                    dir = E_MoveDir.RIGHT;
                }
            } else {
                if (from.y >= to.y) {
                    dir = E_MoveDir.UP;
                } else {
                    dir = E_MoveDir.DOWN;
                }
            }
            return dir;
        }

        private GetClockwise(): MapPoint {
            let point = this.GetPointByDir(this.curPoint.forward + 1);
            if (point) {
                point.climbDir = E_ClimbDir.Clockwise;
                log("找到 顺时针 分叉（+1）：", point.key);
            }
            return point;
        }

        private GetCounterClockwise(): MapPoint {
            let point = this.GetPointByDir(this.curPoint.forward - 1);
            if (point) {
                point.climbDir = E_ClimbDir.NoClockwise;
                log("找到 逆时针 分叉（-1）：", point.key);
            }
            return point;
        }

        private GetPointByDir(dir: E_MoveDir): MapPoint {
            let point = this.mapGraph.GetPointByDir(this.curPoint, dir % 4);
            if (!point || point.weight == Infinity || point.isClosed) return null;
            return point;
        }

    }
}