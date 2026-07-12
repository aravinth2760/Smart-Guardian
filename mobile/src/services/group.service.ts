import api from "@/api/client";

// Group

export const createGroup = async () => {
  const response = await api.post("/chat/group");
  return response.data;
};

export const getMyGroup = async () => {
  const response = await api.get("/chat/group");
  return response.data;
};

export const deleteGroup = async () => {
  const response = await api.delete("/chat/group/delete");
  return response.data;
};

// Invite

export const enableInvite = async () => {
  const response = await api.post("/chat/group/invite/enable");
  return response.data;
};

export const disableInvite = async () => {
  const response = await api.post("/chat/group/invite/disable");
  return response.data;
};

export const regenerateInvite = async () => {
  const response = await api.post("/chat/group/invite/regenerate");
  return response.data;
};

// Join

export const joinGroup = async (inviteCode: string) => {
  const response = await api.post("/chat/group/join", {
    inviteCode,
  });

  return response.data;
};

// Join Requests

export const getJoinRequests = async () => {
  const response = await api.get("/chat/group/join-requests");
  return response.data;
};

export const approveJoinRequest = async (requestId: string) => {
  const response = await api.post(
    `/chat/group/join-requests/${requestId}/approve`,
  );

  return response.data;
};

export const rejectJoinRequest = async (requestId: string) => {
  const response = await api.post(
    `/chat/group/join-requests/${requestId}/reject`,
  );

  return response.data;
};

// Members

export const getGroupMembers = async () => {
  const response = await api.get("/chat/group/members");
  return response.data;
};

export const removeGroupMember = async (userId: string) => {
  const response = await api.delete(`/chat/group/members/${userId}`);
  return response.data;
};

// Owner

export const transferOwner = async (userId: string) => {
  const response = await api.post("/chat/group/transfer-owner", {
    userId,
  });

  return response.data;
};

// Leave

export const leaveGroup = async () => {
  const response = await api.post("/chat/group/leave");
  return response.data;
};
