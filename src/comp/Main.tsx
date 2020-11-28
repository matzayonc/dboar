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
        </div>
    )
}

export default Main
