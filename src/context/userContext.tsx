import { ReactNode, createContext, useContext, useState } from "react";

interface Props {
	loggedIn: boolean
}

const userContext = createContext<Props>({
	loggedIn: false
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [loggedIn, setLoggedIn] = useState(false)

	return (
		<userContext.Provider value={{ loggedIn }}>
			{children}
		</userContext.Provider>
	)
}

export const useUser = () => {
	return useContext(userContext)
}
