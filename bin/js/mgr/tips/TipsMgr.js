var Dylan;
(function (Dylan) {
    var TipsObj = /** @class */ (function () {
        function TipsObj(tips, icon) {
            this._tips = "";
            this._icon = 1;
            this._tips = tips;
            this._icon = icon;
        }
        Object.defineProperty(TipsObj.prototype, "tips", {
            get: function () {
                return this._tips;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TipsObj.prototype, "icon", {
            get: function () {
                return this._icon;
            },
            enumerable: false,
            configurable: true
        });
        return TipsObj;
    }());
    Dylan.TipsObj = TipsObj;
    var TipsMgr = /** @class */ (function () {
        function TipsMgr() {
            this.tipsQueue = [];
            this.isShowing = false;
            Dylan.GEventMgr.On(Dylan.PageMgr.PageClosed, this, this.OnPageRemove);
        }
        Object.defineProperty(TipsMgr, "Inst", {
            get: function () {
                if (TipsMgr._inst == null) {
                    TipsMgr._inst = new TipsMgr();
                }
                return TipsMgr._inst;
            },
            enumerable: false,
            configurable: true
        });
        //
        TipsMgr.prototype.Show = function (tips, icon) {
            this.Add(tips, icon);
            this.DoShow();
        };
        TipsMgr.prototype.Add = function (tips, icon) {
            var length = this.tipsQueue.length;
            if (length == 0 || this.tipsQueue[length - 1].tips != tips) {
                this.tipsQueue.push(new TipsObj(tips, icon));
            }
        };
        TipsMgr.prototype.DoShow = function () {
            var length = this.tipsQueue.length;
            if (!this.isShowing && length > 0) {
                var tipsObj = this.tipsQueue[0];
                Dylan.GPageMgr.ShowTips(this.tipsQueue[0]);
                this.isShowing = true;
            }
        };
        TipsMgr.prototype.OnPageRemove = function (page) {
            if (page.name == "Tips") {
                this.isShowing = false;
                this.tipsQueue.shift();
                this.DoShow();
            }
        };
        return TipsMgr;
    }());
    Dylan.TipsMgr = TipsMgr;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=TipsMgr.js.map