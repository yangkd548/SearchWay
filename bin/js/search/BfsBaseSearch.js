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