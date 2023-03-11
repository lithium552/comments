import { useReducer, Reducer } from 'react'
import '../styles/index.scss'
import data from '../data/data.json'
import Comments from './Comments'
import Textarea from './Textarea'
import Button from './Button'
import { State, Comment1, Reply, Action } from './types'


function scoreHandler(state: State, action: Action) {
  if(action.parent) {
    const filteredComments = [...state.data.comments].filter(c => c.id !== action.parent.id)
    const filteredReplies = [...action.parent.replies].filter(r => r.id !== action.comment.id)
    const updatedReply = {
      ...action.comment,
      score: action.type === 'increment' ? action.comment.score + 1 : (action.comment.score - 1) < 0 ? 0 : action.comment.score - 1
    }
    const comments = [...filteredComments, {...action.parent, replies: [...filteredReplies, updatedReply].sort((a,b) => a.id - b.id)}].sort((a,b) => a.id - b.id)
    const res = {
      ...state,
      data: {
        ...data,
        comments: comments
      }
    }
    localStorage.setItem('data', JSON.stringify(res))
    return res
  } else {
    const filteredComments = [...state.data.comments].filter(c => c.id !== action.comment.id)
    const updatedComment = { ...action.comment, score: action.type === 'increment' ? action.comment.score + 1 : (action.comment.score - 1) < 0 ? 0 : action.comment.score - 1}
    const comments = [...filteredComments, updatedComment].sort((a,b) => a.id - b.id)
    const res = {
      ...state,
      data: {
        ...data,
        comments: comments
      }
    }
    localStorage.setItem('data', JSON.stringify(res))
    return res
  }
}

const reducer: Reducer<any, any> = (state, action) => {
  switch (action.type) {
    case 'changed-text': {
      return {
        ...state,
        inputText: action.inputText,
        textTarget: action.username
      }
    }
    case 'add-comment': {
      const dataNow = Date.now()
      const newComments = {
        ...state,
        data: {
          ...state.data,
          comments: [...state.data.comments,
          {
            id: state.data.comments.length + 1,
            content: state.inputText,
            createdAt: dataNow,
            score: 0,
            replies: [],
            user: state.data.currentUser
          }
          ]
        }
      }
      localStorage.setItem('data', JSON.stringify(newComments))
      return newComments
    }
    case 'add-reply': {
      const dateNow = Date.now()
      if (state.replyFor.parent) {
        const replies = [...state.replyFor.parent.replies]
        replies.push({
          content: state.inputText,
          createdAt: dateNow,
          id: replies[replies.length - 1].id + 1,
          replyingTo: state.textTarget,
          score: 0,
          user: state.data.currentUser
        })
        const filteredArray = state.data.comments.filter((c: Comment1)  => c.id !== state.replyFor.parent.id)
        const res = {
          ...state,
          data: {
            ...data,
            comments: [...filteredArray, { ...state.replyFor.parent, replies: [...replies] }]
              .sort((a, b) => a.id - b.id)
          },
          replyFor: {
            user: null,
            id: null,
            isOpen: false,
            parent: null
          }
        }
        console.log(res)
        localStorage.setItem('data', JSON.stringify(res))
        return res
      } else {
        const comments = [...state.data.comments].map((c) => {
          if (c.id === state.replyFor.id) {
            return {
              ...c,
              replies: [...c.replies,{
                content: state.inputText,
                createdAt: dateNow,
                id: c.replies.length ? c.replies[c.replies.length - 1].id + 1 : c.id + 1,
                replyingTo: state.textTarget,
                score: 0,
                user: state.data.currentUser
              }]
            }
          } else return c
        })
        const res = {
          ...state,
          data: {
            ...data,
            comments: [...comments]
          },
          replyFor: {
            user: null,
            id: null,
            isOpen: false,
            parent: null
          }
        }
        localStorage.setItem('data', JSON.stringify(res))
        return res
      }
    }
    case 'textarea-show': {
      return {
        ...state,
        replyFor: {
          username: action.username,
          id: action.id,
          isOpen: true,
          parent: action.parent
        }
      }
    }

    case 'update': {
      console.log(action.comment)
      return {
        ...state,
        inputText: action.content,
        edit: {
          id: action.id,
          content: action.content,
          comment: action.comment,
          parent: action.parent
        },
        replyFor: {
          isOpen: true
        }
      }
    }

    case 'update-comment': {
      console.log(state.edit, state.edit.parent)
      if(state.edit.parent) {
        if (!state.edit.comment) return { ...state}
        const filteredComments = [...state.data.comments].filter(c => c.id !== state.edit.parent.id)
        const filteredReplies = [...state.edit.parent.replies].filter(r => r.id !== state.edit.comment.id)
        const updatedReply = {
          ...state.edit.comment,
          content: state.inputText
        }
        const comments = [...filteredComments, {...state.edit.parent, replies: [...filteredReplies, updatedReply].sort((a,b) => a.id - b.id)}].sort((a,b) => a.id - b.id)
        const res = {
          ...state,
          data: {
            ...data,
            comments: comments
          },
          replyFor: {
            user: null,
            id: null,
            isOpen: false,
            parent: null
          },
          edit: {
            isEdit: false,
            comment: null,
            parent: null
          },
          inputText: ''          
        }
        localStorage.setItem('data', JSON.stringify(res))
        return res
      } else {
        console.log(state.edit, state.edit.parent)
        if (!state.edit.comment) return { ...state}
        const filteredComments = [...state.data.comments].filter(c => c.id !== state.edit.comment.id)
        const updatedComment = { ...state.edit.comment, content: state.inputText}
        const comments = [...filteredComments, updatedComment].sort((a,b) => a.id - b.id)
        const res = {
          ...state,
          data: {
            ...data,
            comments: comments
          },
          replyFor: {
            user: null,
            id: null,
            isOpen: false,
            parent: null
          },
          edit: {
            isEdit: false,
            comment: null,
            parent: null
          },
          inputText: ''
        }
        localStorage.setItem('data', JSON.stringify(res))
        return res
      }
    }

    case 'increment': {
      return scoreHandler(state, action)
    }
    case 'decrement': {
      return scoreHandler(state, action)
    }
    case 'delete': {
      if(action.isDelete) {
      return {
        ...state,
        delete: {
          isDelete: true,
          parent: action.parent,
          comment: action.comment
        }
      }
    } else {
      return {
        ...state,
        delete: {
          isDelete: false,
          parent: null,
          comment: null
        }
      }
    }
    }

    case 'delete-comment': {
      if(state.delete.parent) {
        const filteredComments = [...state.data.comments].filter(c => c.id !== state.delete.parent.id)
        const filteredReplies = [...state.delete.parent.replies].filter(r => r.id !== state.delete.comment.id)

        const comments = [...filteredComments, {...state.delete.parent, replies: [...filteredReplies].sort((a,b) => a.id - b.id)}].sort((a,b) => a.id - b.id)
        const res = {
          ...state,
          data: {
            ...data,
            comments: comments
          },
          delete: {
            isDelete: false,
            parent: null,
            comment: null
          },          
        }
        localStorage.setItem('data', JSON.stringify(res))
        return res
      } else {
        const filteredComments = [...state.data.comments].filter(c => c.id !== state.delete.comment.id)
        const comments = [...filteredComments].sort((a,b) => a.id - b.id)
        const res = {
          ...state,
          data: {
            ...data,
            comments: comments
          },
          delete: {
            isDelete: false,
            parent: null,
            comment: null
          },
        }
        localStorage.setItem('data', JSON.stringify(res))
        return res
      }
    }
    default: {
      return {
        ...state,
        inputText: ''
      }
    }
  }
}

function App() {
  console.log('MOUNTED')
  const [state, dispatch] = useReducer(reducer,
    {
      textTarget: '',
      inputText: '',
      data: JSON.parse(localStorage.getItem('data')!)?.data || { ...data },
      replyFor: {
        user: null,
        id: null,
        isOpen: false,
        parent: null
      },
      edit: {
        isEdit: false,
        comment: null,
        parent: null,
        id: null,
        content: ''
      },
      delete: {
        isDelete: false,
        parent: null,
        comment:null
      }
    })


  console.log(state, 'state')

  return (
    <>
    <div className='container'>
      {state.data.comments.map((comment: Comment1) => (
        <>
          <Comments state={state} dispatch={dispatch} currentUser={state.data.currentUser.username} comment={comment} />
          {comment.replies?.length !== 0 && (
            <div className='comments-container'>
              <div className='line'></div>
              <div className='replies'>
                {comment.replies?.length !== 0 && (
                  comment.replies.map((repl : Reply) => (
                    <Comments key={repl.id} state={state} dispatch={dispatch} currentUser={state.data.currentUser.username} parent={comment} comment={repl} />
                  ))
                )}
              </div>
            </div>)}
        </>
      ))}
      {!state.replyFor.isOpen && <Textarea dispatch={dispatch} state={state} />}
    </div>
    {state.delete.isDelete && (<div className='container-modal'>
        <div className='modal'>
          <h2>Delete comment</h2>
          <p>Are you sure want to delete this comment? This will remove the commont and can't be undone</p>
          <div>
              <Button dispatch={dispatch} buttonText={'no, cancel'} />
              <Button dispatch={dispatch}  buttonText={'yes, delete'}/>
          </div>
        </div>
      </div>)}
      </>
  )
}

export default App
