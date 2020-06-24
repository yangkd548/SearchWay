module Dylan {
    import Node = Laya.Node;
    import Sprite = Laya.Sprite;
    import View = Laya.View;
    import Handler = Laya.Handler;

    export class PageMgr {
        public static readonly PageShowed:string = 'PageShowed';
        public static readonly PageClosed:string = "PageClosed";
        //单例
        private static _inst: PageMgr;
        public static get Inst() {
            if (PageMgr._inst == null) {
                PageMgr._inst = new PageMgr();
            }
            return PageMgr._inst;
        }

        private constructor() {
            //ui视图层
            this._pageRoot = this.CreateRootLayer("pageRoot");
            // this._broadRoot = this.CreateRootLayer("broadRoot");
            this._flyAniRoot = this.CreateRootLayer("flyAniRoot");
            this._guideBottom = this.CreateRootLayer("guideBottom");
            this._guideTop = this.CreateRootLayer("guideTop");
            this._tipsRoot = this.CreateRootLayer("tipsRoot", 10000);
        }

        private CreateRootLayer(name: string, zOrder: number = 0): Sprite {
            let layer: Sprite = new Sprite();
            layer.name = name;
            Laya.stage.addChild(layer);
            if (zOrder) layer.zOrder = zOrder;
            return layer;
        }

        public AddToGuideRoot(sprite: Sprite): void {
            this._guideBottom.addChild(sprite);
        }

        public CloseAllPage(): void {
            for (let name in this.ipageMap) {
                if (this._pageRoot.getChildByName(name) != null) {
                    this.RemovePage(name, this._pageRoot);
                }
            }
        }

        public ShowFlyAniView(complete?: Laya.Handler): void {
            this.ShowUITo(this._flyAniRoot, "FlyAwardView", complete);
        }

        public ShowPage(name: string, args?: any, complete?: Laya.Handler): void {
            this.ShowUITo(this._pageRoot, name, args, complete);
        }

        public ShowGuide(name: string, args?: any, complete?: Laya.Handler): void {
            this.ShowUITo(this._guideTop, name, args, complete);
        }

        //除了TipsMgr，其他地方不要调用
        public ShowTips(tipsObj: TipsObj): void {
            this.ShowUITo(this._tipsRoot, "Tips", tipsObj);
        }

        public ShowUITo(parent: Node, name: string, args?: any, complete?: Laya.Handler): void {
            if (Dylan[name] != null) {
                this.AddPage(parent, name, args, complete);
            }
        }

        public RemoveGuide(name: string): void {
            this.RemovePage(name, this._guideTop);
        }

        public RemovePage(name: string, parent?: Node): void {
            if (this.ipageMap[name]) {
                if (parent == null) parent = this._pageRoot;
                let view: View = parent.getChildByName(name) as View;
                if (view) {
                    this.RemoveThisPage(view);
                }
                //避免移除，不应该移除的特殊容器的页面
                else if (this.ipageMap[name] instanceof Dialog) {
                    this.RemoveThisPage(this.ipageMap[name]);
                }
            }
        }

        public RemoveThisPage(page: View): void {
            let ipage: IPage = this.ipageMap[page.name] as IPage;
            if (ipage && ipage.OnRemoveStage) ipage.OnRemoveStage();
            GEventMgr.Emit(PageMgr.PageClosed, page);
            page.removeSelf();
        }

        public GetActivePage(name: string): View {
            let page: View = this.ipageMap[name] as View;
            return page != null && page.parent != null? page:null;
        }

        public GetPage(name: string): View {
            return this.ipageMap[name];
        }

        ///////////////////////////////////// private function /////////////////////////////////////

        private AddPage(parent: Node, name: string, args?: any, complete?: Handler): void {
            if (this.ipageMap[name]) {
                // if ((this.ipageMap[name] instanceof Dialog) && (this.ipageMap[name].parent != null)) {
                //     GPlatform.HideBanner();
                // }
            }
            else this.CreatePage(name, parent, args);
            let page: View = this.ipageMap[name] as View;
            if (this.ipageMap[name] instanceof Dialog && page.parent) return;
            page.name = name;
            parent.addChild(page);
            if (this.ipageMap[name] instanceof Dialog) {
                let dialog = this.ipageMap[name] as Dialog;
                dialog.closeHandler = Laya.Handler.create(this, this.RemovePage, [name, null]);
                dialog.popup();
            }
            let ipage: IPage = this.ipageMap[name] as IPage;
            if (ipage && ipage.OnAddStage) ipage.OnAddStage(args);
            GEventMgr.Emit(PageMgr.PageShowed, page);
            if (complete != null) complete.run();
        }

        private CreatePage(name: string, parent: Node, args?: any): View {
            let node: any = new Dylan[name](args);
            let view = node as View;
            view.name = name;
            this.ipageMap[name] = node as IPage;
            return view;
        }

        ///////////////////////////////////// variable /////////////////////////////////////

        private _pageRoot: Node;
        // private _broadRoot:Sprite;//走马灯层
        private _flyAniRoot: Node;
        private _guideBottom: Node;
        private _guideTop: Node;
        private _tipsRoot:Node;

        public rankUIImg: Laya.Image;

        private ipageMap: { [id: string]: any } = {};

        private showModelEvent: Laya.EventDispatcher = new Laya.EventDispatcher();

    }
}