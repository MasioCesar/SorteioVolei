import Link from "next/link";

const Header = () => {

    return (
        <div className="bg-[#121214]">
            <div className="p-2 flex justify-center">
                <Link href="/">
                    <img src="/voleifisio.png" alt="VoleiFisio" className="w-36 h-auto" />
                </Link>
            </div>
        </div>
    )


}

export default Header;