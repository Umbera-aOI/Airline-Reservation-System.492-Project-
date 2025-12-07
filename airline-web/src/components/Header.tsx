import {useState, type MouseEvent} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    MenuItem,
    Menu,
    Box
} from '@mui/material';
import {Menu as MenuIcon} from '@mui/icons-material';
import LoginDialog from "@/components/LoginDialog.tsx";
import LogoutDialog from "@/components/LogoutDialog.tsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useRouter} from "@tanstack/react-router";
import {useAuth} from "@/api/auth.ts";

export default function Header() {
    const jwtToken = useAuth()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const router = useRouter()

    const open = !!anchorEl;
    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickLogin = () => {
        setLoginDialogOpen(true);
    }
    const handleCloseLoginDialog = () => {
        setLoginDialogOpen(false);
    };
    const handleClickLogout = () => {
        setLogoutDialogOpen(true);
    }
    const handleCloseLogoutDialog = () => {
        setLogoutDialogOpen(false);
    };
    const handleClickBookFlight = () => {
        setAnchorEl(null);
        router.navigate({
            to: '/'
        });
    };
    const handleClickFindReservation = () => {
        setAnchorEl(null);
        router.navigate({
            to: '/reservations/search'
        });
    };
    const handleViewAgentReservations = () => {
        setAnchorEl(null);
        router.navigate({
            to: '/reservations/agent'
        });
    };
    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleClickMenu}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClickBookFlight}>Book Flight</MenuItem>
                        <MenuItem onClick={handleClickFindReservation}>Find Reservation</MenuItem>
                        {!!jwtToken &&
                            <MenuItem onClick={handleViewAgentReservations}>View Agent Reservations</MenuItem>
                        }
                    </Menu>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Airline Reservation System
                    </Typography>
                    {!!jwtToken ?
                        <IconButton color='inherit' onClick={handleClickLogout}><AccountCircleIcon/></IconButton> :
                        <Button color='inherit' onClick={handleClickLogin}>Login</Button>}
                </Toolbar>
            </AppBar>
            <LoginDialog open={loginDialogOpen} onClose={handleCloseLoginDialog}/>
            <LogoutDialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}/>
        </Box>
    );
}