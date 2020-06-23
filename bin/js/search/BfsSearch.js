var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dylan;
(function (Dylan) {
    var BfsSearch = /** @class */ (function (_super) {
        __extends(BfsSearch, _super);
        function BfsSearch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.oppoFirst = false;
            _this._frontier = [];
            _this._visiteOrder = [];
            return _this;
        }
        Object.defineProperty(BfsSearch.prototype, "isOver", {
            get: function () {
                return this._frontier.length == 0;
            },
            enumerable: true,
            configurable: true
        });
        BfsSearch.prototype.CheckSucc = function (point) {
            _super.prototype.CheckSucc.call(this, point);
            if (this.isSucc && !this._maxStep) {
                this._maxStep = this._visiteOrder.length;
            }
        };
        BfsSearch.prototype.Start = function () {
            if (_super.prototype.Start.call(this)) {
                this.ProcessAddChildPoint(this.startPoint);
                return true;
            }
            return false;
        };
        BfsSearch.prototype.SearchCustomSteps = function () {
            switch (this.searchStep) {
                case Dylan.E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.DoSearchSteps();
                    }
                    break;
                case Dylan.E_SearchStep.OnceRound:
                    if (this.driveTimes % 10 == 0) {
                        this.SearchOneRound();
                    }
                    break;
                case Dylan.E_SearchStep.OnceSide:
                    if (this.driveTimes % 3 == 0) {
                        this.SearchOneSide();
                    }
                    break;
                default:
                    this.DoSearchSteps();
                    break;
            }
        };
        BfsSearch.prototype.SearchOneRound = function () {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            while (this._frontier.length > 0) {
                var next = this._frontier[0];
                if (Math.abs(next.x - this.mapGraph.startPoint.x) + Math.abs(next.y - this.mapGraph.startPoint.y) > this.fromStartDis) {
                    break;
                }
                this.SearchOneStep();
            }
            if (this.isOver) {
                Laya.timer.clear(this, this.SearchOneRound);
                this.fromStartDis = 0;
            }
        };
        BfsSearch.prototype.SearchOneSide = function () {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            if (this._frontier.length > 0) {
                var flag = null;
                while (this._frontier.length > 0) {
                    var next = this._frontier[0];
                    var newFlag = (next.x - this.mapGraph.startPoint.x) / (next.y - this.mapGraph.startPoint.y + 0.001) > 0;
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
        };
        BfsSearch.prototype.SearchOneStep = function () {
            if (!this.isInit || this.isOver || this.isSucc)
                return;
            // console.log("-------");
            this._curPoint = this._frontier.shift();
            this._curPoint.SetIsVisited();
            this._visiteOrder.push(this._curPoint);
            this.step = this._visiteOrder.length;
            // console.log("---- 基准点：", this._curPoint.x, this._curPoint.y);
            var neighbors = this.mapGraph.GetNeighbors(this._curPoint, this.oppoFirst);
            //查找周围顶点
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
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
        };
        BfsSearch.prototype.ProcessAddChildPoint = function (point) {
            _super.prototype.ProcessAddChildPoint.call(this, point);
            // if(this._frontier.indexOf(point)!=-1){
            //     console.log("----添加了相同点！！！----:",point.x, point.y,"   变色",false);
            // }
            this._frontier.push(point);
            // if (this.curPoint) console.log(this._processOrder.length, "  ++++ 基准点：", point.x, point.y, " ------ 父节点：  ", this.curPoint.x, this.curPoint.y, "   长度：", this._frontier.length);
            // else console.log("++++ 基准点：", point.x, point.y, " ------ 无 父节点！！！！！");
        };
        BfsSearch.prototype.FallBackOneStep = function () {
            if (this.step == 0)
                return;
            var orderPoint = this._visiteOrder.pop();
            this.step = this._visiteOrder.length;
            var tail = this._frontier[this._frontier.length - 1];
            if (tail.parent != orderPoint) {
                this._curPoint = orderPoint;
            }
            else {
                var last = void 0;
                while (this._frontier.length > 0) {
                    var tail_1 = this._frontier[this._frontier.length - 1];
                    if (!last || tail_1.parent == last.parent) {
                        this._curPoint = tail_1.parent;
                        this.ProcessTailUnvisited(tail_1);
                        this.CheckFallOrigin(last);
                        if (!this.isStarted) {
                            break;
                        }
                        last = tail_1;
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
        };
        BfsSearch.prototype.ProcessTailUnvisited = function (point) {
            _super.prototype.ProcessTailUnvisited.call(this, point);
            this._frontier.pop();
        };
        BfsSearch.prototype.Reset = function () {
            this._frontier.splice(0);
            this._visiteOrder.splice(0);
            _super.prototype.Reset.call(this);
        };
        return BfsSearch;
    }(Dylan.BaseSearch));
    Dylan.BfsSearch = BfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BfsSearch.js.map