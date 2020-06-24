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
    var DijkstraSearch = /** @class */ (function (_super) {
        __extends(DijkstraSearch, _super);
        function DijkstraSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DijkstraSearch.prototype.DoSearchOneStep = function () {
            if (!this.isInit || this.isOver || this.isSucc)
                return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            this.curPoint.SetIsVisited();
            var neighbors = this.mapGraph.GetNeighbors(this.curPoint, this.oppoFirst);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
                if (next.isUnvisited) {
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
            this.EmitReDraw();
            this.frontier.push(this.startPoint);
            var came_from = {};
            came_from[this.startPoint.id] = null;
            var cost_so_far = {};
            cost_so_far[this.startPoint.id] = 0;
            while (this.frontier.length > 0) {
                this.SetCurPoint(this.frontier.shift());
                if (this.curPoint == this.endPoint)
                    break;
                //GetNeighbors --> edges_from
                for (var _a = 0, _b = this.mapGraph.GetNeighbors(this.curPoint); _a < _b.length; _a++) {
                    var next = _b[_a];
                    // let new_cost = cost_so_far[this.curPoint.id] + this.mapGraph.cost(this.curPoint, next);
                    // if ((!cost_so_far[next.id]) || new_cost < cost_so_far[next.id]) {
                    //     cost_so_far[next.id] = new_cost;
                    //     let priority = new_cost;
                    //     this.frontier.push(next, priority);
                    //     came_from[next.id] = this.curPoint;//父子关系
                    // }
                }
            }
        };
        return DijkstraSearch;
    }(Dylan.BfsSearch));
    Dylan.DijkstraSearch = DijkstraSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=DijkstraSearch.js.map