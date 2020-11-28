import React from 'react'

import './Menu.sass'


interface Option {
    callback: () => any
    img? : string
    fallback: string
}

interface Props {
    options: Option[]
}

function Menu(props: Props) {
    const {options} = props


    return (
        <div className="container">

            {options.map((i: Option, key: number) => {
                return (
                    <div key={'menuL'+key} className="element" onClick={
                        (e: React.MouseEvent<HTMLElement>) => {
                            e.preventDefault()
                            i.callback()                            
                        }
                    }>
                        <img src={i.img ? i.img : ''} alt={i.fallback} />
                    </div>

            )})}
        </div>
    )
}

export default Menu
