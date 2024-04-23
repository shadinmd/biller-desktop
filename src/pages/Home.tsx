"use client"
import { Separator } from "../components/shadcn/Separator"
import SearchCustomers from "../components/SearchCustomers"
import SearchProducts from "../components/SearchProducts"
import { useStaff } from "../context/staffContext"
import api, { handleAxiosError } from "../lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import CustomerInterface from "../types/customer.interface"
import ProductInterface from "../types/product.interface"
import { z } from "zod"

const Staff = () => {

	const { staff } = useStaff()
	const [selectedProducts, setSelecetdProducts] = useState<(ProductInterface & { quantity: number })[]>([])
	const [discount, setDiscount] = useState(0)
	const [customer, setCustomer] = useState<CustomerInterface>()


	const pointFormSchema = z.object({
		point: z.number().default(0).nullable()
	}).superRefine(({ point }, ctx) => {
		if (!customer) {
			ctx.addIssue({
				code: "custom",
				message: "please select a customer",
				path: ["point"]
			})
			return
		}

		if (point && point > customer.point) {
			ctx.addIssue({
				code: "custom",
				message: "insufficient points",
				path: ["point"]
			})
		}
	})
	type pointFormType = z.infer<typeof pointFormSchema>

	const { register, formState: { errors }, handleSubmit } = useForm<pointFormType>({ resolver: zodResolver(pointFormSchema) })

	const adddProduct = (product: ProductInterface) => {
		const index = selectedProducts.findIndex((e) => e._id == product._id)
		if (index != -1) {
			let temp = [...selectedProducts]
			temp[index].quantity += 1
			setSelecetdProducts(temp)
		} else {
			setSelecetdProducts(prev => [...prev, { ...product, quantity: 1 }])
		}
	}

	const ressetBill = () => {
		setDiscount(0)
		setSelecetdProducts([])
	}

	const saveBill = async () => {
		if (selectedProducts.length < 1) {
			toast.error("the bill is empty")
			return
		}
		try {
			const { data } = await api.post("/bill", {
				staff: staff._id,
				shop: staff.shop,
				total: selectedProducts.reduce((sum, e) => sum + (e.price * e.quantity), 0),
				totalAtfterDiscount: selectedProducts.reduce((sum, e) => sum + (e.price * e.quantity) - discount, 0),
				products: selectedProducts.map((e) => ({ product: e._id, quantity: e.quantity, point: e.point })),
				discount,
				customer: customer?._id
			})
			if (data.success) {
				toast.success(data.message)
				ressetBill()
			} else {
				toast.error(data)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	const addQuantity = (id: string) => {
		let temp = [...selectedProducts]
		let product = temp.find(e => e._id == id)
		if (!product) {
			toast.error("failed to change product quantity")
			return
		}
		product.quantity += 1
		setSelecetdProducts(temp)
	}

	const reduceQuantity = (id: string) => {
		let temp = [...selectedProducts]
		let product = temp.find(e => e._id == id)
		if (!product) {
			toast.error("failed to change product quantity")
			return
		}
		product.quantity -= 1
		setSelecetdProducts(temp)
	}

	const removeItem = (id: string) => {
		setSelecetdProducts(selectedProducts.filter(e => e._id != id))
	}

	return (
		<div className="flex flex-col gap-5 items-center justify-center w-full h-full">
			<div className="flex gap-5 items-center h-full w-full">
				<div className="flex flex-col gap-5 items-center p-5 h-full w-full bg-white rounded-lg drop-shadow-lg">
					<div className="w-full">
						<SearchProducts
							addProduct={adddProduct}
						/>
					</div>
					<div className="flex flex-col h-full w-full">
						<div className="flex flex-col items-center w-full">
							<div className="flex text-custom-light-gray items-center w-full">
								<p className="w-full">no</p>
								<p className="w-full">Name</p>
								<p className="w-full">Price</p>
								<p className="w-full">Qty</p>
								<p className="w-full">Total</p>
								<p className="w-full"></p>
							</div>
							<Separator orientation="horizontal" className="bg-custom-light-gray w-full" />
						</div>
						{selectedProducts.map((e, i) => (
							<div
								key={i}
								className="flex flex-col items-center justify-center w-full"
							>
								<div className="flex items-center w-full h-10">
									<p className="w-full">{i + 1}</p>
									<p className="w-full">{e.name}</p>
									<p className="w-full">{e.price}</p>
									<div className="flex gap-1 items-center w-full">
										<Icon onClick={ev => { ev.preventDefault(); reduceQuantity(e._id) }} icon={"mdi:minus"} className="text-red-500 text-xl" />
										<p>{e.quantity}</p>
										<Icon onClick={ev => { ev.preventDefault(); addQuantity(e._id) }} icon={"mdi:plus"} className="text-green-500 text-xl" />
									</div>
									<p className="w-full">{e.quantity * e.price}</p>
									<div className="w-full">
										<button onClick={ev => { ev.preventDefault(); removeItem(e._id) }}>
											<Icon icon={"mdi:trash"} className="text-red-500 text-2xl" />
										</button>
									</div>
								</div>
								<Separator orientation="horizontal" className="bg-custom-light-gray w-full" />
							</div>
						))}
					</div>
				</div>
				<SearchCustomers shopId={staff.shop._id} setCustomer={setCustomer} customer={customer} />
			</div>
			<div className="flex flex-col gap-5 w-full">
				<div className="flex gap-5 items-center w-full">

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg w-full">
						<div>
							<p className="text-custom-light-gray">items</p>
							<p className="font-bold">{selectedProducts.length}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"bi:boxes"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg w-full">
						<div>
							<p className="text-custom-light-gray">discount</p>
							<p className="font-bold">{discount}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg w-full">
						<div>
							<p className="text-custom-light-gray">total mrp</p>
							<p className="font-bold">{selectedProducts.reduce((sum, e) => sum + (e.quantity * e.price), 0)}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg w-full">
						<div>
							<p className="text-custom-light-gray">total</p>
							<p className="font-bold">{selectedProducts.reduce((sum, e) => sum + (e.quantity * e.price), 0) - discount}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"game-icons:cash"} className="text-white text-2xl" />
						</div>
					</div>
				</div>
				<div className="flex gap-5 items-center w-full">
					<div>
						<input
							{...register("point", { valueAsNumber: true })}
							placeholder="Point to use"
							type="text"
							className="outline-none px-3 py-2 rounded-lg border-2 border-primary"
						/>
						{errors.point && <p className="text-red-500">{errors.point.message}</p>}
					</div>
					<button onClick={handleSubmit(e => setDiscount(e.point || 0))} className="bg-primary text-white font-bold rounded-lg px-6 py-2">
						Apply
					</button>
					<button onClick={e => { e.preventDefault(); saveBill() }} className="bg-primary text-white font-bold rounded-lg px-6 py-2">
						Save
					</button>
					<button onClick={e => { e.preventDefault(); ressetBill() }} className="bg-primary text-white font-bold rounded-lg px-6 py-2">
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}

export default Staff

