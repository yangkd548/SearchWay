module Dylan {
    export class DijkstraSearch extends BaseBfsSearch {

        protected DoSearchOneStep(): void {
            if (!this.isRunning) return;
            this.AddStep();
            this.SetCurPoint(this.frontier.shift());
            for (let next of this.mapGraph.GetNeighbors(this.curPoint)) {
                let newCost = this.mapGraph.GetCost(this.curPoint, next);
                if (!next.cost || newCost < next.cost) {
                    next.cost = newCost;
                    this.AddFrontierPoint(next);
                    if (this.isSucc) {
                        break;
                    }
                }
            }
        }

        protected AddFrontierPoint(point: MapPoint): void {
            super.AddFrontierPoint(point);
            if(this.isSucc) return;
            this.PutPriorityQueue(point);
        }

        protected PutPriorityQueue(point: MapPoint):void{
            let lastPos = this.frontier.indexOf(point);
            if(lastPos != -1){
                this.frontier.splice(lastPos, 1);
            }
            this.InsertIncArr(this.frontier, "cost", point, 0, lastPos);
        }

        //二分法插入对象（插入对象的算法，对寻路效率的影响很大）
        protected InsertIncArr(arr: any[], key: string, input: any, min: number = -1, max: number = -1): void {
            if (min >= arr.length || min < 0) min = 0;
            if (max >= arr.length || max < 0) max = arr.length - 1;
            if (min > max) {
                let index = min;
                min = max;
                max = min;
            }
            if (min == max) {
                arr.splice(min, 0, input);
            }
            else {
                let minObj = arr[min];
                let maxObj = arr[max];
                let inputValue = input[key];
                if (inputValue >= maxObj[key]) {
                    arr.splice(max + 1, 0, input);
                }
                else {
                    if (inputValue < minObj[key]) {
                        arr.splice(min, 0, input);
                    }
                    else {
                        if (min + 1 == max) {
                            arr.splice(max, 0, input);
                        }
                        else {
                            let midIndex = Math.floor((max + min) / 2);
                            let midObj = arr[midIndex];
                            if (midObj[key] > inputValue) {
                                this.InsertIncArr(arr, key, input, min, midIndex);
                            }
                            else {
                                this.InsertIncArr(arr, key, input, midIndex, max);
                            }
                        }
                    }
                }
            }
        }

    }
}