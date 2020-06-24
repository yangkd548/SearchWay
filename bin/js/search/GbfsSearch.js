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
    var GbfsSearch = /** @class */ (function (_super) {
        __extends(GbfsSearch, _super);
        function GbfsSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(GbfsSearch.prototype, "isOver", {
            get: function () {
                return false;
            },
            enumerable: false,
            configurable: true
        });
        GbfsSearch.prototype.SearchCustomSteps = function (step) {
            if (step === void 0) { step = 1; }
        };
        GbfsSearch.prototype.DoSearchOneStep = function () {
        };
        GbfsSearch.prototype.Reset = function () {
            _super.prototype.Reset.call(this);
        };
        return GbfsSearch;
    }(Dylan.BaseSearch));
    Dylan.GbfsSearch = GbfsSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=GbfsSearch.js.map