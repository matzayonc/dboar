import * as request from 'superagent'
const C2S = require('canvas2svg')

const server = 'http://localhost:3000'

interface Size {
    width: number
    height: number
}

interface Coords {
    x: number
    y: number
}

interface Line {
    points : Coords[]
    color : string
    girth? : number
}

interface Move {
    offset: Coords
    prev: Coords
    active: boolean
}



class Canvas{
    lines: Line[]
    ctx: CanvasRenderingContext2D 
    drawing: boolean
    move: Move
    offset: Coords
    activeColor: string
    size: Coords

    constructor() {

        this.activeColor = '000000'
        this.lines = []
        this.offset = {x: 0, y: 0}
        this.drawing = false
        this.move = { offset: {x: 0, y: 0}, prev: {x: 0, y: 0}, active: false}
        
        this.mount()
        //this.get()
        this.test()
    }

    test(){
        let ctx = new C2S(this.size.x, this.size.y)
        ctx.fillStyle="red";
        ctx.fillRect(100,200,100,200);
        let svg = ctx.getSerializedSvg()
        console.log(svg)
        this.drawSvgString(ctx.getSerializedSvg())


    }

    dataToSvg(){

        let ctx = new C2S(this.size.x, this.size.y)


        for(let line of this.lines){
            const off = this.move.offset
            ctx.beginPath()

            ctx.moveTo(line.points[0].x + off.x, line.points[0].y + off.y)

            for(let point of line.points){
                ctx.lineTo(point.x + off.x, point.y + off.y)
                ctx.strokeStyle = '#' + line.color
                ctx.stroke()
            }
        }



        let svg = ctx.getSerializedSvg()
        console.log(svg)

        return svg
    }

    drawSvgString(svg: string){
        let blob = new Blob([svg], {type: 'image/svg+xml'});
        let url = URL.createObjectURL(blob);
        let image = document.createElement('img');
        image.src = url;
        image.addEventListener('load', () => {
            URL.revokeObjectURL(url)
            console.log(image)
            this.ctx.drawImage(image, 0, 0)
        }, {once: true});
    }



    get(){
        request.get(server + '/tab/a')
            .set('accept', 'json')
            .end((err, res) => {
                const data = JSON.parse(res.text)
                console.log(data)
                this.lines = data
                this.canvasRerender()
            })
    }

    post(){
        request.post(server + '/tab/a')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(this.lines))
            .then((res) => {})
            .catch(err => console.error(err))
    }

    
    mount() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        this.ctx = canvas.getContext("2d");

        this.resize();
        canvas.addEventListener('mousedown', this.mouseDown.bind(this));
        canvas.addEventListener('mouseup', this.mouseUp.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', this.mouseMove.bind(this));
        window.addEventListener('contextmenu', e => e.preventDefault())
        document.getElementById('importInput').addEventListener('change', this.upload.bind(this))        
        document.getElementById('colorInput').addEventListener('change', this.color.bind(this))        
        
        this.buttons()
    }

    buttons(){
        document.getElementById('exportButton').addEventListener('click', () => this.export())
        document.getElementById('importButton').addEventListener('click', () => this.import())
        document.getElementById('SVGButton').addEventListener('click', () => this.dataToSvg())
        document.getElementById('colorButton').addEventListener('click', () => this.changeColor())
        document.getElementById('syncButton').addEventListener('click', () => this.post())
    }
      
    resize() {
        console.log('resize')
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        this.size = {x: window.innerWidth, y: window.innerHeight}
        canvas.width = this.size.x
        canvas.height =this.size.y
        this.canvasRerender()
    }

    mouseDown(e: MouseEvent){
        if(e.button == 0){
            this.drawing = true
            this.lines.push({points: [{x: e.pageX - this.move.offset.x, y: e.pageY - this.move.offset.y}], color: this.activeColor})
        }
        else
            this.move = {offset: this.move.offset , prev: {x: e.pageX, y: e.pageY }, active: true}
    }

    mouseUp(e: MouseEvent){
        e.preventDefault()

        if(this.drawing) this.post()


        this.drawing = false
        this.move.active = false

    }
      
    mouseMove(e: MouseEvent){
        if(e.buttons == 1){
            if(!this.drawing) return

            let prev = this.lines[this.lines.length-1].points[this.lines[this.lines.length-1].points.length -1]
            this.lines[this.lines.length-1].points.push({x: e.pageX - this.move.offset.x, y: e.pageY - this.move.offset.y})

            this.ctx.beginPath()
            this.ctx.moveTo(prev.x + this.move.offset.x, prev.y + this.move.offset.y)
            this.ctx.lineTo(e.pageX, e.pageY)
            this.ctx.strokeStyle = '#' + this.activeColor
            this.ctx.stroke(); 
        }
        else if(e.buttons == 2){
            if(!this.move.active) return           

            this.move.offset.x += e.pageX - this.move.prev.x
            this.move.offset.y += e.pageY - this.move.prev.y

            this.move.prev = {x: e.pageX, y: e.pageY }

            this.canvasRerender()
        }
    }

    upload(e: Event){
        let filer = document.getElementById('importInput') as HTMLInputElement
        let file = filer.files[0]

        if(!file) return

        const reader = new FileReader();

        reader.readAsText(file, "UTF-8");
    
        reader.onerror = e => console.error(e)
        reader.onload = (e :any) => {
            this.lines = []
            this.canvasRerender()
            this.lines = JSON.parse(e.target.result)
            this.canvasRerender()
        
        }
    }

    canvasRerender(){
        this.ctx.clearRect(0, 0, this.size.x, this.size.y)
        this.ctx.translate(this.move.offset.x, this.move.offset.y)

        for(let line of this.lines){
            this.ctx.beginPath()

            this.ctx.moveTo(line.points[0].x, line.points[0].y)

            for(let point of line.points){
                this.ctx.lineTo(point.x, point.y)
                this.ctx.strokeStyle = '#' + line.color
                this.ctx.stroke()
            }
        }
        this.ctx.translate(-this.move.offset.x, -this.move.offset.y)

    }

    exportToClipboard(){

        let inp = document.createElement('input')
        document.body.appendChild(inp)
        inp.value = JSON.stringify(this.lines)
        inp.select()
        document.execCommand("copy");
        document.body.removeChild(inp)

    }

    export(){
        let el = document.createElement('a')
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(this.lines));
        el.setAttribute('download', 'exported.json');

        el.style.display = 'none';
        document.body.appendChild(el);    
        el.click();    
        document.body.removeChild(el);
    }

    import(){  
        document.getElementById('importInput').click()   
    }

    changeColor(){
        document.getElementById('colorInput').click()
    }

    color(e: InputEvent){
        this.activeColor = (e.target as HTMLInputElement).value.split('#')[1]
    }


}

export default Canvas