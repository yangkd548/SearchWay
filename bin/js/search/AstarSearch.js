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
    var AstarSearch = /** @class */ (function (_super) {
        __extends(AstarSearch, _super);
        function AstarSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AstarSearch.prototype.DoSearchOneStep = function () {
            if (!this.isRunning)
                return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (var _i = 0, _a = this.mapGraph.GetNeighbors(this.curPoint); _i < _a.length; _i++) {
                var next = _a[_i];
                var newCost = this.mapGraph.GetCost(this.curPoint, next);
                if (!next.cost || newCost < next.cost) {
                    next.cost = newCost;
                    next.f = newCost + this.mapGraph.GetHeuristicDis(this.endPoint, next);
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        };
        AstarSearch.prototype.AddFrontierPoint = function (point) {
            _super.prototype.AddFrontierPoint.call(this, point);
            var lastPos = this.frontier.indexOf(point);
            if (lastPos != -1) {
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "f", point, 0, lastPos);
        };
        return AstarSearch;
    }(Dylan.DijkstraSearch));
    Dylan.AstarSearch = AstarSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=AstarSearch.js.map