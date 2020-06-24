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
    var Vector2 = Laya.Vector2;
    var Ease = Laya.Ease;
    var Tips = /** @class */ (function (_super) {
        __extends(Tips, _super);
        function Tips() {
            var _this = _super.call(this) || this;
            _this.inTime = 300;
            _this.stayTime = 600;
            _this.outTime = 200;
            _this.stayY = -150;
            _this.outY = -250;
            _this.width = Laya.stage.width;
            _this.height = Laya.stage.height;
            _this.box.alpha = 0;
            _this.bgOriginHeight = _this.bg.height;
            _this.originPos = new Vector2(_this.box.x, _this.box.y);
            return _this;
        }
        Tips.prototype.OnAddStage = function (tipsObj) {
            this.box.pos(this.originPos.x, this.originPos.y);
            this.box.alpha = 0;
            this.icon.skin = tipsObj.icon == 1 ? "common/ok1.png" : "common/warn1.png";
            this.tips.text = tipsObj.tips;
            this.bg.height = this.bgOriginHeight + this.tips.textField.textHeight - this.tips.textField.height;
            this.ComeIn();
        };
        Tips.prototype.OnRemoveStage = function () { };
        Tips.prototype.ComeIn = function () {
            var _this = this;
            var cur = { y: this.box.y, alpha: this.box.alpha };
            Laya.Tween.to(cur, {
                y: this.stayY, alpha: 1,
                update: Laya.Handler.create(this, function () {
                    _this.box.alpha = cur.alpha;
                    _this.box.y = cur.y;
                }, null, false)
            }, this.inTime, Ease.linearIn, Laya.Handler.create(this, function () {
                _this.Stay();
            }));
        };
        Tips.prototype.Stay = function () {
            var _this = this;
            Laya.timer.once(this.stayTime, this, function () { _this.GoOut(); });
        };
        Tips.prototype.GoOut = function () {
            var _this = this;
            var cur = { y: this.box.y, alpha: this.box.alpha };
            Laya.Tween.to(cur, {
                y: this.outY, alpha: 0,
                update: Laya.Handler.create(this, function () {
                    _this.box.alpha = cur.alpha;
                    _this.box.y = cur.y;
                }, null, false)
            }, this.outTime, Ease.linearOut, Laya.Handler.create(this, function () {
                Dylan.GPageMgr.RemoveThisPage(_this);
            }));
        };
        return Tips;
    }(ui.page.TipsUI));
    Dylan.Tips = Tips;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=Tips.js.map