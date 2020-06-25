var Dylan;
(function (Dylan) {
    var Handler = Laya.Handler;
    Dylan.log = console.log;
    Dylan.warn = console.warn;
    Dylan.error = console.error;
    Dylan.GEventMgr = new Dylan.EventMgr();
    Dylan.GMapSearch = new Dylan.MapSearch();
    var Launch = /** @class */ (function () {
        function Launch() {
            //程序入口
            Laya.init(760, 510, Laya.WebGL);
            // Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);
            Laya.loader.load(["res/atlas/comp.atlas", "res/atlas/common.atlas"], Handler.create(null, this.OpenSearchWayPage));
            // this.CreateMapSearch();
        }
        Launch.prototype.OpenSearchWayPage = function () {
            Dylan.GTipsMgr = Dylan.TipsMgr.Inst;
            Dylan.GPageMgr = Dylan.PageMgr.Inst;
            Dylan.GPageMgr.ShowPage("SearchWayPage");
        };
        return Launch;
    }());
    Dylan.Launch = Launch;
})(Dylan || (Dylan = {}));
new Dylan.Launch();
//# sourceMappingURL=Launch.js.map