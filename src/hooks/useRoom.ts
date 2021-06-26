import { useEffect, useState } from 'react'

import { database } from '../services/firebase'
import { useAuth } from './useAuth'

type FirebaseQuestion = Record<string, {
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likes: Record<string, {
        authorId: string
    }>
}>

type QuestionType = {
    id: string,
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likeCount: number
    likeId: string | undefined
}

export function useRoom(roomId: string) {
    const { user } = useAuth();

    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomReference = database.ref(`rooms/${roomId}`)

        roomReference.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestion = databaseRoom.questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomReference.off('value');
        }
    }, [roomId, user?.id])

    return { title, questions }
}