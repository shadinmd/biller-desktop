import { ReactNode } from "react"
import cn from "../lib/cn"

interface Props {
	className?: string,
	children?: ReactNode
}


const Container = ({ className, children }: Props) => {
	return (
		<div className={cn("flex items-center bg-white rounded-lg drop-shadow-lg text-black justify-center w-full h-full", className)}>
			{children}
		</div>
	)
}

export default Container
