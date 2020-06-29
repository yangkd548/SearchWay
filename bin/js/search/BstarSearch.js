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
            // this.CheckSucc(forward);
            // if(this.isSucc) return;
            if (forward.weight != Infinity && forward != this.curPoint.parent) {
                if (!forward.cost) {
                    //向前走一步
                    forward.isClimb = false;
                    this.AddFrontierPoint(forward);
                }
                else {
                    Dylan.log("当前分支，发生合并--------终止查找");
                    //或者对比cost和newCost，然后，替换父节点？？？
                }
            }
            else {
                if (this.curPoint.isClimb) {
                    //继续绕，找到1个点，设为绕爬点(4个方向，找到障碍物的下一个可走节点，weight!=Infinity即可，一定不是forward方向，可以是parent)
                    for (var i = 1; i <= 4; i++) {
                        if (curRunPoint.climbDir == 0)
                            return;
                        var next = this.GetPointByDir(this.curPoint.dir + curRunPoint.climbDir * i);
                        if (next && next.weight != Infinity) {
                            this.AddFrontierPoint(next);
                            break;
                        }
                    }
                }
                else {
                    //分叉走，找到2个点，都设为 绕爬点
                    var wise = this.GetClockwise();
                    var noWise = this.GetCounterClockwise();
                }
            }
        };
        BstarSearch.prototype.AddFrontierPoint = function (point) {
            Dylan.BaseBfsSearch.prototype.AddFrontierPoint.call(this, point);
            if (this.curPoint) {
                point.cost = this.mapGraph.GetCost(this.curPoint, point);
                point.f = point.cost + this.mapGraph.GetHeuristicDis(point, this.endPoint) * 1.01;
            }
            var lastPos = this.frontier.indexOf(point);
            if (lastPos != -1) {
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "f", point, 0, lastPos);
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
                    this.mapGraph.GetPoint;
                }
            }
            else {
                if (cur.y >= end.y) {
                    dir = Dylan.E_MoveDir.DOWN;
                }
                else {
                    dir = Dylan.E_MoveDir.UP;
                }
            }
            cur.dir = dir;
            return this.GetPointByDir(dir);
        };
        BstarSearch.prototype.GetClockwise = function () {
            var point = this.GetPointByDir(this.curPoint.dir + 1);
            point.climbDir = Dylan.E_ClimbDir.Clockwise;
            return point;
        };
        BstarSearch.prototype.GetCounterClockwise = function () {
            var point = this.GetPointByDir(this.curPoint.dir - 1);
            point.climbDir = Dylan.E_ClimbDir.CounterClockwise;
            return point;
        };
        BstarSearch.prototype.GetPointByDir = function (dir) {
            return this.mapGraph.GetPointByDir(this.curPoint, dir % 4);
        };
        return BstarSearch;
    }(Dylan.DijkstraSearch));
    Dylan.BstarSearch = BstarSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BstarSearch.js.map