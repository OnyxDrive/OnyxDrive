'use client'

import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

export default function Greet() {
	useEffect(() => {
		invoke<string>('greet', { name: 'Next.js' }).then(console.log).catch(console.error)
	}, [])

	// Necessary because we will have to use Greet as a component later.
	return <></>
}
