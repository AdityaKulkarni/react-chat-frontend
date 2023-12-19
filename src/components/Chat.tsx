import {ChangeEventHandler, useEffect, useRef, useState} from 'react'
import ChatBubble from './ChatBubble'

export enum Role {
	SYSTEM = 'system',
	USER = 'user',
	ASSISTANT = 'assistant',
}

export type Message = {
	id: number
	content: string
	role: Role
	timestamp: string
}

const Chat = () => {
	const [message, setMessage] = useState('')

	const [aiLoading, setAiLoading] = useState<boolean>(false)
	const [firstMessageSent, setFirstMessageSent] = useState(false)
	const [messageList, setMessageList] = useState<Message[]>([])

	const messageListRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!messageList || messageList.length === 0) {
			if (messageList.length === 0) {
				sendMessage([
					{
						id: 0,
						content:
							'You are my pen pal! Your name is Jax Pen. When starting a conversation, write a small message not exceeding 100 characters. Use emojis whenever appropriate to express your emotions.',
						role: Role.SYSTEM,
						timestamp: Date.now().toString(),
					},
				])
			}
		}

		return () => {
			if (!firstMessageSent) {
				setFirstMessageSent(true)
			}
		}
	}, [messageList])

	async function sendMessage(messages: Message[]) {
		setAiLoading(true)
		const response = await fetch('http://localhost:3100/stream', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({messages}),
		})
		if (!response.ok || !response.body) {
			console.log('error')
			return
		}

		const reader = response.body.getReader()
		const decoder = new TextDecoder()

		const timestamp = Date.now().toString()

		let messageText = ''

		while (true) {
			const {done, value} = await reader.read()
			if (done) {
				break
			}

			const token = decoder.decode(value)

			messageText += token

			setMessageList((messages) => {
				const lastMessage = messages[messages.length - 1]!
				if (!lastMessage) {
					return [
						{
							id: 0,
							role: Role.ASSISTANT,
							content: token,
							timestamp,
						},
					]
				}

				if (lastMessage.role !== Role.ASSISTANT) {
					return [
						...messages,
						{
							id: 0,
							role: Role.ASSISTANT,
							content: token,
							timestamp,
						},
					]
				}

				const content = lastMessage.content + token
				return [
					...messages.slice(0, messages.length - 1),
					{id: 0, role: Role.ASSISTANT, content, timestamp},
				]
			})
		}

		const newMessage: Message = {
			id: 0,
			role: Role.ASSISTANT,
			content: messageText,
			timestamp: Date.now().toString(),
		}

		setAiLoading(false)
	}

	useEffect(() => {
		setTimeout(() => {
			messageListRef.current?.lastElementChild?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			})
		}, 200)
	}, [messageList])

	const handleSend = () => {
		const newMessage: Message = {
			id: 0,
			role: Role.USER,
			content: message,
			timestamp: Date.now().toString(),
		}
		const updatedMessages = [...messageList, newMessage]
		setMessageList(updatedMessages)
		setMessage('')
		sendMessage(updatedMessages)
	}

	return (
		<div className='flex flex-col flex-1 max-w-[60%] bg-white max-h-screen'>
			<div
				className='flex flex-col flex-1 overflow-y-auto p-4'
				ref={messageListRef}>
				{messageList.map(
					(message) =>
						message && (
							<ChatBubble
								key={message.timestamp}
								message={message}
							/>
						)
				)}
			</div>
			<div className='flex flex-row bg-blue-100'>
				<input
					type='text'
					className='border-2 border-gray-300 rounded-lg m-2 p-4 w-full outline-none'
					placeholder={
						aiLoading
							? 'Your pen pal is writing...'
							: 'Type your message here...'
					}
					value={message}
					disabled={aiLoading}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					className='bg-blue-700 text-white p-4 rounded-lg m-2 disabled:opacity-50'
					disabled={aiLoading || message.length === 0}
					onClick={handleSend}>
					Send
				</button>
			</div>
		</div>
	)
}

export default Chat
