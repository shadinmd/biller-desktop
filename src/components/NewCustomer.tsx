import { ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/shadcn/Dialog"
import { AxiosInstance } from "axios"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleAxiosError } from "../lib/api"
import { toast } from "sonner"
import cn from "../lib/cn"
import CustomerInterface from "../types/customer.interface"

interface Props {
	children: ReactNode,
	api: AxiosInstance,
	shopId: string,
	className?: string
	setCustomers: (customer: CustomerInterface) => void
}

const formSchema = z.object({
	name: z.string().min(1, { message: "username cannot be empty" }),
	phone: z.string().min(10, { message: "phone number should be atleas 10" }).max(10, { message: "phone number cannot be greater 10 numbers" }).regex(/^[0-9]*$/, { message: "phone number should only contain numbers" })
})

type formType = z.infer<typeof formSchema>

const NewCustomer = ({ children, api, shopId, className, setCustomers }: Props) => {

	const [open, setOpen] = useState(false)

	const { register, formState: { errors }, handleSubmit } = useForm<formType>({ resolver: zodResolver(formSchema) })

	const onSubmit = async (body: formType) => {
		console.log(body)
		try {
			const { data } = await api.post("/customer", { ...body, shop: shopId })
			if (data.success) {
				toast.success(data.message)
				setCustomers(data.customer)
				setOpen(false)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className={cn("outline-none", className)}>
				{children}
			</DialogTrigger>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle>
						create customer
					</DialogTitle>
					<DialogDescription>
						create a new customer account
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
					<input
						{...register("name")}
						placeholder="Name"
						type="text"
						className="outline-none border-2 border-primary px-3 py-1 rounded-lg"
					/>
					{errors.name && <p className="text-red-500">{errors.name.message}</p>}
					<input
						{...register("phone")}
						placeholder="Phone"
						type="text"
						className="outline-none border-2 border-primary px-3 py-1 rounded-lg"
					/>
					{errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
					<button
						type="submit"
						className="bg-primary text-white font-bold px-6 py-3 rounded-lg"
					>
						Create
					</button>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default NewCustomer
