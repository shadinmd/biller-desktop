import { Bar } from "react-chartjs-2"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { useEffect, useState } from "react"
import { AxiosInstance } from "axios"
import { handleAxiosError } from "../lib/api"
import { toast } from "sonner"

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
)

interface Props {
	id: string,
	api: AxiosInstance
}

const ProductGraph = ({ id, api }: Props) => {

	const [data, setData] = useState<{ date: string, quantity: number }[]>([])

	useEffect(() => {
		api.get(`/product/${id}/analytics`)
			.then(({ data }) => {
				if (data.success) {
					while (data.data.length < 5) {
						data.data.push({ date: "none", quantity: 0 })
					}
					setData(data.data)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
	}, [])

	return (
		<div className="flex flex-col items-center justify-center bg-white drop-shadow-lg p-5 rounded-lg w-full h-full">
			<p>bills created last 5 days</p>
			<div className="flex items-center justify-center w-full h-full">
				<Bar
					datasetIdKey='id'
					options={{
						maintainAspectRatio: false
					}}
					data={{
						labels: data.map(e => e.date),
						datasets: [
							{
								label: "bills",
								data: data.map(e => e.quantity),
								backgroundColor: "#3F488D",
								borderColor: "#3F488D"
							},
						],
					}}
				/>
			</div>
		</div>
	)
}

export default ProductGraph
