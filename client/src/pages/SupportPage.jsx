import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { 
  Headphones, 
  PlusCircle, 
  MessageSquare, 
  Send, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  User 
} from 'lucide-react';

export default function SupportPage() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // New ticket modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Account & Security');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Active chat ticket state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await API.get('/support/tickets');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load support tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      showToast('Please enter a subject and message.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/support/tickets', {
        subject,
        category,
        message,
      });

      if (res.data.success) {
        showToast('Support ticket raised! An admin will review and chat shortly.', 'success');
        setShowNewModal(false);
        setSubject('');
        setMessage('');
        fetchTickets();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create support ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openTicketChat = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      const res = await API.get(`/support/tickets/${ticket.id}`);
      if (res.data.success) {
        setSelectedTicket(res.data.ticket);
        setChatMessages(res.data.messages);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load chat history', 'error');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setSendingReply(true);
      const res = await API.post(`/support/tickets/${selectedTicket.id}/messages`, {
        message: replyMessage.trim(),
      });

      if (res.data.success) {
        setReplyMessage('');
        // Refresh chat messages
        const chatRes = await API.get(`/support/tickets/${selectedTicket.id}`);
        if (chatRes.data.success) {
          setChatMessages(chatRes.data.messages);
        }
        fetchTickets();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await API.put(`/support/tickets/${ticketId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Ticket status set to ${newStatus}`, 'success');
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
        }
        fetchTickets();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update ticket status', 'error');
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold border border-brand-500/30">
            FlexiHire Help & Support Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Interactive Support Chat</h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            {isAdmin
              ? 'Review user support tickets and chat directly with candidates & employers.'
              : 'Need help? Raise a support ticket to chat directly with platform administrators.'}
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center space-x-2 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise Support Ticket</span>
          </button>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tickets List Column */}
        <div className={`lg:col-span-5 ${selectedTicket ? 'hidden lg:block' : 'block'} space-y-4`}>
          <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Support Tickets ({tickets.length})</span>
          </h3>

          {loading ? (
            <Loader message="Loading tickets..." />
          ) : tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => openTicketChat(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedTicket?.id === t.id
                      ? 'bg-brand-50/80 border-brand-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400">Ticket #{t.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{t.subject}</h4>
                  
                  {isAdmin && (
                    <p className="text-xs text-brand-600 font-semibold mt-1">
                      Raised by: {t.user_name} ({t.user_role?.replace('_', ' ')})
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100 mt-2">
                    <span>{t.category}</span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t.total_messages || 1} messages</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <Headphones className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No support tickets raised yet.</p>
            </div>
          )}
        </div>

        {/* Live Chat Thread Window Column */}
        <div className={`lg:col-span-7 ${selectedTicket ? 'block' : 'hidden lg:block'}`}>
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="lg:hidden text-xs font-bold text-brand-600 mr-2"
                    >
                      ← Back
                    </button>
                    <span className="text-xs font-bold text-slate-400">Ticket #{selectedTicket.id}</span>
                    <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-800 text-[10px] font-bold">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedTicket.subject}</h3>
                </div>

                {isAdmin && (
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                    className="px-3 py-1 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                )}
              </div>

              {/* Chat Messages Bubble Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {chatMessages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  const isMsgAdmin = msg.sender_role === 'admin';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-semibold mb-1">
                        {isMsgAdmin ? (
                          <span className="flex items-center text-amber-600 font-bold">
                            <ShieldAlert className="w-3 h-3 mr-1" />
                            Admin ({msg.sender_name})
                          </span>
                        ) : (
                          <span>{msg.sender_name}</span>
                        )}
                        <span>• {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                            : isMsgAdmin
                            ? 'bg-amber-100 text-amber-950 border border-amber-200 rounded-bl-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
                <input
                  type="text"
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={isAdmin ? "Type your admin support reply..." : "Type your reply to admin..."}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm text-xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3 h-[600px] flex flex-col items-center justify-center">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">Select a support ticket on the left to view and chat</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Raise a Support Ticket</h3>
            <p className="text-xs text-slate-500">Our admin support team will review and respond directly to your ticket</p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Issue Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
                >
                  <option value="Account & Security">Account & Security</option>
                  <option value="Job Listing Issue">Job Listing Issue</option>
                  <option value="Application Status">Application Status</option>
                  <option value="Technical Bug">Technical Bug</option>
                  <option value="Payment & Billing">Payment & Billing</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Issue updating company profile"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <span>Submit Ticket</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
