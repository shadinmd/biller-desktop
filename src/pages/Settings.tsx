"use client"
import { useStaff } from "../context/staffContext"
import api, { handleAxiosError } from "../lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const resetFormSchema = z.object({
	password: z.string().min(5, { message: "password too short" }).refine(val => !val.includes(" "), { message: "password must not contain spaces" }),
	confirmPassword: z.string()
}).superRefine(({ password, confirmPassword }, ctx) => {
	if (password != confirmPassword) {
		ctx.addIssue({
			code: "custom",
			message: "passwords don't match",
			path: ["confirmPassword"]
		})
	}
})

type resetFormType = z.infer<typeof resetFormSchema>

const Settings = () => {

	const navigate = useNavigate()
	const { staff } = useStaff()

	const { register, handleSubmit, formState: { errors }, setValue } = useForm<resetFormType>({ resolver: zodResolver(resetFormSchema) })

	const logout = () => {
		localStorage.removeItem("token")
		navigate("/login")
	}

	const resetPassword = async (body: resetFormType) => {
		try {
			const { data } = await api.put(`/staff/reset/${staff._id}`, body)
			if (data.success) {
				setValue("confirmPassword", "")
				setValue("password", "")
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<div className="flex flex-col gap-5 items-start justify-start p-5 bg-white rounded-lg drop-shadow-lg w-full h-full">
			<div className="">
				<p className="text-3xl font-bold">Settings</p>
			</div>
			<div className="flex flex-col gap-2 items-center">
				<p className="font-bold">Reset this accounts password</p>
				<form
					className="flex flex-col gap-2 items-start"
					onSubmit={handleSubmit(resetPassword)}
				>
					<input
						{...register("password")}
						placeholder="Password"
						type="password"
						className="outline-none border-2 border-primary px-3 py-1 rounded-lg"
					/>
					{errors.password && <p className="text-red-500">{errors.password.message}</p>}
					<input
						{...register("confirmPassword")}
						placeholder="Confirm password"
						type="password"
						className="outline-none border-2 border-primary px-3 py-1 rounded-lg"
					/>
					{errors.password && <p className="text-red-500">{errors.password.message}</p>}
					<button type="submit" className="text-white bg-red-500 font-bold px-3 py-1 rounded-lg">
						Reset
					</button>
				</form>
			</div>
			<div className="flex flex-col gap-2 items-start">
				<p className="font-bold text-custom-light-gray">Logout from this account?</p>
				<button onClick={() => logout()} className="py-1 px-3 rounded-lg bg-red-500 font-bold text-white">
					logout
				</button>
			</div>
		</div>
	)
}

export default Settings

