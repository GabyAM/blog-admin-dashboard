import { Admins } from './Admins';
import { RegularUsers } from './RegularUsers';
import { BannedUsers } from './BannedUsers';

export function Users({ search }) {
    return (
        <>
            <RegularUsers></RegularUsers>
            <Admins></Admins>
            <BannedUsers></BannedUsers>
        </>
    );
}
