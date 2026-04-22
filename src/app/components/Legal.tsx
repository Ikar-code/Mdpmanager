import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function Legal() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>
            Informations Légales
          </Typography>
        </Box>

        <Card>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Mentions Légales" />
            <Tab label="RGPD" />
            <Tab label="Politique de Confidentialité" />
            <Tab label="Cookies" />
            <Tab label="CGU" />
          </Tabs>

          <CardContent sx={{ p: 4 }}>
            {/* Mentions Légales */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Mentions Légales
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  1. Éditeur du site
                </Typography>
                <Typography paragraph>
                  SecureVault est édité par [Nom de la société]<br />
                  Société [Forme juridique] au capital de [montant] euros<br />
                  Siège social : [Adresse complète]<br />
                  RCS : [Ville] [Numéro]<br />
                  SIRET : [Numéro]<br />
                  Email : contact@securevault.com<br />
                  Téléphone : +33 1 XX XX XX XX
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  2. Directeur de la publication
                </Typography>
                <Typography paragraph>
                  [Nom du directeur de publication]
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  3. Hébergement
                </Typography>
                <Typography paragraph>
                  Le site est hébergé par [Nom de l'hébergeur]<br />
                  [Adresse de l'hébergeur]<br />
                  Téléphone : [Numéro]
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  4. Propriété intellectuelle
                </Typography>
                <Typography paragraph>
                  L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, etc.)
                  est la propriété exclusive de SecureVault, sauf mention contraire.
                  Toute reproduction, distribution, modification, adaptation, retransmission ou
                  publication de ces différents éléments est strictement interdite sans l'accord
                  écrit de SecureVault.
                </Typography>
              </Box>
            )}

            {/* RGPD */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Règlement Général sur la Protection des Données (RGPD)
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Responsable du traitement
                </Typography>
                <Typography paragraph>
                  SecureVault, en tant que responsable du traitement, s'engage à respecter
                  le Règlement Général sur la Protection des Données (RGPD) et à protéger
                  les données personnelles de ses utilisateurs.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Vos droits
                </Typography>
                <Typography paragraph>
                  Conformément au RGPD, vous disposez des droits suivants :
                </Typography>
                <List>
                  <ListItem key="droit-acces">
                    <ListItemText
                      primary="Droit d'accès"
                      secondary="Vous pouvez accéder à vos données personnelles"
                    />
                  </ListItem>
                  <ListItem key="droit-rectification">
                    <ListItemText
                      primary="Droit de rectification"
                      secondary="Vous pouvez corriger vos données inexactes"
                    />
                  </ListItem>
                  <ListItem key="droit-effacement">
                    <ListItemText
                      primary="Droit à l'effacement"
                      secondary="Vous pouvez demander la suppression de vos données"
                    />
                  </ListItem>
                  <ListItem key="droit-limitation">
                    <ListItemText
                      primary="Droit à la limitation"
                      secondary="Vous pouvez limiter le traitement de vos données"
                    />
                  </ListItem>
                  <ListItem key="droit-portabilite">
                    <ListItemText
                      primary="Droit à la portabilité"
                      secondary="Vous pouvez récupérer vos données dans un format structuré"
                    />
                  </ListItem>
                  <ListItem key="droit-opposition">
                    <ListItemText
                      primary="Droit d'opposition"
                      secondary="Vous pouvez vous opposer au traitement de vos données"
                    />
                  </ListItem>
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Exercer vos droits
                </Typography>
                <Typography paragraph>
                  Pour exercer vos droits, vous pouvez nous contacter à l'adresse :
                  dpo@securevault.com ou par courrier à l'adresse du siège social.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Délégué à la Protection des Données
                </Typography>
                <Typography paragraph>
                  Email : dpo@securevault.com
                </Typography>
              </Box>
            )}

            {/* Politique de Confidentialité */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Politique de Confidentialité
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  1. Données collectées
                </Typography>
                <Typography paragraph>
                  Nous collectons les données suivantes :
                </Typography>
                <List>
                  <ListItem key="donnees-identification">
                    <ListItemText primary="Données d'identification : nom, prénom, email" />
                  </ListItem>
                  <ListItem key="donnees-connexion">
                    <ListItemText primary="Données de connexion : adresse IP, logs" />
                  </ListItem>
                  <ListItem key="donnees-chiffrees">
                    <ListItemText primary="Données chiffrées : vos mots de passe sont stockés de manière sécurisée et chiffrée" />
                  </ListItem>
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  2. Finalités du traitement
                </Typography>
                <Typography paragraph>
                  Vos données sont utilisées pour :
                </Typography>
                <List>
                  <ListItem key="finalite-compte">
                    <ListItemText primary="Gérer votre compte utilisateur" />
                  </ListItem>
                  <ListItem key="finalite-securite">
                    <ListItemText primary="Assurer la sécurité de vos mots de passe" />
                  </ListItem>
                  <ListItem key="finalite-amelioration">
                    <ListItemText primary="Améliorer nos services" />
                  </ListItem>
                  <ListItem key="finalite-communications">
                    <ListItemText primary="Vous envoyer des communications importantes" />
                  </ListItem>
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  3. Durée de conservation
                </Typography>
                <Typography paragraph>
                  Vos données sont conservées pendant la durée de votre utilisation du service,
                  et jusqu'à 3 ans après la fermeture de votre compte, sauf obligation légale contraire.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  4. Sécurité
                </Typography>
                <Typography paragraph>
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles
                  appropriées pour protéger vos données contre tout accès non autorisé,
                  modification, divulgation ou destruction. Vos mots de passe sont chiffrés
                  avec un algorithme de chiffrement de niveau militaire (AES-256).
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  5. Partage des données
                </Typography>
                <Typography paragraph>
                  Nous ne partageons jamais vos données avec des tiers, sauf :
                </Typography>
                <List>
                  <ListItem key="partage-consentement">
                    <ListItemText primary="Avec votre consentement explicite" />
                  </ListItem>
                  <ListItem key="partage-legal">
                    <ListItemText primary="Pour respecter une obligation légale" />
                  </ListItem>
                  <ListItem key="partage-prestataires">
                    <ListItemText primary="Avec nos prestataires techniques, sous contrat strict de confidentialité" />
                  </ListItem>
                </List>
              </Box>
            )}

            {/* Cookies */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Politique de Cookies
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Qu'est-ce qu'un cookie ?
                </Typography>
                <Typography paragraph>
                  Un cookie est un petit fichier texte stocké sur votre appareil lors de la
                  visite d'un site web. Il permet de mémoriser vos préférences et d'améliorer
                  votre expérience de navigation.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Types de cookies utilisés
                </Typography>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                  Cookies essentiels
                </Typography>
                <Typography paragraph>
                  Ces cookies sont nécessaires au fonctionnement du site. Ils vous permettent
                  de naviguer sur le site et d'utiliser ses fonctionnalités. Sans ces cookies,
                  certains services ne peuvent pas être fournis.
                </Typography>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                  Cookies de session
                </Typography>
                <Typography paragraph>
                  Ils permettent de maintenir votre session active et de vous reconnaître
                  lorsque vous naviguez sur différentes pages du site.
                </Typography>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                  Cookies de préférence
                </Typography>
                <Typography paragraph>
                  Ils permettent au site de mémoriser vos choix (langue, région, etc.) et
                  de vous offrir une expérience plus personnalisée.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Gestion des cookies
                </Typography>
                <Typography paragraph>
                  Vous pouvez à tout moment désactiver les cookies dans les paramètres de
                  votre navigateur. Cependant, cela peut affecter certaines fonctionnalités du site.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Durée de conservation
                </Typography>
                <Typography paragraph>
                  Les cookies de session sont supprimés lorsque vous fermez votre navigateur.
                  Les autres cookies ont une durée de vie maximale de 13 mois.
                </Typography>
              </Box>
            )}

            {/* CGU */}
            {tabValue === 4 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Conditions Générales d'Utilisation
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  1. Objet
                </Typography>
                <Typography paragraph>
                  Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de
                  définir les modalités et conditions d'utilisation du service SecureVault.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  2. Acceptation des CGU
                </Typography>
                <Typography paragraph>
                  L'utilisation du service implique l'acceptation pleine et entière des présentes CGU.
                  Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  3. Création de compte
                </Typography>
                <Typography paragraph>
                  Pour utiliser SecureVault, vous devez créer un compte en fournissant des
                  informations exactes et à jour. Vous êtes responsable de la confidentialité
                  de votre mot de passe principal.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  4. Utilisation du service
                </Typography>
                <Typography paragraph>
                  Vous vous engagez à :
                </Typography>
                <List>
                  <ListItem key="engagement-destination">
                    <ListItemText primary="Utiliser le service conformément à sa destination" />
                  </ListItem>
                  <ListItem key="engagement-securite">
                    <ListItemText primary="Ne pas porter atteinte à la sécurité du service" />
                  </ListItem>
                  <ListItem key="engagement-legal">
                    <ListItemText primary="Ne pas utiliser le service à des fins illégales" />
                  </ListItem>
                  <ListItem key="engagement-propriete">
                    <ListItemText primary="Respecter les droits de propriété intellectuelle" />
                  </ListItem>
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  5. Responsabilités
                </Typography>
                <Typography paragraph>
                  SecureVault met tout en œuvre pour assurer la sécurité de vos données.
                  Cependant, vous restez responsable de la sauvegarde de votre mot de passe
                  principal. En cas de perte, nous ne pourrons pas récupérer vos données chiffrées.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  6. Résiliation
                </Typography>
                <Typography paragraph>
                  Vous pouvez résilier votre compte à tout moment depuis les paramètres.
                  SecureVault se réserve le droit de suspendre ou résilier votre compte en
                  cas de violation des présentes CGU.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  7. Modification des CGU
                </Typography>
                <Typography paragraph>
                  SecureVault se réserve le droit de modifier les présentes CGU à tout moment.
                  Les modifications entrent en vigueur dès leur publication sur le site.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  8. Loi applicable
                </Typography>
                <Typography paragraph>
                  Les présentes CGU sont régies par le droit français. Tout litige sera soumis
                  aux tribunaux compétents.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
