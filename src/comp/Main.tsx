import React from 'react'

import Canvas from './Canvas'
import Menu from './Menu'

interface Props {}


function Main(props: Props) {
    const {} = props

    return (
        <div>
            <Canvas />
            <input id='exportInput' />
            <input type='file' id='importInput' />
            <input type='color' id='colorInput' />
        </div>
    )
}

export default Main
