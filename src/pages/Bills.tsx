"use client"
import { useEffect, useState } from 'react'
import BillInterface from '../types/bill.interface'
import { useStaff } from '../context/staffContext'
import { toast } from 'sonner'
import api, { handleAxiosError } from '../lib/api'
import { Separator } from '../components/shadcn/Separator'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Bills = () => {

	const { staff } = useStaff()
	const [bills, setBills] = useState<BillInterface[]>([])

	useEffect(() => {
		if (staff._id)
			api.get(`/bill/shop/${staff.shop}`)
				.then(({ data }) => {
					if (data.success) {
						setBills(data.bills)
					} else {
						toast.error(data.message)
					}
				})
				.catch(error => {
					handleAxiosError(error)
				})
	}, [staff])

	// const deleteBill = async (billId: string) => {
	// 	try {
	// 		const { data } = await api.delete(`/bill/${billId}`)
	// 		if (data.success) {
	// 			setBills((prev) => [...prev].filter((e) => e._id != billId))
	// 			toast.success(data.message)
	// 		} else {
	// 			toast.error(data.message)
	// 		}
	// 	} catch (error) {
	// 		handleAxiosError(error)
	// 	}
	// }

	return (
		<div className='flex flex-col gap-5 p-5 bg-white rounded-lg drop-shadow-lg w-full h-full'>
			<div className='text-3xl font-bold'>Bills</div>
			<div className='flex flex-col w-full'>

				<div className='flex flex-col w-full'>
					<div className='flex w-full text-custom-light-gray'>
						<p className='w-full'>no</p>
						<p className='w-full'>date</p>
						<p className='w-full'>no of items</p>
						<p className='w-full'>before discount</p>
						<p className='w-full'>discount</p>
						<p className='w-full'>total</p>
					</div>
					<Separator orientation='horizontal' className='bg-custom-light-gray' />
				</div>

				{bills.map((e, i) => (
					<Link
						to={`/bills/${e._id}`}
						key={i}
						className='flex flex-col w-full'
					>
						<div className='flex items-center py-2 w-full'>
							<p className='w-full'>{i + 1}</p>
							<p className='w-full'>{moment(e.createdAt).format("HH:mm DD/MM/YYYY")}</p>
							<p className='w-full'>{e.products.length}</p>
							<p className='w-full'>{e.total}</p>
							<p className='w-full'>{e.discount}</p>
							<p className='w-full'>{e.totalAtfterDiscount}</p>
						</div>
						<Separator orientation='horizontal' className='bg-custom-light-gray' />
					</Link>
				))}
			</div>
		</div>
	)
}

export default Bills

