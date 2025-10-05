import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
	return (
		<div className='sticky top-3 z-50 flex w-full items-center justify-between gap-4 bg-background rounded-full px-4 py-1 shadow-md mt-2'>
			<Link href='/'>
				<Image
					src='/icons/logo.svg'
					alt='logo'
					width={40}
					height={40}
					className='w-10 h-10'
				/>
			</Link>
			<Menu size={32} className='cursor-pointer hover:text-primary' />
		</div>
	);
}
