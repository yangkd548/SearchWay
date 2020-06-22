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
    var BfsSearch = /** @class */ (function (_super) {
        __extends(BfsSearch, _super);
        function BfsSearch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.oppoFirst = false;
            return _this;
        }
        BfsSearch.prototype.DoSearch = function () {
            switch (this.searchStep) {
                case Dylan.E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.SearchOnePoint();
                    }
                    break;
                case Dylan.E_SearchStep.OnceRound:
                    if (this.driveTimes % 10 == 0) {
                        this.SearchOneRound();
                    }
                    break;
                case Dylan.E_SearchStep.OnceSide:
                    if (this.driveTimes % 3 == 0) {
                        this.SearchOneSide();
                    }
                    break;
            }
        };
        BfsSearch.prototype.SearchOneRound = function () {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            while (this._frontier.length > 0) {
                var next = this._frontier[0];
                if (Math.abs(next.x - this._start.x) + Math.abs(next.y - this._start.y) > this.fromStartDis) {
                    break;
                }
                this.DoSearchOnePoint();
            }
            if (this._frontier.length == 0) {
                Laya.timer.clear(this, this.SearchOneRound);
                this.fromStartDis = 0;
            }
        };
        BfsSearch.prototype.SearchOneSide = function () {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            if (this._frontier.length > 0) {
                var flag = null;
                while (this._frontier.length > 0) {
                    var next = this._frontier[0];
                    var newFlag = (next.x - this._start.x) / (next.y - this._start.y + 0.001) > 0;
                    if (flag == null) {
                        flag = newFlag;
                    }
                    else if (flag != newFlag) {
                        break;
                    }
                    this.DoSearchOnePoint();
                }
            }
            if (this._frontier.length == 0) {
                Laya.timer.clear(this, this.SearchOneSide);
            }
        };
        BfsSearch.prototype.DoSearchOnePoint = function () {
            // console.log("-------");
            this._cur = this._frontier.shift();
            this._cur.SetIsVisited();
            // console.log("---- 基准点：", this.cur.x, this.cur.y);
            var neighbors = this._mapGraph.GetNeighbors(this._cur, this.oppoFirst);
            //查找周围顶点
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
                //没有访问过
                if (next.isUnvisited) {
                    this.PushQueue(next);
                    if (this._end == next) {
                        this._cur = this._end;
                        this._isSucc = true;
                        break;
                    }
                }
            }
            this.EmitReDraw();
            if (this._isSucc)
                this.Clear();
        };
        return BfsSearch;
    }(Dylan.BaseSearch));
    Dylan.BfsSearch = BfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BfsSearch.js.map