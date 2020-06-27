var Dylan;
(function (Dylan) {
    function Vec2Equal(v1, v2) {
        return v1.x == v2.x && v1.y == v2.y;
    }
    Dylan.Vec2Equal = Vec2Equal;
    function CopyVec2(target, data) {
        target.x = data.x;
        target.y = data.y;
    }
    Dylan.CopyVec2 = CopyVec2;
})(Dylan || (Dylan = {}));
//# sourceMappingURL=Global.js.map