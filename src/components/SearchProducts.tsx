import { KeyboardEvent, useEffect, useRef, useState } from "react"
import ProductInterface from "../types/product.interface"
import api, { handleAxiosError } from "../lib/api"
import { useStaff } from "../context/staffContext"
import { toast } from "sonner"

interface Props {
	addProduct: (product: ProductInterface) => void
}

const SearchProducts = ({ addProduct }: Props) => {

	const { staff } = useStaff()
	const [products, setProducts] = useState<ProductInterface[]>([])
	const [search, setSearch] = useState("")
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (staff.shop && localStorage.getItem("token"))
			api.get(`/product/shop/listed/${staff.shop._id}?name=${search}`)
				.then(({ data }) => {
					if (data.success) {
						setProducts(data.products)
					} else {
						toast.error(data.message)
					}
				}).catch(error => {
					handleAxiosError(error)
				})
	}, [search, staff.shop])


	useEffect(() => {
		const pasteHandler = async (e: ClipboardEvent) => {
			const barcode = e.clipboardData?.getData("Text")
			if (barcode) {
				if (inputRef.current === document.activeElement) {
					return
				}
				try {
					const { data } = await api.get(`/product/shop/listed/${staff.shop._id}?barcode=${barcode}`)
					if (data.success) {
						if (data.product)
							addProduct(data.product)
					} else {
						toast.error(data.message)
					}
				} catch (error) {
					handleAxiosError(error)
				}
			}
		}

		addEventListener("paste", pasteHandler)
		return () => {
			removeEventListener("paste", pasteHandler)
		}
	}, [staff.shop, addProduct])

	const onSelect = (index: number) => {
		addProduct(products[index])
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key == "Enter") {
			if (products.length > 0)
				onSelect(0)
		}
	}

	return (
		<div>
			<input
				ref={inputRef}
				placeholder="Search..."
				onChange={e => setSearch(e.target.value)}
				value={search}
				autoFocus
				onKeyDown={handleKeyDown}
				className="w-1/2 outline-none px-3 py-1 rounded-lg border-2"
			/>
			<div className="z-10 text-black fixed top-14 bg-white border-2 rounded-lg px-5">
				{search.length > 0 && (
					products.length > 0 ?
						products.map((e, i) => (
							<div
								key={i}
								className="text-black"
								onSelect={() => { onSelect(i) }}
							>
								<p className="text-black opacity-100">{e.name}</p>
							</div>
						))
						: <div className="text-red-500">
							no Product found
						</div>
				)
				}
			</div>
		</div >
	)
}

export default SearchProducts

