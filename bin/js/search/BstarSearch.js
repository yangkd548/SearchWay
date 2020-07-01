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
            var curRunPoint = this.frontier.shift();
            this.SetCurPoint(curRunPoint);
            var forward = this.GetForwardPoint(this.curPoint, this.endPoint);
            this.CheckSucc(forward);
            if (this.isSucc)
                return;
            Dylan.log("\n------------------- 开始查找：", this.curPoint.key, forward);
            if (!this.DealNext(forward)) {
                Dylan.log("------遇到障碍物，", forward);
                //如果当前自有节点的climbDir == 0，表示需要分叉
                //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
                if (this.curPoint.isClimb || this.curPoint.climbDir != Dylan.E_ClimbDir.None) {
                    //继续绕，找到1个点，设为绕爬点(4个方向，找到障碍物的下一个可走节点，weight!=Infinity即可，一定不是forward方向，可以是parent)
                    var count = this.frontier.length;
                    for (var i = 1; i <= 3; i++) {
                        var next = this.GetPointByDir(this.curPoint.dir + curRunPoint.climbDir * i);
                        if (next) {
                            if (this.DealNext(next, this.curPoint.climbDir))
                                break;
                        }
                    }
                    // if(this.frontier.length > count){
                    //     log("找到 绕爬 子节点 了", this.frontier[count]);
                    // }
                }
                else {
                    //分叉走，找到2个点，都设为 绕爬点
                    //如果当前自有节点的climbDir == 0，表示需要分叉
                    //如果当前自有节点的climbDir == 1 || climbDir == -1，表示需要绕行（回退的！！！）
                    var wise = this.GetClockwise();
                    var noWise = this.GetCounterClockwise();
                    if (wise)
                        this.AddBranchPoint(wise);
                    if (noWise)
                        this.AddBranchPoint(noWise);
                    if (!wise || !noWise) {
                        var climbDir = (wise ? 0 : Dylan.E_ClimbDir.Clockwise) + (noWise ? 0 : Dylan.E_ClimbDir.NoClockwise);
                        this.curPoint.SetIsClosed();
                        var next = this.curPoint.parent;
                        this.PushParent(next);
                        console.log("回退------", next.key);
                    }
                }
            }
        };
        BstarSearch.prototype.SetCurPoint = function (value) {
            this._curPoint = value;
        };
        BstarSearch.prototype.AddBranchPoint = function (point) {
            this.SetBranchCross(point);
            this.AddFrontierPoint(point);
        };
        BstarSearch.prototype.SetBranchCross = function (point) {
            point.cross = this.curPoint.cross || point;
        };
        BstarSearch.prototype.DealNext = function (next, climbDir) {
            if (climbDir === void 0) { climbDir = Dylan.E_ClimbDir.None; }
            if (this.curPoint.isClimb && climbDir != Dylan.E_ClimbDir.None)
                return false;
            if (next != null && !this.IsClosed(next) && next.weight != Infinity && next.parent != this.curPoint) {
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
                    this.SetBranchCross(next);
                }
            }
            else {
                return false;
            }
            return true;
        };
        BstarSearch.prototype.PushParent = function (parent) {
            this.CloseWayPoint(parent, this.curPoint, true);
            this.AddFrontierPoint(parent); //-----------------------------并让父节点帮忙找????
        };
        BstarSearch.prototype.IsClosed = function (point) {
            if (point.isClosed) {
                //遇到 已结束的节点，递归到分叉点，都设为关闭的
                this.CloseBranch();
            }
            return point.isClosed;
        };
        BstarSearch.prototype.CloseBranch = function () {
            this.CloseWayPoint(this.curPoint.cross, this.curPoint);
        };
        BstarSearch.prototype.CloseWayPoint = function (start, end, ignoreStart) {
            if (ignoreStart === void 0) { ignoreStart = false; }
            do {
                end.SetIsClosed();
                end = end.parent;
            } while (end != start);
            if (!ignoreStart)
                start.SetIsClosed();
        };
        BstarSearch.prototype.AddFrontierPoint = function (point) {
            this.CheckSucc(point);
            if (this.isSucc)
                return;
            if (point != this.startPoint && this.curPoint.parent != point) {
                point.parent = this.curPoint;
            }
            point.SetIsProcess();
            this.frontier.push(point);
        };
        // 确定移动时的 方向（上下左右）
        BstarSearch.prototype.GetForwardPoint = function (cur, end) {
            var disX = Math.abs(cur.x - end.x); //取绝对值
            var disY = Math.abs(cur.y - end.y); //取绝对值
            var dir = Dylan.E_MoveDir.NONE;
            if (disX >= disY) {
                if (cur.x >= end.x) {
                    dir = Dylan.E_MoveDir.LEFT;
                }
                else {
                    dir = Dylan.E_MoveDir.RIGHT;
                }
            }
            else {
                if (cur.y >= end.y) {
                    dir = Dylan.E_MoveDir.UP;
                }
                else {
                    dir = Dylan.E_MoveDir.DOWN;
                }
            }
            cur.dir = dir;
            return this.GetPointByDir(dir);
        };
        BstarSearch.prototype.GetClockwise = function () {
            var point = this.GetPointByDir(this.curPoint.dir + 1);
            if (point)
                point.climbDir = Dylan.E_ClimbDir.Clockwise;
            return point;
        };
        BstarSearch.prototype.GetCounterClockwise = function () {
            var point = this.GetPointByDir(this.curPoint.dir - 1);
            if (point)
                point.climbDir = Dylan.E_ClimbDir.NoClockwise;
            return point;
        };
        BstarSearch.prototype.GetPointByDir = function (dir) {
            var point = this.mapGraph.GetPointByDir(this.curPoint, dir % 4);
            if (point) {
                Dylan.log("找到 分叉 或 绕爬：", point.key);
            }
            if (!point || point.weight == Infinity || point.isClosed)
                return null;
            return point;
        };
        return BstarSearch;
    }(Dylan.DijkstraSearch));
    Dylan.BstarSearch = BstarSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BstarSearch.js.map