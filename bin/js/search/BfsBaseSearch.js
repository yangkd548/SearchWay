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
    var BfsBaseSearch = /** @class */ (function (_super) {
        __extends(BfsBaseSearch, _super);
        function BfsBaseSearch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.oppoFirst = false;
            _this.frontier = [];
            _this.fromStartDis = 0;
            return _this;
        }
        Object.defineProperty(BfsBaseSearch.prototype, "isOver", {
            get: function () {
                return this.frontier.length == 0;
            },
            enumerable: false,
            configurable: true
        });
        BfsBaseSearch.prototype.Start = function () {
            if (_super.prototype.Start.call(this)) {
                this.AddFrontierPoint(this.startPoint);
                return true;
            }
            return false;
        };
        BfsBaseSearch.prototype.SearchCustomSteps = function () {
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
        BfsBaseSearch.prototype.SearchOneRound = function () {
            this.fromStartDis++;
            console.log("---------------", this.fromStartDis);
            while (this.frontier.length > 0) {
                var next = this.frontier[0];
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
        BfsBaseSearch.prototype.SearchOneSide = function () {
            if (this.frontier.length > 0) {
                var flag = null;
                while (this.frontier.length > 0) {
                    var next = this.frontier[0];
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
        BfsBaseSearch.prototype.SetCurPoint = function (value) {
            _super.prototype.SetCurPoint.call(this, value);
            this.curPoint.SetIsVisited();
        };
        BfsBaseSearch.prototype.Clear = function () {
            this.frontier.splice(0);
            _super.prototype.Clear.call(this);
        };
        return BfsBaseSearch;
    }(Dylan.BaseSearch));
    Dylan.BfsBaseSearch = BfsBaseSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BfsBaseSearch.js.map