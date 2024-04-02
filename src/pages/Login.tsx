import { z } from "zod"
import Container from "../components/Container"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import api, { handleAxiosError } from "../lib/api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useStaff } from "../context/staffContext"

const formSchema = z.object({
	shopId: z.string().min(1, { message: "this field cannot be empty" }),
	username: z.string().min(1, { message: "this field cannot be empty" }),
	password: z.string().min(1, { message: "this field cannot be empty" })
})

type formType = z.infer<typeof formSchema>

const Login = () => {

	const { fetchStaffDetails } = useStaff()
	const { register, formState: { errors }, handleSubmit } = useForm<formType>({ resolver: zodResolver(formSchema) })
	const navigate = useNavigate()

	const onSubmit = async (data: formType) => {
		try {
			const response = await api.post("/auth/staff/login", data)
			if (response.data.success) {
				localStorage.setItem("token", response.data.token)
				fetchStaffDetails()
				navigate("/")
			} else {
				toast.error(response.data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<Container>
			<div className="flex flex-col gap-5 items-center bg-white drop-shadow-lg p-10 rounded-lg">
				<p className="text-4xl font-bold">Login</p>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-2"
				>
					<input
						{...register("shopId")}
						placeholder="Shop id"
						type="text"
						className={`border-2 ${errors.shopId ? "border-red-500" : "border-primary"} px-3 py-1 rounded-lg outline-none`}
					/>
					{errors.shopId && <p className="text-red-500">{errors.shopId.message}</p>}
					<input
						{...register("username")}
						placeholder="Username"
						type="text"
						className={`border-2 ${errors.username ? "border-red-500" : "border-primary"} px-3 py-1 rounded-lg outline-none`}
					/>
					{errors.username && <p className="text-red-500">{errors.username.message}</p>}
					<input
						{...register("password")}
						placeholder="Password"
						type="password"
						className={`border-2 ${errors.password ? "border-red-500" : "border-primary"} px-3 py-1 rounded-lg outline-none`}
					/>
					{errors.password && <p className="text-red-500">{errors.password.message}</p>}
					<button type="submit" className="bg-primary font-bold text-white rounded-lg px-6 py-2">
						Login
					</button>
				</form>
			</div>
		</Container>
	)
}

export default Login
