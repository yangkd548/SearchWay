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
                this.DealFreePoint();
            }
            else {
                this.DealClimbPoint();
            }
        };
        BstarSearch.prototype.DealFreePoint = function () {
            Dylan.log("当  -自由节点-  处理 ------------------");
            var forward = this.GetForwardPoint();
            if (this.ForwardIsBlock(forward)) {
                //遇到障碍
                this.FreeForkMove();
            }
            else if (forward.isOpened) { //等同于cost==0
                //遇到开放节点
                this.AddFrontierPoint(forward);
            }
            else {
                //遇到处理中的节点
                this.DealProcessPoint(forward);
            }
        };
        BstarSearch.prototype.DealClimbPoint = function () {
            //当前为绕爬点，
            //绕爬点，通过绕爬选出的点，还是绕爬点
            //绕爬点，可以走最佳点，最佳点跟绕爬点，不是一个点，这个最佳点就是自由点了！！！
            if (this.curPoint.climbRot == Dylan.E_ClimbRot.None) {
                //遇到障碍
                this.ClimbForkMove();
            }
            else {
                //执行绕爬
                this.TryClimbMove();
            }
        };
        BstarSearch.prototype.ForwardIsBlock = function (forward) {
            if (forward === void 0) { forward = null; }
            return forward == null || forward.weight == Infinity || forward.isClosed;
        };
        //执行分叉前进
        BstarSearch.prototype.FreeForkMove = function () {
            //分叉走，找到2个点，都设为 绕爬点
            //如果当前自有节点的climbDir == 0，表示需要分叉
            //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
            var wise = this.GetClockwise();
            var noWise = this.GetCounterClockwise();
            console.log("找到：", !wise || !noWise, !wise, !noWise);
            if (!wise || !noWise) {
                console.log("回退------", 1111111);
                var next = this.curPoint.parent;
                if (!wise) {
                    next.climbRot = Dylan.E_ClimbRot.Clockwise;
                    this.PushParent(next, false, this.curPoint.forwardDir + 1);
                    console.log("回退------", next.key);
                }
                if (!noWise) {
                    next.climbRot = Dylan.E_ClimbRot.NoClockwise;
                    this.PushParent(next, false, this.curPoint.forwardDir - 1);
                    console.log("回退------", next.key);
                }
            }
        };
        //2个分支临时合并，再分支的处理
        BstarSearch.prototype.ClimbForkMove = function () {
            //如果空位，已被兄弟分支占用，则设置为ClimbRot = None即可
            //如果空位，没有被占用，则正常绕行
        };
        BstarSearch.prototype.RollBackClimb = function (lastPoint) {
            var fromDir = this.GetMoveDir(this.curPoint, lastPoint);
            var finded = false;
            //绕爬点，从父节点开始（不含），按绕爬方向找可以走的点（如果是父节点，则执行，父节点处理）
            for (var i = 1; i <= 4; i++) {
                var checkDir = fromDir + this.curPoint.climbRot * i;
                console.log("RollBackClimb 绕爬 寻找------- ： ", i, checkDir);
                var next = this.GetPointByDir(checkDir);
                if (next) {
                    if (next.isOpened) {
                        console.log("\u627E\u5230 -- \u7ED5\u884C\u70B9\uFF08" + this.curPoint.climbRot + "\uFF09,\u5F85\u8FDB\u4E00\u6B65\u5904\u7406\uFF1A" + next.key);
                        this.DoRealClimb(next);
                        finded = true;
                        break;
                    }
                    else if (next == this.curPoint.parent) {
                        break;
                    }
                }
            }
            if (!finded) {
                if (this.curPoint.parent) {
                    if (!this.curPoint.isClimb && this.curPoint.parent.isClimb) {
                        Dylan.log("回退 遇到 分支，终止！-------");
                    }
                    else {
                        this.PushParent(this.curPoint.parent, true);
                    }
                }
                else {
                    Dylan.log("回退 到 起点了！！！！！");
                    this.TryBrotherLine(lastPoint);
                }
            }
        };
        BstarSearch.prototype.TryBrotherLine = function (lastPoint) {
            var fromDir = this.GetMoveDir(this.curPoint, lastPoint);
            var finded = false;
            for (var i = 1; i <= 4; i++) {
                var checkDir = fromDir + this.curPoint.climbRot * i;
                console.log("RollBackClimb 绕爬 寻找------- 2222： ", i, checkDir);
                var next = this.GetPointByDir(checkDir);
                if (next && this.PassBrotherPoint(next)) {
                    break;
                }
            }
        };
        //占线绕爬
        BstarSearch.prototype.PassBrotherPoint = function (next) {
            //如果绕行的点，是兄弟节点的，
            if (next.isClimb && next.root == this.curPoint.root) {
                var index = this.frontier.indexOf(next);
                if (index != -1) {
                    var fromDir = this.GetClimbFromPos();
                    var checkDir = fromDir + this.curPoint.climbRot * 1;
                    var nextNext = this.GetPointByDir(checkDir);
                    if (nextNext == this.curPoint) {
                        this.frontier.splice(index, 1);
                    }
                    else {
                        //TODO：需要编辑，2个分支临时合并向前的处理
                        next.climbRot = Dylan.E_ClimbRot.None;
                    }
                }
                else {
                    this.DoRealClimb(next);
                }
                return true;
            }
        };
        BstarSearch.prototype.TryClimbMove = function () {
            var fromDir = this.GetClimbFromPos();
            var canFree = this.curPoint.canFree;
            var forward = Dylan.MapPoint.GetFormatDir(this.curPoint.forwardDir);
            //绕爬点，从父节点开始（不含），按绕爬方向找可以走的点（如果是父节点，则执行，父节点处理）
            for (var i = 1; i <= 4; i++) {
                var checkDir = fromDir + this.curPoint.climbRot * i;
                console.log("绕爬 寻找------- ： ", i, canFree);
                if (canFree)
                    canFree = forward != Dylan.MapPoint.GetFormatDir(checkDir);
                var next = this.GetPointByDir(checkDir);
                if (next) {
                    console.log("\u627E\u5230 \u7ED5\u884C\u70B9\uFF08" + this.curPoint.climbRot + "\uFF09,\u5F85\u8FDB\u4E00\u6B65\u5904\u7406\uFF1A" + next.key + " ---- : ", canFree);
                    this.DoClimbMove(next, canFree);
                    break;
                }
            }
        };
        BstarSearch.prototype.SetCurPoint = function (value) {
            if (this.curPoint && this.curPoint.isRollBack) {
                this.curPoint.isRollBack = false;
            }
            this._curPoint = value;
            this.curPoint.forwardDir = this.GetMoveDir(this.curPoint, this.endPoint);
        };
        BstarSearch.prototype.AddClimbPoint = function (point, isNewBranch) {
            if (isNewBranch === void 0) { isNewBranch = false; }
            point.isClimb = true;
            this.AddFrontierPoint(point);
            Dylan.log("新点：", point.key, "  -  是否自由：", point.canFree);
            //设置新分支，必须单独设置root节点
            if (isNewBranch) {
                this.SetNewBranchRoot(point);
            }
            this.SetCurClimbDir(point);
            Dylan.log("新点 222 ：", point.key, "  -  是否自由：", point.canFree);
        };
        BstarSearch.prototype.SetCurClimbDir = function (point, moveDir) {
            if (moveDir === void 0) { moveDir = Dylan.E_MoveDir.NONE; }
            if (point.branch == point && point.curClimbDir != Dylan.E_MoveDir.NONE)
                return;
            if (moveDir != Dylan.E_MoveDir.NONE) {
                point.SetCurClimbDir(moveDir, this.curPoint);
            }
            else {
                point.SetCurClimbDir(this.GetMoveDir(this.curPoint, point), this.curPoint);
            }
        };
        BstarSearch.prototype.SetNewBranchRoot = function (point) {
            if (!point.root) {
                point.root = this.curPoint;
            }
        };
        BstarSearch.prototype.SetBranchRoot = function (point) {
            if (!point.root) {
                if (!this.curPoint)
                    this.SetNewBranchRoot(point);
                else
                    point.root = this.curPoint.root;
            }
        };
        BstarSearch.prototype.SetBranchMinorRoot = function (point) {
            if (point.isClimb && !point.branch) {
                point.branch = this.curPoint ? (this.curPoint.branch || point) : point;
            }
        };
        BstarSearch.prototype.DoClimbMove = function (next, canFree) {
            if (next.isOpened) {
                this.DealClimbOpenedPoint(next, canFree);
            }
            else {
                if (next.isClimb) {
                    this.DealClimbMeetClimb(next);
                }
                else {
                    this.DealProcessPoint(next);
                }
            }
        };
        BstarSearch.prototype.DealClimbOpenedPoint = function (point, canFree) {
            // 如果绕爬点，与Forward点，都可以通行，并且不相同，则分析变为自由节点，还需要记录分支信息
            Dylan.log("绕行-----111 ：", canFree);
            if (canFree) {
                Dylan.log("绕行-----222 ：", canFree);
                //此时，绕行节点转变为自由节点处理
                this.curPoint.isClimb = false;
                this.DealFreePoint();
            }
            else {
                Dylan.log("绕行-----333 ：", canFree);
                this.DoRealClimb(point);
            }
        };
        BstarSearch.prototype.DoRealClimb = function (point, climbDir) {
            if (climbDir === void 0) { climbDir = Dylan.E_MoveDir.NONE; }
            point.climbRot = this.curPoint.climbRot;
            console.log("普通绕行 ： ", point.key);
            this.AddClimbPoint(point);
        };
        BstarSearch.prototype.DealClimbMeetClimb = function (next) {
            if (this.curPoint.root == next.root) {
                if (this.IsWayPoint(next, this.curPoint)) {
                    console.log("遇到父节点，关闭链路节点，回溯到父节点：", next.key);
                    //遇到未关闭的递归父节点，回溯，并让父节点帮忙找
                    if (next.isClimb) {
                        this.PushParent(next, true);
                    }
                    else {
                        this.CloseWayPoint(next);
                    }
                }
                else {
                    //遇到兄弟分支 节点？？？？？？？？？？？？？？？？？？？？？？？？？？？如何实现，可以走兄弟分支的节点。。。。
                    this.DealClimbOpenedPoint(next, false);
                }
            }
            else {
                this.CloseBranch();
            }
        };
        //自由节点，遇到自由节点、绕行节点
        //绕行节点，遇到自由节点
        //的 相关处理
        BstarSearch.prototype.DealProcessPoint = function (next) {
            if (this.IsWayPoint(next, this.curPoint)) {
                console.log("遇到父节点，关闭链路节点，回溯到父节点：", next.key);
                //遇到未关闭的递归父节点，回溯，并让父节点帮忙找
                this.PushParent(next, true);
            }
            else {
                console.log("仅关闭链路节点：", next.key);
                //遇到其他分支节点 递归到自己的分叉点，路径点设为关闭的
                //其实这里，不添加点，就够了。关闭branch分支的点可以不执行。
                this.CloseBranch();
            }
        };
        BstarSearch.prototype.PushParent = function (point, curIsClimb, moveDir) {
            if (curIsClimb === void 0) { curIsClimb = false; }
            if (moveDir === void 0) { moveDir = Dylan.E_MoveDir.NONE; }
            var lastPoint = this.curPoint;
            if (curIsClimb)
                point.climbRot = this.curPoint.climbRot;
            point.isRollBack = true;
            this.CloseWayPoint(point);
            Dylan.log("回退 节点：", point ? point.key : "null");
            //单次循环内，递归回退
            if (curIsClimb)
                point.branch = this.curPoint.branch;
            else
                point.branch = point;
            this.SetCurClimbDir(point, moveDir);
            this.SetCurPoint(point);
            this.RollBackClimb(lastPoint);
        };
        BstarSearch.prototype.CloseBranch = function () {
            this.CloseWayPoint(this.curPoint.root);
        };
        BstarSearch.prototype.CloseWayPoint = function (end) {
            var start = this.curPoint;
            Dylan.log("关闭 链路 ------------- ：", start.key, end.key);
            while (start != end) {
                if (start.isRollBack || !start.isClimb) {
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
                else
                    start.SetIsClosed();
                Dylan.log("关闭节点：", start.key);
                start = start.parent;
            }
            // if (!ignoreEnd) end.SetIsClosed();
        };
        BstarSearch.prototype.AddFrontierPoint = function (point, rollback) {
            if (rollback === void 0) { rollback = false; }
            // //关闭的点，不再加入process队列，是否正确？？？？？？？？？？
            // if (point.isClosed) return;
            this.CheckSucc(point);
            if (!rollback && this.curPoint) { // && this.curPoint.parent != point) {
                this.SetPointParent(point);
            }
            point.SetIsProcess();
            this.SetBranchRoot(point);
            this.SetBranchMinorRoot(point);
            //当前逻辑使用isOpened判断forward节点，cost属性暂时没有使用
            // point.cost = this.mapGraph.GetCost(this.curPoint, point);
            if (this.isSucc)
                return;
            this.frontier.push(point);
        };
        // 获取（最佳）前进方向的点
        BstarSearch.prototype.GetForwardPoint = function (isMerge) {
            if (isMerge === void 0) { isMerge = false; }
            var point = this.GetPointByDir(this.curPoint.forwardDir);
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
            return this.GetBranchPoint(Dylan.E_ClimbRot.Clockwise);
        };
        BstarSearch.prototype.GetCounterClockwise = function () {
            return this.GetBranchPoint(Dylan.E_ClimbRot.NoClockwise);
        };
        BstarSearch.prototype.GetBranchPoint = function (climbRot) {
            var climbDir = this.curPoint.forwardDir + (climbRot == Dylan.E_ClimbRot.Clockwise ? 1 : -1);
            var point = this.GetPointByDir(climbDir);
            if (point)
                console.log("分叉 找点：", point.key, point.isOpened, point.cost);
            var finded = point && point.isOpened;
            if (finded) {
                point.climbRot = climbRot;
                this.AddClimbPoint(point, true);
                Dylan.log("-----\u627E\u5230 " + (climbRot == Dylan.E_ClimbRot.Clockwise ? "顺" : "逆") + "\u65F6\u9488 \u5206\u53C9\uFF08" + (climbRot == Dylan.E_ClimbRot.Clockwise ? "+" : "-") + "1\uFF09\uFF1A" + point.key);
            }
            return finded ? point : null;
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
            var point = this.mapGraph.GetPointByDir(this.curPoint, Dylan.MapPoint.GetFormatDir(dir));
            //将关闭的节点，算作障碍
            if (!point || point.weight == Infinity || point.isClosed)
                return null;
            return point;
        };
        return BstarSearch;
    }(Dylan.DijkstraSearch));
    Dylan.BstarSearch = BstarSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BstarSearch.js.map