import { useRef } from 'react'
import Button from './Button'
import TextInput from './TextInput'
import { State, User } from './types'


interface TextareaProps{
    state: State
    dispatch: React.Dispatch<any>
    user?: User
}

const Textarea = ({state, dispatch, user}: TextareaProps) => {
    
    // const onHandleReplyAdd = () => {
    //   dispatch({
    //     type: 'add-reply',
    //   })
    // }
  return (
    <div className='textarea-container'>
    <TextInput dispatch={dispatch} user={user} state={state}/>
    <Button type={'changed-text'}  buttonText={state.replyFor.isOpen ? 'Reply' : 'Send'} dispatch={dispatch} />
    </div>
  )
}

export default Textarea