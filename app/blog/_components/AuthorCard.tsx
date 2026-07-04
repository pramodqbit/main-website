import Image from "next/image";
import { ShareButtons } from "./ShareButtons";

export function AuthorCard({ title }: { title: string }) {
	return (
		<div className='flex flex-col gap-6 rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-7'>
			<div className='flex flex-shrink-0 items-center gap-4'>
				<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15'>
					<Image
						src='/icons/logo.png'
						alt='QbitLog'
						width={30}
						height={30}
						className='h-[30px] w-[30px] object-contain'
					/>
				</div>
				<div>
					<p className='text-xs text-muted-foreground'>Written by</p>
					<p className='text-sm font-bold text-foreground'>
						QbitLog Editorial Team
					</p>
					<p className='mt-0.5 text-xs text-muted-foreground'>
						AI &bull; Software Engineering &bull; Digital Transformation
					</p>
				</div>
			</div>
			<div className='flex flex-col gap-4 md:max-w-sm md:flex-row md:items-center'>
				<p className='text-xs leading-relaxed text-muted-foreground'>
					We are a team of technologists and writers passionate about exploring
					AI, software, and the future of digital innovation.
				</p>
				<ShareButtons title={title} className='flex-shrink-0' />
			</div>
		</div>
	);
}

export default AuthorCard;
