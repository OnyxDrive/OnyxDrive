import { convertBytesToMBorGB } from '../../utils/storage-utils'
import AppProgress from '../core/progress/AppProgress'

type StorageWidgetProps = {
  plan: string
  used: number
  storage: number
}

export default function StorageWidget({ plan, used, storage }: StorageWidgetProps) {
  // calculate the percentage of storage used
  const storageUsedPercentage = Math.round((used / storage) * 100)
  const { unit: usedUnit, value: usedValue } = convertBytesToMBorGB(used)
  const { unit: storageUnit, value: storageValue } = convertBytesToMBorGB(storage)

  return (
    <div className="relative mb-auto flex h-20 w-full flex-col justify-between p-4 sm:h-24 sm:w-3/4 md:w-1 lg:h-32 lg:w-2/3 xl:w-3/4">
      <div className="text-xl font-semibold text-white">{plan}</div>
      <AppProgress progress={storageUsedPercentage} />
      <div className="text-base font-light text-zinc-500">
        {usedValue} {usedUnit} of {storageValue} {storageUnit} used
      </div>
    </div>
  )
}
