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
        // public SearchCustomSteps(): void {
        //     switch (this.searchStep) {
        //         case E_SearchStep.OncePoint:
        //             if (this.driveTimes % 1 == 0) {
        //                 this.DoSearchSteps();
        //             }
        //             break;
        //         default:
        //             this.DoSearchSteps();
        //             break;
        //     }
        // }
        DfsSearch.prototype.DoSearchOneStep = function () {
            if (!this.isRunning)
                return;
            this.AddStep();
            if (this.curPoint == null) {
                this.SetCurPoint(this.startPoint);
            }
            var hasUnvisited = false;
            var neighbors = this.mapGraph.GetNeighbors(this.curPoint, this.oppoFirst);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
                if (next.isOpened) {
                    hasUnvisited = true;
                    this.AddFrontierPoint(next);
                    break;
                }
            }
            if (!this.isSucc && !hasUnvisited) {
                this.Recall();
            }
        };
        DfsSearch.prototype.AddFrontierPoint = function (point) {
            _super.prototype.AddFrontierPoint.call(this, point);
            if (this.isSucc)
                return;
            this.SetCurPoint(point);
        };
        DfsSearch.prototype.Recall = function () {
            this.curPoint.SetIsClosed();
            if (this.curPoint.parent == null) {
                this._isOver = true;
            }
            else {
                this.SetCurPoint(this.curPoint.parent);
            }
        };
        DfsSearch.prototype.Clear = function () {
            this._isOver = false;
            _super.prototype.Clear.call(this);
        };
        return DfsSearch;
    }(Dylan.BaseSearch));
    Dylan.DfsSearch = DfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=DfsSearch.js.map