import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputBase,
  Paper,
  Fab,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Lock,
  Add,
  Search,
  Dashboard as DashboardIcon,
  Settings,
  Logout,
  AccountCircle,
  Menu as MenuIcon,
  People,
  Message,
  Gavel,
} from '@mui/icons-material';
import { PasswordList } from './PasswordList';
import { AddPasswordDialog } from './AddPasswordDialog';
import { useNavigate } from 'react-router';

const drawerWidth = 260;

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  lastModified: Date;
  isFavorite: boolean;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [passwords, setPasswords] = useState<Password[]>([]);

  const categories = [
    'Tous',
    'Favoris',
    'Email',
    'Réseaux sociaux',
    'Banque',
    'Travail',
    'Shopping',
    'Autre',
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAddPassword = (newPassword: Omit<Password, 'id' | 'lastModified'>) => {
    const password: Password = {
      ...newPassword,
      id: Date.now().toString(),
      lastModified: new Date(),
    };
    setPasswords([...passwords, password]);
  };

  const handleUpdatePassword = (id: string, updatedPassword: Partial<Password>) => {
    setPasswords(
      passwords.map((pwd) =>
        pwd.id === id ? { ...pwd, ...updatedPassword, lastModified: new Date() } : pwd
      )
    );
  };

  const handleDeletePassword = (id: string) => {
    setPasswords(passwords.filter((pwd) => pwd.id !== id));
  };

  const filteredPasswords = passwords.filter((pwd) => {
    const matchesSearch =
      pwd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pwd.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pwd.website.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Tous' ||
      (selectedCategory === 'Favoris' && pwd.isFavorite) ||
      pwd.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 2,
        }}
      >
        <Lock color="primary" />
        <Typography variant="h6" fontWeight={600}>
          SecureVault
        </Typography>
      </Toolbar>

      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton
              selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={category} />
              {category !== 'Tous' && category !== 'Favoris' && (
                <Chip
                  label={
                    passwords.filter((p) => p.category === category).length
                  }
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List sx={{ borderTop: 1, borderColor: 'divider' }}>
        <ListItem key="menu-contacts" disablePadding>
          <ListItemButton onClick={() => navigate('/contacts')}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Contacts" />
          </ListItemButton>
        </ListItem>
        <ListItem key="menu-messages" disablePadding>
          <ListItemButton onClick={() => navigate('/messages')}>
            <ListItemIcon>
              <Message />
            </ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItemButton>
        </ListItem>
        <ListItem key="menu-settings" disablePadding>
          <ListItemButton onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Paramètres" />
          </ListItemButton>
        </ListItem>
        <ListItem key="menu-legal" disablePadding>
          <ListItemButton onClick={() => navigate('/legal')}>
            <ListItemIcon>
              <Gavel />
            </ListItemIcon>
            <ListItemText primary="Mentions légales" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', md: 400 },
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
            }}
            elevation={0}
          >
            <IconButton sx={{ p: '10px', color: 'white' }}>
              <Search />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'white' }}
              placeholder="Rechercher un mot de passe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Paper>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              U
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem key="profile" onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              Mon profil
            </MenuItem>
            <MenuItem key="settings" onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              Paramètres
            </MenuItem>
            <MenuItem key="logout" onClick={() => navigate('/')}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              height: '100%',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              height: '100%',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            {selectedCategory === 'Tous'
              ? 'Tous les mots de passe'
              : selectedCategory}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredPasswords.length} mot(s) de passe
          </Typography>
        </Box>

        <PasswordList
          passwords={filteredPasswords}
          onUpdate={handleUpdatePassword}
          onDelete={handleDeletePassword}
        />

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => setOpenAddDialog(true)}
        >
          <Add />
        </Fab>

        <AddPasswordDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAdd={handleAddPassword}
        />
      </Box>
    </Box>
  );
}
