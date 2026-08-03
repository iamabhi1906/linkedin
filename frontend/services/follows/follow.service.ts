import apiClient from '@/lib/axios';

export interface FollowUser {
  id: string;
  name: string;
  username: string;
  headline?: string;
  profilePicture?: string;
  isPrivate?: boolean;
}

export interface PendingFollowRequest {
  id: string;
  createdAt: string;
  follower: FollowUser;
  following?: FollowUser;
}

export interface FollowStatusResponse {
  status: string;
  isFollowing: boolean;
  isFollower: boolean;
  hasPendingRequestFromMe: boolean;
  hasPendingRequestToMe: boolean;
  outgoingStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
  incomingStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
}

export const followService = {
  async sendFollowRequest(targetUserId: string) {
    const response = await apiClient.post(`/follows/request/${targetUserId}`);
    return response.data;
  },

  async directFollow(targetUserId: string) {
    const response = await apiClient.post(`/follows/direct/${targetUserId}`);
    return response.data;
  },

  async acceptRequest(identifier: string) {
    const response = await apiClient.post(`/follows/requests/${identifier}/accept`);
    return response.data;
  },

  async rejectRequest(identifier: string) {
    const response = await apiClient.post(`/follows/requests/${identifier}/reject`);
    return response.data;
  },

  async cancelRequest(identifier: string) {
    const response = await apiClient.delete(`/follows/requests/${identifier}/cancel`);
    return response.data;
  },

  async unfollow(targetUserId: string) {
    const response = await apiClient.delete(`/follows/unfollow/${targetUserId}`);
    return response.data;
  },

  async removeFollower(followerId: string) {
    const response = await apiClient.delete(`/follows/followers/${followerId}`);
    return response.data;
  },

  async getPendingRequests(page = 1, limit = 10) {
    const response = await apiClient.get('/follows/requests/pending', {
      params: { page, limit },
    });
    return response.data as {
      status: string;
      requests: PendingFollowRequest[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    };
  },

  async getSentRequests(page = 1, limit = 10) {
    const response = await apiClient.get('/follows/requests/sent', {
      params: { page, limit },
    });
    return response.data;
  },

  async getFollowers(userId?: string, page = 1, limit = 10) {
    const url = userId ? `/follows/users/${userId}/followers` : '/follows/followers';
    const response = await apiClient.get(url, { params: { page, limit } });
    return response.data as {
      status: string;
      followers: FollowUser[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    };
  },

  async getFollowing(userId?: string, page = 1, limit = 10) {
    const url = userId ? `/follows/users/${userId}/following` : '/follows/following';
    const response = await apiClient.get(url, { params: { page, limit } });
    return response.data as {
      status: string;
      following: FollowUser[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    };
  },

  async getFollowStatus(targetUserId: string): Promise<FollowStatusResponse> {
    const response = await apiClient.get(`/follows/status/${targetUserId}`);
    return response.data;
  },
};
