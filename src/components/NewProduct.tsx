import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./shadcn/Dialog"
import { ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import ProductInterface from "../types/product.interface"
import api, { handleAxiosError } from "../lib/api"

interface Props {
	children: ReactNode,
	shopId: string,
	newProduct: (product: ProductInterface) => void
}

const formSchema = z.object({
	name: z.string().min(1, { message: "this field cannot be empty" }),
	barcode: z.string().min(1, { message: "this field cannot be empty" }).refine(val => !val.includes(" "), { message: "barcode must not contain spaces" }),
	price: z.number(),
	profit: z.number()
}).superRefine(({ profit, price }, ctx) => {
	if (profit > price) {
		ctx.addIssue({
			code: "custom",
			path: ["profit"],
			message: "profit cannot be higher than price"
		})
	}
})

type formType = z.infer<typeof formSchema>
type className = string

const inputStyle: className = "border-2 border-primary px-3 py-1 rounded-lg outline-none"

const NewProduct = ({ children, shopId, newProduct }: Props) => {

	const { register, handleSubmit, formState: { errors } } = useForm<formType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			barcode: "",
			price: 0,
			profit: 0
		}
	})
	const [open, setOpen] = useState(false)

	const onSubmit = async (data: formType) => {
		try {
			const response = await api.post("/product", { shopId, ...data })
			if (response.data.success) {
				toast.success(response.data.message)
				newProduct(response.data.product)
				setOpen(false)
			} else {
				toast.error(response.data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="outline-none">
				{children}
			</DialogTrigger>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle>
						New Product
					</DialogTitle>
					<DialogDescription>
						create a new product in this shop
					</DialogDescription>
				</DialogHeader>
				<div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col items-center gap-2"
					>
						<input
							{...register("name")}
							placeholder="Name"
							type="text"
							className={inputStyle}
						/>
						{errors.name && <p className="text-red-500">{errors.name.message}</p>}
						<input
							{...register("barcode")}
							placeholder="Barcode"
							type="text"
							className={inputStyle}
						/>
						{errors.barcode && <p className="text-red-500">{errors.barcode.message}</p>}
						<input
							{...register("price", { valueAsNumber: true })}
							placeholder="Price"
							type="text"
							className={inputStyle}
						/>
						{errors.price && <p className="text-red-500">{errors.price.message}</p>}
						<input
							{...register("profit", { valueAsNumber: true })}
							placeholder="Profit"
							type="text"
							className={inputStyle}
						/>
						{errors.profit && <p className="text-red-500">{errors.profit.message}</p>}
						<button className="font-bold text-white bg-primary px-6 py-2 rounded-full" type="submit">
							Create
						</button>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default NewProduct
