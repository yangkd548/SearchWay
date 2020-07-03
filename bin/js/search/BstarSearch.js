var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dylan;
(function (Dylan) {
    var BstarSearch = /** @class */ (function (_super) {
        __extends(BstarSearch, _super);
        function BstarSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BstarSearch.prototype.DoSearchOneStep = function () {
            if (!this.isRunning)
                return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            Dylan.log("\n------------------- 开始查找：", this.curPoint.key);
            this.DoBstarStep();
        };
        BstarSearch.prototype.DoBstarStep = function () {
            if (!this.curPoint.isClimb) {
                //走过的节点（isProcess == true），可以再次选择？？？？？？？？？？？？？？？？？？？？？？？？？？
                //关闭的节点，不可以再选择！！！
                //没有走的节点，一定可以！先判断这个！！！！！！！！
                var forward = this.GetForwardPoint();
                if (this.ForwardIsBlock(forward)) {
                    //遇到障碍
                    this.BranchMove();
                }
                else {
                    if (forward.isOpened) { //等同于cost==0
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
                if (this.curPoint.climbRot == Dylan.E_ClimbRotation.None) {
                    //遇到障碍
                    this.BranchMove();
                }
                else {
                    //执行绕爬
                    this.ClimbMove(this.curPoint);
                }
            }
        };
        BstarSearch.prototype.ForwardIsBlock = function (forward) {
            if (forward === void 0) { forward = null; }
            if (!forward) {
                forward = this.GetPointByDir(this.curPoint.forward);
            }
            return forward == null || forward.weight == Infinity || forward.isClosed;
        };
        //执行分叉前进
        BstarSearch.prototype.BranchMove = function () {
            //分叉走，找到2个点，都设为 绕爬点
            //如果当前自有节点的climbDir == 0，表示需要分叉
            //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
            var wise = this.GetClockwise();
            var noWise = this.GetCounterClockwise();
            if (!wise || !noWise) {
                var next = this.curPoint.parent;
                next.climbRot = (wise ? 0 : Dylan.E_ClimbRotation.Clockwise) + (noWise ? 0 : Dylan.E_ClimbRotation.NoClockwise);
                next.isClimb = true;
                this.PushParent(next);
                console.log("回退------", next.key);
            }
        };
        BstarSearch.prototype.ClimbMove = function (point) {
            var fromPos = this.GetClimbFromPos();
            //绕爬点，从父节点开始（不含），按绕爬方向找可以走的点（如果是父节点，则执行，父节点处理）
            for (var i = 1; i <= 4; i++) {
                console.log("绕爬 寻找------- ： ", i);
                var next = this.GetPointByDir(fromPos + this.curPoint.climbRot * i);
                if (next) {
                    console.log("\u627E\u5230 \u7ED5\u884C\u70B9\uFF08" + this.curPoint.climbRot + "\uFF09,\u5F85\u8FDB\u4E00\u6B65\u5904\u7406\uFF1A" + next.key);
                    if (this.TryClimbMove(next))
                        break;
                }
            }
        };
        BstarSearch.prototype.SetCurPoint = function (value) {
            this._curPoint = value;
            this.curPoint.forward = this.GetMoveDir(this.curPoint, this.endPoint);
        };
        BstarSearch.prototype.AddBranchPoint = function (point, isNewBranch) {
            if (isNewBranch === void 0) { isNewBranch = false; }
            if (isNewBranch) {
                this.SetNewBranchRoot(point);
            }
            this.AddFrontierPoint(point);
        };
        BstarSearch.prototype.SetNewBranchRoot = function (point) {
            if (!point.root) {
                point.root = point;
            }
        };
        BstarSearch.prototype.InheritBranchRoot = function (point) {
            if (!point.root) {
                if (!this.curPoint)
                    this.SetNewBranchRoot(point);
                else
                    point.root = this.curPoint.root;
            }
        };
        BstarSearch.prototype.TryClimbMove = function (next) {
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
        };
        BstarSearch.prototype.PostClimbMove = function (point) {
            var forward = this.GetForwardPoint(true);
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
        };
        //一个简单的方案，就是，遇到绕行的另一个分支，直接关闭对方，然后自己自由了？？？
        BstarSearch.prototype.DealNoOpenPoint = function (next) {
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
        };
        BstarSearch.prototype.PushParent = function (parent) {
            parent.climbRot = this.curPoint.climbRot;
            this.CloseWayPoint(parent, true);
            this.DoBstarStep();
            // this.AddFrontierPoint(parent, true);//-----------------------------并让父节点帮忙找????
        };
        BstarSearch.prototype.IsClosed = function (point) {
            if (point.isClosed) {
                //遇到 已结束的节点，递归到分叉点，都设为关闭的？？？？？？？
                //是 应该关闭吗？？？？？
                //还是 根本不会遇到 已经关闭的点（逻辑在外层已经过滤了呢？？？？？）
                this.CloseBranch();
            }
            return point.isClosed;
        };
        BstarSearch.prototype.CloseBranch = function () {
            this.CloseWayPoint(this.curPoint.root);
        };
        BstarSearch.prototype.CloseWayPoint = function (end, ignoreEnd) {
            if (ignoreEnd === void 0) { ignoreEnd = false; }
            var start = this.curPoint;
            while (start != end) {
                start.SetIsClosed();
                start = start.parent;
            }
            if (!ignoreEnd)
                end.SetIsClosed();
        };
        BstarSearch.prototype.AddFrontierPoint = function (point, rollback) {
            if (rollback === void 0) { rollback = false; }
            //关闭的点，不再加入process队列，是否正确？？？？？？？？？？
            if (point.isClosed)
                return;
            this.CheckSucc(point);
            if (!rollback && this.curPoint) { // && this.curPoint.parent != point) {
                this.SetPointParent(point);
            }
            if (this.isSucc)
                return;
            point.SetIsProcess();
            this.InheritBranchRoot(point);
            //当前逻辑使用isOpened判断forward节点，cost属性暂时没有使用
            point.cost = this.mapGraph.GetCost(this.curPoint, point);
            this.frontier.push(point);
        };
        // 获取（最佳）前进方向的点
        BstarSearch.prototype.GetForwardPoint = function (isMerge) {
            if (isMerge === void 0) { isMerge = false; }
            var point = this.GetPointByDir(this.curPoint.forward);
            if (point && point != this.curPoint.parent) {
                Dylan.log(isMerge ? "检查 是否设为 自由节点：\t" : "", this.curPoint.key, "找到 前进方向：", point.key);
            }
            else {
                Dylan.log(isMerge ? "检查 是否设为 自由节点：\t" : "", this.curPoint.key, "前进方向，受阻 ！！！");
            }
            return point;
        };
        BstarSearch.prototype.GetMoveDir = function (from, to) {
            var disX = Math.abs(from.x - to.x); //取绝对值
            var disY = Math.abs(from.y - to.y); //取绝对值
            var dir = Dylan.E_MoveDir.NONE;
            if (disX >= disY) {
                if (from.x >= to.x) {
                    dir = Dylan.E_MoveDir.LEFT;
                }
                else {
                    dir = Dylan.E_MoveDir.RIGHT;
                }
            }
            else {
                if (from.y >= to.y) {
                    dir = Dylan.E_MoveDir.UP;
                }
                else {
                    dir = Dylan.E_MoveDir.DOWN;
                }
            }
            return dir;
        };
        BstarSearch.prototype.GetClockwise = function () {
            var point = this.GetPointByDir(this.curPoint.forward + 1);
            if (point && point.isOpened) {
                point.climbRot = Dylan.E_ClimbRotation.Clockwise;
                this.AddBranchPoint(point, true);
                Dylan.log("找到 顺时针 分叉（+1）：", point.key);
            }
            return point;
        };
        BstarSearch.prototype.GetCounterClockwise = function () {
            var point = this.GetPointByDir(this.curPoint.forward - 1);
            if (point && point.isOpened) {
                point.climbRot = Dylan.E_ClimbRotation.NoClockwise;
                this.AddBranchPoint(point, true);
                Dylan.log("找到 逆时针 分叉（-1）：", point.key);
            }
            return point;
        };
        BstarSearch.prototype.GetClimbFromPos = function () {
            if (!this.curPoint.parent) {
                return this.GetMoveDir(this.endPoint, this.curPoint);
            }
            else {
                return this.GetMoveDir(this.curPoint, this.curPoint.parent);
            }
        };
        BstarSearch.prototype.GetPointByDir = function (dir) {
            var point = this.mapGraph.GetPointByDir(this.curPoint, dir % 4);
            if (!point || point.weight == Infinity)
                return null;
            return point;
        };
        return BstarSearch;
    }(Dylan.DijkstraSearch));
    Dylan.BstarSearch = BstarSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BstarSearch.js.map