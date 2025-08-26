import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// import { useNavigate } from "react-router-dom";
import { authService } from "../auth/services/authService";
import { sendPost } from '@/shared/utils/logout';

export default function ErrorPermissionPage() {
    // const navigate = useNavigate();
    const heldleClick = () => {
        authService.logout();
        sendPost();
        // navigate('/login');
    }
    return (
        <>
            <Container>
                <Card sx={{ sx: 12, sm: 12, md: 12, lg: 12, xl: 12, mt: 5 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" color="error">
                            {/* Access denied. Please contact your system administrator. */}
                            Not eligible for the privilege
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Please contact Admin to request access rights.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {/* <Button size="small" onClick={() => window.location.href = "https://www.google.com"}>Go Back</Button> */}
                        <Button size="small" color="error" variant="contained" onClick={heldleClick}>Go Back</Button>
                    </CardActions>

                </Card>
            </Container>
        </>

    )
}


