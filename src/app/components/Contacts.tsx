import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Chip,
  InputAdornment,
  Fab,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Add,
  MoreVert,
  Person,
  Email,
  Phone,
  Edit,
  Delete,
  Group,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initials: string;
  color: string;
  sharedPasswords: number;
}

export function Contacts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleAddContact = () => {
    if (newContact.name && newContact.email) {
      const initials = newContact.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const colors = ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#7b1fa2'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
        initials,
        color: randomColor,
        sharedPasswords: 0,
      };

      setContacts([...contacts, contact]);
      setNewContact({ name: '', email: '', phone: '' });
      setAddDialogOpen(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    setAnchorEl(null);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>
            Contacts
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredContacts.length} contact(s)
            </Typography>

            <List>
              {filteredContacts.map((contact) => (
                <ListItem
                  key={contact.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelectedContact(contact);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  }
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: contact.color }}>
                      {contact.initials}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight={600}>{contact.name}</Typography>
                        {contact.sharedPasswords > 0 && (
                          <Chip
                            label={`${contact.sharedPasswords} partagé(s)`}
                            size="small"
                            color="primary"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {contact.email}
                        </Typography>
                        {contact.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {contact.phone}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {filteredContacts.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Person sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography color="text.secondary">
                  Aucun contact trouvé
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => setAddDialogOpen(true)}
        >
          <Add />
        </Fab>

        {/* Add Contact Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Ajouter un contact</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Nom complet"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Téléphone (optionnel)"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleAddContact}
              variant="contained"
              disabled={!newContact.name || !newContact.email}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        {/* Contact Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem key="edit">
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modifier
          </MenuItem>
          <MenuItem key="share">
            <Group sx={{ mr: 1 }} fontSize="small" />
            Partager un mot de passe
          </MenuItem>
          <MenuItem
            key="delete"
            onClick={() => selectedContact && handleDeleteContact(selectedContact.id)}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" color="error" />
            Supprimer
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
