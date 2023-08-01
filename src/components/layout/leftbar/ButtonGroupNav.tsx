import { useRouter } from 'next/navigation'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'

type Props = {}

export default function ButtonGroupNav({}: Props) {
	const router = useRouter()

	return (
		<div className="flex-grow">
			<Tabs defaultValue="account" className="flex flex-col">
				<TabsList className="grid-cols-flex grid w-full flex-col">
					<TabsTrigger
						className="hover:bg-red-600"
						onClick={() => router.push('/files')}
						value="files"
					>
						All Files
					</TabsTrigger>
					<TabsTrigger
						className="hover:bg-red-600"
						onClick={() => router.push('/files')}
						value="shares"
					>
						Shares & Activities
					</TabsTrigger>
					<TabsTrigger
						className="hover:bg-red-600"
						onClick={() => router.push('/files')}
						value="tags"
					>
						Tags
					</TabsTrigger>
					<TabsTrigger
						className="hover:bg-red-600"
						onClick={() => router.push('/')}
						value="deleted"
					>
						Deleted Files
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	)
}
