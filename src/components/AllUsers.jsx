import { Admins } from './Admins';
import { RegularUsers } from './RegularUsers';
import { BannedUsers } from './BannedUsers';

export function AllUsers() {
    return (
        <>
            <RegularUsers></RegularUsers>
            <Admins></Admins>
            <BannedUsers></BannedUsers>
        </>
    );
}
