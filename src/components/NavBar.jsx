export function NavBar() {
    return (
        <aside className="main-navbar flex-col">
            <div className="logo-container">
                <img src="/logo.png"></img>
            </div>
            <nav>
                <ul className="sections-list flex-col">
                    <li>Overview</li>
                    <li>Posts</li>
                    <li>Users</li>
                    <li>Comments</li>
                </ul>
            </nav>
        </aside>
    );
}
