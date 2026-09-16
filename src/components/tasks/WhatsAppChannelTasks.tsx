import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialTask } from '../../types';
import {
  MessageCircle,
  Upload,
  CheckCircle2,
  ExternalLink,
  Lock,
  Unlock,
  Coins,
  Edit3,
  Eye,
  Trash2,
  Sparkles,
  AlertCircle,
  FileImage,
  ArrowRight,
  ShieldCheck,
  X,
  Check,
} from 'lucide-react';

interface ChannelProofState {
  file: File | null;
  previewUrl: string;
  isSubmitting: boolean;
  error: string;
}

export const WhatsAppChannelTasks: React.FC = () => {
  const {
    user,
    socialTasks,
    submitSocialTaskProof,
    updateWhatsAppChannelUrl,
    setActiveTab,
    showToast,
    formatMoney,
  } = useApp();

  // Filter WhatsApp channels
  const whatsappTasks = socialTasks.filter((t) => t.platform === 'whatsapp');

  // Local state for each channel's uploaded proof before submission
  const [proofs, setProofs] = useState<{ [taskId: string]: ChannelProofState }>({});

  // Editing links state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editUrlValue, setEditUrlValue] = useState<string>('');

  // Modal to preview screenshot
  const [previewModalImg, setPreviewModalImg] = useState<{ title: string; url: string } | null>(null);

  // File input refs
  const fileInputRefs = useRef<{ [taskId: string]: HTMLInputElement | null }>({});

  const completedCount = whatsappTasks.filter((t) => t.isCompleted).length;
  const isAllJoined = completedCount >= 2 && user.isWhatsAppJoined;

  const handleFileChange = (taskId: string, file: File | null) => {
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select an image file (PNG, JPG, or WEBP).', 'error');
      return;
    }

    // Convert file to Data URL
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProofs((prev) => ({
        ...prev,
        [taskId]: {
          file,
          previewUrl: result,
          isSubmitting: false,
          error: '',
        },
      }));
      showToast('Screenshot Attached', 'Screenshot selected. Now click "Done" to submit proof.', 'info');
    };
    reader.readAsDataURL(file);
  };

  // Generate sample test screenshot for convenient testing
  const handleUseSampleScreenshot = (task: SocialTask) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = '#0b141a';
      ctx.fillRect(0, 0, 600, 800);

      // Header bar
      ctx.fillStyle = '#202c33';
      ctx.fillRect(0, 0, 600, 100);

      // WhatsApp Green accent
      ctx.fillStyle = '#25D366';
      ctx.fillRect(0, 96, 600, 4);

      // Text Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(task.title.substring(0, 32), 30, 60);

      // Joined badge
      ctx.fillStyle = '#00a884';
      ctx.beginPath();
      ctx.roundRect(450, 35, 120, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('✓ Joined', 475, 60);

      // Channel description card
      ctx.fillStyle = '#111b21';
      ctx.beginPath();
      ctx.roundRect(30, 140, 540, 220, 16);
      ctx.fill();

      ctx.fillStyle = '#8696a0';
      ctx.font = '16px sans-serif';
      ctx.fillText('Channel Info & Announcements', 50, 180);

      ctx.fillStyle = '#e9edef';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(task.title, 50, 220);

      ctx.fillStyle = '#00a884';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('● Following & Notifications On', 50, 260);

      ctx.fillStyle = '#8696a0';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Proof Generated: ${new Date().toLocaleString()}`, 50, 310);

      // Messages mockup
      ctx.fillStyle = '#202c33';
      ctx.beginPath();
      ctx.roundRect(30, 390, 540, 140, 16);
      ctx.fill();

      ctx.fillStyle = '#25D366';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('PakInvest Official Channel Admin', 50, 425);

      ctx.fillStyle = '#e9edef';
      ctx.font = '15px sans-serif';
      ctx.fillText('✅ Daily payout proofs dispatched to all members!', 50, 460);
      ctx.fillText('Withdrawal requests processed instantly via Easypaisa / JazzCash.', 50, 490);

      const dataUrl = canvas.toDataURL('image/png');
      setProofs((prev) => ({
        ...prev,
        [task.id]: {
          file: null,
          previewUrl: dataUrl,
          isSubmitting: false,
          error: '',
        },
      }));
      showToast('Sample Proof Attached', 'Sample screenshot generated. Now click "Done" to verify.', 'info');
    }
  };

  const handleRemoveProof = (taskId: string) => {
    setProofs((prev) => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
    if (fileInputRefs.current[taskId]) {
      fileInputRefs.current[taskId]!.value = '';
    }
  };

  const handleSubmitDone = (task: SocialTask) => {
    const proof = proofs[task.id];

    if (!proof || !proof.previewUrl) {
      setProofs((prev) => ({
        ...prev,
        [task.id]: {
          file: null,
          previewUrl: '',
          isSubmitting: false,
          error: 'Please upload or share your screenshot proof first before clicking Done!',
        },
      }));
      showToast(
        'Screenshot Missing',
        'Please upload your WhatsApp channel join screenshot first, then click Done.',
        'error'
      );
      return;
    }

    // Start submission spinner
    setProofs((prev) => ({
      ...prev,
      [task.id]: {
        ...prev[task.id],
        isSubmitting: true,
        error: '',
      },
    }));

    setTimeout(() => {
      const result = submitSocialTaskProof(task.id, proof.previewUrl);
      if (result.success) {
        // Clean up proof state
        handleRemoveProof(task.id);
      } else {
        setProofs((prev) => ({
          ...prev,
          [task.id]: {
            ...prev[task.id],
            isSubmitting: false,
            error: result.message,
          },
        }));
      }
    }, 750);
  };

  const handleStartEditLink = (task: SocialTask) => {
    setEditingTaskId(task.id);
    setEditUrlValue(task.url);
  };

  const handleSaveEditLink = (taskId: string, channelNumber?: number) => {
    if (editUrlValue.trim()) {
      updateWhatsAppChannelUrl(editUrlValue.trim(), channelNumber || 1);
      setEditingTaskId(null);
    }
  };

  return (
    <div className="space-y-6" id="whatsapp-channels-container">
      {/* Header Overview Card */}
      <div
        className={`rounded-3xl border p-6 sm:p-7 transition-all ${
          isAllJoined
            ? 'bg-emerald-50/50 border-emerald-200'
            : 'bg-white border-blue-200 ring-2 ring-blue-500/10'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isAllJoined
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              }`}
            >
              <MessageCircle className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit']">
                  Official WhatsApp Channels (2 Channels)
                </h3>
                {isAllJoined ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <Unlock className="w-3 h-3 text-emerald-700" /> Both Verified (Withdrawals Active)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    <Lock className="w-3 h-3 text-amber-700" /> {completedCount} / 2 Channels Completed
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Join both official WhatsApp channels below. Take a screenshot showing you have joined each channel, upload the screenshot here, and click <strong>"Done"</strong> to claim <strong>₨ 5.00 PKR</strong> for each channel and unlock your withdrawal gateway.
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> Total Reward: ₨ 10.00 PKR (₨ 5/Channel)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">
                  Screenshot Proof Required Before Clicking "Done"
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
            {isAllJoined ? (
              <button
                onClick={() => setActiveTab('withdraw')}
                id="unlocked-goto-withdraw-btn"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Withdraw</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Progress</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {completedCount} of 2 Verified
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2 Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {whatsappTasks.map((task, index) => {
          const channelNumber = task.channelNumber || index + 1;
          const proofState = proofs[task.id];
          const isDone = task.isCompleted;

          return (
            <div
              key={task.id}
              id={`whatsapp-channel-card-${channelNumber}`}
              className={`rounded-3xl border p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-emerald-50/30 border-emerald-300 ring-1 ring-emerald-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isDone ? <Check className="w-5 h-5" /> : `CH ${channelNumber}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          Channel {channelNumber}
                        </span>
                        {isDone ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done & Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                            +₨ {task.rewardPkr || 5} PKR Reward
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-base text-slate-900 font-['Outfit'] mt-1">
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      editingTaskId === task.id ? setEditingTaskId(null) : handleStartEditLink(task)
                    }
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Configure Channel Invite Link"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {task.description}
                </p>

                {/* Edit Link Inline Form if activated */}
                {editingTaskId === task.id && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-in fade-in">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Edit Channel {channelNumber} Invite URL:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={editUrlValue}
                        onChange={(e) => setEditUrlValue(e.target.value)}
                        placeholder="https://whatsapp.com/channel/..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                      <button
                        onClick={() => handleSaveEditLink(task.id, channelNumber)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1: Join Button */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      Step 1: Open & Join Channel
                    </span>
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noreferrer"
                      id={`join-channel-link-${channelNumber}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Join Channel {channelNumber}</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  </div>
                </div>

                {/* Step 2: Upload Screenshot & Step 3: Done */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Step 2: Share Screenshot Proof
                    </span>
                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => handleUseSampleScreenshot(task)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        title="Simulate selecting a screenshot for fast testing"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Use Sample Proof</span>
                      </button>
                    )}
                  </div>

                  {/* If Already Completed */}
                  {isDone ? (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {task.screenshotUrl ? (
                          <div
                            onClick={() =>
                              setPreviewModalImg({
                                title: `Channel ${channelNumber} Verified Screenshot`,
                                url: task.screenshotUrl!,
                              })
                            }
                            className="w-12 h-14 rounded-xl overflow-hidden border border-emerald-300 cursor-pointer relative group flex-shrink-0 shadow-2xs"
                          >
                            <img
                              src={task.screenshotUrl}
                              alt="Screenshot Proof"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-extrabold text-emerald-900 block">
                            Screenshot Verified & Done!
                          </span>
                          <span className="text-[11px] text-emerald-700">
                            {task.submittedAt ? `Verified on ${task.submittedAt}` : 'Task Completed'}
                          </span>
                        </div>
                      </div>

                      {task.screenshotUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewModalImg({
                              title: `Channel ${channelNumber} Verified Proof`,
                              url: task.screenshotUrl!,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>View Proof</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    /* If Not Completed: Upload Box */
                    <div className="space-y-2.5">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => (fileInputRefs.current[task.id] = el)}
                        onChange={(e) => handleFileChange(task.id, e.target.files?.[0] || null)}
                        className="hidden"
                        id={`file-input-${task.id}`}
                      />

                      {/* Attached Screenshot Preview or Dropzone */}
                      {proofState?.previewUrl ? (
                        <div className="p-3 bg-slate-50 border border-emerald-300 ring-2 ring-emerald-500/10 rounded-2xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              onClick={() =>
                                setPreviewModalImg({
                                  title: `Channel ${channelNumber} Selected Screenshot`,
                                  url: proofState.previewUrl,
                                })
                              }
                              className="w-12 h-14 rounded-xl overflow-hidden border border-slate-300 cursor-pointer relative group flex-shrink-0 shadow-2xs"
                              title="Click to view full screenshot"
                            >
                              <img
                                src={proofState.previewUrl}
                                alt="Selected Screenshot"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">
                                {proofState.file ? proofState.file.name : 'Screenshot Proof Ready'}
                              </span>
                              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Ready to Submit
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[task.id]?.click()}
                              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveProof(task.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Remove Screenshot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRefs.current[task.id]?.click()}
                          className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                            proofState?.error
                              ? 'border-rose-300 bg-rose-50/50'
                              : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30'
                          }`}
                        >
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                          <span className="text-xs font-bold text-slate-800 block">
                            Click to Upload Screenshot
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Take a screenshot of joined channel & select image
                          </span>
                        </div>
                      )}

                      {/* Error text if any */}
                      {proofState?.error && (
                        <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{proofState.error}</span>
                        </p>
                      )}

                      {/* Step 3: DONE BUTTON */}
                      <button
                        type="button"
                        id={`done-channel-btn-${channelNumber}`}
                        disabled={proofState?.isSubmitting}
                        onClick={() => handleSubmitDone(task)}
                        className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                          proofState?.previewUrl
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer ring-2 ring-emerald-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                        }`}
                      >
                        {proofState?.isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Verifying Proof...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                            <span>
                              {proofState?.previewUrl
                                ? `Done: Submit Proof & Claim ₨ ${task.rewardPkr || 5}`
                                : `Done (Upload Screenshot First)`}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Screenshot Modal Viewer */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">{previewModalImg.title}</h4>
              </div>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={previewModalImg.url}
                alt="Full Screenshot Proof"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewModalImg(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
