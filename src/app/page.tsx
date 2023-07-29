import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useCallback, useEffect, useState } from 'react'
import useIsMountedRef from '../utils/useIsMountedRef'
import { DirectoryData, FileMetaData } from '../common/folderTypes'
import { DataTable } from '../components/files/data-table'
import { FileListElement, columns } from '../components/files/columns'
import { NextPageWithLayout } from './_app'
import AppLayout from '../components/layout/AppLayout'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPageWithLayout = () => {
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

	const data: FileListElement[] =
		files?.map((v) => ({ id: v.basename, name: v.basename })) ?? []
	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<div>Files:</div>
			<div className="container mx-auto py-10">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
		// <div className='flex flex-col'>
		//   <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
		//     <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
		//       <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
		//         <table className='min-w-full divide-y divide-gray-200'>
		//           <thead className='bg-gray-50'>
		//             <tr>
		//               <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
		//                 Name
		//               </th>
		//               <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
		//                 Type
		//               </th>
		//               <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
		//                 Size
		//               </th>
		//               <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
		//                 Last Modified
		//               </th>
		//             </tr>
		//           </thead>
		//           <tbody className='bg-white divide-y divide-gray-200'>
		//             {files?.map((file, idx) => (
		//               <tr
		//                 key={idx}
		//                 className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
		//               >
		//                 <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
		//                   {file.basename}
		//                 </td>
		//                 <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
		//                   {file.file_type}
		//                 </td>
		//                 <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
		//                   {file.size}
		//                 </td>
		//                 <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
		//                   {file.last_modified
		//                     ? new Date(
		//                         file.last_modified.secs_since_epoch * 1000
		//                       ).toLocaleString()
		//                     : 'N/A'}
		//                 </td>
		//               </tr>
		//             ))}
		//           </tbody>
		//         </table>
		//       </div>
		//     </div>
		//   </div>
		// </div>
	)
}

// eslint-disable-next-line no-undef
Home.getLayout = function getLayout(page: JSX.Element) {
	return <AppLayout>{page}</AppLayout>
}

export default Home
