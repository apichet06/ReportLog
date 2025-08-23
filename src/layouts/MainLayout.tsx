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
import type { User } from "./userType";
import LogoutIcon from '@mui/icons-material/Logout';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { sendPost } from "@/shared/utils/logout";
import Avatar from '@mui/material/Avatar';
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

const capitalize = (str?: string): string => {
    if (!str) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


const MainLayout = ({ children }: { children?: React.ReactNode }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const userDataString = localStorage.getItem("user");

    const resultData: User | null = userDataString
        ? JSON.parse(userDataString)
        : null;


    const hendleLogout = () => {
        // แจ้ง Logout ไปยัง CaaS
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {
            sendPost();
        }, 100);
    };


    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const menuItems = [
        { label: "Dashboard Chart", icon: <InsertChartIcon />, path: "/dashboard" },
        { label: "Report Log", icon: <InboxIcon />, path: "/reportlog" },
        { label: "Audit Report Log", icon: <DescriptionIcon />, path: "/saved_report" },
    ];

    const { setToken, setUser } = useAuthContext();
    const [isAppInitialized, setIsAppInitialized] = useState(false);

    const userId = getUserIdFromCookie();


    const handlelogin = useCallback(async () => {
        if (!userId) {
            setIsAppInitialized(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAppInitialized(false);
                sendPost()
            }
            return;
        }
        const response = await login({ user_name: userId });
        if (response.isSuccess) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.result));
            await setToken(response.token);
            await setUser(response.result);
            Cookies.remove("authToken")

        } else {
            navigate('/ErrorPermissionPage');
        }
        setIsAppInitialized(true);
    }, [navigate, setToken, setUser, userId]);

    useEffect(() => {
        handlelogin();
    }, [handlelogin, navigate]);

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
                        Application Log
                    </Typography>
                    <>
                        <List>
                            <ListItem>
                                {/* <img id="profile-img" src="https://fits/emp_pic/533566.jpg" alt="" className="img-login"></img> */}
                                <Avatar alt="Remy Sharp" src={`https://fits/emp_pic/${resultData?.emp_no}.jpg`} sx={{ mr: 2 }} />
                                <ListItemText>{capitalize(resultData?.firstname)} {capitalize(resultData?.lastname)} ({capitalize(resultData?.status)} {'>'} {resultData?.plant_Name}  )</ListItemText>
                            </ListItem>
                        </List>
                        <Button color="inherit" onClick={hendleLogout} startIcon={<LogoutIcon />}>Logout</Button>
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
                <DrawerHeader />
                {children ?? <Outlet />}
            </Main>
        </Box>
    );
};

export default MainLayout;
