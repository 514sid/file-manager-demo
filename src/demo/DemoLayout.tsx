import { NavLink, Outlet } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { demoDb } from '@/demo/db'
import { TbFolder, TbCloudUpload, TbRefresh } from 'react-icons/tb'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
        'flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-colors',
        isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200',
    ].join(' ')

export const DemoLayout = () => {
    const routes = useWorkspaceRoutes()

    const handleReset = () => {
        demoDb.reset()
        window.location.reload()
    }

    return (
        <div className='min-h-screen bg-gray-100'>
            <header className='h-20 px-4 flex items-center justify-between gap-4'>
                <div className='flex items-center gap-6'>
                    <div className='text-lg font-semibold text-gray-900'>
                        File Manager Demo
                    </div>
                    <nav className='flex items-center gap-2'>
                        <NavLink
                            to={ routes.files }
                            end
                            className={ navLinkClass }
                        >
                            <TbFolder size={ 18 } />
                            Files
                        </NavLink>
                        <NavLink
                            to={ routes.filesUpload }
                            className={ navLinkClass }
                        >
                            <TbCloudUpload size={ 18 } />
                            Upload
                        </NavLink>
                    </nav>
                </div>
                <button
                    onClick={ handleReset }
                    className='flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors'
                    title='Restore the original sample data'
                >
                    <TbRefresh size={ 18 } />
                    Reset demo data
                </button>
            </header>
            <main className='px-4'>
                <Outlet />
            </main>
        </div>
    )
}
