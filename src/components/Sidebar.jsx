import { NavLink } from "react-router-dom";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-title">
                S3 Console
            </div>

            <NavLink
                to="/dashboard"
                className="sidebar-link"
            >
                📊 Dashboard
            </NavLink>

            <NavLink
                to="/buckets"
                className="sidebar-link"
            >
                🪣 Buckets
            </NavLink>

            <NavLink
                to="/analytics"
                className="sidebar-link"
            >
                📈 Analytics
            </NavLink>

            <NavLink
                to="/about"
                className="sidebar-link"
            >
                ℹ️ About S3
            </NavLink>

        </aside>

    );

}

export default Sidebar;