import { METHOD_HTML } from "@/lib/methodHtml";
export const metadata = { title: "Method" };
export default function Method() {
  return <div dangerouslySetInnerHTML={{ __html: METHOD_HTML }} />;
}
