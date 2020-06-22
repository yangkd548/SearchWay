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
            return _this;
        }
        DfsSearch.prototype.DoSearch = function () {
            switch (this.searchStep) {
                case Dylan.E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.SearchOnePoint();
                    }
                    break;
            }
        };
        DfsSearch.prototype.DoSearchOnePoint = function () {
            // console.log("-------");
            if (this._cur == null) {
                this._cur = this.start;
            }
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            var hasUnvisited = false;
            //查找周围顶点
            var neighbors = this._mapGraph.GetNeighbors(this._cur, this.oppoFirst);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
                //没有访问过
                if (next.isUnvisited) {
                    this.PushQueue(next);
                    if (this._end == next) {
                        this._cur = this._end;
                        this._isSucc = true;
                    }
                    hasUnvisited = true;
                    this._cur.SetInQueue();
                    this._cur = next;
                    break;
                }
            }
            this.EmitReDraw();
            if (this._isSucc) {
                this.Clear();
            }
            else {
                if (!hasUnvisited) {
                    //执行回溯（先回溯一步，不行再回溯一步...）
                    this.Recall();
                }
            }
        };
        DfsSearch.prototype.Recall = function () {
            this._cur.SetIsVisited();
            if (this._cur.parent == null) {
                this._frontier.splice(0);
            }
            else {
                this._cur = this._cur.parent;
            }
        };
        return DfsSearch;
    }(Dylan.BaseSearch));
    Dylan.DfsSearch = DfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=DfsSearch.js.map