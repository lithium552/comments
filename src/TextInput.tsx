import React from 'react'
import { useRef } from 'react'
import { State } from './types'

interface TextareaProps{
    state: State
    dispatch: React.Dispatch<any>
    user?: {
      image: {
        png: string,
        webp: string
      }
      username: string
    }
}

const TextInput = ({state, dispatch, user}: TextareaProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <>
    {!state.edit.content ? (<img src={state.data.currentUser.image.png} />) : null}
    <textarea 
      name="story"
      placeholder='Add comment...'
      ref={textAreaRef}
      value={state.inputText}
      onFocus={() => {
        if(textAreaRef.current) {
            textAreaRef.current.style.height = '6rem'
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
        }
      }}
      onInput={() => {
        if(textAreaRef.current) {
            textAreaRef.current.style.height = '6rem'
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
        }
      }}
      onChange={(e) => {
        dispatch({
        type: 'changed-text',
        inputText: e.target.value,
        username: user?.username
      })
    }
    }
    >
    </textarea>
    </>
  )
}

export default TextInput