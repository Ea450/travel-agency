import { useNavigate } from 'react-router';
import { logoutUser } from '~/appwrite/auth';

const pageLayout = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in')
    }
    return (
        <div>
            <button onClick={handleLogout} className="cursor-pointer">
                <img src="/assets/icons/logout.svg" alt="log Out" className="size-6" referrerPolicy="no-referrer" />
            </button>
            <button onClick={() => { navigate('/dashboard') }} className='cursor-pointer bg-light-100 hover:bg-light-200 text-dark-100 font-semibold px-4 py-2 rounded-md transition-colors duration-300'>
                Dashboard
            </button>
        </div>
    )
}

export default pageLayout