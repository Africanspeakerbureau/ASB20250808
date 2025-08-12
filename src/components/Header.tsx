import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 flex flex-wrap gap-4 text-sm">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/find-speakers">Find a Speaker</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/book-a-speaker">Book a Speaker</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </div>
    </header>
  );
}

