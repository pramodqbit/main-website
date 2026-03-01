import { TextFadeIn } from "@/components/animation/text-animation";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SectionLayoutProps {
	children: React.ReactNode;
	className?: string;
	badgeLabel: string;
	badgeIcon: React.ReactNode;
	title: string;
	description?: string;
	id?: string;
}

export const SectionHeader = ({
	badgeLabel,
	badgeIcon,
	title,
	description,
}: Omit<SectionLayoutProps, "children" | "id">) => {
	return (
		<div className='flex flex-col md:gap-3 gap-1 items-center justify-center md:mb-10 mb-5'>
			<Badge
				variant='outline'
				className='flex items-center justify-center gap-2 md:py-2 py-1 md:px-4 px-2 rounded-full border text-[10px] md:text-[12px]'>
				{badgeIcon}
				<AnimatedGradientText speed={0.5} colorFrom='#8A38F5' colorTo='#25D0FF'>
					<span className='text-[8px] md:text-[12px]'>{badgeLabel}</span>
				</AnimatedGradientText>
			</Badge>
			<TextFadeIn
				delay={0.3}
				as='h2'
				className={cn(
					" font-bold mb-0  bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight text-center",
					"text-sm sm:text-md md:text-3xl lg:text-4xl",
					"leading-[20px] md:leading-[40px] lg:leading-[50px] ",
				)}>
				{title}
			</TextFadeIn>
			{description && <TextFadeIn
				as='p'
				delay={0.3}
				className={cn(
					"md:text-md text-[10px] md:text-base text-center text-muted-foreground max-w-auto 2xl:max-w-[1200px] mx-auto",
				)}>
				{description}
			</TextFadeIn>}
		</div>
	);
};

const SectionLayout = forwardRef<HTMLDivElement, SectionLayoutProps>(
	(
		{ children, badgeLabel, badgeIcon, title, description, id, className },
		ref,
	) => {
		return (
			<section
				ref={ref}
				className={cn(
					"container  px-4  ",
					"py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 2xl:py-14",
					className,
				)}
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
