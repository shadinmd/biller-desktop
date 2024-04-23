import { useEffect, useState } from "react"
import StaffInterface from "../types/staff.interface"
import api, { handleAxiosError } from "../lib/api"
import { toast } from "sonner"
import NewStaff from "../components/NewStaff"
import { Icon } from "@iconify/react"
import { ScaleLoader } from "react-spinners"
import cn from "../lib/cn"
import { useStaff } from "../context/staffContext"
import Select from "../components/Select"
import { Link } from "react-router-dom"

const Staffs = () => {

	const [staffs, setStaffs] = useState<StaffInterface[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [filter, setFilter] = useState("filter")
	const { staff } = useStaff()

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (staff.shop)
				api.get(`/staff/shop/${staff.shop._id}?name=${search}&filter=${filter}`)
					.then(({ data }) => {
						if (data.success) {
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
			clearTimeout(timeout)
		}
	}, [staff.shop, search, filter])

	const newStaff = (staff: StaffInterface) => {
		setStaffs(val => [...val, staff])
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center bg-white rounded-lg drop-shadow-lg w-full h-full">
				<ScaleLoader />
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-1 py-3 px-5 w-full h-full'>
			<div className="flex items-center w-full justify-between">
				<div className="flex gap-1 items-center h-full">
					<p className='flex items-center justify-center text-xl font-bold bg-white drop-shadow-lg rounded-lg px-2 h-full'>Staffs</p>
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search.."
						type="text"
						className="drop-shadow-lg outline-none rounded-lg py-2 px-3"
					/>
					<Select selected={filter} items={["filter", "manager", "staff"]} onSelect={setFilter} />
				</div>
				<NewStaff className="bg-white rounded-lg drop-shadow-lg" shopId={staff.shop._id || ""} newStaff={newStaff} api={api} >
					<Icon icon="mdi:plus" className="text-green-500 text-3xl" />
				</NewStaff>
			</div>
			<div className="flex flex-col gap-1 w-full h-full">
				{staffs.map((e, i) => (
					e._id != staff._id &&
					<Link
						to={`/staffs/${e?._id}`}
						key={i}
						className="flex items-center bg-white rounded-lg drop-shadow-lg w-full p-2 font-semibold"
					>
						<p className="w-full">{e?.username}</p>
						<p className={cn("w-full", e.manager ? "text-red-500" : "text-green-500")}>{e?.manager ? "manager" : "staff"}</p>
					</Link>
				))}
			</div>
		</div>

	)
}

export default Staffs


