module Dylan {
    export class TipsObj {
        private _tips: string = "";
        public get tips(): string {
            return this._tips;
        }
        private _icon: number = 1;
        public get icon(): number {
            return this._icon;
        }
        constructor(tips: string, icon: number) {
            this._tips = tips;
            this._icon = icon;
        }
    }

    export class TipsMgr {
        private tipsQueue: TipsObj[] = [];
        private isShowing:boolean = false;

        //单例
        private static _inst: TipsMgr;
        public static get Inst() {
            if (TipsMgr._inst == null) {
                TipsMgr._inst = new TipsMgr();
            }
            return TipsMgr._inst;
        }

        private constructor() {
            GEventMgr.On(PageMgr.PageClosed, this, this.OnPageRemove);
        }

        //
        public Show(tips: string, icon: number): void {
            this.Add(tips, icon);
            this.DoShow();
        }

        private Add(tips: string, icon: number): void {
            let length = this.tipsQueue.length;
            if (length == 0 || this.tipsQueue[length - 1].tips != tips) {
                this.tipsQueue.push(new TipsObj(tips, icon));
            }
        }

        private DoShow(): void {
            let length = this.tipsQueue.length;
            if (!this.isShowing && length > 0) {
                let tipsObj = this.tipsQueue[0];
                GPageMgr.ShowTips(this.tipsQueue[0]);
                this.isShowing = true;
            }
        }

        private OnPageRemove(page: View): void {
            if (page.name == "Tips") {
                this.isShowing = false;
                this.tipsQueue.shift();
                this.DoShow();
            }
        }
    }
}