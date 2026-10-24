import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Buckets from "./pages/Buckets";
import BucketDetails from "./pages/BucketDetails";
import Analytics from "./pages/Analytics";
import About from "./pages/About";

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <div className="app-layout">

                <Sidebar />

                <main className="main-content">

                    <Routes>

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/buckets"
                            element={<Buckets />}
                        />

                        <Route
                            path="/bucket/:id"
                            element={<BucketDetails />}
                        />

                        <Route
                            path="/analytics"
                            element={<Analytics />}
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                    </Routes>

                </main>

            </div>

        </BrowserRouter>

    );

}

export default App;