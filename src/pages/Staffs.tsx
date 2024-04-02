"use client"
import { Separator } from "../components/shadcn/Separator"
import NewStaff from "../components/NewStaff"
import { useStaff } from "../context/staffContext"
import api, { handleAxiosError } from "../lib/api"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import { toast } from "sonner"
import StaffInterface from "../types/staff.interface"

const Staff = () => {

	const { staff } = useStaff()
	const [staffs, setStaffs] = useState<StaffInterface[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")

	useEffect(() => {
		const fetchStaffs = setTimeout(() => {
			if (staff.shop)
				api.get(`staff/shop/${staff.shop}?name=${search}`)
					.then(({ data }) => {
						if (data.success) {
							console.log(data.staffs)
							setStaffs(data.staffs)
						} else {
							toast.error(data.message)
						}
					})
					.catch(error => {
						handleAxiosError(error)
					}).finally(() => {
						setLoading(false)
					})
		}, 500)

		return () => {
			clearTimeout(fetchStaffs)
		}
	}, [staff.shop, search])

	const addStaff = (staff: StaffInterface) => {
		setStaffs(prev => [...prev, staff])
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center w-full h-full">
				<ScaleLoader />
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-start bg-white rounded-lg drop-shadow-lg w-full h-full">
			<div className="flex flex-col gap-5 items-start h-full w-full p-5">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-5">
						<p className="text-3xl font-bold">Staffs</p>
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Name.."
							type="text"
							className="outline-none border-2 px-3 py-1 rounded-lg"
						/>
					</div>
					<NewStaff shopId={staff.shop} newStaff={addStaff} >
						<Icon icon={"mdi:plus"} className="text-green-500 text-3xl" />
					</NewStaff>
				</div>
				<div className="flex flex-col items-center w-full">
					<div className="flex flex-col items-center w-full">
						<div className="flex text-custom-light-gray items-center w-full">
							<p className="w-full">Name</p>
							<p className="w-full">type</p>
							<p className="w-full">status</p>
						</div>
						<Separator orientation="horizontal" className="w-full bg-custom-light-gray" />
					</div>
					{staffs.map((e, i) => staff._id != e._id && (
						<Link
							to={`/staffs/${e._id}`}
							key={i}
							className="flex flex-col items-center w-full h-10"
						>
							<div className="flex items-center h-full w-full">
								<p className="w-full">{e.username}</p>
								<p className="w-full">{e.manager ? "Manger" : "staff"}</p>
								<p className="w-full">{e.blocked ? "inactive" : "Active"}</p>
							</div>
							<Separator orientation="horizontal" className="w-full bg-custom-light-gray" />
						</Link>
					))}
				</div>

			</div>

		</div>
	)
}

export default Staff

