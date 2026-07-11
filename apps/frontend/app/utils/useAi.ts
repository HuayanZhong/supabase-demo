// ── 类型定义 ──

export interface Message {
  id: string;
  role: "user" | "assistant";
  parts: { type: "text"; text: string }[];
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export interface Suggestion {
  id: string;
  textKey: string;
  icon: string;
}

type ChatStatus = "ready" | "streaming" | "submitted" | "error";

// ── 本地状态（模块级单例） ──

const messages = ref<Message[]>([]);
const status = ref<ChatStatus>("ready");
const conversations = ref<Conversation[]>([]);
const activeConversationId = ref<string | null>(null);

const suggestions: Suggestion[] = [
  { id: "s1", textKey: "AI Suggestion1", icon: "i-lucide-target" },
  { id: "s2", textKey: "AI Suggestion2", icon: "i-lucide-trending-up" },
  { id: "s3", textKey: "AI Suggestion3", icon: "i-lucide-file-text" },
  { id: "s4", textKey: "AI Suggestion4", icon: "i-lucide-book-open" },
];

// ── 辅助函数 ──

let messageCounter = 0;

function generateId(): string {
  return `${Date.now()}-${++messageCounter}`;
}

/** 模拟 AI 回复 */
function mockAiReply(userContent: string): string {
  const replies = [
    "这是一个很好的问题。基于我的分析，我建议你从以下几个方面考虑：首先，明确你的核心目标；其次，分解为可执行的小步骤；最后，定期复盘调整。",
    "根据目前的信息，我认为可以采取以下方案：第一，优先级排序，确保关键事项先行；第二，合理分配资源，避免过度集中；第三，设置检查点，及时发现偏差。",
    "我来帮你分析一下。从整体来看，进展符合预期，但有几个需要注意的点：时间安排上可以更紧凑一些，资源调配还有优化空间，建议重点关注关键路径上的任务。",
    "收到你的问题。我的建议是分三步走：第一阶段做好准备工作，第二阶段推进核心事项，第三阶段进行总结优化。每一步都有对应的检查标准。",
  ];
  return replies[Math.floor(Math.random() * replies.length)] ?? "让我想想再回答你。";
}

// ── 公共 API ──

export function useAi() {
  const { t } = useI18n();

  const hasMessages = computed(() => messages.value.length > 0);

  /** 发送消息（模拟） */
  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    status.value = "submitted";

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      parts: [{ type: "text", text: trimmed }],
    };
    messages.value = [...messages.value, userMsg];

    // 更新当前对话的最后一条消息
    const activeConv = conversations.value.find((c) => c.id === activeConversationId.value);
    if (activeConv) {
      activeConv.lastMessage = trimmed;
      activeConv.timestamp = new Date();
    }

    // 模拟 AI 回复
    setTimeout(
      () => {
        const aiMsg: Message = {
          id: generateId(),
          role: "assistant",
          parts: [{ type: "text", text: mockAiReply(trimmed) }],
        };
        messages.value = [...messages.value, aiMsg];
        status.value = "ready";

        // 更新对话最后消息摘要
        const conv = conversations.value.find((c) => c.id === activeConversationId.value);
        if (conv) {
          conv.lastMessage = (aiMsg.parts[0]?.text ?? "").slice(0, 30) + "...";
        }
      },
      800 + Math.random() * 600,
    );
  }

  /** 新建对话 */
  function startNewConversation() {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: t("AI NewConversation"),
      lastMessage: "",
      timestamp: new Date(),
    };
    conversations.value = [conv, ...conversations.value];
    activeConversationId.value = id;
    messages.value = [];
    status.value = "ready";
  }

  /** 切换对话 */
  function switchConversation(id: string) {
    activeConversationId.value = id;
    // 模拟加载该对话的消息
    messages.value = [
      {
        id: "history-demo",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `这是对话「${conversations.value.find((c) => c.id === id)?.title}」的历史消息。`,
          },
        ],
      },
    ];
    status.value = "ready";
  }

  return {
    messages,
    status,
    suggestions,
    conversations,
    activeConversationId,
    hasMessages,
    sendMessage,
    startNewConversation,
    switchConversation,
  };
}
