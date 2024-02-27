import { ReactNode } from "react"
import cn from "../lib/cn"

interface Props {
	className?: string,
	children?: ReactNode
}


const Container = ({ className, children }: Props) => {
	return (
		<div className={cn("flex items-center justify-center w-screen h-screen bg-custom-offwhite", className)}>
			{children}
		</div>
	)
}

export default Container
