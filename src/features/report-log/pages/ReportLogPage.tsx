import { useState } from "react";
import { Container } from "@mui/material";
import ReportLogToolbar from "../components/ReportLogToolbar";
import ReportLogDialog from "../components/ReportLogDialog";
// import ReportLogTabs from "../components/ReportLogTabs";

export default function ReportLogPages() {
    const [textSearch, setTextSearch] = useState("");
    const [valueRedio, setValueRedio] = useState("Usual");
    const [comment, setComment] = useState("");
    const [open, setOpen] = useState(false);

    const handleSearch = () => { console.log("Search", textSearch); };
    const handleClear = () => setTextSearch("");
    const handleClose = () => setOpen(false);
    const handleSubmit = () => {
        console.log("Submit", { valueRedio, comment });
        setOpen(false);
    };

    return (
        <Container maxWidth="xl">
            <ReportLogToolbar
                textSearch={textSearch}
                onSearchChange={setTextSearch}
                onSearchClick={handleSearch}
                onClearClick={handleClear}
            />
            {/* <ReportLogTabs /> */}
            <ReportLogDialog
                open={open}
                valueRedio={valueRedio}
                comment={comment}
                onClose={handleClose}
                onSubmit={handleSubmit}
                onRadioChange={setValueRedio}
                onCommentChange={setComment}
            />
        </Container>
    );
}
