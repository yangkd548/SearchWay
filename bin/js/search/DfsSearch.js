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
        DfsSearch.prototype.DoSearchOneStep = function () {
            // console.log("-------");
            if (!this.isInit || this.isOver || this.isSucc)
                return;
            this.AddStep();
            console.log(this.step, this._isSucc, this.step >= this._maxStep);
            if (this.curPoint == null) {
                this.SearchSetCurPoint(this.startPoint);
            }
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            var hasUnvisited = false;
            var neighbors = this.mapGraph.GetNeighbors(this.curPoint, this.oppoFirst);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
                if (next.isUnvisited) {
                    hasUnvisited = true;
                    this.AddProcessPoint(next);
                    this.CheckSucc(next);
                    break;
                }
            }
            if (!this.isSucc && !hasUnvisited) {
                this.Recall();
            }
            this.EmitReDraw();
        };
        DfsSearch.prototype.AddProcessPoint = function (point) {
            _super.prototype.AddProcessPoint.call(this, point);
            this.SearchSetCurPoint(point);
        };
        DfsSearch.prototype.Recall = function () {
            this.curPoint.SetIsVisited();
            if (this.curPoint.parent == null) {
                this._isOver = true;
            }
            else {
                this.SearchSetCurPoint(this.curPoint.parent);
            }
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