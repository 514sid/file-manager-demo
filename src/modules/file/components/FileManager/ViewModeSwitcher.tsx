import { TbLayoutGrid, TbLayoutList } from 'react-icons/tb'
import { useFileViewStore, FileViewMode } from '../../stores/useFileViewStore'

const options: { mode: FileViewMode, label: string, Icon: typeof TbLayoutGrid }[] = [
    { mode: 'cards', label: 'Cards', Icon: TbLayoutGrid },
    { mode: 'list', label: 'List', Icon: TbLayoutList },
]

export const ViewModeSwitcher = () => {
    const { mode, setMode } = useFileViewStore()

    return (
        <div className='flex items-center gap-0.5 rounded-full bg-gray-100 p-0.5 h-8'>
            { options.map(({ mode: value, label, Icon }) => {
                const active = mode === value

                return (
                    <button
                        key={ value }
                        type='button'
                        onClick={ () => setMode(value) }
                        title={ `${label} view` }
                        aria-pressed={ active }
                        className={ [
                            'flex items-center gap-1.5 h-7 px-3 rounded-full text-sm font-medium transition-colors cursor-pointer',
                            active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800',
                        ].join(' ') }
                    >
                        <Icon size={ 16 } />
                        { label }
                    </button>
                )
            }) }
        </div>
    )
}
