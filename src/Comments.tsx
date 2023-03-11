import React, { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import TextInput from './TextInput';
import Button from './Button';
import Textarea from './Textarea';
import { State, Comment1, Reply } from './types'

interface Comments {
  comment: Comment1 | Reply
  currentUser: string
  dispatch: React.Dispatch<any>
  state: State
  parent?: Comment1
}





const Comments = ({comment, currentUser, dispatch, state, parent }: Comments ) => {
  const [bodyWidth, setBodyWidth] = useState(-1)

  function isCurrentUser() {
    return currentUser === comment.user.username
  }

  function iconsShow() {
    return (isCurrentUser() ? (
      <div className='icons-container icons'>
        <div onClick={() => handleClickDelete()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368" /></svg>
          <span className='red'>Delete</span>
        </div>
        <div onClick={() => handleClickEdit()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6" /></svg>
          <span>Edit</span>
        </div>
      </div>)
      : (
        <div className='icons' onClick={() => handleClick()}>
          <div>
          <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6" /></svg>
          <span>Reply</span>
          </div>
        </div>))
  }


  function handleClick() {
    dispatch({
      type: 'textarea-show',
      username : comment.user.username,
      id: comment.id,
      parent: !!parent ? parent : null 
    }) 
  }
  function handleClickEdit() {
    dispatch({
      type: 'update',
      content: comment.content,
      id: comment.id,
      comment: comment,
      parent: !!parent ? parent : null 
    })
  }

  function handleClickDelete() {
    dispatch({
      type: 'delete',
      isDelete: true,
      parent: !!parent ? parent : null,
      comment: comment
    })
  }

  function HandleCommentScore(type: string) {
    dispatch({
      type: type,
      parent: !!parent ? parent : null,
      comment: comment
    })
  }
useEffect(() => {
  const width = document.body.offsetWidth
  setBodyWidth(width)
window.addEventListener('resize', () => {
  setBodyWidth(window.innerWidth)
  })
}, [])

console.log(bodyWidth)
  return (
    <>
    <div className='section-container'>
    {bodyWidth > 675 && (<div className='score'>
        <div>
          <button onClick={() => HandleCommentScore('increment')}>+</button>
          <span>{comment.score}</span>
          <button onClick={() => HandleCommentScore('decrement')}>-</button>
        </div>
      </div>)}
      <div className='comment-section'>
        <div className='user-info'>
          <div>
            <img src={comment.user.image.png}></img>
            <p>{comment.user.username}</p>
            {isCurrentUser() && (<span className='you'>you</span>)}
            <span>{formatDistanceToNow(new Date(comment.createdAt)) || comment.createdAt}</span>
          </div>
          {bodyWidth > 675 && iconsShow()}
        </div>
        {state.edit.content === comment.content && state.edit.id === comment.id ? (
        <div className='update-container'>
        <div className='textarea-container'>
          <TextInput user={comment.user} state={state} dispatch={dispatch}/>
        </div>
          <Button buttonText='Update' dispatch={dispatch} type={'update-comment'} />
        </div>) :
        (<div>
          <p className='text-content'>
            {comment?.replyingTo && (
              <span className='replying-to'>@{comment.replyingTo} </span>
            )}
            {comment.content}
          </p>
        </div>)}
      </div>
      {bodyWidth < 675 && 
      (<div className='icons-container'>
      <div className='score'>
        <div>
          <button onClick={() => HandleCommentScore('increment')}>+</button>
          <span>{comment.score}</span>
          <button onClick={() => HandleCommentScore('decrement')}>-</button>
        </div>
      </div>
      <>
      {iconsShow()}
      </>
      </div>
      )}
    </div>
    {state.replyFor.username === comment.user.username && state.replyFor.id === comment.id && (<Textarea user={comment.user} state={state} dispatch={dispatch} />)}
    </>
  )
}

export default Comments