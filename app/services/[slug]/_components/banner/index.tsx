export default function ServiceBanner({ title }: { title: string }) {
	return (
		<div className='border rounded-xl p-4 bg-secondary/10 mt-10'>
			<p
				className='text-[100px] text-nowrap leading-[100px]  text-center  seven-segment-font
             bg-clip-text 
            text-transparent bg-gradient-to-r from-primary to-secondary'>
				{title}
			</p>
		</div>
	);
}
