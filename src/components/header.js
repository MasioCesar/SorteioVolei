import Link from "next/link";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const Header = () => {

    return (
        <div className="bg-[#121214] w-full py-2 flex items-center justify-between border-b border-gray-600 mb-1">
            <div className="ml-4">
                <Link href="/gameHistory">
                    <CalendarMonthOutlinedIcon className="text-yellow-300" style={{ fontSize: 40 }} />
                </Link>
            </div>

            <div className="flex-grow flex justify-center mr-14">
                <Link href="/">
                    <img src="/voleifisio.png" alt="VoleiFisio" className="w-20" />
                </Link>
            </div>
            <div>
                <Link href="/addPlayerForm">
                    <PersonAddAltIcon className="text-gray-300" style={{ fontSize: 40 }} />
                </Link>
            </div>
        </div>
    );
}

export default Header;
