import SignupRoute from "@/components/signup";

export default function LoginRoute(props) {
  return SignupRoute({ isSignIn: false, ...props });
}
