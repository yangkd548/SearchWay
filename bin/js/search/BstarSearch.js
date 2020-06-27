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
    var BstarSearch = /** @class */ (function (_super) {
        __extends(BstarSearch, _super);
        function BstarSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(BstarSearch.prototype, "isOver", {
            get: function () {
                return false;
            },
            enumerable: false,
            configurable: true
        });
        BstarSearch.prototype.SearchCustomSteps = function (step) {
            if (step === void 0) { step = 1; }
        };
        BstarSearch.prototype.DoSearchOneStep = function () {
        };
        BstarSearch.prototype.Clear = function () {
            _super.prototype.Clear.call(this);
        };
        return BstarSearch;
    }(Dylan.BaseSearch));
    Dylan.BstarSearch = BstarSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=BstarSearch.js.map