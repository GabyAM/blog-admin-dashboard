export function Header() {
    return (
        <header>
            <button className="new-post-button">New post</button>
            <div className="main-search-bar-section">
                <input
                    className="main-search-bar"
                    type="text"
                    placeholder="Search posts, users, comments"
                ></input>
            </div>
            <div className="user-card"></div>
        </header>
    );
}
