import tailwindConfig from "../../tailwind.config";
export const colors = tailwindConfig.theme.extend.colors;
export const ColorFilters = {
  primary:
    "invert(13%) sepia(19%) saturate(7467%) hue-rotate(233deg) brightness(71%) contrast(116%)",
  secondary:
    "invert(19%) sepia(68%) saturate(5325%) hue-rotate(355deg) brightness(87%) contrast(99%)",
  placeholder:
    "invert(36%) sepia(99%) saturate(0%) hue-rotate(159deg) brightness(97%) contrast(101%)",
  primaryDark:
    "invert(9%) sepia(16%) saturate(6075%) hue-rotate(226deg) brightness(87%) contrast(116%)",
  primaryLight:
    "invert(30%) sepia(9%) saturate(3705%) hue-rotate(202deg) brightness(90%) contrast(93%)",
  accent1:
    "invert(62%) sepia(92%) saturate(4384%) hue-rotate(218deg) brightness(102%) contrast(103%)",
  black2:
    "invert(7%) sepia(7%) saturate(1082%) hue-rotate(214deg) brightness(97%) contrast(90%)",
  disabled:
    "invert(44%) sepia(31%) saturate(0%) hue-rotate(209deg) brightness(84%) contrast(82%)",
  lightGray:
    "invert(100%) sepia(0%) saturate(5121%) hue-rotate(172deg) brightness(107%) contrast(70%)",
};
