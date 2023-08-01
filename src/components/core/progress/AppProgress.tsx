import React from 'react'
import * as Progress from '@radix-ui/react-progress'

type ProgressProps = {
	progress: number
}

export default function AppProgress({ progress }: ProgressProps) {
	return (
		<Progress.Root
			className="relative h-[25px] w-[300px] overflow-hidden rounded-full bg-zinc-700"
			style={{
				transform: 'translateZ(0)',
			}}
			value={progress}
		>
			<Progress.Indicator
				className="duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full bg-white transition-transform"
				style={{ transform: `translateX(-${100 - progress}%)` }}
			/>
		</Progress.Root>
	)
}
