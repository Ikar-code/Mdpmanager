import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import { ArrowBack, Edit, PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    createdAt: new Date(),
  });

  const handleSave = () => {
    setIsEditing(false);
    // Ici vous ajouteriez la logique pour sauvegarder le profil
  };

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
            Mon Profil
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    bgcolor: 'primary.main',
                    mb: 2,
                  }}
                >
                  U
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 0,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h5" fontWeight={600}>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Membre depuis {profile.createdAt.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Informations personnelles
              </Typography>
              {!isEditing && (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                >
                  Modifier
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Nom complet"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label="Téléphone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
              />
            </Box>

            {isEditing && (
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  fullWidth
                >
                  Enregistrer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  fullWidth
                >
                  Annuler
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Statistiques
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mt: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight={600}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mots de passe
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight={600}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Catégories
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight={600}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Favoris
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
