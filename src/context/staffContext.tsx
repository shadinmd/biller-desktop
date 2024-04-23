import ExpiredComponent from "../components/ExpiredComponent";
import api, { handleAxiosError } from "../lib/api";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { FullStaffInterface } from "../types/staff.interface";

interface Props {
	staff: FullStaffInterface
	fetchStaffDetails: () => void
}

const staffContext = createContext<Props>({
	staff: {
		_id: "",
		username: "",
		password: "",
		shop: {
			_id: "",
			name: "",
			shop_id: "",
			shop_secret: "",
			vendor: {
				_id: "",
				username: "",
				password: "",
				email: "",
				shop: "",
				verified: false,
				verificationToken: "",
				verificationExpiry: new Date(),
				activePlan: "",
				planExpiry: new Date(),
				active: false,
				subscribed: true,
				blocked: false,
				deleted: false
			},
			location: "",
			active: false,
			image: "",
			createdAt: new Date()
		},
		blocked: false,
		manager: false,
		createdAt: new Date()
	},
	fetchStaffDetails: () => { }
})

export const StaffProvider = ({ children }: { children: ReactNode }) => {

	const [expiredModal, setExpiredModal] = useState(false)
	const [staff, setStaff] = useState<FullStaffInterface>(
		{
			_id: "",
			username: "",
			password: "",
			shop: {
				_id: "",
				name: "",
				shop_id: "",
				shop_secret: "",
				vendor: {
					_id: "",
					username: "",
					password: "",
					email: "",
					shop: "",
					verified: false,
					verificationToken: "",
					verificationExpiry: new Date(),
					activePlan: "",
					planExpiry: new Date(),
					active: false,
					subscribed: true,
					blocked: false,
					deleted: false
				},
				location: "",
				active: false,
				image: "",
				createdAt: new Date()
			},
			blocked: false,
			manager: false,
			createdAt: new Date()
		}
	)

	const fetchStaffDetails = async () => {
		try {
			const { data } = await api.get("/staff")
			if (data.success) {
				setStaff(data.staff)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	useEffect(() => {
		if (localStorage.getItem("token")) {
			api.get("/staff")
				.then(({ data }) => {
					if (data.success) {
						console.log(data)
						setStaff(data.staff)
					} else {
						toast.error(data.message)
					}
				})
				.catch(error => {
					handleAxiosError(error)
				})
		}
	}, [])

	useEffect(() => {
		setExpiredModal(!staff.shop.vendor.subscribed)
	}, [staff.shop.vendor.subscribed])

	return (
		<staffContext.Provider value={{ staff, fetchStaffDetails }}>
			<ExpiredComponent open={expiredModal} />
			{children}
		</staffContext.Provider>
	)
}

export const useStaff = () => {
	return useContext(staffContext)
}
