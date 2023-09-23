import Link from "next/link";
import classes from "./app_header.module.css";
import { m } from "framer-motion";
export default function AppHeader() {
  return (
    <m.div
      className={`${classes.header} app-padding root`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5, delay: 5 }}
    >
      <HeaderLink>Home</HeaderLink>
      <HeaderLink href="#myname">About Me</HeaderLink>
      <HeaderLink>Start Project</HeaderLink>
    </m.div>
  );
}

function HeaderLink({ href = "#", children }) {
  return (
    <Link href={href} className={classes.link}>
      {children}
    </Link>
  );
}
