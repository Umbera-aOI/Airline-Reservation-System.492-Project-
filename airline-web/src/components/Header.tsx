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
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/reservations/search.tsx";
import LoginDialog from "@/components/LoginDialog.tsx";
import {useMutation} from "@tanstack/react-query";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const navigate = useNavigate({from: Route.fullPath});

    const open = !!anchorEl;

    const userMutation = useMutation({
        mutationFn: ({jwtToken}: { jwtToken: string }) => {
            return Promise.resolve(jwtToken);
        },
    })

    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickLogin = () => {
        setLoginDialogOpen(true);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseLoginDialog = (jwtToken?: string) => {
        if (jwtToken) {
            userMutation.mutate({jwtToken});
        }
        setLoginDialogOpen(false);
    };
    const handleClickBookFlight = () => {
        setAnchorEl(null);
        navigate({
            to: '/'
        });
    };
    const handleClickFindReservation = () => {
        setAnchorEl(null);
        navigate({
            to: '/reservations/search'
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
                    </Menu>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Airline Reservation System
                    </Typography>
                    {!userMutation.isPending && userMutation.data ?
                        <IconButton color='inherit'><AccountCircleIcon/></IconButton> :
                        <Button color='inherit' onClick={handleClickLogin}>Login</Button>}
                </Toolbar>
            </AppBar>
            <LoginDialog open={loginDialogOpen} onClose={handleCloseLoginDialog}/>
        </Box>
    );
}