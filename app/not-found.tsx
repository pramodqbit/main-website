import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className='min-h-screen flex flex-col '>
			<div className='container'>
				<Navbar />
			</div>

			<main className='flex-1 flex items-center justify-center px-4 container'>
				<div className='container text-center space-y-8 max-w-2xl mx-auto py-20'>
					{/* Animated 404 Text */}
					<div className='relative'>
						<h1 className='text-[180px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 leading-none select-none animate-pulse'>
							404
						</h1>
						<div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 -z-10'></div>
					</div>

					{/* Error Message */}
					<div className='space-y-4'>
						<h2 className='text-3xl md:text-5xl font-bold text-gray-900 dark:text-white'>
							Page Not Found
						</h2>
						<p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
							Oops! The page you&apos;re looking for seems to have wandered off
							into the digital void.
						</p>
					</div>

					{/* Action Buttons */}
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-8'>
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
							<span className='text-sm'>Lost in space?</span>
							<div className='w-16 h-px bg-gradient-to-l from-transparent to-gray-400'></div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
