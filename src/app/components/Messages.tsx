import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Badge,
  InputAdornment,
  Divider,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Send,
  Add,
  Group,
  AttachFile,
  EmojiEmotions,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string;
  color: string;
  isGroup: boolean;
  members?: number;
}

export function Messages() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Marie Dubois',
      lastMessage: 'Merci pour le partage !',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      unread: 2,
      avatar: 'MD',
      color: '#1976d2',
      isGroup: false,
    },
    {
      id: '2',
      name: 'Équipe Marketing',
      lastMessage: 'Le mot de passe a été mis à jour',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      unread: 0,
      avatar: 'EM',
      color: '#388e3c',
      isGroup: true,
      members: 5,
    },
    {
      id: '3',
      name: 'Jean Martin',
      lastMessage: 'OK, je vais vérifier',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unread: 0,
      avatar: 'JM',
      color: '#dc004e',
      isGroup: false,
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        text: 'Bonjour, peux-tu me partager le mot de passe du compte Gmail ?',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        id: '2',
        text: 'Bien sûr, je te le partage tout de suite',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
      },
      {
        id: '3',
        text: 'Merci pour le partage !',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
    ],
  });

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'me',
        timestamp: new Date(),
      };

      setMessages({
        ...messages,
        [selectedConversation]: [
          ...(messages[selectedConversation] || []),
          newMessage,
        ],
      });

      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation
            ? { ...conv, lastMessage: messageText, timestamp: new Date() }
            : conv
        )
      );

      setMessageText('');
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        name: newGroupName,
        lastMessage: 'Groupe créé',
        timestamp: new Date(),
        unread: 0,
        avatar: newGroupName.slice(0, 2).toUpperCase(),
        color: '#7b1fa2',
        isGroup: true,
        members: 1,
      };
      setConversations([newConv, ...conversations]);
      setNewGroupName('');
      setNewGroupDialogOpen(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
      }}
    >
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Conversations List */}
        <Box
          sx={{
            width: { xs: '100%', md: 350 },
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'white',
            display: { xs: selectedConversation ? 'none' : 'block', md: 'block' },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/dashboard')}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
              Messages
            </Typography>
            <IconButton onClick={() => setNewGroupDialogOpen(true)}>
              <Add />
            </IconButton>
          </Box>

          <Box sx={{ px: 2, pb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <List sx={{ px: 1 }}>
            {filteredConversations.map((conv) => (
              <ListItemButton
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                selected={selectedConversation === conv.id}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemAvatar>
                  <Badge badgeContent={conv.unread} color="error">
                    <Avatar sx={{ bgcolor: conv.color }}>
                      {conv.isGroup ? <Group /> : conv.avatar}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight={conv.unread > 0 ? 600 : 400}>
                        {conv.name}
                      </Typography>
                      {conv.isGroup && (
                        <Chip label={`${conv.members} membres`} size="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conv.lastMessage}
                    </Typography>
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  {conv.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: selectedConversation ? 'flex' : 'none', md: 'flex' },
            flexDirection: 'column',
            bgcolor: 'white',
          }}
        >
          {selectedConv ? (
            <>
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <IconButton
                  sx={{ display: { md: 'none' } }}
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowBack />
                </IconButton>
                <Avatar sx={{ bgcolor: selectedConv.color }}>
                  {selectedConv.isGroup ? <Group /> : selectedConv.avatar}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={600}>{selectedConv.name}</Typography>
                  {selectedConv.isGroup && (
                    <Typography variant="caption" color="text.secondary">
                      {selectedConv.members} membres
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                {(messages[selectedConv.id] || []).map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '70%',
                        bgcolor: msg.sender === 'me' ? 'primary.main' : 'grey.100',
                        color: msg.sender === 'me' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                        }}
                      >
                        {msg.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>

              {/* Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  gap: 1,
                }}
              >
                <IconButton size="small">
                  <AttachFile />
                </IconButton>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Votre message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography color="text.secondary">
                Sélectionnez une conversation
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* New Group Dialog */}
      <Dialog
        open={newGroupDialogOpen}
        onClose={() => setNewGroupDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Créer un groupe</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom du groupe"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Group />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewGroupDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            disabled={!newGroupName.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
