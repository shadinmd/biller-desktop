import { FC, ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./shadcn/Dialog"
import ProductInterface from "../types/product.interface"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { handleAxiosError } from "../lib/api"
import { AxiosInstance } from "axios"
import { toast } from "sonner"

interface Props {
	children: ReactNode
	product: ProductInterface
	setProduct: (product: ProductInterface) => void
	api: AxiosInstance
}

type className = string

const inputStyle: className = "outline-none border-2 border-primary px-3 py-1 rounded-lg"

const EditProduct: FC<Props> = ({ children, product, api, setProduct }) => {

	const formSchema = z.object({
		name: z.string().min(1, { message: "this field cannot be empty" }).default(product?.name!),
		price: z.number().min(0, { message: "" }).nonnegative({ message: "this field cannot be negaative number" }).default(product?.price!),
		stock: z.number().min(0, { message: "" }).nonnegative({ message: "this field cannot be negaative number" }).default(product?.stock!),
		profit: z.number().min(0, { message: "" }).nonnegative({ message: "this field cannot be negaative number" }).default(product?.profit!),
		point: z.number().min(0, { message: "" }).nonnegative({ message: "this field cannot be negaative number" }).default(product?.point!)
	})
	type formType = z.infer<typeof formSchema>

	const [open, setOpen] = useState(false)
	const { register, handleSubmit, formState: { errors } } = useForm<formType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: product.name,
			price: product.price,
			profit: product.profit,
			point: product.point,
			stock: product.stock
		}
	})
	const [image, setImage] = useState<File | string>(product.image)

	const onSubmit = async (data: formType) => {
		try {

			const form = new FormData()
			if (image) {
				form.append("file", image || "no file")
			}

			for (const [key, value] of Object.entries(data)) {
				form.append(key, value.toString());
			}

			const response = await api.put(`/product/${product?._id}`, form)
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
					<div className="flex items-center justify-center w-full h-full">
						<label htmlFor="image" className="flex items-center justify-center scale-56">
							{
								image ?
									<img className="bg-contain" height={300} width={300} src={typeof image == "string" ? image : URL.createObjectURL(image)} alt="" /> :
									<p className="text-white font-bold bg-primary px-6 py-2 rounded-full">
										pick a photo
									</p>
							}
						</label>
						<input
							id="image"
							onChange={e => { e.target.files && setImage(e.target.files[0]) }}
							type="file"
							multiple={false}
							className=""
							hidden
						/>

					</div>
					<div className="flex gap-3 items-center">
						<p>Name: </p>
						<input
							{...register("name")}
							defaultValue={product.name}
							placeholder="Name"
							type="text"
							className={inputStyle}
						/>
					</div>
					{errors.name && <p className="text-red-500">{errors.name.message}</p>}
					<div className="flex gap-3 items-center">
						<p>Stock: </p>
						<input
							{...register("stock", { valueAsNumber: true })}
							defaultValue={product.stock}
							placeholder="Price"
							type="text"
							className={inputStyle}
						/>
					</div>
					{errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
					<div className="flex gap-3 items-center">
						<p>Price: </p>
						<input
							{...register("price", { valueAsNumber: true })}
							defaultValue={product.price}
							placeholder="Price"
							type="text"
							className={inputStyle}
						/>
					</div>
					{errors.price && <p className="text-red-500">{errors.price.message}</p>}
					<div className="flex gap-3 items-center">
						<p>Profit: </p>
						<input
							{...register("profit", { valueAsNumber: true })}
							defaultValue={product.profit}
							placeholder="Profit"
							type="text"
							className={inputStyle}
						/>
					</div>
					{errors.profit && <p className="text-red-500">{errors.profit.message}</p>}
					<div className="flex gap-3 items-center">
						<p>Point: </p>
						<input
							{...register("point", { valueAsNumber: true })}
							defaultValue={product.point}
							placeholder="Point"
							type="text"
							className={inputStyle}
						/>
					</div>
					{errors.point && <p className="text-red-500">{errors.point.message}</p>}
					<button className="font-bold text-white bg-primary px-6 py-2 rounded-full" type="submit">
						Save
					</button>
				</form>

			</DialogContent>
		</Dialog>
	)
}

export default EditProduct

