import useMediaQuery from '@mui/material/useMediaQuery';
import HistoryTable from "../components/HistoryTable";
import { useHistory } from "../hook/useHistory";


export default function History() {
    const { row } = useHistory();

    const isBetween1201And1536 = useMediaQuery("(min-width:1201px) and (max-width:1536px)");
    const isAbove1537 = useMediaQuery("(min-width:1537px)");
    return (
        <>
            <h2>History Report</h2>
            <HistoryTable
                rows={row}
                isBetween1201And1536={isBetween1201And1536}
                isAbove1537={isAbove1537}
            />
        </>
    )
}
