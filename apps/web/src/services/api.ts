const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('we4us_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

// Journal API
export const journalApi = {
  async getEntries(limit = 20, offset = 0) {
    const response = await fetch(
      `${API_URL}/journal/entries?limit=${limit}&offset=${offset}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse<{
      entries: JournalEntry[];
      total: number;
    }>(response);
  },

  async getEntry(id: string) {
    const response = await fetch(`${API_URL}/journal/entries/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<JournalEntry>(response);
  },

  async createEntry(data: CreateJournalEntryData) {
    const response = await fetch(`${API_URL}/journal/entries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<JournalEntry>(response);
  },

  async updateEntry(id: string, data: Partial<CreateJournalEntryData>) {
    const response = await fetch(`${API_URL}/journal/entries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<JournalEntry>(response);
  },

  async deleteEntry(id: string) {
    const response = await fetch(`${API_URL}/journal/entries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ deleted: boolean }>(response);
  },

  async getTodayCheckin() {
    const response = await fetch(`${API_URL}/journal/checkin/today`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<DailyCheckin | null>(response);
  },

  async saveCheckin(data: SaveCheckinData) {
    const response = await fetch(`${API_URL}/journal/checkin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<DailyCheckin>(response);
  },

  async getCheckinHistory(days = 30) {
    const response = await fetch(`${API_URL}/journal/checkin/history?days=${days}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ checkins: DailyCheckin[]; period: number }>(response);
  },
};

// Community API
export const communityApi = {
  async getFeed(page = 1, limit = 20) {
    const response = await fetch(
      `${API_URL}/community/feed?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse<{
      posts: CommunityPost[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>(response);
  },

  async createPost(content: string) {
    const response = await fetch(`${API_URL}/community/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse<CommunityPost>(response);
  },

  async deletePost(id: string) {
    const response = await fetch(`${API_URL}/community/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ deleted: boolean }>(response);
  },

  async toggleLike(postId: string) {
    const response = await fetch(`${API_URL}/community/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ liked: boolean; likesCount: number }>(response);
  },

  async getComments(postId: string, page = 1, limit = 20) {
    const response = await fetch(
      `${API_URL}/community/posts/${postId}/comments?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse<{
      comments: Comment[];
      page: number;
      limit: number;
      total: number;
    }>(response);
  },

  async addComment(postId: string, content: string) {
    const response = await fetch(`${API_URL}/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse<Comment>(response);
  },

  async getMatches(limit = 10) {
    const response = await fetch(`${API_URL}/community/matches?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{
      matches: PatientMatch[];
    }>(response);
  },

  async getForums() {
    const response = await fetch(`${API_URL}/community/forums`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{
      forums: Forum[];
    }>(response);
  },
};

// Messaging API
export const messagingApi = {
  async getConversations() {
    const response = await fetch(`${API_URL}/community/messages`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{
      conversations: Conversation[];
    }>(response);
  },

  async getMessages(userId: string, page = 1, limit = 50) {
    const response = await fetch(
      `${API_URL}/community/messages/${userId}?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse<{
      messages: Message[];
      page: number;
      limit: number;
      total: number;
    }>(response);
  },

  async sendMessage(userId: string, content: string) {
    const response = await fetch(`${API_URL}/community/messages/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse<Message>(response);
  },

  async getUnreadCount() {
    const response = await fetch(`${API_URL}/community/messages/unread`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ unreadCount: number }>(response);
  },
};

// Types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'difficult' | 'rough' | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryData {
  title: string;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'difficult' | 'rough';
  isPrivate?: boolean;
}

export interface DailyCheckin {
  id: string;
  date: string;
  energyLevel: number;
  painLevel: number;
  moodLevel: number;
  cognitiveClarity: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCheckinData {
  energyLevel: number;
  painLevel: number;
  moodLevel: number;
  cognitiveClarity: number;
  notes?: string;
}

export interface CommunityPost {
  id: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    userType: string;
    diagnosisTimeline: string | null;
  };
  isLiked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
  };
}

export interface PatientMatch {
  userId: string;
  name: string;
  similarity: number;
  phase: string;
}

export interface Forum {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Conversation {
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isOwn: boolean;
}
