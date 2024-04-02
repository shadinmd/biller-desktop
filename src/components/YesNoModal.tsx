import { MouseEvent, ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./shadcn/Dialog"

interface Props {
	onYes: () => void
	onNo: () => void
	title: string
	description: string
	children?: ReactNode
}

const YesNoModal = ({ children, onNo, onYes, title, description }: Props) => {

	const [open, setOpen] = useState(false)

	const handleYes = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		onYes()
		setOpen(false)
	}

	const handleNo = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		onNo()
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="outline-none">
				{children}
			</DialogTrigger>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle>
						{title}
					</DialogTitle>
					<DialogDescription>
						{description}
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-5 items-center">
					<button onClick={handleYes} className="bg-green-500 text-white px-6 py-2 font-bold rounded-lg">
						Yes
					</button>
					<button onClick={handleNo} className="bg-red-500 text-white px-6 py-2 font-bold rounded-lg">
						No
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default YesNoModal
