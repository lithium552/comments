import React from 'react'

interface ButtonProps {
  dispatch: React.Dispatch<any>
  type?: string
  buttonText: string
  onHandleReplyAdd?: () => void
  onHandleUpdateComment?: () => void
}


const Button = ({ dispatch, type, buttonText }: ButtonProps) => {
  const onHandleCommentAdd = () => {
    dispatch({
      type: 'add-comment',
    })
  }

  const onHandleReplyAdd = () => {
    dispatch({
      type: 'add-reply',
    })
  }

  const onHandleCancelDelete = () => {
    dispatch({
      type: 'delete',
      isDelete: false
    })
  }

  const onHandleDeleteComment = () => {
    dispatch({
      type: 'delete-comment',
    })
  } 

  const onHandleUpdateComment = () => {
    dispatch({
      type: 'update-comment',
    })
  }


  return (
    <button onClick={() => {
      if (buttonText === 'Send') onHandleCommentAdd()
      else if (buttonText === 'Reply') onHandleReplyAdd()
      else if(buttonText === 'Update') onHandleUpdateComment()
      else if(buttonText === 'no, cancel') onHandleCancelDelete() 
      else if(buttonText === 'yes, delete') onHandleDeleteComment() 
      dispatch({
        type: type,
        inputText: ''
      })
    }}
    className='text-area-btn'
    
    >{buttonText}</button>
  )
}

export default Button