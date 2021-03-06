import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

import illustration from '../assets/images/illustration.svg'
import logo from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google-icon.svg'

import '../styles/auth.scss'

import { Button } from '../components/Button'

export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()

    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === '') 
            return
        
        const roomReference = await database.ref(`rooms/${roomCode}`).get()

        if (!roomReference.exists() || roomReference.val().endedAt) {
            alert('Room does not exists.')
            return
        }

        history.push(`rooms/${roomCode}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={ illustration } alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={ logo } alt="Letmeask" />
                    <button onClick={ handleCreateRoom } className="create-room">
                        <img src={ googleIcon } alt="Logo do Google"/>
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={ handleJoinRoom }>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={ event => setRoomCode(event.target.value) }
                            value={ roomCode }
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}