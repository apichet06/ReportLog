// src/layouts/MainLayout.tsx
import { useCallback, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
import MuiAppBar, {
    type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from '@mui/icons-material/Mail';
import DescriptionIcon from "@mui/icons-material/Description";
import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { login } from "@/features/auth/services/authService";
import { getUserIdFromCookie } from "@/features/auth/services/authFuntion";
import { useAuthContext } from "@/shared/context/AuthContext";
import Cookies from "js-cookie";
import Button from '@mui/material/Button';
const drawerWidth = 240;

/* ---------- styled components ---------- */
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
}));

interface StyledAppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<StyledAppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));


const MainLayout = ({ children }: { children?: React.ReactNode }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const hendleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {

            navigate('/login');
        }, 100); // delay สั้น ๆ เพื่อให้ลบเสร็จแน่นอน
    };


    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const menuItems = [
        { label: "Report Log", icon: <InboxIcon />, path: "/reportlog" },
        { label: "Save Report", icon: <DescriptionIcon />, path: "/saved_report" },
    ];

    const { setToken, setUser } = useAuthContext();
    const [isAppInitialized, setIsAppInitialized] = useState(false);

    const userId = getUserIdFromCookie();


    const handlelogin = useCallback(async () => {
        if (!userId) {
            setIsAppInitialized(true);
            return;
        }
        const response = await login({ username: userId });
        if (response.isSuccess) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.result));
            await setToken(response.token);
            await setUser(response.result);
            await Cookies.remove("authToken");
            await navigate('/reportlog');
        } else {
            navigate('/ErrorPermissionPage');
        }
        setIsAppInitialized(true);
    }, [navigate, setToken, setUser, userId]);

    useEffect(() => {
        handlelogin();
    }, [handlelogin]);

    // ระหว่างรอ login เสร็จ
    if (!isAppInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* ---------- Top AppBar ---------- */}
            <AppBar position="fixed" open={open} color="success">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, ...(open && { display: "none" }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Report Log
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                    <>
                        {/* <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Mr.Apichet Singnakrong</MenuItem>
                            <MenuItem onClick={hendleLogout}>Logout</MenuItem>
                        </Menu> */}
                        <List>
                            <ListItem>
                                <ListItemText>Mr.Apichet Singnakrong</ListItemText>
                            </ListItem>
                        </List>
                        <Button color="inherit" onClick={hendleLogout}>Logout</Button>

                    </>
                </Toolbar>
            </AppBar>

            {/* ---------- Side Drawer ---------- */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {menuItems.map(({ label, icon, path }) => (
                        <ListItem key={label} disablePadding>
                            <ListItemButton
                                component={RouterLink}
                                to={path}
                                onClick={handleDrawerClose}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />


            </Drawer>

            {/* ---------- Main Content ---------- */}
            <Main open={open}>
                <DrawerHeader /> {/* pushes content below AppBar */}
                {children ?? <Outlet />}
            </Main>
        </Box>
    );
};

export default MainLayout;
