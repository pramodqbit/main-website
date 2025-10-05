import { OrbitingCircles } from "@/components/ui/orbiting-circles";

import Image from "next/image";

const ICON_SIZE = 60;

export default function WebDevBg() {
	return (
		<div
			className={
				"absolute bottom-[-400px] inset-0 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
			}>
			<OrbitingCircles radius={360} duration={120} delay={0}>
				<Image
					src='/icons/react.webp'
					alt='React'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full object-cover'
				/>

				<Image
					src='/icons/angular.webp'
					alt='React'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full object-cover'
				/>
				<Image
					src='/icons/python.webp'
					alt='React'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full object-cover'
				/>
				<Image
					src='/icons/react.webp'
					alt='React'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full object-cover'
				/>

				<Image
					src='/icons/angular.webp'
					alt='React'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full object-cover'
				/>
				<Image
					src='/icons/python.webp'
					alt='React'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full object-cover'
				/>
			</OrbitingCircles>
			<OrbitingCircles radius={290} duration={60} delay={5} reverse>
				<Image
					src='/icons/js.webp'
					alt='JavaScript'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full'
				/>
				<Image
					src='/icons/wordpress.webp'
					alt='JavaScript'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full'
				/>
				<Image
					src='/icons/php.webp'
					alt='JavaScript'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full'
				/>
			</OrbitingCircles>
			<OrbitingCircles radius={210} duration={60} delay={10}>
				<Image
					src='/icons/python.webp'
					alt='Python'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full'
				/>
			</OrbitingCircles>

			<OrbitingCircles radius={120} duration={25} reverse>
				<Image
					src='/icons/angular.webp'
					alt='Angular'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full'
				/>
			</OrbitingCircles>
			<OrbitingCircles radius={60} duration={20} delay={15}>
				<Image
					src='/icons/wordpress.webp'
					alt='WordPress'
					width={ICON_SIZE}
					height={ICON_SIZE}
					className='rounded-full'
				/>
			</OrbitingCircles>
		</div>
	);
}
