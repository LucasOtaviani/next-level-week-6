import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import logo from '../assets/images/logo.svg'
import deleteIcon from '../assets/images/delete.svg'
import checkIcon from '../assets/images/check.svg'
import answerIcon from '../assets/images/answer.svg'

import '../styles/room.scss'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

type RoomParams = {
    id: string
}

export function AdminRoom() {
    const history = useHistory()

    const params = useParams<RoomParams>()
    const roomId = params.id

    // const { user } = useAuth()
    const { title, questions } = useRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja excluir essa pergunta?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={ logo } alt="Letmeask" />
                    <div>
                        <RoomCode code={ roomId } />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            
            <main className="content">
                <div className="room-title">
                    <h1>Sala { title }</h1>
                    { questions.length > 0 && <span>{ questions.length } {  questions.length === 1 ? 'Pergunta' : 'Perguntas' }</span> }
                </div>

                <div className="question-list">
                    { 
                        questions.map(question => {
                            return (
                                <Question
                                    key={ question.id }
                                    content={ question.content }
                                    author={ question.author }
                                    isAnswered={ question.isAnswered }
                                    isHighlighted={ question.isHighlighted }
                                >
                                   { 
                                        !question.isAnswered && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                                >
                                                    <img src={ checkIcon } alt="Marcar pergunta como respondida" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleHighlightQuestion(question.id)}
                                                >
                                                    <img src={ answerIcon } alt="Dar destaque à pergunta" />
                                                </button>
                                            </>
                                        )
                                    }

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        <img src={ deleteIcon } alt="Remover pergunta" />
                                    </button>
                                </Question>
                            )
                        }) 
                    }
                </div>
            </main>
        </div>
    )
}