import React from 'react'


interface Option {
    name: string
    callback: () => void
}


interface Props {
    title: string
    text: string
    options: Option[]
}

function Prompt(props: Props) {
    const {title, text, options} = props

    return (
        <div className='prompt-box'>
            <h3 className='prompt-title'>{title}</h3>
            <p className='prompt-text'>{text}</p>
            <div className='prompt-options'>{options.map(o => {
                return (
                    <button onClick={o.callback}>{o.name}</button>
                )
            })}
            
            </div>
        </div>
    )
}

export default Prompt
