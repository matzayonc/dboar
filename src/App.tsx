import './style/main.sass'

import Canvas from './comp/Canvas';




class App {
	canvas: Canvas
	
	constructor(){
		this.canvas = new Canvas()
	}
}

export default App
