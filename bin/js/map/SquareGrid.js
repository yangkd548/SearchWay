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
    //生成一个方格网格，用作图表。
    var SquareGrid = /** @class */ (function (_super) {
        __extends(SquareGrid, _super);
        function SquareGrid() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SquareGrid.CreateSquareGrid = function (W, H) {
            var _this = new SquareGrid(W * H);
            _this.W = W;
            _this.H = H;
            for (var x = 0; x < W; x++) {
                for (var y = 0; y < H; y++) {
                    var id = _this.to_id(x, y);
                    SquareGrid.DIRS.forEach(function (dir) {
                        var x2 = x + dir[0], y2 = y + dir[1];
                        if (_this.valid(x2, y2)) {
                            _this._edges[id].push(_this.to_id(x2, y2));
                        }
                    });
                }
            }
            return _this;
        };
        SquareGrid.prototype.edges_from = function (id1) {
            var edges = _super.prototype.edges_from.call(this, id1);
            var xy = this.from_id(id1);
            if ((xy[0] + xy[1]) % 2 == 0) {
                edges.reverse();
            }
            return edges;
        };
        SquareGrid.prototype.valid = function (x, y) {
            return 0 <= x && x < this.W && 0 <= y && y < this.H;
        };
        SquareGrid.prototype.to_id = function (x, y) {
            x = Math.min(this.W - 1, Math.max(0, x));
            y = Math.min(this.H - 1, Math.max(0, y));
            return x + y * this.W;
        };
        SquareGrid.prototype.from_id = function (id) {
            return [id % this.W, Math.floor(id / this.W)];
        };
        SquareGrid.DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        return SquareGrid;
    }(Dylan.Graph));
    Dylan.SquareGrid = SquareGrid;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=SquareGrid.js.map