abstract class SimpleClass {
    protected _canvasDom : HTMLCanvasElement;
    protected _context : CanvasRenderingContext2D;
    protected screenHeight : number;
    protected screenWidth : number;

    public IsProgramValid : boolean = false;

    constructor(queryString :string) {
        this._canvasDom = document.querySelector(queryString);
        this.IsProgramValid = this._canvasDom != null;

        if (this.IsProgramValid) {
            this._context = this._canvasDom.getContext("2d");
            this.RegisterDomEvent();    
            this.SetCanvasSize();
        }
    }

    protected RegisterDomEvent() {
        window.addEventListener('resize', () => {
            this.SetCanvasSize();
        });
    }

    protected SetCanvasSize() {
        this.SetCanvasToSceenSize(this._canvasDom);
        this.screenHeight = window.innerHeight - 4;
        this.screenWidth = window.innerWidth ;
    }

    public SetCanvasToSceenSize(canvas : HTMLCanvasElement) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight -4;

        console.log(`canvas.width ${canvas.width}, heigth ${canvas.height}`);
    }
}

export default SimpleClass;