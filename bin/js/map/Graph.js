var Dylan;
(function (Dylan) {
    var Graph = /** @class */ (function () {
        function Graph(num_nodes) {
            this._edges = [];
            this._weights = [];
            this._observers = [];
            this.num_nodes = num_nodes;
            this._edges = [];
            this._weights = [];
            this._observers = [];
            for (var id = 0; id < num_nodes; id++) {
                this._weights[id] = 1;
                this._edges[id] = [];
            }
        }
        Graph.prototype.tile_weight = function (id) {
            return this._weights[id];
        };
        Graph.prototype.set_tile_weight = function (id, w) {
            if (this._weights[id] != w) {
                this._weights[id] = w;
                this.notify_observers();
            }
        };
        Graph.prototype.tiles_less_than_weight = function (w) {
            if (w === void 0) {
                w = Infinity;
            }
            // return d3.range(this.num_nodes).filter((id) => { return this._weights[id] < w; });
        };
        Graph.prototype.tiles_with_given_weight = function (w) {
            if (w === void 0) {
                w = Infinity;
            }
            // return d3.range(this.num_nodes).filter((id) => { return this._weights[id] == w; });
        };
        Graph.prototype.edge_weight = function (id1, id2) {
            if (!this.has_edge(id1, id2)) {
                return Infinity;
            }
            if (this._weights[id2] === undefined) {
                return 1;
            }
            return this._weights[id2];
        };
        Graph.prototype.has_edge = function (id1, id2) {
            return this._edges[id1] && this._edges[id1].indexOf(id2) >= 0;
        };
        Graph.prototype.edges_from = function (id1) {
            var _this = this;
            return this._edges[id1].filter(function (id2) { return _this.tile_weight(id2) != Infinity; });
        };
        Graph.prototype.all_edges = function (maxWeight) {
            var _this = this;
            if (maxWeight === void 0) {
                maxWeight = Infinity;
            }
            var all = [];
            for (var id1 = 0; id1 < this.num_nodes; id1++) {
                if (this.tile_weight(id1) < maxWeight) {
                    this._edges[id1].forEach(function (id2) {
                        if (_this.tile_weight(id2) < maxWeight) {
                            all.push([id1, id2]);
                        }
                    });
                }
            }
            return all;
        };
        Graph.prototype.notify_observers = function () {
            this._observers.forEach(function (f) { return f(); });
        };
        Graph.prototype.add_observer = function (f) {
            this._observers.push(f);
            f();
        };
        Graph.prototype.make_proxy = function () {
            var proxy = {};
            for (var field in this) {
                //此处，可能会报错
                proxy[field] = this[field];
            }
            return proxy;
        };
        return Graph;
    }());
    Dylan.Graph = Graph;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=Graph.js.map