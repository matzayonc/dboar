import React, { PureComponent, ReactNode } from 'react'
import { Prompt } from 'react-router'
import { isThisTypeNode, isThrowStatement } from 'typescript'

import './Canvas.sass'

import Menu from './Menu'




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
    color? : string
    girth? : number
}


interface Props {}


interface State {
    size: Size
}




class Canvas extends PureComponent<Props, State> {
    down: boolean
    prev: Coords
    lines: Line[]
    ctx: CanvasRenderingContext2D 


    constructor(props: Props) {
        super(props)

        this.state = {
            size: {width: 0, height: 0}
        }
        this.down = false
        this.prev = {x: 0, y: 0}
        this.lines = []


    }

    
    componentDidMount() {
        this.ctx = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions.bind(this));
        window.addEventListener('mousedown', this.mouseDown.bind(this));
        window.addEventListener('mouseup', this.mouseUp.bind(this));
        window.addEventListener('mousemove', this.mouseMove.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    }
      
    updateWindowDimensions() {
        this.setState({ size: { width: window.innerWidth, height: window.innerHeight }});
        this.canvasRerender()
    }

    mouseDown(e: MouseEvent){
        this.down = true
        this.prev = {x: e.pageX, y: e.pageY}
        this.lines.push({points: [{x: e.pageX, y: e.pageY }]})

    }

    mouseUp(e: MouseEvent){
        this.down = false
        console.log(this.prev)
    }
      
    mouseMove(e: MouseEvent){
        if(!this.down) return


        let prev = this.lines[this.lines.length-1].points[this.lines[this.lines.length-1].points.length -1]
        this.lines[this.lines.length-1].points.push({x: e.pageX, y: e.pageY})

        this.ctx.moveTo(prev.x, prev.y)
        this.ctx.lineTo(e.pageX, e.pageY)
        this.ctx.stroke(); 

    }

    canvasRerender(){
        for(let line of this.lines){
            this.ctx.moveTo(line.points[0].x, line.points[0].y)

            for(let point of line.points){

                this.ctx.lineTo(point.x, point.y)
            }
        }
        this.ctx.stroke()
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



    
    render(): ReactNode {

        return (
            <div>
                <canvas id="canvas" width={this.state.size.width} height={this.state.size.height} />
                <Menu options={[
                    {callback: () => console.log('A'), fallback: 'A'},
                    {callback: () => this.export(), fallback: 'Exp'},
                    {callback: () => alert(JSON.stringify(this.lines)), fallback: 'Imp'},
                ]}></Menu>
            </div>
        )

    }
}

export default Canvas