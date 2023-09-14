export default function hasProp(ctx, prop) {
  return Object.prototype.hasOwnProperty.call(ctx, prop);
}
