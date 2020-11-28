import React from 'react'


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
        <div className="menu-container">

            {options.map((i: Option, key: number) => {
                return (
                    <div key={'menuL'+key} className="menu-element" onClick={
                        (e: React.MouseEvent<HTMLElement>) => {
                            e.stopPropagation()
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
