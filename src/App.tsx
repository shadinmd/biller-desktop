import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Sidebar from "./components/Sidebar"
import Products from "./pages/Products"
import Settings from "./pages/Settings"
import Staffs from "./pages/Staffs"
import Bills from "./pages/Bills"
import StaffView from "./pages/StaffView"
import ProductView from "./pages/ProductView"
import BillView from "./pages/BillView"
import Customers from "./pages/Customers"
import { useEffect } from "react"
import CustomerView from "./pages/CustomerView"

const App = () => {

	const path = useLocation().pathname

	useEffect(() => {
		if (path != "/login")
			if (!localStorage.getItem("token"))
				location.assign("/login")
	}, [])

	return (
		<div className="flex gap-5 p-5 items-center bg-custom-offwhite h-screen w-screen">
			{path != "/login" && <Sidebar />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/products" element={<Products />} />
				<Route path="/products/:id" element={<ProductView />} />
				<Route path="/staffs" element={<Staffs />} />
				<Route path="/staffs/:id" element={<StaffView />} />
				<Route path="/bills" element={<Bills />} />
				<Route path="/bills/:id" element={<BillView />} />
				<Route path="/customers" element={<Customers />} />
				<Route path="/customers/:id" element={<CustomerView />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>
		</div>
	)
}

export default App
