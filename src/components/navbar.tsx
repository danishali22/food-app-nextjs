import { UserButton } from "@clerk/nextjs"
import MainNav from "./main-nav"

const Navbar = () => {
  return (
    <div className="border-b">
        <div className="flex h-16 items-center px-4">
            <p>Store switcher</p>
            {/* routes  */}

            <MainNav />

            {/* user profile  */}
            <div className="ml-auto">
                <UserButton />
            </div>
        </div>
    </div>
  )
}

export default Navbar