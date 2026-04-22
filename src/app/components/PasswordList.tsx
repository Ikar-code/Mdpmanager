import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  MoreVert,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  Star,
  StarBorder,
  Language,
} from '@mui/icons-material';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

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

interface PasswordListProps {
  passwords: Password[];
  onUpdate: (id: string, updatedPassword: Partial<Password>) => void;
  onDelete: (id: string) => void;
}

export function PasswordList({ passwords, onUpdate, onDelete }: PasswordListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedPassword, setEditedPassword] = useState<Password | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, password: Password) => {
    setAnchorEl(event.currentTarget);
    setSelectedPassword(password);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setSnackbarMessage('Mot de passe copié !');
    setSnackbarOpen(true);
  };

  const handleCopyUsername = (username: string) => {
    navigator.clipboard.writeText(username);
    setSnackbarMessage('Nom d\'utilisateur copié !');
    setSnackbarOpen(true);
  };

  const handleToggleFavorite = (password: Password) => {
    onUpdate(password.id, { isFavorite: !password.isFavorite });
    handleMenuClose();
  };

  const handleEditOpen = () => {
    if (selectedPassword) {
      setEditedPassword({ ...selectedPassword });
      setEditDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleEditSave = () => {
    if (editedPassword) {
      onUpdate(editedPassword.id, editedPassword);
      setEditDialogOpen(false);
      setSnackbarMessage('Mot de passe mis à jour !');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (selectedPassword) {
      onDelete(selectedPassword.id);
      setDeleteDialogOpen(false);
      setSnackbarMessage('Mot de passe supprimé !');
      setSnackbarOpen(true);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (passwords.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Aucun mot de passe trouvé. Cliquez sur le bouton "+" pour en ajouter un.
      </Alert>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {passwords.map((password) => (
          <Card
            key={password.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {password.title}
                    </Typography>
                    <Chip label={password.category} size="small" color="primary" />
                  </Box>
                  <Box>
                    {password.isFavorite && (
                      <Star sx={{ color: 'warning.main', fontSize: 20, mr: 1 }} />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, password)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Nom d'utilisateur
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {password.username}
                    </Typography>
                    <Tooltip title="Copier">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyUsername(password.username)}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Mot de passe
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      sx={{ flexGrow: 1 }}
                    >
                      {showPassword[password.id]
                        ? password.password
                        : '••••••••••'}
                    </Typography>
                    <Tooltip title={showPassword[password.id] ? 'Masquer' : 'Afficher'}>
                      <IconButton
                        size="small"
                        onClick={() => togglePasswordVisibility(password.id)}
                      >
                        {showPassword[password.id] ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copier">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyPassword(password.password)}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <PasswordStrengthIndicator password={password.password} />
                </Box>

                {password.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      color="primary"
                      component="a"
                      href={password.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      {password.website}
                    </Typography>
                  </Box>
                )}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 2 }}
                >
                  Modifié le {password.lastModified.toLocaleDateString('fr-FR')}
                </Typography>
              </CardContent>
            </Card>
        ))}
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem key="favorite" onClick={() => selectedPassword && handleToggleFavorite(selectedPassword)}>
          <ListItemIcon>
            {selectedPassword?.isFavorite ? <Star /> : <StarBorder />}
          </ListItemIcon>
          {selectedPassword?.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </MenuItem>
        <MenuItem key="edit" onClick={handleEditOpen}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          Modifier
        </MenuItem>
        <MenuItem key="delete" onClick={handleDeleteOpen}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          Supprimer
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le mot de passe</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Titre"
              value={editedPassword?.title || ''}
              onChange={(e) =>
                setEditedPassword((prev) => prev ? { ...prev, title: e.target.value } : null)
              }
            />
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={editedPassword?.username || ''}
              onChange={(e) =>
                setEditedPassword((prev) => prev ? { ...prev, username: e.target.value } : null)
              }
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="text"
              value={editedPassword?.password || ''}
              onChange={(e) =>
                setEditedPassword((prev) => prev ? { ...prev, password: e.target.value } : null)
              }
            />
            <TextField
              fullWidth
              label="Site web"
              value={editedPassword?.website || ''}
              onChange={(e) =>
                setEditedPassword((prev) => prev ? { ...prev, website: e.target.value } : null)
              }
            />
            <TextField
              fullWidth
              select
              label="Catégorie"
              value={editedPassword?.category || ''}
              onChange={(e) =>
                setEditedPassword((prev) => prev ? { ...prev, category: e.target.value } : null)
              }
              SelectProps={{ native: true }}
            >
              <option value="Email">Email</option>
              <option value="Réseaux sociaux">Réseaux sociaux</option>
              <option value="Banque">Banque</option>
              <option value="Travail">Travail</option>
              <option value="Shopping">Shopping</option>
              <option value="Autre">Autre</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleEditSave} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le mot de passe pour{' '}
            <strong>{selectedPassword?.title}</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
}
