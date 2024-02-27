import clsx from "clsx"
import { ClassNameValue, twMerge } from "tailwind-merge"

const cn = (...props: ClassNameValue[]) => {
	return twMerge(clsx(props))
}

export default cn
