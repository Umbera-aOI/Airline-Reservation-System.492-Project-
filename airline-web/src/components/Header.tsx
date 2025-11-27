import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Book a Flight
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
}