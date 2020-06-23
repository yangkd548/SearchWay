module Dylan {
    export class AstarSearch extends BaseSearch {
        public get isOver(): boolean {
            return false;
        }

        public SearchCustomSteps(step: number = 1): void {

        }

        protected SearchOneStep(): void {

        }

        protected FallBackOneStep(): void {

        }

        public Reset():void{

            super.Reset();
        }
    }
}