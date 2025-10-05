import { TextFadeIn } from "@/components/animation/text-animation";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Badge } from "@/components/ui/badge";
import { forwardRef } from "react";

interface SectionLayoutProps {
	children: React.ReactNode;
	className?: string;
	badgeLabel: string;
	badgeIcon: React.ReactNode;
	title: string;
	description: string;
	id?: string;
}

export const SectionHeader = ({
	badgeLabel,
	badgeIcon,
	title,
	description,
}: Omit<SectionLayoutProps, "children" | "id">) => {
	return (
		<div className='flex flex-col md:gap-5 gap-1 items-center justify-center md:mb-10 mb-5'>
			<Badge
				variant='outline'
				className='flex items-center justify-center gap-2 md:py-2 py-1 md:px-4 px-2 rounded-full border text-[10px] md:text-[12px]'>
				{badgeIcon}
				<AnimatedGradientText speed={0.5} colorFrom='#8A38F5' colorTo='#25D0FF'>
					<span className='text-[8px] md:text-[12px]'>{badgeLabel}</span>
				</AnimatedGradientText>
			</Badge>
			<TextFadeIn className=' text-md md:text-4xl font-bold mb-0 md:mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight text-center'>
				{title}
			</TextFadeIn>
			<p className=' lg:w-[1000px] w-[300px]  md:text-md text-[10px] md:text-base text-center text-muted-foreground'>
				{description}
			</p>
		</div>
	);
};

const SectionLayout = forwardRef<HTMLDivElement, SectionLayoutProps>(
	({ children, badgeLabel, badgeIcon, title, description, id }, ref) => {
		return (
			<section
				ref={ref}
				className='container mx-auto px-4 border py-16'
				id={id}>
				<SectionHeader
					badgeLabel={badgeLabel}
					badgeIcon={badgeIcon}
					title={title}
					description={description}
				/>
				<div>{children}</div>
			</section>
		);
	},
);

SectionLayout.displayName = "SectionLayout";

export default SectionLayout;
