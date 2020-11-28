import React from 'react'

import Canvas from './Canvas'
import Menu from './Menu'

interface Props {}

function Main(props: Props) {
    const {} = props

    return (
        <div>
        <Canvas />
        <Menu options={[
            {callback: () => console.log('A'), fallback: 'A'},
            {callback: () => this.export(), fallback: 'Exp'},
            {callback: () => alert(JSON.stringify(this.lines)), fallback: 'Imp'},
        ]}></Menu>
        <input id='exportInput' />
    </div>
    )
}

export default Main
