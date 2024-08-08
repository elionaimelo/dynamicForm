export interface SchemaField {
  as: string;
  name: string;
  label: string;
  children?: Array<{
    text: string;
    value?: string;
    type?: string;
    color?: string;
    tailwindClasses?: string;
    position?: "left" | "center" | "right";
    action?: () => void;
  }>;
  rules?: (value: any) => boolean | string;
  columns: number;
  [key: string]: any;
}

export interface Schema {
  fields: SchemaField[];
}
