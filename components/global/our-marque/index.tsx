import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const MarqueeCard = ({
	icon,
	label,
	className,
}: {
	icon: React.ReactNode;
	label: string;
	className?: string;
}) => {
	return (
		<div className={cn("flex items-center justify-center gap-2", className)}>
			{icon}
			<p className='lg:text-[24px] text-[16px]'>{label}</p>
		</div>
	);
};

export default function OurMarque({
	Items,
}: {
	Items: { icon: React.ReactNode; label: string }[];
}) {
	return (
		<div className='flex w-full border border-gray-200 lg:p-4 p-2  '>
			<div className=' lg:w-[300px] w-[100px] flex flex-col items-center justify-center '>
				<p className='lg:text-[16px] text-[12px]  font-bold'>
					What sets us apart
				</p>
				<p className='lg:text-[12px] text-[8px] text-gray-500 '>
					Reliable delivery, robust security, fair pricing, and unmatched
					flexibility guaranteed.
				</p>
			</div>
			<div className='lg:w-[calc(100%-300px)] w-[calc(100%-100px)]'>
				<Marquee pauseOnHover className='[--duration:20s]  justify-between'>
					{Items?.map((item, index) => (
						<MarqueeCard
							key={index}
							{...item}
							className='lg:w-[220px] w-[160px]  lg:h-[60px] h-[40px] '
						/>
					))}
				</Marquee>
			</div>
		</div>
	);
}
