module Dylan {

    //生成一个方格网格，用作图表。
    export class SquareGrid extends Graph {
        public static readonly DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        private W: number;
        private H: number;

        static CreateSquareGrid(W: number, H: number): SquareGrid {
            let _this = new SquareGrid(W * H);
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
        }

        public edges_from(id1: number) {
            var edges = super.edges_from(id1);
            var xy = this.from_id(id1);
            if ((xy[0] + xy[1]) % 2 == 0) {
                edges.reverse();
            }
            return edges;
        }

        public valid(x: number, y: number) {
            return 0 <= x && x < this.W && 0 <= y && y < this.H;
        }

        public to_id(x: number, y: number): number {
            x = Math.min(this.W - 1, Math.max(0, x));
            y = Math.min(this.H - 1, Math.max(0, y));
            return x + y * this.W;
        }

        public from_id(id: number): number[] {
            return [id % this.W, Math.floor(id / this.W)];
        }
    }
}