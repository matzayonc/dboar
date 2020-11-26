import React, { PureComponent, ReactNode } from 'react'

import './Canvas.sass'


interface Size {
    width: number
    height: number
}

interface Coords {
    x: number
    y: number
}

interface Props {}


interface State {
    size: Size
}




class Canvas extends PureComponent<Props, State> {
    down: boolean
    prev: Coords

    constructor(props: Props) {
        super(props)

        this.state = {
            size: {width: 0, height: 0}
        }
        this.down = false
        this.prev = {x: 0, y: 0}
    }

    
    componentDidMount() {
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
    }

    mouseDown(e: MouseEvent){
        this.down = true
        this.prev = {x: e.pageX, y: e.pageY}

    }

    mouseUp(e: MouseEvent){
        this.down = false
        console.log(this.prev)
    }
      
    mouseMove(e: MouseEvent){
        if(!this.down) return

        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        const ctx = canvas.getContext("2d");
        ctx.moveTo(this.prev.x, this.prev.y)
        ctx.lineTo(e.pageX, e.pageY)
        ctx.stroke(); 
        this.prev = {x: e.pageX, y: e.pageY}
    }

    render(): ReactNode {
        return (
            <canvas id="canvas" width={this.state.size.width} height={this.state.size.height}></canvas>
        )
    }
}

export default Canvas
