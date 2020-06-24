module Dylan {
    export class Graph {
        private readonly num_nodes: number;
        protected readonly _edges: any[] = [];
        private readonly _weights: number[] = [];
        private readonly _observers = [];

        constructor(num_nodes) {
            this.num_nodes = num_nodes;
            this._edges = [];
            this._weights = [];
            this._observers = [];
            for (var id = 0; id < num_nodes; id++) {
                this._weights[id] = 1;
                this._edges[id] = [];
            }
        }

        public tile_weight(id: number): number {
            return this._weights[id];
        }

        public set_tile_weight(id: number, w: number): void {
            if (this._weights[id] != w) {
                this._weights[id] = w;
                this.notify_observers();
            }
        }

        public tiles_less_than_weight(w: number): void {
            if (w === void 0) { w = Infinity; }
            // return d3.range(this.num_nodes).filter((id) => { return this._weights[id] < w; });
        }

        public tiles_with_given_weight(w: number): void {
            if (w === void 0) { w = Infinity; }
            // return d3.range(this.num_nodes).filter((id) => { return this._weights[id] == w; });
        }

        public edge_weight(id1: number, id2: number): number {
            if (!this.has_edge(id1, id2)) {
                return Infinity;
            }
            if (this._weights[id2] === undefined) {
                return 1;
            }
            return this._weights[id2];
        }

        public has_edge(id1: number, id2: number): boolean {
            return this._edges[id1] && this._edges[id1].indexOf(id2) >= 0;
        }

        public edges_from(id1: number) {
            return this._edges[id1].filter((id2) => { return this.tile_weight(id2) != Infinity; });
        }

        public all_edges(maxWeight: number) {
            if (maxWeight === void 0) { maxWeight = Infinity; }
            var all = [];
            for (var id1 = 0; id1 < this.num_nodes; id1++) {
                if (this.tile_weight(id1) < maxWeight) {
                    this._edges[id1].forEach((id2) => {
                        if (this.tile_weight(id2) < maxWeight) {
                            all.push([id1, id2]);
                        }
                    });
                }
            }
            return all;
        }

        public notify_observers() {
            this._observers.forEach(function (f) { return f(); });
        }

        public add_observer(f: Function) {
            this._observers.push(f); f();
        }

        public make_proxy(): any {
            let proxy: any = {};
            for (var field in this) {
                //此处，可能会报错
                proxy[field] = this[field];
            }
            return proxy;
        }
    }
}