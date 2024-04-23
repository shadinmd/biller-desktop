import { ShadSelect, SelectTrigger, SelectContent, SelectGroup, SelectItem } from "../components/shadcn/ShadSelect"

interface Props {
	items: string[],
	onSelect: (item: string) => void
	selected: string
}

const Select = ({ items, onSelect, selected }: Props) => {

	return (
		<ShadSelect onValueChange={(e) => onSelect(e)}>
			<SelectTrigger className="outline-none bg-white font-bold drop-shadow-lg h-full">
				{selected}
			</SelectTrigger>
			<SelectContent className="outline-none bg-white">
				<SelectGroup className="outline-none">
					{
						items.map((e, i) => (
							<SelectItem value={e} key={i} className="outline-none cursor-pointer font-bold">
								{e}
							</SelectItem>
						))
					}
				</SelectGroup>
			</SelectContent>
		</ShadSelect>
	)
}

export default Select
