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
    var DijkstraSearch = /** @class */ (function (_super) {
        __extends(DijkstraSearch, _super);
        function DijkstraSearch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DijkstraSearch;
    }(Dylan.BfsSearch));
    Dylan.DijkstraSearch = DijkstraSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=DijkstraSearch.js.map