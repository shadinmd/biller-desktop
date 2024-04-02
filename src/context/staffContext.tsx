import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import StaffInterface from "../types/staff.interface";
import api, { handleAxiosError } from "../lib/api";
import { toast } from "sonner";

interface Props {
	staff: StaffInterface,
	fetchStaffDetails: () => void
}

const staffContext = createContext<Props>({
	staff: {
		_id: "",
		username: "",
		password: "",
		shop: "",
		manager: false,
		blocked: false
	},
	fetchStaffDetails: () => { }
})

export const StaffProvider = ({ children }: { children: ReactNode }) => {

	const path = new URL(location.href).pathname
	const [staff, setStaff] = useState<StaffInterface>({
		_id: "",
		username: "",
		password: "",
		shop: "",
		manager: false,
		blocked: false
	})

	const fetchStaffDetails = async () => {
		api.get("/staff")
			.then(({ data }) => {
				if (data.success) {
					setStaff(data.staff)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
	}

	useEffect(() => {
		if (path != "/login")
			if (localStorage.getItem("token"))
				api.get("/staff")
					.then(({ data }) => {
						if (data.success) {
							setStaff(data.staff)
						} else {
							toast.error(data.message)
						}
					})
					.catch(error => {
						handleAxiosError(error)
					})
			else {
				location.assign("/login")
			}
	}, [])

	return (
		<staffContext.Provider value={{ staff, fetchStaffDetails }}>
			{children}
		</staffContext.Provider>
	)
}

export const useStaff = () => {
	return useContext(staffContext)
}
