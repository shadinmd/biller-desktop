import { ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/shadcn/Dialog"
import { handleAxiosError } from "../lib/api"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import StaffInterface from "../types/staff.interface"
import { AxiosInstance } from "axios"
import cn from "../lib/cn"

interface Props {
	children: ReactNode,
	shopId: string,
	newStaff: (staff: StaffInterface) => void,
	api: AxiosInstance,
	className?: string
}

const formSchema = z.object({
	username: z.string().min(5, { message: "username is too short" }).refine(val => !val.includes(" "), { message: "username must not contain space" }),
	password: z.string().min(5, { message: "password is too short" }).refine(val => !val.includes(" "), { message: "password must not contain space" }),
	confirmPassword: z.string(),
	manager: z.boolean().default(false)
}).superRefine(({ password, confirmPassword }, ctx) => {
	if (password != confirmPassword) {
		ctx.addIssue({
			code: "custom",
			path: ["confirmPassword"],
			message: "passwords don't match"
		})
	}
})

type formType = z.infer<typeof formSchema>

const NewStaff = ({ children, shopId, newStaff, api, className }: Props) => {

	const [open, setOpen] = useState(false)
	const { register, formState: { errors }, handleSubmit } = useForm<formType>({ resolver: zodResolver(formSchema) })

	const onSubmit = async (data: formType) => {
		try {
			const response = await api.post("/staff", { shopId, ...data })
			if (response.data.success) {
				toast.success(response.data.message)
				newStaff(response.data.staff)
				setOpen(false)
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
						New Staff
					</DialogTitle>
					<DialogDescription>
						create a new staff for this shop
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-2 items-center"
				>
					<input
						{...register("username")}
						placeholder="Username"
						type="text"
						className="border-2 border-primary px-3 py-1 rounded-lg outline-none"
					/>
					{errors.username && <p className="text-red-500">{errors.username.message}</p>}
					<input
						{...register("password")}
						placeholder="Password"
						type="password"
						className="border-2 border-primary px-3 py-1 rounded-lg outline-none"
					/>
					{errors.password && <p className="text-red-500">{errors.password.message}</p>}
					<input
						{...register("confirmPassword")}
						placeholder="Confirm password"
						type="password"
						className="border-2 border-primary px-3 py-1 rounded-lg outline-none"
					/>
					{errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
					<div className="flex items-center gap-2">
						<label>Manager: </label>
						<input
							{...register("manager")}
							placeholder="Manager"
							type="checkbox"
							className="border-2 border-primary px-3 py-1 rounded-lg outline-none"
						/>
					</div>
					{errors.manager && <p className="text-red-500">{errors.manager.message}</p>}
					<button className="bg-primary text-white font-bold px-6 py-2 rounded-lg">
						Create
					</button>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default NewStaff


