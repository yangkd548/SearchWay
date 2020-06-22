module Dylan {
	import Handler = Laya.Handler;

	export const log = console.log;
	export const warn = console.warn;
	export const error = console.error;

	export var GEventMgr: EventMgr = new EventMgr();
	export var GTipsMgr: TipsMgr;
	export var GPageMgr: PageMgr;
	export var GMapSearch: MapSearch = new MapSearch();

	export class Launch {
		constructor() {
			//程序入口
			Laya.init(760, 510, Laya.WebGL);
			// Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);
			Laya.loader.load(["res/atlas/comp.atlas","res/atlas/common.atlas"], Handler.create(null, this.OpenSearchWarPage));
			// this.CreateMapSearch();
		}

		private OpenSearchWarPage(): void {
			GTipsMgr = TipsMgr.Inst;
			GPageMgr = PageMgr.Inst;
			GPageMgr.ShowPage("SearchWayPage");
		}
	}
}
new Dylan.Launch();