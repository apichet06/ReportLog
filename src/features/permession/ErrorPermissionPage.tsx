import { Button, Card, CardActions, CardContent, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../auth/services/authService";

export default function ErrorPermissionPage() {
    const navigate = useNavigate();
    const heldleClick = () => {
        authService.logout();
        navigate('/login');
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
                            Please contact it to request access rights.
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
