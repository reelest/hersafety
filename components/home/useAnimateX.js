import { useTransform } from "framer-motion";

export default function useAnimateX(translateY) {
  return useTransform(translateY, [1, 0.5, -0.5, -1], [-50, 0, 0, -50]);
}
