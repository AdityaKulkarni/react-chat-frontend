import {ChangeEventHandler, useState} from 'react'

const Chat = () => {
	const [message, setMessage] = useState('')

	return (
		<div className='flex flex-col flex-1 max-w-[60%] bg-white max-h-screen'>
			<div className='flex flex-col flex-1 overflow-y-auto p-4'></div>
			<div className='flex flex-row bg-blue-100'>
				<input
					type='text'
					className='border-2 border-gray-300 rounded-lg m-2 p-4 w-full outline-none'
					placeholder='Type your message here...'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					className='bg-blue-700 text-white p-4 rounded-lg m-2 disabled:opacity-50'
					disabled={message.length === 0}>
					Send
				</button>
			</div>
		</div>
	)
}

export default Chat
