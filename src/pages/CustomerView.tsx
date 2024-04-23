import api, { handleAxiosError } from "../lib/api"
import moment from "moment"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import BillInterface from "../types/bill.interface"
import CustomerInterface from "../types/customer.interface"
import { Separator } from "../components/shadcn/Separator"
import { Link, useParams } from "react-router-dom"

const CustomerView = () => {

	const params = useParams()
	const [customer, setCustomer] = useState<CustomerInterface>()
	const [bills, setBills] = useState<BillInterface[]>([])

	useEffect(() => {
		api.get(`/customer/${params.id}`)
			.then(({ data }) => {
				if (data.success) {
					setBills(data.bills)
					setCustomer(data.customer)
				} else {
					toast.error(data.message)
				}
			})
			.catch(err => handleAxiosError(err))
	}, [params.id])

	return (
		<div className="flex flex-col gap-5 items-start h-full w-full bg-white drop-shadow-lg rounded-lg p-5">
			<p className="font-bold text-3xl">Customer</p>
			<div className="flex flex-col">
				<div className="flex font-semibold items-center gap-2">
					<p>Name:</p>
					<p>{customer?.name}</p>
				</div>
				<div className="flex font-semibold items-center gap-2">
					<p>Phone:</p>
					<p>{customer?.phone}</p>
				</div>
				<div className="flex font-semibold items-center gap-2">
					<p>Points:</p>
					<p>{customer?.point}</p>
				</div>
				<div className="flex font-semibold items-center gap-2">
					<p>Created on:</p>
					<p>{moment(customer?.createdAt).format("DD/MM/YYYY")}</p>
				</div>
			</div>
			<div className="flex flex-col w-full">
				<p className="font-bold text-2xl">Bills</p>
			</div>
			<div className="flex flex-col gap-2 w-full">
				<Separator orientation="horizontal" className="w-full bg-gray-500" />
				{bills.map((e, i) => (
					<Link
						key={i}
						to={`/bills/${e._id}`}
						className="flex flex-col items-center w-full"
					>
						<div className="flex pb-2 items-center w-full">
							<p className="w-full">{moment(e.createdAt).format("DD/MM/YYYY")}</p>
							<div className="flex w-full items-center gap-2">
								<p>Total:</p>
								<p>{e.total}</p>
							</div>
							<div className="flex w-full items-center gap-2">
								<p>Discount:</p>
								<p>{e.discount}</p>
							</div>
						</div>
						<Separator orientation="horizontal" className="w-full bg-gray-500" />
					</Link>
				))}
			</div>
		</div>
	)
}

export default CustomerView
