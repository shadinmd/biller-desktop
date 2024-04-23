import { useStaff } from '../context/staffContext'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SidebarItem from "./SidebarItem"

const StaffSidebar = () => {

	const { staff } = useStaff()

	const [links, setLinks] = useState<{ title: string, to: string, icon: string }[]>([])

	useEffect(() => {
		if (staff.manager) {
			setLinks([
				{ title: "Dashboard", to: "/", icon: "mdi:home" },
				{ title: "Staffs", to: "/staffs", icon: "mdi:people-group" },
				{ title: "Customers", to: "/customers", icon: "mdi:people-group" },
				{ title: "Products", to: "/products", icon: "bi:boxes" },
				{ title: "Bills", to: "/bills", icon: "mdi:books" },
				{ title: "Settings", to: "/settings", icon: "mdi:gear" }
			])
		} else {
			setLinks([
				{ title: "Dashboard", to: "/", icon: "mdi:home" },
				{ title: "Customers", to: "/customers", icon: "mdi:people-group" },
				{ title: "Products", to: "/products", icon: "bi:boxes" },
				{ title: "Bills", to: "/bills", icon: "mdi:books" },
				{ title: "Settings", to: "/settings", icon: "mdi:gear" }
			])
		}
	}, [staff.manager])

	return (
		<Sidebar items={links} />
	)
}


interface Props {
	items: { title: string, to: string, icon: string }[]
}

const Sidebar = ({ items }: Props) => {
	return (
		<div className="flex flex-col gap-10 items-center justify-start h-full bg-custom-offwhite p-5">
			<Link to={"/"} className="-tracking-widest text-primary font-extrabold text-4xl w-full">Biller</Link>
			<div className="flex flex-col gap-2 items-center">
				{
					items.map((e, i) => (
						<SidebarItem key={i} title={e.title} to={e.to} icon={e.icon} />
					))
				}
			</div>
		</div>
	)
}

export default StaffSidebar

