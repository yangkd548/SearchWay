module Dylan {
    export class BstarSearch extends DijkstraSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            log("\n------------------- 开始查找：", this.curPoint.key);
            this.DoBstarStep();
        }

        private DoBstarStep(): void {
            if (!this.curPoint.isClimb) {
                this.DealFreePoint();
            }
            else {
                this.DealClimbPoint();
            }
        }

        private DealFreePoint(): void {
            let forward = this.GetForwardPoint();
            if (this.ForwardIsBlock(forward)) {
                //遇到障碍
                this.BranchMove();
            }
            else if (forward.isOpened) {//等同于cost==0
                //遇到开放节点
                this.AddFrontierPoint(forward);
            }
            else {
                //遇到处理中的节点
                this.DealProcessPoint(forward);
            }
        }

        private DealClimbPoint(): void {
            //当前为绕爬点，
            //绕爬点，通过绕爬选出的点，还是绕爬点
            //绕爬点，可以走最佳点，最佳点跟绕爬点，不是一个点，这个最佳点就是自由点了！！！
            if (this.curPoint.climbRot == E_ClimbRot.None) {
                //遇到障碍
                this.BranchMove();
            }
            else {
                //执行绕爬
                this.TryClimbMove();
            }
        }

        private ForwardIsBlock(forward: MapPoint = null): boolean {
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
                next.climbRot = (wise ? 0 : E_ClimbRot.Clockwise) + (noWise ? 0 : E_ClimbRot.NoClockwise);
                this.PushParent(next);
                console.log("回退------", next.key);
            }
        }

        private RollBackClimb(lastPoint: MapPoint): void {
            let fromDir = this.GetMoveDir(this.curPoint, lastPoint);
            let finded = false;
            //绕爬点，从父节点开始（不含），按绕爬方向找可以走的点（如果是父节点，则执行，父节点处理）
            for (let i = 1; i <= 4; i++) {
                let checkDir = fromDir + this.curPoint.climbRot * i;
                console.log("RollBackClimb 绕爬 寻找------- ： ", i, checkDir);
                let next = this.GetPointByDir(checkDir);
                if (next && next.isOpened) {
                    console.log(`找到 绕行点（${this.curPoint.climbRot}）,待进一步处理：${next.key}`);
                    this.DoRealClimb(next);
                    finded = true;
                    break;
                }
            }
            if (!finded && this.curPoint.parent) this.PushParent(this.curPoint.parent);
        }

        private TryClimbMove(): void {
            let fromDir = this.GetClimbFromPos();
            let canFree = this.curPoint.canFree;
            //绕爬点，从父节点开始（不含），按绕爬方向找可以走的点（如果是父节点，则执行，父节点处理）
            for (let i = 1; i <= 4; i++) {
                let checkDir = fromDir + this.curPoint.climbRot * i;
                console.log("绕爬 寻找------- ： ", i);
                let next = this.GetPointByDir(checkDir);
                if (next) {
                    console.log(`找到 绕行点（${this.curPoint.climbRot}）,待进一步处理：${next.key}`);
                    this.DoClimbMove(next, canFree);
                    break;
                }
                if (canFree) canFree = MapPoint.GetFormatDir(this.curPoint.forwardDir) == MapPoint.GetFormatDir(checkDir);
            }
        }

        protected SetCurPoint(value: MapPoint): void {
            if (this.curPoint && this.curPoint.isRollBack) {
                this.curPoint.isRollBack = false;
            }
            this._curPoint = value;
            this.curPoint.forwardDir = this.GetMoveDir(this.curPoint, this.endPoint);
        }

        private AddBranchPoint(point: MapPoint, isNewBranch: boolean = false): void {
            //设置新分支，必须单独设置root节点
            if (isNewBranch) {
                this.SetNewBranchRoot(point);
            }
            this.AddFrontierPoint(point);
        }

        private SetNewBranchRoot(point: MapPoint): void {
            if (!point.root) {
                point.root = this.curPoint;
            }
        }

        private InheritBranchRoot(point: MapPoint): void {
            if (!point.root) {
                point.branch = point;
                if (!this.curPoint) this.SetNewBranchRoot(point);
                else point.root = this.curPoint.root;
            }
        }

        private DoClimbMove(next: MapPoint, isCanFree: boolean): void {
            if (next.isOpened) {
                this.DealClimbOpenedPoint(next, isCanFree);
            }
            else {
                if (next.isClimb) {
                    this.DealClimbMeetClimb(next);
                }
                else {
                    this.DealProcessPoint(next);
                }
            }
        }

        private DealClimbOpenedPoint(point: MapPoint, isCanFree: boolean): void {
            // 如果绕爬点，与Forward点，都可以通行，并且不相同，则分析变为自由节点，还需要记录分支信息
            if (isCanFree) {
                //此时，绕行节点转变为自由节点处理
                this.curPoint.isClimb = false;
                this.DealFreePoint();
                this.AddBranchPoint(point);
            }
            else {
                this.DoRealClimb(point);
            }
        }

        private DoRealClimb(point: MapPoint): void {
            point.climbRot = this.curPoint.climbRot;
            point.isClimb = true;
            console.log("普通绕行 ： ", point.key);
            this.AddBranchPoint(point);
        }

        private DealClimbMeetClimb(next: MapPoint): void {
            if (this.curPoint.root == next.root) {
                if (this.IsWayPoint(next, this.curPoint)) {
                    console.log("遇到父节点，关闭链路节点，回溯到父节点：", next);
                    //遇到未关闭的递归父节点，回溯，并让父节点帮忙找
                    this.PushParent(next);
                }
                else {
                    //遇到兄弟分支 节点？？？？？？？？？？？？？？？？？？？？？？？？？？？如何实现，可以走兄弟分支的节点。。。。
                    this.DealClimbOpenedPoint(next, false);
                }
            }
            else {
                this.CloseBranch();
            }
        }

        //自由节点，遇到自由节点、绕行节点
        //绕行节点，遇到自由节点
        //的 相关处理
        private DealProcessPoint(next: MapPoint): void {
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
            let lastPoint = this.curPoint;
            log("回退 节点：", parent ? parent.key : "null");
            if (!parent.climbRot) {
                parent.climbRot = this.curPoint.climbRot;
            }
            parent.isRollBack = true;
            this.CloseWayPoint(parent);
            //单次循环内，递归回退
            this.SetCurPoint(parent);
            this.RollBackClimb(lastPoint);
        }

        private CloseBranch(): void {
            this.CloseWayPoint(this.curPoint.root);
        }

        private CloseWayPoint(end: MapPoint): void {//, ignoreEnd: boolean = true): void {
            let start = this.curPoint;
            log("关闭 链路 ------------- ：", start.key, end.key);
            while (start != end) {
                if (start.isRollBack) {
                    start.rollCount++;
                    if (start.isClimb) {
                        if (start.rollCount == 1) {
                            start.SetIsClosed();
                        }
                    }
                    else if (start.rollCount == 2) {
                        start.SetIsClosed();
                    }
                }
                else start.SetIsClosed();
                log("关闭节点：", start.key);
                start = start.parent;
            }
            // if (!ignoreEnd) end.SetIsClosed();
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
            if (point.isClimb && !point.branch) {
                point.branch = this.curPoint.branch;
            }
            //当前逻辑使用isOpened判断forward节点，cost属性暂时没有使用
            point.cost = this.mapGraph.GetCost(this.curPoint, point);
            this.frontier.push(point);
        }

        // 获取（最佳）前进方向的点
        private GetForwardPoint(isMerge: boolean = false): MapPoint {
            let point = this.GetPointByDir(this.curPoint.forwardDir);
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
            return this.GetRealClimbPoint(E_ClimbRot.Clockwise);
        }        

        private GetCounterClockwise(): MapPoint {
            return this.GetRealClimbPoint(E_ClimbRot.NoClockwise);
        }

        private GetRealClimbPoint(climbRot:E_ClimbRot):MapPoint{
            let climbDir = this.curPoint.forwardDir + (climbRot == E_ClimbRot.Clockwise?1:-1);
            let point = this.GetPointByDir(climbDir);
            if (point && point.isOpened) {
                point.climbRot = climbRot;
                point.isClimb = true;
                this.AddBranchPoint(point, true);
                point.SetCurClimbDir(climbDir);
                log(`找到 ${climbRot == E_ClimbRot.Clockwise?"顺":"逆"}时针 分叉（${climbRot == E_ClimbRot.Clockwise?"+":"-"}1）：${point.key}`);
            }
            return point;
        }

        private GetClimbFromPos(): E_MoveDir {
            if (!this.curPoint.parent) {
                return this.GetMoveDir(this.endPoint, this.curPoint);
            }
            else {
                return this.GetMoveDir(this.curPoint, this.curPoint.parent);
            }
        }

        private GetPointByDir(dir: E_MoveDir): MapPoint {
            let point = this.mapGraph.GetPointByDir(this.curPoint, MapPoint.GetFormatDir(dir));
            //将关闭的节点，算作障碍
            if (!point || point.weight == Infinity || point.isClosed) return null;
            return point;
        }

    }
}