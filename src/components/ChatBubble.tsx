import {Message, Role} from '../redux/chat_slice'

interface ChatBubbleProps {
	message: Message
}

const ChatBubble = ({message}: ChatBubbleProps) => {
	return (
		<div
			className={`flex bg-blue-700 text-white max-w-[70%] p-4 m-2 rounded-b-lg font-semibold h-fit ${
				message.role === Role.ASSISTANT
					? ' rounded-tr-lg self-start'
					: ' rounded-tl-lg self-end'
			}`}>
			{' '}
			{message.content}
		</div>
	)
}

export default ChatBubble
