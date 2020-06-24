module Dylan{
    export class GbfsSearch extends BaseSearch {
        public get isOver(): boolean{
            return false;
        }

        public SearchCustomSteps(step:number = 1): void {
            
        }

        protected DoSearchOneStep(): void {
            
        }

        public Reset():void{
            
            super.Reset();
        }
    }
}