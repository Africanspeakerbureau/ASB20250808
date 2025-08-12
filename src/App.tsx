import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";

import Home from "./pages/Home";
import Find from "./pages/Find";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact"; // if you have a standalone page
import Book from "./pages/Book";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/find-speakers" element={<Find />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-a-speaker" element={<Book />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

