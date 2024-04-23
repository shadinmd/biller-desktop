import api, { handleAxiosError } from "../lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import CustomerInterface from "../types/customer.interface"
import { Icon } from "@iconify/react/dist/iconify.js"
import NewCustomer from "./NewCustomer"
import { Separator } from "./shadcn/Separator"

interface Props {
	shopId: string,
	setCustomer: (customer: CustomerInterface | undefined) => void,
	customer: CustomerInterface | undefined
}

const SearchCustomers = ({ shopId, setCustomer, customer }: Props) => {

	const [customers, setCustomers] = useState<CustomerInterface[]>([])
	const [search, setSearch] = useState("")

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (shopId)
				api.get(`/customer/shop/${shopId}?name=${search}`)
					.then(({ data }) => {
						if (data.success) {
							setCustomers(data.customers)
						} else {
							toast.error(data.message)
						}
					})
					.catch(error => {
						handleAxiosError(error)
					})
		}, 500)
		return () => {
			clearTimeout(timeout)
		}
	}, [shopId, search])

	const newCustomer = (customer: CustomerInterface) => {
		setCustomers(val => [...val, customer])
	}

	const onSelect = (id: string) => {
		const customer = customers.find(e => e._id == id)
		setCustomer(customer)
	}

	if (customer) {
		return (
			<div className="flex flex-col gap-2 items-center h-full w-96 bg-white rounded-lg drop-shadow-lg p-5">
				<div className="flex items-center justify-between w-full">
					<p className="font-bold text-xl">{customer.name}</p>
					<button onClick={e => { e.preventDefault(); setCustomer(undefined) }} className="text-primary">
						{"<-"}
					</button>
				</div>
				<Separator orientation="horizontal" className="bg-custom-gray" />
				<div className="flex flex-col items-center h-full w-full">
					<div className="flex flex-col items-center w-full">
						<div className="flex items-center justify-between py-2 w-full">
							<p>phone:</p>
							<p>{customer.phone}</p>
						</div>
						<Separator orientation="horizontal" className="bg-custom-gray" />
					</div>
					<div className="flex flex-col items-center w-full">
						<div className="flex items-center justify-between py-2 w-full">
							<p>points:</p>
							<p>{customer.point}</p>
						</div>
						<Separator orientation="horizontal" className="bg-custom-gray" />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2 items-center h-full w-96 bg-white rounded-lg drop-shadow-lg p-5">
			<div className="flex flex-col gap-2 items-start">
				<div className="flex items-center justify-between w-full">
					<p className="font-bold text-xl">customers</p>
					<NewCustomer setCustomers={newCustomer} api={api} shopId={shopId}>
						<Icon icon={"mdi:plus"} className="text-green-500 text-3xl" />
					</NewCustomer>
				</div>
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Name or phone"
					type="text"
					className="outline-none border-2 rounded-lg px-3 py-1"
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							setCustomer(customers[0])
						}
					}}
				/>
			</div>
			<div className="flex flex-col h-full w-full">
				<div className="flex flex-col w-full text-custom-gray items-center">
					<div className="flex items-center w-full">
						<p className="w-full">
							Name
						</p>
						<p className="w-full">
							Phone
						</p>
					</div>
					<Separator orientation="horizontal" className="bg-custom-gray" />
				</div>
				{customers.map((e, i) => (
					<div
						key={i}
						className="flex flex-col w-full"
					>
						<div onClick={ev => { ev.preventDefault(); onSelect(e._id) }} className="flex items-center w-full py-2 cursor-pointer">
							<p className="w-full">{e.name}</p>
							<p className="w-full">{e.phone}</p>
						</div>
						<Separator orientation="horizontal" className="bg-custom-gray" />
					</div>
				))}
			</div>
		</div >

	)
}

export default SearchCustomers
