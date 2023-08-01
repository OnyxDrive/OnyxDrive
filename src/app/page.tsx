'use client'
import { useCallback, useEffect, useState } from 'react'
import useIsMountedRef from '../utils/useIsMountedRef'
import { DirectoryData, FileMetaData } from '../common/folderTypes'
import { DataTable } from '../components/files/data-table'
import { FileListElement, columns } from '../components/files/columns'
import AppLayout from '../components/layout/AppLayout'

const Home = () => {
	const isMountedRef = useIsMountedRef()
	const [files, setFiles] = useState<FileMetaData[]>()
	const getFiles = useCallback(async () => {
		const { path } = require('@tauri-apps/api')
		const { invoke } = require('@tauri-apps/api')
		const homePath = await path.homeDir()
		const data: DirectoryData = await invoke('read_directory', {
			dir: homePath,
		})
		setFiles(data.files)
		console.log(files)
	}, [isMountedRef])

	useEffect(() => {
		getFiles()
	}, [getFiles])

	const data: FileListElement[] = files?.map((v) => ({ id: v.basename, name: v.basename })) ?? []
	return (
		<AppLayout>
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div>Files:</div>
				<div className="container mx-auto py-10">
					<DataTable columns={columns} data={data} />
				</div>
			</div>
		</AppLayout>
	)
}

export default Home
