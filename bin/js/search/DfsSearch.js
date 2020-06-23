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
    var DfsSearch = /** @class */ (function (_super) {
        __extends(DfsSearch, _super);
        function DfsSearch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.oppoFirst = true;
            _this._isOver = false;
            return _this;
        }
        Object.defineProperty(DfsSearch.prototype, "isOver", {
            get: function () {
                return this._isOver;
            },
            enumerable: true,
            configurable: true
        });
        DfsSearch.prototype.SearchCustomSteps = function () {
            switch (this.searchStep) {
                case Dylan.E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.DoSearchSteps();
                    }
                    break;
                default:
                    this.DoSearchSteps();
                    break;
            }
        };
        DfsSearch.prototype.SearchOneStep = function () {
            // console.log("-------");
            if (!this.isInit || this.isOver || this.isSucc)
                return;
            if (this._curPoint == null) {
                this._curPoint = this.startPoint;
            }
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            var hasUnvisited = false;
            //查找周围顶点
            var neighbors = this.mapGraph.GetNeighbors(this._curPoint, this.oppoFirst);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
                //没有访问过
                if (next.isUnvisited) {
                    this.ProcessAddChildPoint(next);
                    this.CheckSucc(next);
                    hasUnvisited = true;
                    break;
                }
            }
            this.EmitReDraw();
            if (!this.isSucc) {
                if (!hasUnvisited) {
                    //执行回溯（先回溯一步，不行再回溯一步...）
                    this.Recall();
                }
            }
        };
        DfsSearch.prototype.ProcessAddChildPoint = function (point) {
            _super.prototype.ProcessAddChildPoint.call(this, point);
            this._curPoint = point;
        };
        DfsSearch.prototype.Recall = function () {
            this._curPoint.SetIsVisited();
            if (this._curPoint.parent == null) {
                this._isOver = true;
            }
            else {
                this._curPoint = this._curPoint.parent;
            }
        };
        DfsSearch.prototype.FallBackOneStep = function () {
            // while (this._frontier.length > 0) {
            //     let tailPoint = this._frontier[this._frontier.length - 1];
            //     if (tailPoint.parent == this._curPoint) {
            //         this.ProcessTailUnvisited(tailPoint);
            //     }
            //     else{
            //         break;
            //     }
            // }
            // this._frontier.unshift(this._curPoint);
            // this._curPoint.SetIsProcess();
            // this._curPoint = this._curPoint.parent;
        };
        DfsSearch.prototype.ProcessTailUnvisited = function (point) {
            _super.prototype.ProcessAddChildPoint.call(this, point);
            // this._frontier.pop();
        };
        DfsSearch.prototype.Reset = function () {
            this._isOver = false;
            _super.prototype.Reset.call(this);
        };
        return DfsSearch;
    }(Dylan.BaseSearch));
    Dylan.DfsSearch = DfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=DfsSearch.js.map