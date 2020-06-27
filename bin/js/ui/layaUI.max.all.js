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
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var page;
    (function (page) {
        var SearchWayPageUI = /** @class */ (function (_super) {
            __extends(SearchWayPageUI, _super);
            function SearchWayPageUI() {
                return _super.call(this) || this;
            }
            SearchWayPageUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.page.SearchWayPageUI.uiView);
            };
            SearchWayPageUI.uiView = { "type": "View", "props": { "width": 600, "height": 400 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 761, "skin": "comp/bg.png", "sizeGrid": "30,4,4,4", "height": 509 } }, { "type": "Box", "props": { "y": 25, "x": 2, "width": 506, "height": 481 }, "child": [{ "type": "Sprite", "props": { "y": 70, "x": 52, "width": 395, "var": "mapSp", "height": 296 } }, { "type": "HSlider", "props": { "y": 384, "x": 118, "width": 360, "var": "slider", "skin": "comp/hslider.png", "height": 14, "centerX": 0 } }, { "type": "HScrollBar", "props": { "y": 416, "x": 72, "width": 363, "var": "scroll", "touchScrollEnable": false, "skin": "comp/hscroll.png", "scaleBar": false, "height": 17 } }] }, { "type": "Tab", "props": { "y": 71, "x": 512, "var": "functionTab", "space": 5, "skin": "comp/tab.png", "selectedIndex": 0, "labels": "设宽高和点,设通行性,测试" } }, { "type": "Box", "props": { "y": 120, "x": 496, "var": "baseSetBox" }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "child": [{ "type": "Label", "props": { "y": 36, "x": 0, "text": "宽高", "fontSize": 16 } }, { "type": "Box", "props": { "y": 0, "x": 80, "width": 140, "height": 24 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "宽", "fontSize": 14 } }, { "type": "TextInput", "props": { "y": 1, "x": 40, "width": 100, "var": "mapWidth", "type": "number", "text": "17", "skin": "comp/html.png", "prompt": "水平方向 格子数", "fontSize": 18, "bold": true, "align": "center" } }] }, { "type": "Label", "props": { "y": 36, "x": 100, "text": "X", "fontSize": 16 } }, { "type": "Box", "props": { "y": 60, "x": 80, "width": 140 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "高", "fontSize": 14 } }, { "type": "TextInput", "props": { "y": 1, "x": 40, "width": 100, "var": "mapHeight", "type": "number", "text": "13", "skin": "comp/html.png", "prompt": "竖直方向 格子数", "fontSize": 18, "bold": true, "align": "center" } }] }] }, { "type": "Box", "props": { "y": 130 }, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "text": "起点坐标", "fontSize": 16 } }, { "type": "Box", "props": { "y": 0, "x": 80, "width": 140 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "X", "fontSize": 14 } }, { "type": "TextInput", "props": { "y": 1, "x": 40, "width": 100, "var": "startX", "text": "8", "skin": "comp/html.png", "prompt": "竖直方向 格子数", "fontSize": 18, "bold": true, "align": "center" } }] }, { "type": "Box", "props": { "y": 30, "x": 80, "width": 140 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "Y", "fontSize": 14 } }, { "type": "TextInput", "props": { "y": 1, "x": 40, "width": 100, "var": "startY", "text": "6", "skin": "comp/html.png", "prompt": "竖直方向 格子数", "fontSize": 18, "bold": true, "align": "center" } }] }] }, { "type": "Box", "props": { "y": 230, "x": 0 }, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "text": "终点坐标", "fontSize": 16 } }, { "type": "Box", "props": { "y": 0, "x": 80, "width": 140 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "X", "fontSize": 14 } }, { "type": "TextInput", "props": { "y": 1, "x": 40, "width": 100, "var": "endX", "text": "14", "skin": "comp/html.png", "prompt": "竖直方向 格子数", "fontSize": 18, "bold": true, "align": "center" } }] }, { "type": "Box", "props": { "y": 30, "x": 80, "width": 140 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "Y", "fontSize": 14 } }, { "type": "TextInput", "props": { "y": 1, "x": 40, "width": 100, "var": "endY", "text": "11", "skin": "comp/html.png", "prompt": "竖直方向 格子数", "fontSize": 18, "bold": true, "align": "center" } }] }] }] }, { "type": "Box", "props": { "y": 120, "x": 480, "width": 250, "var": "gridSetBox", "height": 331 }, "child": [{ "type": "Label", "props": { "y": 0, "x": 40, "wordWrap": true, "width": 173, "text": "点击切换 通行性\\n\\n左键点击格子，可切换格子的\\n可通行、\\n禁通行、\\n有权值通行\\n之间循环切换", "leading": 4, "height": 115, "fontSize": 13, "color": "#8e4847" } }, { "type": "Label", "props": { "y": 150, "x": 50, "text": "设置 “有通行权值”" } }, { "type": "RadioGroup", "props": { "y": 178, "x": 50, "var": "costRadioGroup", "space": 20, "skin": "comp/radiogroup.png", "selectedIndex": 0, "labels": "1倍权值（默认）,2倍权值,3倍权值,4倍权值,5倍权值", "direction": "vertical" } }, { "type": "Button", "props": { "y": 149, "x": 160, "width": 100, "var": "resetWeightBtn", "skin": "comp/button.png", "sizeGrid": "4,4,4,4", "labelColors": "#AABB00", "label": "重置权值", "height": 37 } }] }, { "type": "Box", "props": { "y": 120, "x": 480, "var": "testBox" }, "child": [{ "type": "Box", "props": { "width": 240, "height": 24 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "驱动", "fontSize": 14 } }, { "type": "ComboBox", "props": { "y": 0, "x": 40, "width": 200, "var": "driveCombo", "skin": "comp/combobox.png", "sizeGrid": "4,20,4,4", "selectedIndex": 0, "labels": "按帧执行 驱动  ,左键点击 驱动", "height": 23 } }] }, { "type": "Box", "props": { "y": 45 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "算法", "fontSize": 14 } }, { "type": "ComboBox", "props": { "y": 0, "x": 40, "width": 200, "var": "searchCombo", "skin": "comp/combobox.png", "sizeGrid": "4,20,4,4", "selectedIndex": 0, "labels": "深度优先（DFS）  ,广度优先（BFS）  ,DIJKSTRA（迪杰斯特）  ,贪婪最佳优先搜索（GBFS）  ,A*    ,B*    ", "height": 23 } }] }, { "type": "Box", "props": { "y": 88 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "text": "速度", "fontSize": 14 } }, { "type": "ComboBox", "props": { "y": 0, "x": 40, "width": 200, "var": "stepCombo", "skin": "comp/combobox.png", "sizeGrid": "4,20,4,4", "selectedIndex": 0, "labels": "一个顶点  ,一圈顶点  ,一侧顶点", "height": 23, "disabled": true } }] }, { "type": "CheckBox", "props": { "y": 128, "x": 118, "width": 118, "var": "showCostCheck", "skin": "comp/checkbox.png", "labelPadding": "0,0,0,5", "label": "显示消耗", "height": 18 } }, { "type": "CheckBox", "props": { "y": 128, "x": 2, "width": 118, "var": "showDirCheck", "skin": "comp/checkbox.png", "labelPadding": "0,0,0,5", "label": "显示指向", "height": 18 } }, { "type": "CheckBox", "props": { "y": 152, "x": 22, "var": "isPreprocessCheck", "skin": "comp/checkbox.png", "labelPadding": "0,0,0,5", "label": "预处理地图信息  (否则：遍历时计算)" } }, { "type": "CheckBox", "props": { "y": 203, "x": 2, "var": "showNeighborsCheck", "skin": "comp/checkbox.png", "labelPadding": "0,0,0,5", "label": "显示相邻格子" } }, { "type": "Button", "props": { "y": 268, "x": 26, "width": 100, "var": "startBtn", "skin": "comp/button.png", "sizeGrid": "4,4,4,4", "label": "停止", "height": 37 } }, { "type": "Button", "props": { "y": 268, "x": 148, "width": 100, "var": "pauseBtn", "skin": "comp/button.png", "sizeGrid": "4,4,4,4", "label": "暂停", "height": 37 } }, { "type": "Button", "props": { "y": 326, "x": 26, "width": 100, "var": "clearBtn", "skin": "comp/button.png", "sizeGrid": "4,4,4,4", "labelColors": "#AABB00", "label": "重置", "height": 37 } }, { "type": "Button", "props": { "y": 326, "x": 148, "width": 100, "var": "resetBtn", "skin": "comp/button.png", "sizeGrid": "4,4,4,4", "labelColors": "#FF0000", "label": "重置权值", "height": 37 } }] }] };
            return SearchWayPageUI;
        }(View));
        page.SearchWayPageUI = SearchWayPageUI;
    })(page = ui.page || (ui.page = {}));
})(ui || (ui = {}));
(function (ui) {
    var page;
    (function (page) {
        var TipsUI = /** @class */ (function (_super) {
            __extends(TipsUI, _super);
            function TipsUI() {
                return _super.call(this) || this;
            }
            TipsUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.page.TipsUI.uiView);
            };
            TipsUI.uiView = { "type": "View", "props": { "width": 720, "height": 1280 }, "child": [{ "type": "Box", "props": { "centerY": 0, "centerX": 0 }, "child": [{ "type": "Box", "props": { "y": 0, "var": "box", "right": 0, "left": 0 }, "child": [{ "type": "Box", "props": { "y": 19, "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "child": [{ "type": "Image", "props": { "width": 520, "var": "bg", "skin": "common/bg1.png", "height": 204, "centerX": 0, "sizeGrid": "100,200,100,200" } }, { "type": "Image", "props": { "y": 34, "width": 68, "var": "icon", "skin": "common/ok1.png", "height": 66, "centerX": 0 } }, { "type": "Label", "props": { "y": 105, "wordWrap": true, "width": 460, "var": "tips", "valign": "middle", "text": "请选择要兑换的金额", "strokeColor": "#7f3d3c", "stroke": 0, "leading": 20, "height": 50, "fontSize": 30, "font": "Microsoft YaHei", "color": "#573c3c", "centerX": 0, "bold": true, "align": "center" } }] }] }] }] };
            return TipsUI;
        }(View));
        page.TipsUI = TipsUI;
    })(page = ui.page || (ui.page = {}));
})(ui || (ui = {}));
(function (ui) {
    var test;
    (function (test) {
        var TestPageUI = /** @class */ (function (_super) {
            __extends(TestPageUI, _super);
            function TestPageUI() {
                return _super.call(this) || this;
            }
            TestPageUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.test.TestPageUI.uiView);
            };
            TestPageUI.uiView = { "type": "View", "props": { "width": 600, "height": 400 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 600, "skin": "comp/bg.png", "sizeGrid": "30,4,4,4", "height": 400 } }, { "type": "Button", "props": { "y": 56, "x": 41, "width": 150, "var": "btn", "skin": "comp/button.png", "sizeGrid": "4,4,4,4", "label": "点我赋值", "height": 37 } }, { "type": "Clip", "props": { "y": 56, "x": 401, "var": "clip", "skin": "comp/clip_num.png", "index": 5, "clipX": 10 } }, { "type": "ComboBox", "props": { "y": 143, "x": 220, "width": 200, "var": "combobox", "skin": "comp/combobox.png", "sizeGrid": "4,20,4,4", "selectedIndex": 1, "labels": "select1,select2,selecte3", "height": 23 } }, { "type": "Tab", "props": { "y": 96, "x": 220, "var": "tab", "skin": "comp/tab.png", "labels": "tab1,tab2,tab3" } }, { "type": "VScrollBar", "props": { "y": 223, "x": 259, "skin": "comp/vscroll.png", "height": 150 } }, { "type": "VSlider", "props": { "y": 223, "x": 224, "skin": "comp/vslider.png", "height": 150 } }, { "type": "List", "props": { "y": 68, "x": 452, "width": 128, "var": "list", "vScrollBarSkin": "comp/vscroll.png", "repeatX": 1, "height": 299 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 112, "name": "render", "height": 30 }, "child": [{ "type": "Label", "props": { "y": 5, "x": 26, "width": 78, "text": "this is a list", "skin": "comp/label.png", "name": "label", "height": 20, "fontSize": 14 } }, { "type": "Clip", "props": { "y": 2, "x": 0, "skin": "comp/clip_num.png", "name": "clip", "clipX": 10 } }] }] }, { "type": "Button", "props": { "y": 4, "x": 563, "skin": "comp/btn_close.png", "name": "close" } }, { "type": "Button", "props": { "y": 112, "x": 41, "width": 150, "var": "btn2", "skin": "comp/button.png", "sizeGrid": "4,4,4,4", "labelSize": 30, "labelBold": true, "label": "点我赋值", "height": 66 } }, { "type": "CheckBox", "props": { "y": 188, "x": 220, "var": "check", "skin": "comp/checkbox.png", "label": "checkBox1" } }, { "type": "RadioGroup", "props": { "y": 61, "x": 220, "var": "radio", "skin": "comp/radiogroup.png", "labels": "radio1,radio2,radio3" } }, { "type": "Panel", "props": { "y": 223, "x": 299, "width": 127, "vScrollBarSkin": "comp/vscroll.png", "height": 150 }, "child": [{ "type": "Image", "props": { "skin": "comp/image.png" } }] }, { "type": "CheckBox", "props": { "y": 188, "x": 326, "skin": "comp/checkbox.png", "labelColors": "#ff0000", "label": "checkBox2" } }, { "type": "Box", "props": { "y": 197, "x": 38, "var": "box" }, "child": [{ "type": "ProgressBar", "props": { "y": 70, "width": 150, "skin": "comp/progress.png", "sizeGrid": "4,4,4,4", "name": "progress", "height": 14 } }, { "type": "Label", "props": { "y": 103, "width": 137, "text": "This is a Label", "skin": "comp/label.png", "name": "label", "height": 26, "fontSize": 20 } }, { "type": "TextInput", "props": { "y": 148, "width": 150, "text": "textinput", "skin": "comp/textinput.png", "name": "input" } }, { "type": "HSlider", "props": { "width": 150, "skin": "comp/hslider.png", "name": "slider" } }, { "type": "HScrollBar", "props": { "y": 34, "width": 150, "skin": "comp/hscroll.png", "name": "scroll" } }] }] };
            return TestPageUI;
        }(View));
        test.TestPageUI = TestPageUI;
    })(test = ui.test || (ui.test = {}));
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map