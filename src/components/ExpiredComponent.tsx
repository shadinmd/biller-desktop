import { FC } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/shadcn/Dialog"

interface Props {
	open: boolean,
}

const ExpiredComponent: FC<Props> = ({ open }) => {


	const logout = () => {
		localStorage.removeItem("token")
		location.assign("/staff/login")
	}

	return (
		<Dialog open={open}>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle className="text-red-500">
						You don&apos;t have an active plan
					</DialogTitle>
					<DialogDescription>
						you don&apos;t have an active plan please purchase a plan to continue using our service
					</DialogDescription>
				</DialogHeader>
				<button onClick={e => { e.preventDefault(); logout() }} className="bg-red-500 text-white font-bold rounded-lg px-6 py-2">
					Logout
				</button>
			</DialogContent>
		</Dialog>
	)
}

export default ExpiredComponent

