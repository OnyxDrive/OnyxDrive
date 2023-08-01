import React from 'react'

type ButtonStyle = 'primary' | 'secondary'

export type AppButtonProps = {
	buttonStyle?: ButtonStyle
	icon?: JSX.Element
} & React.ComponentProps<'button'>

export default function AppButton({ buttonStyle, icon, ...props }: AppButtonProps) {
	return (
		<button type="button" {...props} className="rounded-xl bg-red-500 p-1 hover:bg-red-900">
			{icon}
		</button>
	)
}
