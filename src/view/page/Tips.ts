module Dylan {
    import Vector2 = Laya.Vector2;
    import Ease = Laya.Ease;
    export class Tips extends ui.page.TipsUI implements IPage {
        private readonly inTime: number = 300;
        private readonly stayTime: number = 600;
        private readonly outTime: number = 200;

        private readonly stayY: number = -150;
        private readonly outY: number = -250;

        private readonly bgOriginHeight: number;
        private readonly originPos: Vector2;

        constructor() {
            super();
            this.width = Laya.stage.width;
			this.height = Laya.stage.height;
            this.box.alpha = 0;
            this.bgOriginHeight = this.bg.height;
            this.originPos = new Vector2(this.box.x, this.box.y);
        }

        public OnAddStage(tipsObj: TipsObj): void {
            this.box.pos(this.originPos.x, this.originPos.y);
            this.box.alpha = 0;
            this.icon.skin = tipsObj.icon == 1 ? "common/ok1.png" : "common/warn1.png";
            this.tips.text = tipsObj.tips;
            this.bg.height = this.bgOriginHeight + this.tips.textField.textHeight - this.tips.textField.height;
            this.ComeIn();
        }

        public OnRemoveStage(): void { }

        private ComeIn(): void {
            let cur = { y: this.box.y, alpha: this.box.alpha };
            Laya.Tween.to(
                cur,
                {
                    y: this.stayY, alpha: 1,
                    update: Laya.Handler.create(this, () => {
                        this.box.alpha = cur.alpha;
                        this.box.y = cur.y;
                    }, null, false)
                },
                this.inTime, Ease.linearIn,
                Laya.Handler.create(this, () => {
                    this.Stay();
                })
            );
        }

        private Stay(): void {
            Laya.timer.once(this.stayTime, this, () => { this.GoOut(); });
        }

        private GoOut(): void {
            let cur = { y: this.box.y, alpha: this.box.alpha };
            Laya.Tween.to(
                cur,
                {
                    y: this.outY, alpha: 0,
                    update: Laya.Handler.create(this, () => {
                        this.box.alpha = cur.alpha;
                        this.box.y = cur.y;
                    }, null, false)
                },
                this.outTime, Ease.linearOut,
                Laya.Handler.create(this, () => {
                    GPageMgr.RemoveThisPage(this);
                })
            );
        }
    }
}