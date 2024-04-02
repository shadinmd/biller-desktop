import { FC, ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./shadcn/Dialog"
import ProductInterface from "../types/product.interface"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api, { handleAxiosError } from "../lib/api"
import { toast } from "sonner"

interface Props {
	children: ReactNode
	product: ProductInterface
	setProduct: (product: ProductInterface) => void
}

type className = string

const inputStyle: className = "outline-none border-2 border-primary px-3 py-1 rounded-lg"

const EditProduct: FC<Props> = ({ children, product, setProduct }) => {

	const formSchema = z.object({
		name: z.string().min(1, { message: "this field cannot be empty" }).default(product?.name!),
		price: z.number().min(0, { message: "" }).nonnegative({ message: "this field cannot be negaative number" }).default(product?.price!),
		stock: z.number().min(0, { message: "" }).nonnegative({ message: "this field cannot be negaative number" }).default(product?.stock!),
		profit: z.number().min(0, { message: "" }).nonnegative({ message: "this field cannot be negaative number" }).default(product?.profit!)
	})
	type formType = z.infer<typeof formSchema>

	const [open, setOpen] = useState(false)
	const { register, handleSubmit, formState: { errors } } = useForm<formType>({ resolver: zodResolver(formSchema) })

	const onSubmit = async (data: formType) => {
		try {
			const response = await api.put(`/product/${product?._id}`, data)
			if (response.data.success) {
				let temp = { ...product, ...data }
				setProduct(temp)
				setOpen(false)
				toast.success(response.data.message)
			} else {
				toast.error(response.data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger className="outline-none">
				{children}
			</DialogTrigger>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle>
						Edit Product
					</DialogTitle>
					<DialogDescription>
						edit the details of this product
					</DialogDescription>
				</DialogHeader>

				<form
					className="flex flex-col gap-2 items-center"
					onSubmit={handleSubmit(onSubmit)}
				>
					<input
						{...register("name")}
						autoFocus
						defaultValue={product?.name}
						placeholder="Name"
						type="text"
						className={inputStyle}
					/>
					{errors.name && <p className="text-red-500">{errors.name.message}</p>}
					<input
						{...register("price", { valueAsNumber: true })}
						defaultValue={product?.price}
						placeholder="Price"
						type="number"
						className={inputStyle}
					/>
					{errors.price && <p className="text-red-500">{errors.price.message}</p>}
					<input
						{...register("stock", { valueAsNumber: true })}
						defaultValue={product?.stock}
						placeholder="Stock"
						type="number"
						className={inputStyle}
					/>
					{errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
					<input
						{...register("profit", { valueAsNumber: true })}
						defaultValue={product?.profit}
						placeholder="Profit"
						type="number"
						className={inputStyle}
					/>
					{errors.profit && <p className="text-red-500">{errors.profit.message}</p>}

					<div className="flex gap-3 items-center">
						<button type="submit" className="bg-primary px-6 py-2 rounded-lg text-white font-bold">
							Save
						</button>
						<button onClick={e => { e.preventDefault(); setOpen(false) }} className="bg-red-500 px-6 py-2 rounded-lg text-white font-bold">
							Cancel
						</button>
					</div>

				</form>

			</DialogContent>
		</Dialog>
	)
}

export default EditProduct
