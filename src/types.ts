type User = {
    image: {
        png: string
        webp: string
    }
    username: string
}

type Reply = {
    content: string
    createdAt: number
    id: number
    replyingTo: string
    score: number
    user: User
}

type Comment1 = {
    content: string
    createdAt: number
    id: number
    replies: Reply[]
    user: User
    score: number
    replyingTo?: string
}

type Action = {
    type: string
    parent: Comment1
    comment: Comment1 | Reply 
    content: string
    inputText?: string
    username?: string
    id?: number
    isDelete?: boolean
    textTarget?: string
}

interface State {
    inputText: string
    textTarget: string
    data: {
        comments: Comment1[]
        currentUser: User
    }
    delete: {
        comment: Comment1 | Reply
        isDelete: boolean
        parent: Comment1
    }
    edit: {
        comment: Comment1 | Reply
        content: string
        id: number
        isEdit: boolean
        parent: Comment1
    }
    replyFor: {
        id: number
        isOpen: boolean
        parent: Comment1
        username: string
    }
}

export {
    type User, type Reply, type Comment1, type State, type Action
}