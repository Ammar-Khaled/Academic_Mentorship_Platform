import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Calendar01Icon,
	CodeIcon,
	MentorIcon,
	Progress01Icon,
	Search01Icon,
	StudentIcon,
	TeacherIcon,
	User02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getHomePathForRole, UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const heroButtonClass =
	'h-14 rounded-xl px-8 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*="size-"])]:size-5';

const landingButtonClass =
	'h-11 rounded-xl px-6 text-sm has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*="size-"])]:size-4';

const studentButtonClass =
	"border-transparent bg-sky-400 text-white hover:bg-sky-500 dark:bg-sky-400 dark:hover:bg-sky-500";

const mentorButtonClass =
	"border-transparent bg-violet-400 text-white hover:bg-violet-500 dark:bg-violet-400 dark:hover:bg-violet-500";

const studentFeatures = [
	{
		icon: Search01Icon,
		title: "Discover mentors",
		description:
			"Filter by stack, rating, and availability to find the right expert.",
	},
	{
		icon: Calendar01Icon,
		title: "Book focused sessions",
		description:
			"Reserve 45-minute slots for code reviews, pair programming, or mock interviews.",
	},
	{
		icon: CodeIcon,
		title: "Actionable feedback",
		description:
			"Receive structured evaluations that help you improve faster.",
	},
	{
		icon: Progress01Icon,
		title: "Track your progress",
		description:
			"Revisit session history, mentor notes, and feedback from your dashboard.",
	},
];

const mentorFeatures = [
	{
		icon: User02Icon,
		title: "Build your profile",
		description:
			"Showcase your stack, bio, and expertise to attract the right students.",
	},
	{
		icon: Calendar01Icon,
		title: "Set your availability",
		description:
			"Define weekly windows and let students book sessions that fit your schedule.",
	},
	{
		icon: TeacherIcon,
		title: "Run review sessions",
		description:
			"Guide developers through code reviews, pair programming, and mock interviews.",
	},
	{
		icon: MentorIcon,
		title: "Grow your impact",
		description:
			"Monitor bookings, add evaluation notes, and build your mentor reputation.",
	},
];

const studentSteps = [
	{
		step: "01",
		title: "Create a student account",
		body: "Sign up and set up your learning profile.",
	},
	{
		step: "02",
		title: "Find the right mentor",
		body: "Browse experts by stack, keyword, and rating.",
	},
	{
		step: "03",
		title: "Book and grow",
		body: "Schedule a session and apply feedback to your work.",
	},
];

const mentorSteps = [
	{
		step: "01",
		title: "Join as a mentor",
		body: "Register and share your technical background.",
	},
	{
		step: "02",
		title: "Set your schedule",
		body: "Configure availability and get discovered by students.",
	},
	{
		step: "03",
		title: "Mentor with purpose",
		body: "Deliver reviews, notes, and guidance in every session.",
	},
];

function FeatureCard({ icon, title, description, iconClassName, className }) {
	return (
		<div
			className={cn(
				"flex gap-4 rounded-2xl border bg-background/80 p-5 shadow-sm transition-colors hover:bg-background",
				className,
			)}
		>
			<div
				className={cn(
					"inline-flex size-12 shrink-0 items-center justify-center rounded-xl",
					iconClassName,
				)}
			>
				<HugeiconsIcon icon={icon} strokeWidth={2} className="size-6" />
			</div>
			<div className="space-y-1.5">
				<h4 className="text-base font-semibold">{title}</h4>
				<p className="text-base leading-relaxed text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}

const featureThemes = {
	student: {
		panel: "border-sky-200 bg-linear-to-br from-sky-50 via-background to-background dark:border-sky-800/40 dark:from-sky-950/30",
		headerIcon: "bg-sky-400 text-white shadow-sm shadow-sky-400/25",
		badge: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-300",
		label: "text-sky-600 dark:text-sky-300",
		icon: "bg-sky-100 text-sky-500 dark:bg-sky-900/40 dark:text-sky-300",
		divider: "bg-sky-200 dark:bg-sky-800/50",
	},
	mentor: {
		panel: "border-violet-200 bg-linear-to-br from-violet-50 via-background to-background dark:border-violet-800/40 dark:from-violet-950/30",
		headerIcon: "bg-violet-400 text-white shadow-sm shadow-violet-400/25",
		badge: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300",
		label: "text-violet-600 dark:text-violet-300",
		icon: "bg-violet-100 text-violet-500 dark:bg-violet-900/40 dark:text-violet-300",
		divider: "bg-violet-200 dark:bg-violet-800/50",
	},
};

function FeatureBlock({
	icon,
	badge,
	title,
	description,
	features,
	theme,
	cta,
}) {
	const styles = featureThemes[theme];

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-3xl border-2 p-6 sm:p-8",
				styles.panel,
			)}
		>
			<div
				aria-hidden
				className={cn(
					"pointer-events-none absolute -right-12 -top-12 size-40 rounded-full blur-3xl",
					theme === "student" ? "bg-sky-300/20" : "bg-violet-300/20",
				)}
			/>

			<div className="relative space-y-6">
				<div className="space-y-4">
					<span
						className={cn(
							"inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
							styles.badge,
						)}
					>
						{badge}
					</span>

					<div className="flex items-start gap-4">
						<div
							className={cn(
								"inline-flex size-14 shrink-0 items-center justify-center rounded-2xl",
								styles.headerIcon,
							)}
						>
							<HugeiconsIcon
								icon={icon}
								strokeWidth={2}
								className="size-7"
							/>
						</div>
						<div className="space-y-2 pt-1">
							<h3 className="font-heading text-2xl font-semibold tracking-tight">
								{title}
							</h3>
							<p className="max-w-xl text-base leading-relaxed text-muted-foreground">
								{description}
							</p>
						</div>
					</div>
				</div>

				<div className={cn("h-px w-full", styles.divider)} />

				<div className="grid gap-4">
					{features.map(feature => (
						<FeatureCard
							key={feature.title}
							{...feature}
							iconClassName={styles.icon}
						/>
					))}
				</div>

				{cta}
			</div>
		</div>
	);
}

function AudiencePath({ icon, label, steps, accent }) {
	return (
		<div
			className={cn(
				"rounded-3xl border bg-linear-to-br p-6 sm:p-8",
				accent,
			)}
		>
			<div className="mb-6 flex items-center gap-3">
				<div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
					<HugeiconsIcon
						icon={icon}
						strokeWidth={2}
						className="size-6"
					/>
				</div>
				<h3 className="font-heading text-xl font-semibold">{label}</h3>
			</div>
			<div className="grid gap-4">
				{steps.map(item => (
					<div
						key={item.step}
						className="flex gap-4 rounded-2xl border bg-background/80 p-5 shadow-sm"
					>
						<span className="font-heading text-2xl font-semibold text-primary/40">
							{item.step}
						</span>
						<div>
							<p className="text-base font-medium">
								{item.title}
							</p>
							<p className="mt-1.5 text-base text-muted-foreground">
								{item.body}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function HomePage() {
	const { isAuthenticated, user } = useAuthStore();

	return (
		<div className="flex flex-col gap-16">
			<section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/8 via-background to-background px-6 py-12 sm:px-10 sm:py-16">
				<div
					aria-hidden
					className="pointer-events-none absolute -right-10 top-0 size-56 rounded-full bg-primary/10 blur-3xl"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -bottom-16 left-1/3 size-72 rounded-full bg-primary/5 blur-3xl"
				/>

				<div className="relative mx-auto max-w-4xl space-y-8 text-center">
					<h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
						Where developers learn and mentors lead
					</h1>
					<p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
						Students book expert code reviews. Mentors share their
						craft, manage availability, and guide the next
						generation — all on one platform.
					</p>

					<div className="flex flex-wrap items-center justify-center gap-4">
						{isAuthenticated ? (
							<Button
								size="lg"
								className={heroButtonClass}
								asChild
							>
								<Link to={getHomePathForRole(user.role)}>
									Go to dashboard
								</Link>
							</Button>
						) : (
							<>
								<Button
									size="lg"
									className={cn(
										heroButtonClass,
										studentButtonClass,
									)}
									asChild
								>
									<Link
										to={`/register?role=${UserRole.STUDENT}`}
									>
										<HugeiconsIcon
											icon={StudentIcon}
											strokeWidth={2}
											className="size-5"
											data-icon="inline-start"
										/>
										Join as student
									</Link>
								</Button>
								<Button
									size="lg"
									className={cn(
										heroButtonClass,
										mentorButtonClass,
									)}
									asChild
								>
									<Link
										to={`/register?role=${UserRole.MENTOR}`}
									>
										<HugeiconsIcon
											icon={MentorIcon}
											strokeWidth={2}
											className="size-5"
											data-icon="inline-start"
										/>
										Become a mentor
									</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</section>

			{!isAuthenticated && (
				<section className="grid gap-4 sm:grid-cols-2">
					<Card className="border-sky-200 bg-linear-to-br from-sky-50 to-transparent dark:border-sky-800/40 dark:from-sky-950/20">
						<CardHeader className="gap-4">
							<div className="inline-flex size-11 items-center justify-center rounded-xl bg-sky-100 text-sky-500 dark:bg-sky-900/40 dark:text-sky-300">
								<HugeiconsIcon
									icon={StudentIcon}
									strokeWidth={2}
									className="size-5"
								/>
							</div>
							<CardTitle className="text-xl">
								For students
							</CardTitle>
							<CardDescription className="text-base leading-relaxed">
								Level up with structured 45-minute reviews from
								engineers who have been where you are.
							</CardDescription>
							<Button
								size="lg"
								className={cn(
									landingButtonClass,
									studentButtonClass,
								)}
								asChild
							>
								<Link to={`/register?role=${UserRole.STUDENT}`}>
									Find a mentor
								</Link>
							</Button>
						</CardHeader>
					</Card>

					<Card className="border-violet-200 bg-linear-to-br from-violet-50 to-transparent dark:border-violet-800/40 dark:from-violet-950/20">
						<CardHeader className="gap-4">
							<div className="inline-flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-500 dark:bg-violet-900/40 dark:text-violet-300">
								<HugeiconsIcon
									icon={MentorIcon}
									strokeWidth={2}
									className="size-5"
								/>
							</div>
							<CardTitle className="text-xl">
								For mentors
							</CardTitle>
							<CardDescription className="text-base leading-relaxed">
								Turn your expertise into impact — set your
								hours, mentor on your terms, and help developers
								grow.
							</CardDescription>
							<Button
								size="lg"
								className={cn(
									landingButtonClass,
									mentorButtonClass,
								)}
								asChild
							>
								<Link to={`/register?role=${UserRole.MENTOR}`}>
									Start mentoring
								</Link>
							</Button>
						</CardHeader>
					</Card>
				</section>
			)}

			<section className="space-y-10">
				<div className="space-y-3 text-center">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
						Platform features
					</p>
					<h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
						Built for students and mentors alike
					</h2>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground">
						Two tailored experiences on one platform — pick the path
						that fits you.
					</p>
				</div>

				<div className="grid gap-8 xl:gap-10">
					<FeatureBlock
						theme="student"
						icon={StudentIcon}
						badge="For students"
						title="Learn with expert guidance"
						description="Everything you need to find mentors, book sessions, and grow through structured feedback."
						features={studentFeatures}
						cta={
							!isAuthenticated && (
								<Button
									size="lg"
									className={cn(
										landingButtonClass,
										"mt-2",
										studentButtonClass,
									)}
									asChild
								>
									<Link
										to={`/register?role=${UserRole.STUDENT}`}
									>
										Start learning
									</Link>
								</Button>
							)
						}
					/>

					<FeatureBlock
						theme="mentor"
						icon={MentorIcon}
						badge="For mentors"
						title="Lead the next generation"
						description="Tools to showcase your expertise, manage your schedule, and deliver meaningful code reviews."
						features={mentorFeatures}
						cta={
							!isAuthenticated && (
								<Button
									size="lg"
									className={cn(
										landingButtonClass,
										"mt-2",
										mentorButtonClass,
									)}
									asChild
								>
									<Link
										to={`/register?role=${UserRole.MENTOR}`}
									>
										Start mentoring
									</Link>
								</Button>
							)
						}
					/>
				</div>
			</section>

			<section className="space-y-6">
				<div className="space-y-3 text-center">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
						How it works
					</p>
					<h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
						Two paths, one platform
					</h2>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<AudiencePath
						icon={StudentIcon}
						label="Student journey"
						steps={studentSteps}
						accent="from-sky-100/90 to-transparent dark:from-sky-950/40"
					/>
					<AudiencePath
						icon={MentorIcon}
						label="Mentor journey"
						steps={mentorSteps}
						accent="from-violet-100/90 to-transparent dark:from-violet-950/40"
					/>
				</div>
			</section>

			{!isAuthenticated && (
				<section className="grid gap-4 sm:grid-cols-2">
					<div className="rounded-3xl border border-sky-200 bg-linear-to-br from-sky-50 to-sky-100/80 px-6 py-10 sm:px-8 dark:border-sky-800/40 dark:from-sky-950/40 dark:to-sky-900/20">
						<div className="space-y-5">
							<HugeiconsIcon
								icon={StudentIcon}
								strokeWidth={2}
								className="size-7 text-sky-500 dark:text-sky-300"
							/>
							<h2 className="font-heading text-2xl font-semibold">
								Ready to learn?
							</h2>
							<p className="text-base text-muted-foreground">
								Find mentors, book sessions, and grow with real
								feedback.
							</p>
							<Button
								size="lg"
								className={cn(
									landingButtonClass,
									studentButtonClass,
								)}
								asChild
							>
								<Link to={`/register?role=${UserRole.STUDENT}`}>
									Join as student
								</Link>
							</Button>
						</div>
					</div>

					<div className="rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50 to-violet-100/80 px-6 py-10 sm:px-8 dark:border-violet-800/40 dark:from-violet-950/40 dark:to-violet-900/20">
						<div className="space-y-5">
							<HugeiconsIcon
								icon={MentorIcon}
								strokeWidth={2}
								className="size-7 text-violet-500 dark:text-violet-300"
							/>
							<h2 className="font-heading text-2xl font-semibold">
								Ready to mentor?
							</h2>
							<p className="text-base text-muted-foreground">
								Share your expertise, manage your schedule, and
								guide developers forward.
							</p>
							<Button
								size="lg"
								className={cn(
									landingButtonClass,
									mentorButtonClass,
								)}
								asChild
							>
								<Link to={`/register?role=${UserRole.MENTOR}`}>
									Join as mentor
								</Link>
							</Button>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
