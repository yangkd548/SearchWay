module Dylan {
    export function Vec2Equal(v1: Laya.Vector2, v2: Laya.Vector2): boolean {
        return v1.x == v2.x && v1.y == v2.y;
    }

    export function CopyVec2(target: Laya.Vector2, data: Laya.Vector2): void {
        target.x = data.x;
        target.y = data.y;
    }
}