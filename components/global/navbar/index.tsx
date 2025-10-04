import Image from "next/image";
import { Menu } from "lucide-react";

export default function Navbar() {
	return (
		<div className='flex w-full items-center justify-between gap-4 bg-background rounded-full px-4 py-1 shadow-md mt-2'>
			<Image
				src='/icons/logo.svg'
				alt='logo'
				width={40}
				height={40}
				className='w-10 h-10'
			/>
			<Menu size={32} className='cursor-pointer hover:text-primary' />
		</div>
	);
}
