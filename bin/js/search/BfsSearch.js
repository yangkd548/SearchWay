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
            _this._frontier = [];
            _this.fromStartDis = 0;
            return _this;
        }
        Object.defineProperty(BfsSearch.prototype, "isOver", {
            get: function () {
                return this._frontier.length == 0;
            },
            enumerable: true,
            configurable: true
        });
        BfsSearch.prototype.Start = function () {
            if (_super.prototype.Start.call(this)) {
                this.AddProcessPoint(this.startPoint);
                return true;
            }
            return false;
        };
        BfsSearch.prototype.SearchCustomSteps = function () {
            switch (this.searchStep) {
                case Dylan.E_SearchStep.OncePoint:
                    if (this.driveTimes % 1 == 0) {
                        this.DoSearchSteps();
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
                default:
                    this.DoSearchSteps();
                    break;
            }
        };
        BfsSearch.prototype.SearchOneRound = function () {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            while (this._frontier.length > 0) {
                var next = this._frontier[0];
                if (Math.abs(next.x - this.mapGraph.startPoint.x) + Math.abs(next.y - this.mapGraph.startPoint.y) > this.fromStartDis) {
                    break;
                }
                this.DoSearchOneStep();
            }
            if (this.isOver) {
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
                    var newFlag = (next.x - this.mapGraph.startPoint.x) / (next.y - this.mapGraph.startPoint.y + 0.001) > 0;
                    if (flag == null) {
                        flag = newFlag;
                    }
                    else if (flag != newFlag) {
                        break;
                    }
                    this.DoSearchOneStep();
                }
            }
            if (this.isOver) {
                Laya.timer.clear(this, this.SearchOneSide);
            }
        };
        BfsSearch.prototype.DoSearchOneStep = function () {
            if (!this.isInit || this.isOver || this.isSucc)
                return;
            // console.log("-------");
            this.AddStep();
            this.SearchSetCurPoint(this._frontier.shift());
            this.curPoint.SetIsVisited();
            // console.log("---- 基准点：", this.curPoint.x, this.curPoint.y);
            var neighbors = this.mapGraph.GetNeighbors(this.curPoint, this.oppoFirst);
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var next = neighbors_1[_i];
                if (next.isUnvisited) {
                    this.AddProcessPoint(next);
                    this.CheckSucc(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
            this.EmitReDraw();
        };
        BfsSearch.prototype.AddProcessPoint = function (point) {
            _super.prototype.AddProcessPoint.call(this, point);
            this._frontier.push(point);
        };
        BfsSearch.prototype.Reset = function () {
            this._frontier.splice(0);
            _super.prototype.Reset.call(this);
        };
        return BfsSearch;
    }(Dylan.BaseSearch));
    Dylan.BfsSearch = BfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BfsSearch.js.map