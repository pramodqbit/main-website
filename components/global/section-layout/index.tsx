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
}

export const SectionHeader = ({
	badgeLabel,
	badgeIcon,
	title,
	description,
}: Omit<SectionLayoutProps, "children">) => {
	return (
		<div className='flex flex-col gap-5 items-center justify-center mb-10'>
			<Badge
				variant='outline'
				className='flex items-center justify-center gap-2 py-2 px-4 rounded-full border'>
				{badgeIcon}
				<AnimatedGradientText speed={0.5} colorFrom='#8A38F5' colorTo='#25D0FF'>
					{badgeLabel}
				</AnimatedGradientText>
			</Badge>
			<TextFadeIn className='text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight'>
				{title}
			</TextFadeIn>
			<p className=' lg:w-[1000px] w-[300px] text-md text-center text-muted-foreground'>
				{description}
			</p>
		</div>
	);
};

const SectionLayout = forwardRef<HTMLDivElement, SectionLayoutProps>(
	({ children, badgeLabel, badgeIcon, title, description }, ref) => {
		return (
			<section ref={ref} className='container mx-auto px-4 border py-16'>
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
