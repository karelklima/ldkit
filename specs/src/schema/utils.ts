const X_NAMESPACE = "http://x/";

export const x = (s: string) => `${X_NAMESPACE}${s}`;

export type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;
