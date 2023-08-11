import SignUp from "./signup";

export default function SignIn(props) {
  return SignUp({ isSignIn: true, ...props });
}
