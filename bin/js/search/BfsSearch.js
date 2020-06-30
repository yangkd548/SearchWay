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
    var BfsSearch = /** @class */ (function (_super) {
        __extends(BfsSearch, _super);
        function BfsSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BfsSearch.prototype.DoSearchOneStep = function () {
            if (!this.isRunning)
                return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (var _i = 0, _a = this.mapGraph.GetNeighbors(this.curPoint); _i < _a.length; _i++) {
                var next = _a[_i];
                if (next.isOpened) {
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        };
        BfsSearch.prototype.AddFrontierPoint = function (point) {
            _super.prototype.AddFrontierPoint.call(this, point);
            if (this.isSucc)
                return;
            this.frontier.push(point);
        };
        return BfsSearch;
    }(Dylan.BaseBfsSearch));
    Dylan.BfsSearch = BfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BfsSearch.js.map