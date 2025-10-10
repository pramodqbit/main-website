import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Construction() {
	return (
		<div className='min-h-screen flex flex-col '>
			<div className='container'>
				<Navbar />
			</div>

			<main className='flex-1 flex items-center justify-center px-4 container mb-4'>
				<div className='text-center max-w-4xl mx-auto mt-0 md:mt-20'>
					{/* Construction Icon/Emoji */}
					<div className='mb-8 relative'>
						{/* <div className='text-8xl md:text-9xl animate-bounce'>🚧</div> */}
						<div className='absolute inset-0 blur-3xl bg-gradient-to-r from-purple-600/20 to-blue-500/20 -z-10'></div>
					</div>

					{/* Main Heading */}
					<h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent'>
						Under Construction
					</h1>

					{/* Subheading */}
					<p className='text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-4'>
						We&apos;re building something awesome!
					</p>

					{/* Description */}
					<p className='text-base md:text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto'>
						This page is currently under development. Our team is working hard
						to bring you an amazing experience. Please check back soon!
					</p>

					{/* Progress Bar */}
					<div className='mb-12 max-w-md mx-auto'>
						<div className='relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
							<div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 animate-pulse w-3/4 rounded-full'></div>
						</div>
						<p className='text-sm text-gray-500 dark:text-gray-600 mt-2'>
							Progress: 75%
						</p>
					</div>

					{/* Action Buttons */}
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Link href='/'>
							<Button
								size='lg'
								className='bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300'>
								Return Home
							</Button>
						</Link>
						<Link href='/services'>
							<Button
								size='lg'
								variant='outline'
								className='border-2 px-8 py-6 text-lg rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300'>
								View Services
							</Button>
						</Link>
					</div>

					{/* Decorative Elements */}
					<div className='pt-12 opacity-50'>
						<div className='flex items-center justify-center gap-2 text-gray-500 dark:text-gray-600'>
							<div className='w-16 h-px bg-gradient-to-r from-transparent to-gray-400'></div>
							<span className='text-sm'>Coming Soon</span>
							<div className='w-16 h-px bg-gradient-to-l from-transparent to-gray-400'></div>
						</div>
					</div>

					{/* Floating Tools Icons */}
					<div className='mt-12 flex justify-center gap-8 opacity-30'>
						<div className='text-4xl animate-pulse'>⚙️</div>
						<div className='text-4xl animate-pulse delay-100'>🔧</div>
						<div className='text-4xl animate-pulse delay-200'>🔨</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
