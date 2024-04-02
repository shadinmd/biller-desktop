import { Link } from "react-router-dom"
import { Icon } from "@iconify/react"

interface Props {
	title: string,
	to: string,
	icon: string
}

const SidebarItem = ({ title, to, icon }: Props) => {
	const active = true

	return (
		<Link to={to} className={`${active ? `bg-white rounded-lg drop-shadow-lg ` : ``} px-4 py-3 w-full flex gap-5 pr-16 items-center`}>
			<div className={active ? `p-2 bg-primary rounded-lg` : `p-2 bg-white rounded-lg drop-shadow-lg`}>
				<Icon icon={icon} className={`${active ? `text-white` : `text-primary`} text-2xl`} />
			</div>
			<p className={active ? `font-bold` : `text-custom-light-gray`}>
				{title}
			</p>
		</Link>
	)
}

export default SidebarItem
