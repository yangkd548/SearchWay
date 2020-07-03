module Dylan {
    export class BstarSearch extends DijkstraSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            log("\n------------------- 开始查找：", this.curPoint.key);
            this.DoBstarStep();
        }

        private DoBstarStep():void{
            if (!this.curPoint.isClimb) {
                //走过的节点（isProcess == true），可以再次选择？？？？？？？？？？？？？？？？？？？？？？？？？？
                //关闭的节点，不可以再选择！！！
                //没有走的节点，一定可以！先判断这个！！！！！！！！
                let forward = this.GetForwardPoint();
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
                        this.DealNoOpenPoint(forward);
                    }
                }
            }
            else {
                //当前为绕爬点，
                //绕爬点，通过绕爬选出的点，还是绕爬点
                //绕爬点，可以走最佳点，最佳点跟绕爬点，不是一个点，这个最佳点就是自由点了！！！
                if (this.curPoint.climbRot == E_ClimbRotation.None) {
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
            return forward == null || forward.weight == Infinity || forward.isClosed;
        }

        //执行分叉前进
        private BranchMove(): void {
            //分叉走，找到2个点，都设为 绕爬点
            //如果当前自有节点的climbDir == 0，表示需要分叉
            //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
            let wise = this.GetClockwise();
            let noWise = this.GetCounterClockwise();
            if (!wise || !noWise) {
                let next = this.curPoint.parent;
                next.climbRot = (wise ? 0 : E_ClimbRotation.Clockwise) + (noWise ? 0 : E_ClimbRotation.NoClockwise);
                next.isClimb = true;
                this.PushParent(next);
                console.log("回退------", next.key);
            }
        }

        private ClimbMove(point: MapPoint): void {
            let fromPos = this.GetClimbFromPos();
            //绕爬点，从父节点开始（不含），按绕爬方向找可以走的点（如果是父节点，则执行，父节点处理）
            for (let i = 1; i <= 4; i++) {
                console.log("绕爬 寻找------- ： ", i);
                let next = this.GetPointByDir(fromPos + this.curPoint.climbRot * i);
                if (next) {
                    console.log(`找到 绕行点（${this.curPoint.climbRot}）,待进一步处理：${next.key}`);
                    if (this.TryClimbMove(next)) break;
                }
            }
        }

        protected SetCurPoint(value: MapPoint): void {
            this._curPoint = value;
            this.curPoint.forward = this.GetMoveDir(this.curPoint, this.endPoint);
        }

        private AddBranchPoint(point: MapPoint, isNewBranch: boolean = false): void {
            if (isNewBranch) {
                this.SetNewBranchRoot(point);
            }
            this.AddFrontierPoint(point);
        }

        private SetNewBranchRoot(point: MapPoint): void {
            if (!point.root) {
                point.root = point;
            }
        }

        private InheritBranchRoot(point: MapPoint): void {
            if (!point.root) {
                if (!this.curPoint) this.SetNewBranchRoot(point);
                else point.root = this.curPoint.root;
            }
        }

        private TryClimbMove(next: MapPoint): boolean {
            //这里的关闭（this.IsClosed(next)），可能会被GetPointByDir的返回约束，拦截了，考虑一下？？？？？？？？？？？？？？？？
            if (!this.IsClosed(next)) {
                if (next.isOpened) {
                    this.PostClimbMove(next);
                }
                else {
                    this.DealNoOpenPoint(next);
                }
            }
            else {
                return false;
            }
            return true;
        }

        private PostClimbMove(point: MapPoint): void {
            let forward = this.GetForwardPoint(true);
            // 如果绕爬点，与Forward点，都可以通行，并且不相同，则分析变为自由节点，还需要记录分支信息
            if (forward && forward.isOpened && point != forward) {
                //绕爬分支，这时 自由了，添加的是一个自由节点
                console.log("变为自由节点！！！", point.key, forward.key, this.curPoint.parent.key);
                point = forward;
            }
            else {
                point.climbRot = this.curPoint.climbRot;
                console.log("普通绕行 ： ", point.key);
            }
            this.AddBranchPoint(point);
        }

        //一个简单的方案，就是，遇到绕行的另一个分支，直接关闭对方，然后自己自由了？？？

        private DealNoOpenPoint(next: MapPoint): void {
            if (this.IsWayPoint(next, this.curPoint)) {
                console.log("遇到父节点，关闭链路节点，回溯到父节点：", next);
                //遇到未关闭的递归父节点，回溯，并让父节点帮忙找
                this.PushParent(next);
            }
            else {
                console.log("仅关闭链路节点：", next);
                //遇到其他分支节点 递归到自己的分叉点，路径点设为关闭的
                //其实这里，不添加点，就够了。关闭branch分支的点可以不执行。
                this.CloseBranch();
            }
        }

        private PushParent(parent: MapPoint): void {
            parent.climbRot = this.curPoint.climbRot;
            this.CloseWayPoint(parent, true);
            this.DoBstarStep();
            // this.AddFrontierPoint(parent, true);//-----------------------------并让父节点帮忙找????
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
            this.CloseWayPoint(this.curPoint.root);
        }

        private CloseWayPoint(end: MapPoint, ignoreEnd: boolean = false): void {
            let start = this.curPoint;
            while (start != end) {
                start.SetIsClosed();
                start = start.parent;
            }
            if (!ignoreEnd) end.SetIsClosed();
        }

        protected AddFrontierPoint(point: MapPoint, rollback: boolean = false): void {
            //关闭的点，不再加入process队列，是否正确？？？？？？？？？？
            if (point.isClosed) return;
            this.CheckSucc(point);
            if (!rollback && this.curPoint) {// && this.curPoint.parent != point) {
                this.SetPointParent(point);
            }
            if (this.isSucc) return;
            point.SetIsProcess();
            this.InheritBranchRoot(point);
            //当前逻辑使用isOpened判断forward节点，cost属性暂时没有使用
            point.cost = this.mapGraph.GetCost(this.curPoint, point);
            this.frontier.push(point);
        }

        // 获取（最佳）前进方向的点
        private GetForwardPoint(isMerge: boolean = false): MapPoint {
            let point = this.GetPointByDir(this.curPoint.forward);
            if (point && point != this.curPoint.parent) {
                log(isMerge ? "检查 是否设为 自由节点：\t" : "", this.curPoint.key, "找到 前进方向：", point.key);
            }
            else {
                log(isMerge ? "检查 是否设为 自由节点：\t" : "", this.curPoint.key, "前进方向，受阻 ！！！");
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
            if (point && point.isOpened) {
                point.climbRot = E_ClimbRotation.Clockwise;
                this.AddBranchPoint(point, true);
                log("找到 顺时针 分叉（+1）：", point.key);
            }
            return point;
        }

        private GetCounterClockwise(): MapPoint {
            let point = this.GetPointByDir(this.curPoint.forward - 1);
            if (point && point.isOpened) {
                point.climbRot = E_ClimbRotation.NoClockwise;
                this.AddBranchPoint(point, true);
                log("找到 逆时针 分叉（-1）：", point.key);
            }
            return point;
        }

        private GetClimbFromPos():E_MoveDir{
            if(!this.curPoint.parent){
                return this.GetMoveDir(this.endPoint, this.curPoint);
            }
            else{
                return this.GetMoveDir(this.curPoint, this.curPoint.parent);
            }
        }

        private GetPointByDir(dir: E_MoveDir): MapPoint {
            let point = this.mapGraph.GetPointByDir(this.curPoint, dir % 4);
            if (!point || point.weight == Infinity) return null;
            return point;
        }

    }
}