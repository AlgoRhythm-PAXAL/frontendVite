import NumberShowingCard from '../NUmberShowingCard'

const UserCount = () => {
    return (
        <div className="flex flex-col justify-center items-stretch gap-2 w-fit h-fit">
            <NumberShowingCard title="Total Customers" number="1000" since="last year" type="Customer" />
            <NumberShowingCard title="Total Drivers" number="1000" since="last year" type="Driver" />
            <NumberShowingCard title="Total Admins" number="1000" since="last year" type="Admin" />
            <NumberShowingCard title="Total Staffs" number="1000" since="last year" type="Staff" />
        </div>
    )
}

export default UserCount