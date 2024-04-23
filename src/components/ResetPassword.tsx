import { ReactNode, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/shadcn/Dialog'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleAxiosError } from '../lib/api'
import { AxiosInstance } from 'axios'
import { toast } from 'sonner'
import cn from '../lib/cn'

interface Props {
	children: ReactNode,
	api: AxiosInstance,
	staffId: string,
	className?: string
}

const formSchema = z.object({
	password: z.string().min(1, { message: "this field cannot be empty" }).refine((val) => !val.includes(" ")),
	confirmPassword: z.string().min(1, { message: "this field cannot be empty" }).refine((val) => !val.includes(" "))
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

const ResetPassword = ({ children, api, staffId, className }: Props) => {

	const { register, formState: { errors }, handleSubmit } = useForm<formType>({ resolver: zodResolver(formSchema) })
	const [open, setOpen] = useState(false)

	const onSubmit = async (body: formType) => {
		try {
			const { data } = await api.put(`/staff/reset/${staffId}`, body)
			if (data.success) {
				setOpen(false)
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className={cn('outline-none', className)}>
				{children}
			</DialogTrigger>
			<DialogContent className='bg-white'>
				<DialogHeader>
					<DialogTitle>
						Change password
					</DialogTitle>
					<DialogDescription>
						change password of this staff
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-2'
				>
					<input
						{...register("password")}
						placeholder='Password'
						type="password"
						className='border-2 border-primary px-3 py-1 rounded-lg outline-none'
					/>
					{errors.password && <p className='text-red-500'>{errors.password.message}</p>}
					<input
						{...register("confirmPassword")}
						placeholder='Confirm Password'
						type="password"
						className='border-2 border-primary px-3 py-1 rounded-lg outline-none'
					/>
					{errors.password && <p className='text-red-500'>{errors.password.message}</p>}
					<div className='flex gap-5 items-center'>
						<button type='submit' className='bg-primary text-white font-bold rounded-lg w-full py-2'>
							Reset
						</button>
						<button onClick={(e) => { e.preventDefault(); setOpen(false) }} className='bg-red-500 text-white font-bold rounded-lg w-full py-2'>
							Cancel
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default ResetPassword

