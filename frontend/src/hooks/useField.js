import { useState } from 'react'

export const useField = (type) => {
    const [value, setValue] = useState('')
    console.log(value)

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    return {
        inputProps: {
            type,
            value,
            onChange,
        },
        reset,
    }
}
