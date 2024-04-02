import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Sidebar from "./components/Sidebar"
import Products from "./pages/Products"
import Settings from "./pages/Settings"
import Staffs from "./pages/Staffs"
import { useStaff } from "./context/staffContext"
import { useEffect, useState } from "react"
import Bills from "./pages/Bills"
import StaffView from "./pages/StaffView"
import ProductView from "./pages/ProductView"
import BillView from "./pages/BillView"

const App = () => {

	const path = useLocation().pathname
	const { staff } = useStaff()
	const [items, setItems] = useState<{ title: string, to: string, icon: string }[]>([])

	useEffect(() => {
		if (staff.manager) {
			setItems([
				{ title: "Dashboard", to: "/", icon: "mdi:home" },
				{ title: "Products", to: "/products", icon: "mdi:books" },
				{ title: "Staffs", to: "/staffs", icon: "mdi:people-group" },
				{ title: "Bills", to: "/bills", icon: "mdi:people-group" },
				{ title: "Settings", to: "/settings", icon: "mdi:gear" }
			])
		} else {
			setItems([
				{ title: "Dashboard", to: "/", icon: "mdi:home" },
				{ title: "Products", to: "/products", icon: "mdi:books" },
				{ title: "Settings", to: "/settings", icon: "mdi:gear" }
			])
		}
	}, [staff.manager])

	return (
		<div className="flex gap-5 p-5 items-center bg-custom-offwhite h-screen w-screen">
			{path != "/login" && <Sidebar items={items} />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/products" element={<Products />} />
				<Route path="/products/:id" element={<ProductView />} />
				<Route path="/staffs" element={<Staffs />} />
				<Route path="/staffs/:id" element={<StaffView />} />
				<Route path="/bills" element={<Bills />} />
				<Route path="/bills/:id" element={<BillView />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>
		</div>
	)
}

export default App
