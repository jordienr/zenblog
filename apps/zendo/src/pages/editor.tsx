import { ZendoEditor } from "@/components/Editor/ZendoEditor";

const Editor = () => <ZendoEditor onSave={() => console.log("save")} />;

export default Editor;
