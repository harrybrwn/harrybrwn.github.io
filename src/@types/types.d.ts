declare module "*/icons.json" {
  const value: {
    [key: string]: {
      alt: string;
      title: string;
      href: string;
      src?: string;
      exclude?: boolean;
    };
  };
  export default value;
}
