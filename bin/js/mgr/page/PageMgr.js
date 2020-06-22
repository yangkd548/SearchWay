var Dylan;
(function (Dylan) {
    var Sprite = Laya.Sprite;
    var PageMgr = /** @class */ (function () {
        function PageMgr() {
            this.ipageMap = {};
            this.showModelEvent = new Laya.EventDispatcher();
            //ui视图层
            this._pageRoot = this.CreateRootLayer("pageRoot");
            // this._broadRoot = this.CreateRootLayer("broadRoot");
            this._flyAniRoot = this.CreateRootLayer("flyAniRoot");
            this._guideBottom = this.CreateRootLayer("guideBottom");
            this._guideTop = this.CreateRootLayer("guideTop");
            this._tipsRoot = this.CreateRootLayer("tipsRoot", 10000);
        }
        Object.defineProperty(PageMgr, "Inst", {
            get: function () {
                if (PageMgr._inst == null) {
                    PageMgr._inst = new PageMgr();
                }
                return PageMgr._inst;
            },
            enumerable: true,
            configurable: true
        });
        PageMgr.prototype.CreateRootLayer = function (name, zOrder) {
            if (zOrder === void 0) { zOrder = 0; }
            var layer = new Sprite();
            layer.name = name;
            Laya.stage.addChild(layer);
            if (zOrder)
                layer.zOrder = zOrder;
            return layer;
        };
        PageMgr.prototype.AddToGuideRoot = function (sprite) {
            this._guideBottom.addChild(sprite);
        };
        PageMgr.prototype.CloseAllPage = function () {
            for (var name_1 in this.ipageMap) {
                if (this._pageRoot.getChildByName(name_1) != null) {
                    this.RemovePage(name_1, this._pageRoot);
                }
            }
        };
        PageMgr.prototype.ShowFlyAniView = function (complete) {
            this.ShowUITo(this._flyAniRoot, "FlyAwardView", complete);
        };
        PageMgr.prototype.ShowPage = function (name, args, complete) {
            this.ShowUITo(this._pageRoot, name, args, complete);
        };
        PageMgr.prototype.ShowGuide = function (name, args, complete) {
            this.ShowUITo(this._guideTop, name, args, complete);
        };
        //除了TipsMgr，其他地方不要调用
        PageMgr.prototype.ShowTips = function (tipsObj) {
            this.ShowUITo(this._tipsRoot, "Tips", tipsObj);
        };
        PageMgr.prototype.ShowUITo = function (parent, name, args, complete) {
            // log(`显示页面 +++++++ ：${name} in [${parent.name}]`);
            if (Dylan[name] != null) {
                this.AddPage(parent, name, args, complete);
            }
        };
        PageMgr.prototype.RemoveGuide = function (name) {
            this.RemovePage(name, this._guideTop);
        };
        PageMgr.prototype.RemovePage = function (name, parent) {
            if (this.ipageMap[name]) {
                if (parent == null)
                    parent = this._pageRoot;
                var view = parent.getChildByName(name);
                if (view) {
                    // log(`移除页面 111 ------- ：${name} in [${parent.name}]`);
                    this.RemoveThisPage(view);
                }
                //避免移除，不应该移除的特殊容器的页面
                else if (this.ipageMap[name] instanceof Dialog) {
                    this.RemoveThisPage(this.ipageMap[name]);
                    // log(`移除页面 222 ------- ：${name} in [${parent.name}]`);
                    // GPlatform.HideBanner();
                }
            }
        };
        PageMgr.prototype.RemoveThisPage = function (page) {
            var ipage = this.ipageMap[page.name];
            if (ipage && ipage.OnRemoveStage)
                ipage.OnRemoveStage();
            Dylan.GEventMgr.Emit(PageMgr.PageClosed, page);
            page.removeSelf();
        };
        PageMgr.prototype.GetActivePage = function (name) {
            var page = this.ipageMap[name];
            return page != null && page.parent != null ? page : null;
        };
        PageMgr.prototype.GetPage = function (name) {
            return this.ipageMap[name];
        };
        ///////////////////////////////////// private function /////////////////////////////////////
        PageMgr.prototype.AddPage = function (parent, name, args, complete) {
            if (this.ipageMap[name]) {
                // if ((this.ipageMap[name] instanceof Dialog) && (this.ipageMap[name].parent != null)) {
                //     GPlatform.HideBanner();
                // }
            }
            else
                this.CreatePage(name, parent, args);
            var page = this.ipageMap[name];
            if (this.ipageMap[name] instanceof Dialog && page.parent)
                return;
            page.name = name;
            parent.addChild(page);
            if (this.ipageMap[name] instanceof Dialog) {
                var dialog = this.ipageMap[name];
                dialog.closeHandler = Laya.Handler.create(this, this.RemovePage, [name, null]);
                dialog.popup();
                // if (name != "TestPage") {
                //     //新手引导期间不显示banner广告
                //     if (GPlayerData.isFinishGuide || GPlayerData.mapLevel > 2) {
                //         if (Config.isSpeBannerOpen || !(name == "NeedGoldPage" && args != null)) {
                //             GPlatform.ShowBanner();
                //         }
                //     }
                // }
            }
            var ipage = this.ipageMap[name];
            if (ipage && ipage.OnAddStage)
                ipage.OnAddStage(args);
            Dylan.GEventMgr.Emit(PageMgr.PageShowed, page);
            if (complete != null)
                complete.run();
        };
        PageMgr.prototype.CreatePage = function (name, parent, args) {
            var node = new Dylan[name](args);
            var view = node;
            view.name = name;
            this.ipageMap[name] = node;
            return view;
        };
        PageMgr.PageShowed = 'PageShowed';
        PageMgr.PageClosed = "PageClosed";
        return PageMgr;
    }());
    Dylan.PageMgr = PageMgr;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=PageMgr.js.map