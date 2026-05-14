'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import {
  Brain, ListOrdered, Bell, Wallet, Zap, ChevronRight, Sparkles,
  MessageSquare, Settings, ToggleLeft, ToggleRight, Save, Play, AlertCircle,
  Loader2, ArrowLeft, Bot, Wand2, CheckCircle2, GripVertical,
} from 'lucide-react';
import { showToast } from '@/hooks/useToast';
import { WORKFLOW_TEMPLATES, type Workflow, type BotPersonality } from '@/lib/workflow/types';
import PhoneSimulator from '@/components/PhoneSimulator';
import type { Service } from '@/types';
import DialogWrapper from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ICON_MAP: Record<string, React.ElementType> = { Brain, ListOrdered, Bell, Wallet, Zap };

const TEMPLATE_GRADIENTS: Record<string, string> = {
  'basic-booking': 'from-orange-400 to-amber-300',
  'smart-agent': 'from-violet-500 to-purple-400',
  'reminder-bot': 'from-blue-400 to-cyan-300',
  'deposit-first': 'from-emerald-400 to-teal-300',
};

const TEMPLATE_BG: Record<string, string> = {
  'basic-booking': 'bg-orange-50',
  'smart-agent': 'bg-violet-50',
  'reminder-bot': 'bg-blue-50',
  'deposit-first': 'bg-emerald-50',
};

function StepIcon({ type }: { type: string }) {
  const icons: Record<string, React.ElementType> = {
    send_welcome: Bot, show_services: ListOrdered, pick_service: Wand2,
    pick_date: CalendarDaysIcon, pick_time: ClockIcon, ask_name: UserIcon,
    confirm_details: CheckCircle2, create_booking: Save,
    send_confirmation: MessageSquare, collect_deposit: Wallet,
    send_reminder: Bell, ask_review: Sparkles, ai_chat: Brain,
  };
  const Icon = icons[type] || Zap;
  return <Icon size={16} />;
}

function CalendarDaysIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>; }
function ClockIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function UserIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }

export default function AutomationPage() {
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'personality'>('steps');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => { fetchWorkflow(); fetchServices(); }, []);

  async function fetchWorkflow() {
    try {
      const res = await fetch('/api/workflow', { credentials: 'include' });
      if (res.status === 401) { setLoading(false); router.push('/login'); return; }
      const data = await res.json();
      if (data.workflow) { setWorkflow(data.workflow); }
      else { setShowTemplatePicker(true); }
    } catch { setShowTemplatePicker(true); }
    finally { setLoading(false); }
  }

  async function fetchServices() {
    try {
      const res = await fetch('/api/services', { credentials: 'include' });
      if (res.ok) { const data = await res.json(); setServices(data.services || []); }
    } catch { /* ignore */ }
  }

  function selectTemplate(templateId: string) {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    setWorkflow({
      id: uuidv4(), business_id: '', name: template.name, template_id: template.id,
      is_active: true, steps: template.steps.map((s, i) => ({ ...s, id: `step-${i}` })),
      bot_personality: { ...template.default_personality },
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
    setShowTemplatePicker(false);
  }

  function toggleStep(stepId: string) {
    if (!workflow) return;
    setWorkflow({ ...workflow, steps: workflow.steps.map(s => s.id === stepId ? { ...s, enabled: !s.enabled } : s) });
  }

  function updatePersonality(patch: Partial<BotPersonality>) {
    if (!workflow) return;
    setWorkflow({ ...workflow, bot_personality: { ...(workflow.bot_personality || {}), ...patch } as BotPersonality });
  }

  function addFaq() {
    if (!workflow?.bot_personality) return;
    updatePersonality({ faq: [...(workflow.bot_personality.faq || []), { q: '', a: '' }] });
  }

  function updateFaq(index: number, field: 'q' | 'a', value: string) {
    if (!workflow?.bot_personality) return;
    const faq = workflow.bot_personality.faq.map((f, i) => i === index ? { ...f, [field]: value } : f);
    updatePersonality({ faq });
  }

  function removeFaq(index: number) {
    if (!workflow?.bot_personality) return;
    updatePersonality({ faq: workflow.bot_personality.faq.filter((_, i) => i !== index) });
  }

  function toggleActive() {
    if (!workflow) return;
    setWorkflow({ ...workflow, is_active: !workflow.is_active });
  }

  async function saveWorkflow() {
    if (!workflow) return;
    if (workflow.steps.filter(s => s.enabled).length === 0) {
      showToast('Enable at least one step before saving.', 'error'); return;
    }
    setSaving(true);
    const res = await fetch('/api/workflow', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    });
    setSaving(false);
    if (res.ok) {
      showToast('Workflow saved!', 'success');
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } else {
      showToast('Failed to save workflow.', 'error');
    }
  }

  async function testWorkflow() {
    if (!workflow) return;
    const res = await fetch('/api/workflow/test', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hi', phone: '+919999999999' }),
    });
    const data = await res.json();
    showToast(data.message || 'Test triggered! Check console.', 'info');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-saffron-glow border-t-transparent" />
      </div>
    );
  }

  // ─── Template Picker ───
  if (showTemplatePicker || !workflow) {
    return (
      <div className="flex gap-8 h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto pr-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="mb-10 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-glow to-coral-blush text-white shadow-xl shadow-saffron-glow/20 mb-4"
              >
                <Wand2 size={28} />
              </motion.div>
              <h1 className="text-3xl font-bold text-deep-ink dark:text-white font-display">Choose a Template</h1>
              <p className="text-deep-ink/40 dark:text-white/40 font-body mt-2">Pick a starting point. Customize everything later.</p>
            </div>
            <div className="grid gap-4">
              {WORKFLOW_TEMPLATES.map((template, i) => {
                const Icon = ICON_MAP[template.icon] || Zap;
                return (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => selectTemplate(template.id)}
                    className={`flex items-start gap-5 p-6 rounded-2xl border text-left transition-all group
                      bg-white dark:bg-deep-ink/40 border-deep-ink/5 dark:border-white/5
                      hover:shadow-xl hover:border-saffron-glow/20 hover:shadow-saffron-glow/5`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${TEMPLATE_GRADIENTS[template.id] || 'from-gray-400 to-gray-300'} flex items-center justify-center text-white shadow-lg shrink-0`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-deep-ink dark:text-white font-headline text-lg">{template.name}</h3>
                        {template.is_premium && (
                          <Badge variant="warning" className="text-[10px]">
                            <Sparkles size={10} className="mr-1" /> Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-deep-ink/50 dark:text-white/40 font-body">{template.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-deep-ink/5 dark:bg-white/5 text-deep-ink/40 dark:text-white/40 font-body">{template.steps.length} steps</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-deep-ink/5 dark:bg-white/5 text-deep-ink/40 dark:text-white/40 font-body capitalize">{template.category}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-deep-ink/20 dark:text-white/20 group-hover:text-saffron-glow group-hover:translate-x-1 transition-all mt-2" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
        <div className="hidden xl:block shrink-0">
          <PhoneSimulator workflow={null} services={services} />
        </div>
      </div>
    );
  }

  // ─── Workflow Editor ───
  const template = WORKFLOW_TEMPLATES.find(t => t.id === workflow.template_id);
  const enabledCount = workflow.steps.filter(s => s.enabled).length;
  const progress = Math.round((enabledCount / workflow.steps.length) * 100);

  const editor = (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <button
            onClick={() => setShowBackDialog(true)}
            className="inline-flex items-center gap-1 text-xs text-deep-ink/30 dark:text-white/30 hover:text-saffron-glow font-body mb-2 transition-colors"
          >
            <ArrowLeft size={12} /> Back to templates
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-deep-ink dark:text-white font-display">{workflow.name}</h1>
            <Badge variant={workflow.is_active ? 'success' : 'outline'} className="text-[10px]">
              {workflow.is_active ? <><Play size={8} className="mr-1" /> Active</> : <><AlertCircle size={8} className="mr-1" /> Paused</>}
            </Badge>
          </div>
          <p className="text-deep-ink/30 dark:text-white/30 font-body text-sm mt-0.5">{template?.description}</p>
          {/* Progress bar */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-1.5 bg-deep-ink/5 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-saffron-glow to-coral-blush rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] text-deep-ink/30 dark:text-white/30 font-body">{enabledCount}/{workflow.steps.length} steps</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleActive}
            className={workflow.is_active ? 'border-green-200 text-green-700 bg-green-50' : 'border-orange-200 text-orange-700 bg-orange-50'}
          >
            {workflow.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {workflow.is_active ? 'Active' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={testWorkflow}>
            <Play size={14} className="mr-1" /> Test
          </Button>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={saveWorkflow}
              disabled={saving}
              className={`min-w-[100px] ${savedFlash ? 'bg-green-500 hover:bg-green-600' : 'bg-saffron-glow hover:bg-saffron-dark'}`}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : savedFlash ? <CheckCircle2 size={14} /> : <Save size={14} />}
              <span className="ml-1.5">{savedFlash ? 'Saved!' : 'Save'}</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-deep-ink/5 dark:bg-white/5 rounded-xl mb-6 w-fit">
        {(['steps', 'personality'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
              activeTab === tab ? 'bg-white dark:bg-deep-ink text-deep-ink dark:text-white shadow-sm' : 'text-deep-ink/30 dark:text-white/30 hover:text-deep-ink dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab === 'steps' ? <ListOrdered size={14} /> : <MessageSquare size={14} />}
              {tab === 'steps' ? `Steps (${enabledCount})` : 'Bot Personality'}
            </span>
          </button>
        ))}
      </div>

      {/* Steps Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'steps' && (
          <motion.div
            key="steps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {workflow.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  step.enabled
                    ? 'bg-white dark:bg-deep-ink/30 border-deep-ink/5 dark:border-white/5 shadow-sm'
                    : 'bg-transparent border-deep-ink/[0.03] dark:border-white/[0.03] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-display transition-colors ${
                      step.enabled
                        ? 'bg-saffron-glow/10 text-saffron-glow'
                        : 'bg-deep-ink/5 text-deep-ink/20 dark:bg-white/5 dark:text-white/20'
                    }`}>
                      <StepIcon type={step.type} />
                    </div>
                    <div>
                      <h4 className={`font-medium font-body text-sm ${step.enabled ? 'text-deep-ink dark:text-white' : 'text-deep-ink/30 dark:text-white/30'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-deep-ink/30 dark:text-white/30 font-body">{step.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="text-saffron-glow hover:scale-110 transition-transform"
                  >
                    {step.enabled ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-deep-ink/10 dark:text-white/10" />}
                  </button>
                </div>
              </motion.div>
            ))}
            <div className="p-4 rounded-xl border border-dashed border-deep-ink/10 dark:border-white/10 bg-deep-ink/[0.02] dark:bg-white/[0.02]">
              <button onClick={() => setShowTemplatePicker(true)} className="flex items-center gap-2 text-sm text-deep-ink/30 dark:text-white/30 hover:text-saffron-glow transition-colors font-body">
                <Settings size={14} /> Switch to a different template
              </button>
            </div>
          </motion.div>
        )}

        {/* Personality Tab */}
        {activeTab === 'personality' && workflow.bot_personality && (
          <motion.div
            key="personality"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 bg-white dark:bg-deep-ink/30 rounded-2xl border border-deep-ink/5 dark:border-white/5 p-6 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label text-xs">Tone</label>
                <select value={workflow.bot_personality.tone}
                  onChange={(e) => updatePersonality({ tone: e.target.value as BotPersonality['tone'] })}
                  className="w-full px-3 py-2.5 border border-deep-ink/10 dark:border-white/10 rounded-xl text-sm font-body bg-white dark:bg-deep-ink/50"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div>
                <label className="label text-xs">Language</label>
                <select value={workflow.bot_personality.language}
                  onChange={(e) => updatePersonality({ language: e.target.value as BotPersonality['language'] })}
                  className="w-full px-3 py-2.5 border border-deep-ink/10 dark:border-white/10 rounded-xl text-sm font-body bg-white dark:bg-deep-ink/50"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>
            </div>

            {[
              { key: 'greeting' as const, label: 'Welcome Greeting', rows: 2, placeholder: "👋 Hi! Welcome to {businessName}..." },
              { key: 'farewell' as const, label: 'Closing Message', rows: 2, placeholder: 'Thank you for booking...' },
              { key: 'special_notes' as const, label: 'Special Instructions', rows: 2, placeholder: 'Always mention free parking...' },
            ].map((field) => (
              <div key={field.key}>
                <label className="label text-xs">{field.label}</label>
                <textarea
                  value={workflow.bot_personality?.[field.key] ?? ''}
                  onChange={(e) => updatePersonality({ [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-deep-ink/10 dark:border-white/10 rounded-xl text-sm font-body bg-white dark:bg-deep-ink/50 resize-none"
                  rows={field.rows}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {/* FAQ */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label text-xs">FAQ Knowledge Base</label>
                <button onClick={addFaq} className="text-xs text-saffron-glow font-body font-medium hover:underline">+ Add FAQ</button>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {workflow.bot_personality?.faq?.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl border border-deep-ink/5 dark:border-white/5 bg-sage-whisper/30 dark:bg-white/5 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-deep-ink/20 dark:text-white/20 shrink-0" />
                        <input
                          type="text"
                          value={f.q}
                          onChange={(e) => updateFaq(i, 'q', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm font-body bg-white dark:bg-deep-ink/50 border border-deep-ink/10 dark:border-white/10 rounded-lg"
                          placeholder="Question"
                        />
                        <button onClick={() => removeFaq(i)} className="px-2 text-red-400 hover:text-red-600 transition-colors">×</button>
                      </div>
                      <textarea
                        value={f.a}
                        onChange={(e) => updateFaq(i, 'a', e.target.value)}
                        className="w-full px-3 py-2 text-sm font-body bg-white dark:bg-deep-ink/50 border border-deep-ink/10 dark:border-white/10 rounded-lg resize-none"
                        rows={1}
                        placeholder="Answer"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(!workflow.bot_personality.faq || workflow.bot_personality.faq.length === 0) && (
                  <p className="text-xs text-deep-ink/20 dark:text-white/20 font-body">No FAQs added yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <div className="flex gap-8 h-[calc(100vh-4rem)]">
        <div className="flex-1 min-w-0 overflow-y-auto pr-2">{editor}</div>
        <div className="hidden xl:block shrink-0">
          <PhoneSimulator workflow={workflow} services={services} />
        </div>
      </div>

      <DialogWrapper open={showBackDialog} onClose={() => setShowBackDialog(false)}>
        <div className="text-center p-2 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-saffron-glow/10 flex items-center justify-center mx-auto mb-3">
            <ArrowLeft size={20} className="text-saffron-glow" />
          </div>
          <h3 className="text-lg font-semibold text-deep-ink dark:text-white font-headline mb-1">Go back?</h3>
          <p className="text-sm text-deep-ink/40 dark:text-white/40 font-body mb-5">
            Any unsaved changes will be lost.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowBackDialog(false)}>Stay</Button>
            <Button className="flex-1 bg-saffron-glow hover:bg-saffron-dark" onClick={() => { setShowBackDialog(false); setShowTemplatePicker(true); }}>
              Go back
            </Button>
          </div>
        </div>
      </DialogWrapper>
    </>
  );
}
