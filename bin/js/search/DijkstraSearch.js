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
        DijkstraSearch.prototype.DoSearchOneStep = function () {
            if (!this.isRunning)
                return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (var _i = 0, _a = this.mapGraph.GetNeighbors(this.curPoint); _i < _a.length; _i++) {
                var next = _a[_i];
                var newCost = this.mapGraph.GetCost(this.curPoint, next);
                if (!next.cost || newCost < next.cost) {
                    next.cost = newCost;
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        };
        DijkstraSearch.prototype.AddFrontierPoint = function (point) {
            _super.prototype.AddFrontierPoint.call(this, point);
            if (this.isSucc)
                return;
            this.PutPriorityQueue(point);
        };
        DijkstraSearch.prototype.PutPriorityQueue = function (point) {
            var lastPos = this.frontier.indexOf(point);
            if (lastPos != -1) {
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "cost", point, 0, lastPos);
        };
        //二分法插入对象（插入对象的算法，对寻路效率的影响很大）
        DijkstraSearch.prototype.InsertIncArr = function (arr, key, input, min, max) {
            if (min === void 0) { min = -1; }
            if (max === void 0) { max = -1; }
            if (min >= arr.length || min < 0)
                min = 0;
            if (max >= arr.length || max < 0)
                max = arr.length - 1;
            if (min > max) {
                var index = min;
                min = max;
                max = min;
            }
            if (min == max) {
                arr.splice(min, 0, input);
            }
            else {
                var minObj = arr[min];
                var maxObj = arr[max];
                var inputValue = input[key];
                if (inputValue >= maxObj[key]) {
                    arr.splice(max + 1, 0, input);
                }
                else {
                    if (inputValue < minObj[key]) {
                        arr.splice(min, 0, input);
                    }
                    else {
                        if (min + 1 == max) {
                            arr.splice(max, 0, input);
                        }
                        else {
                            var midIndex = Math.floor((max + min) / 2);
                            var midObj = arr[midIndex];
                            if (midObj[key] > inputValue) {
                                this.InsertIncArr(arr, key, input, min, midIndex);
                            }
                            else {
                                this.InsertIncArr(arr, key, input, midIndex, max);
                            }
                        }
                    }
                }
            }
        };
        return DijkstraSearch;
    }(Dylan.BaseBfsSearch));
    Dylan.DijkstraSearch = DijkstraSearch;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=DijkstraSearch.js.map