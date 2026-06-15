import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  IconButton,
  Pill,
  Row,
  Select,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Text,
  TextArea,
  TextInput,
  Toggle,
  UsageBar,
  useCanvasState,
  useHostTheme,
  type Color,
} from "cursor/canvas";

type TabId = "home" | "tasks" | "alerts" | "style";
type StylePanel = "hub" | "icon" | "colors" | "pictures" | "brand" | "session";
type AlarmType = "ringtone" | "song" | "spoken";
type VoiceTone = "stern" | "neutral" | "warm";
type VoiceGender = "woman" | "man";
type IconId = "gecko" | "timer" | "monogram" | "focus" | "custom_gallery" | "custom_camera";
type ImagePreset = "gecko" | "lizard" | "leaf" | "sun" | "moon" | "stars" | "custom_gallery" | "custom_camera" | "none";
type TimerStyle = "classic" | "minimal" | "bold";
type AlarmVolume = "soft" | "medium" | "loud";
type BgStrength = "soft" | "medium" | "deep";

interface ImageSlot {
  source: ImagePreset;
  customName: string;
}

interface ThemeColors {
  primary: Color;
  secondary: Color;
  background: Color;
  stripeA: Color;
  stripeB: Color;
  timerDots: Color;
  border: Color;
  bgStrength: BgStrength;
}

interface AppImages {
  mascot: ImageSlot;
  headerWallpaper: ImageSlot;
  timerMascot: ImageSlot;
  victoryBanner: ImageSlot;
}

interface BrandSettings {
  appName: string;
  tagline: string;
  iconId: IconId;
  iconBackground: Color;
  showNameOnLauncher: boolean;
  customIconName: string;
  timerStyle: TimerStyle;
}

interface UserPreferences {
  showGuide: boolean;
  autoAdvance: boolean;
  breakBetweenTasksSec: number;
  vibrationEnabled: boolean;
  confirmReset: boolean;
  largeTimerText: boolean;
  alarmVolume: AlarmVolume;
  snoozeSeconds: number;
}

interface AlarmSettings {
  type: AlarmType;
  ringtone: string;
  songName: string;
  spokenText: string;
  voiceTone: VoiceTone;
  voiceGender: VoiceGender;
  voiceAccent: string;
  useCustomPerTask: boolean;
}

interface TaskItem {
  id: string;
  name: string;
  durationSeconds: number;
  color: Color;
  completed: boolean;
  airplaneModeUntilComplete: boolean;
  image: ImageSlot;
}

interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  tasks: TaskItem[];
}

const DEFAULT_PREFS: UserPreferences = {
  showGuide: false,
  autoAdvance: true,
  breakBetweenTasksSec: 5,
  vibrationEnabled: true,
  confirmReset: true,
  largeTimerText: false,
  alarmVolume: "medium",
  snoozeSeconds: 30,
};

const DEFAULT_BRAND: BrandSettings = {
  appName: "Heather's Helper",
  tagline: "Sequential task timer",
  iconId: "timer",
  iconBackground: "green",
  showNameOnLauncher: true,
  customIconName: "",
  timerStyle: "bold",
};

const DEFAULT_THEME: ThemeColors = {
  primary: "purple",
  secondary: "green",
  background: "purple",
  stripeA: "purple",
  stripeB: "green",
  timerDots: "purple",
  border: "purple",
  bgStrength: "medium",
};

const DEFAULT_IMAGES: AppImages = {
  mascot: { source: "stars", customName: "" },
  headerWallpaper: { source: "leaf", customName: "" },
  timerMascot: { source: "sun", customName: "" },
  victoryBanner: { source: "sun", customName: "" },
};

const IMAGE_PRESETS: Array<{ id: ImagePreset; label: string }> = [
  { id: "gecko", label: "Portrait" },
  { id: "lizard", label: "Profile" },
  { id: "leaf", label: "Nature" },
  { id: "sun", label: "Morning" },
  { id: "moon", label: "Evening" },
  { id: "stars", label: "Night" },
  { id: "custom_gallery", label: "Gallery photo" },
  { id: "custom_camera", label: "Camera photo" },
  { id: "none", label: "No picture" },
];

const DEFAULT_TASKS: TaskItem[] = [
  { id: "t1", name: "Morning stretch", durationSeconds: 120, color: "green", completed: false, airplaneModeUntilComplete: false, image: { source: "sun", customName: "" } },
  { id: "t2", name: "Focus session", durationSeconds: 1500, color: "purple", completed: false, airplaneModeUntilComplete: true, image: { source: "stars", customName: "" } },
  { id: "t3", name: "Water break", durationSeconds: 300, color: "gray", completed: false, airplaneModeUntilComplete: false, image: { source: "leaf", customName: "" } },
  { id: "t4", name: "Plan tomorrow", durationSeconds: 600, color: "green", completed: false, airplaneModeUntilComplete: true, image: { source: "moon", customName: "" } },
];

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: "morning",
    name: "Morning routine",
    description: "Warm up, plan the day, and ease into your schedule.",
    tasks: [
      { id: "m1", name: "Stretch & wake up", durationSeconds: 180, color: "green", completed: false, airplaneModeUntilComplete: false, image: { source: "sun", customName: "" } },
      { id: "m2", name: "Review today's tasks", durationSeconds: 600, color: "purple", completed: false, airplaneModeUntilComplete: false, image: { source: "leaf", customName: "" } },
      { id: "m3", name: "Breakfast", durationSeconds: 900, color: "gray", completed: false, airplaneModeUntilComplete: false, image: { source: "sun", customName: "" } },
    ],
  },
  {
    id: "pomodoro",
    name: "Focus blocks",
    description: "Deep work intervals with short breaks between sessions.",
    tasks: [
      { id: "p1", name: "Focus block 1", durationSeconds: 1500, color: "purple", completed: false, airplaneModeUntilComplete: true, image: { source: "stars", customName: "" } },
      { id: "p2", name: "Short break", durationSeconds: 300, color: "green", completed: false, airplaneModeUntilComplete: false, image: { source: "leaf", customName: "" } },
      { id: "p3", name: "Focus block 2", durationSeconds: 1500, color: "gray", completed: false, airplaneModeUntilComplete: true, image: { source: "moon", customName: "" } },
    ],
  },
  {
    id: "evening",
    name: "Evening wind-down",
    description: "Tidy up, reflect, and prepare for tomorrow.",
    tasks: [
      { id: "e1", name: "Tidy workspace", durationSeconds: 600, color: "gray", completed: false, airplaneModeUntilComplete: false, image: { source: "moon", customName: "" } },
      { id: "e2", name: "Journal & reflect", durationSeconds: 600, color: "purple", completed: false, airplaneModeUntilComplete: true, image: { source: "stars", customName: "" } },
      { id: "e3", name: "Relax & unwind", durationSeconds: 900, color: "green", completed: false, airplaneModeUntilComplete: false, image: { source: "lizard", customName: "" } },
    ],
  },
];

const DEFAULT_ALARM: AlarmSettings = {
  type: "spoken",
  ringtone: "gecko_chirp",
  songName: "",
  spokenText: "Great work, Heather. It is time for the next task.",
  voiceTone: "warm",
  voiceGender: "woman",
  voiceAccent: "american",
  useCustomPerTask: false,
};

const ICON_OPTIONS: Array<{ id: IconId; label: string }> = [
  { id: "timer", label: "Timer" },
  { id: "gecko", label: "Monogram" },
  { id: "monogram", label: "Initials" },
  { id: "focus", label: "Focus" },
  { id: "custom_gallery", label: "Gallery photo" },
  { id: "custom_camera", label: "Camera photo" },
];

const RINGTONE_OPTIONS = [
  { value: "gecko_chirp", label: "Soft bell" },
  { value: "lily_pad_bell", label: "Classic bell" },
  { value: "gentle_pulse", label: "Gentle pulse" },
  { value: "urgent_alarm", label: "Urgent alarm" },
];

const ACCENT_OPTIONS = [
  { value: "american", label: "American English" },
  { value: "british", label: "British English" },
  { value: "australian", label: "Australian English" },
  { value: "irish", label: "Irish English" },
  { value: "southern_us", label: "Southern US" },
];

const COLOR_OPTIONS: Color[] = ["green", "purple", "gray", "blue", "yellow", "orange", "pink"];
const THEME_COLOR_FIELDS: Array<{ key: keyof ThemeColors; label: string; hint: string }> = [
  { key: "primary", label: "Primary accent", hint: "Buttons, nav, highlights" },
  { key: "secondary", label: "Secondary accent", hint: "Titles, go button, stripes" },
  { key: "background", label: "Background tint", hint: "Page, panel, and shell wash" },
  { key: "stripeA", label: "Stripe color A", hint: "Header color band" },
  { key: "stripeB", label: "Stripe color B", hint: "Header color band" },
  { key: "timerDots", label: "Timer accent", hint: "Secondary tone on the timer ring" },
  { key: "border", label: "Phone border", hint: "Outer device frame" },
];
const ACCENT_STRIPE: Array<{ color: Color | "shell"; flex: number }> = [
  { color: "purple", flex: 3 },
  { color: "green", flex: 3 },
  { color: "shell", flex: 2 },
];
const QUICK_DURATIONS = [60, 300, 600, 900, 1500, 1800];
const TEMPLATE_COLORS: Record<string, Color> = { morning: "green", pomodoro: "purple", evening: "gray" };
const RADIUS_SM = 10;
const RADIUS_MD = 14;
const RADIUS_LG = 20;

function tintedBg(theme: ReturnType<typeof useHostTheme>, tint: Color, strength: BgStrength = "medium"): string {
  const lightBase = theme.kind === "light" ? theme.bg.editor : theme.text.primary;
  const amount = strength === "soft" ? 12 : strength === "medium" ? 20 : 34;
  return `color-mix(in srgb, ${theme.category[tint]} ${amount}%, ${lightBase})`;
}

function mockUploadName(kind: "gallery" | "camera", slot: string): string {
  const stamp = Date.now().toString().slice(-5);
  return kind === "gallery" ? `${slot}-${stamp}.png` : `${slot}-snap-${stamp}.jpg`;
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function makeId(): string {
  return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function monogramFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}


function describeAlarm(alarm: AlarmSettings, prefs: UserPreferences): string {
  const volume = prefs.alarmVolume === "soft" ? "soft" : prefs.alarmVolume === "loud" ? "loud" : "medium";
  if (alarm.type === "ringtone") {
    const label = RINGTONE_OPTIONS.find((o) => o.value === alarm.ringtone)?.label ?? "Soft bell";
    return `Plays a ${volume} ${label.toLowerCase()}.`;
  }
  if (alarm.type === "song") {
    return alarm.songName
      ? `Plays ${alarm.songName} at ${volume} volume.`
      : "Plays a song from your phone library.";
  }
  const accent = ACCENT_OPTIONS.find((o) => o.value === alarm.voiceAccent)?.label ?? "English";
  const gender = alarm.voiceGender === "woman" ? "woman" : "man";
  const tone = alarm.voiceTone === "warm" ? "warm" : alarm.voiceTone === "stern" ? "firm" : "neutral";
  return `${tone} ${gender} voice (${accent}, ${volume}): â€œ${alarm.spokenText}â€`;
}

function timerStrokeWidth(style: TimerStyle): number {
  if (style === "minimal") return 6;
  if (style === "bold") return 16;
  return 12;
}

function cloneTemplateTasks(template: RoutineTemplate): TaskItem[] {
  return template.tasks.map((task) => ({ ...task, id: makeId(), completed: false }));
}

function GfxIcon({ color, size = 24, children }: { color: string; size?: number; children?: unknown }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <g stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

type ActionKind =
  | "play" | "pause" | "skip" | "reset" | "edit" | "plus" | "minus" | "search" | "add"
  | "volume" | "snooze" | "vibrate" | "brand" | "rules" | "colors" | "pictures" | "icon";

function ActionGlyph({ kind, color, size = 22 }: { kind: ActionKind; color: string; size?: number }) {
  if (kind === "play") return <GfxIcon color={color} size={size}><polygon points="10,8 18,12 10,16" fill={color} stroke="none" /></GfxIcon>;
  if (kind === "pause") return <GfxIcon color={color} size={size}><path d="M10 8v8M14 8v8" /></GfxIcon>;
  if (kind === "skip") return <GfxIcon color={color} size={size}><path d="M8 7l7 5-7 5V7zM16 7v10" fill={color} stroke="none" /><path d="M16 7v10" /></GfxIcon>;
  if (kind === "reset") return <GfxIcon color={color} size={size}><path d="M12 6a6 6 0 1 1-4.2 10" /><path d="M8 6H12V10" /></GfxIcon>;
  if (kind === "edit") return <GfxIcon color={color} size={size}><path d="M15.5 6.5l2 2L9 17H7v-2l8.5-8.5z" /></GfxIcon>;
  if (kind === "plus" || kind === "minus") return <GfxIcon color={color} size={size}><path d={kind === "plus" ? "M12 8v8M8 12h8" : "M8 12h8"} /></GfxIcon>;
  if (kind === "search") return <GfxIcon color={color} size={size}><circle cx="11" cy="11" r="5.5" /><path d="M15.5 15.5L19 19" /></GfxIcon>;
  if (kind === "add") return <GfxIcon color={color} size={size}><path d="M12 7v10M7 12h10" /><rect x="5" y="5" width="14" height="14" rx="3" fill={color} fillOpacity={0.1} stroke="none" /></GfxIcon>;
  if (kind === "volume") return <GfxIcon color={color} size={size}><path d="M11 9H8v6h3l4 3V6l-4 3z" fill={color} fillOpacity={0.15} stroke="none" /><path d="M16 10a3 3 0 0 1 0 4" /></GfxIcon>;
  if (kind === "snooze") return <GfxIcon color={color} size={size}><circle cx="12" cy="13" r="6" /><path d="M12 10v3l2 1.5M9 4l1.5 1.5M15 4l-1.5 1.5" /></GfxIcon>;
  if (kind === "vibrate") return <GfxIcon color={color} size={size}><path d="M8 8v8M10.5 6v12M13 8v8M15.5 6v12M18 8v8" /></GfxIcon>;
  if (kind === "brand") return <GfxIcon color={color} size={size}><path d="M6 7h12v10H6z" fill={color} fillOpacity={0.12} stroke="none" /><path d="M8.5 10h7M8.5 13h5" /></GfxIcon>;
  if (kind === "rules") return <GfxIcon color={color} size={size}><circle cx="12" cy="12" r="6" fill={color} fillOpacity={0.12} stroke="none" /><path d="M12 9v3.5l2 1.2" /></GfxIcon>;
  if (kind === "colors") return <GfxIcon color={color} size={size}><circle cx="8" cy="10" r="2.2" fill={color} stroke="none" /><circle cx="12" cy="8" r="2.2" fill={color} stroke="none" /><circle cx="16" cy="10" r="2.2" fill={color} stroke="none" /></GfxIcon>;
  if (kind === "pictures") return <GfxIcon color={color} size={size}><rect x="5" y="7" width="14" height="10" rx="2" fill={color} fillOpacity={0.12} stroke="none" /><circle cx="9" cy="11" r="1.5" fill={color} stroke="none" /><path d="M5 15l3-2 3 2 3-3 5 4" /></GfxIcon>;
  return <GfxIcon color={color} size={size}><rect x="6" y="6" width="12" height="12" rx="3" fill={color} fillOpacity={0.12} stroke="none" /></GfxIcon>;
}

function NavGlyph({ tab, color }: { tab: TabId; color: string }) {
  if (tab === "home") {
    return <GfxIcon color={color}><circle cx="12" cy="13" r="7" /><path d="M12 10v4l2.5 1.5" /><path d="M9 5h6" /></GfxIcon>;
  }
  if (tab === "tasks") {
    return <GfxIcon color={color}><path d="M8 7h12M8 12h12M8 17h8" /><rect x="5" y="6" width="3" height="3" rx="0.8" fill={color} stroke="none" /><rect x="5" y="11" width="3" height="3" rx="0.8" fill={color} stroke="none" /><rect x="5" y="16" width="3" height="3" rx="0.8" fill={color} stroke="none" /></GfxIcon>;
  }
  if (tab === "alerts") {
    return <GfxIcon color={color}><path d="M12 4.5a4.5 4.5 0 0 1 4.5 4.5v3.8l1.5 2.7H6l1.5-2.7V9A4.5 4.5 0 0 1 12 4.5z" fill={color} fillOpacity={0.12} /><path d="M10 18.5a2 2 0 0 0 4 0" /></GfxIcon>;
  }
  return <GfxIcon color={color}><circle cx="12" cy="12" r="7.5" fill={color} fillOpacity={0.12} stroke="none" /><path d="M8.5 12h7M12 8.5v7" /><circle cx="8.5" cy="9" r="1.2" fill={color} stroke="none" /><circle cx="15" cy="10" r="1.2" fill={color} stroke="none" /><circle cx="13" cy="15" r="1.2" fill={color} stroke="none" /></GfxIcon>;
}

function SpeechNote({ theme, accent, message, bubbleBg }: { theme: ReturnType<typeof useHostTheme>; accent: string; message: string; bubbleBg: string }) {
  return (
    <div style={{ borderRadius: RADIUS_MD, padding: "16px 18px", background: bubbleBg, border: `1px solid ${theme.stroke.tertiary}` }}>
      <Text size="small" tone="secondary" style={{ margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>{message}</Text>
    </div>
  );
}
function PresetArt({ preset, size, primary, secondary }: { preset: ImagePreset; size: number; primary: string; secondary: string }) {
  if (preset === "gecko") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
        <circle cx="40" cy="30" r="13" fill={secondary} opacity={0.18} />
        <circle cx="40" cy="28" r="10" fill={primary} opacity={0.9} />
        <path d="M40 42v18" stroke={primary} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M31 54h18" stroke={primary} strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (preset === "lizard") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
        <rect x="24" y="22" width="32" height="36" rx="8" fill={secondary} opacity={0.16} />
        <rect x="28" y="26" width="24" height="28" rx="6" fill={primary} opacity={0.85} />
        <path d="M34 38h12M34 46h8" stroke={secondary} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (preset === "leaf") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
        <path d="M40 18c-14 10-18 28-10 44 8-16 4-34-10-44z" fill={primary} opacity={0.85} />
        <path d="M40 24v34" stroke={secondary} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M40 34c8-4 14-2 18 4" stroke={secondary} strokeWidth="2" fill="none" />
      </svg>
    );
  }
  if (preset === "sun") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
        <circle cx="40" cy="40" r="14" fill={primary} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 40 + Math.cos(rad) * 18;
          const y1 = 40 + Math.sin(rad) * 18;
          const x2 = 40 + Math.cos(rad) * 28;
          const y2 = 40 + Math.sin(rad) * 28;
          return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={secondary} strokeWidth="2.8" strokeLinecap="round" />;
        })}
      </svg>
    );
  }
  if (preset === "moon") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
        <path d="M48 22a18 18 0 1 0 10 34a14 14 0 1 1 0-34z" fill={primary} />
        <circle cx="54" cy="30" r="3" fill={secondary} opacity={0.35} />
      </svg>
    );
  }
  if (preset === "stars") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
        <path d="M40 18l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" fill={primary} />
        <path d="M18 52l2 5h5l-4 3 1 5-4-3-4 3 1-5-4-3h5z" fill={secondary} />
        <path d="M58 54l2 5h5l-4 3 1 5-4-3-4 3 1-5-4-3h5z" fill={secondary} />
      </svg>
    );
  }
  return null;
}

function PhotoMock({ size, label, accent, theme, variant = "gallery" }: { size: number; label: string; accent: string; theme: ReturnType<typeof useHostTheme>; variant?: "gallery" | "camera" }) {
  const iconSize = Math.max(16, size * 0.35);
  return (
    <div style={{ width: size, height: size, borderRadius: 12, border: `1px dashed ${accent}`, background: theme.fill.quaternary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 6 }}>
      {variant === "gallery" ? (
        <GfxIcon color={accent} size={iconSize}>
          <rect x="4" y="6" width="16" height="12" rx="2" fill={accent} fillOpacity={0.12} stroke="none" />
          <circle cx="9" cy="11" r="2" fill={accent} stroke="none" />
          <path d="M4 16l4-3 3 2 5-4 4 5" />
        </GfxIcon>
      ) : (
        <GfxIcon color={accent} size={iconSize}>
          <rect x="5" y="8" width="14" height="10" rx="2" />
          <circle cx="12" cy="13" r="3" />
          <path d="M9 8V6h6v2" />
        </GfxIcon>
      )}
      <Text size="small" truncate style={{ width: size - 10, textAlign: "center", margin: 0, fontSize: 10 }}>{label}</Text>
    </div>
  );
}

function ImageArt({ slot, size, theme, primary, secondary }: { slot: ImageSlot; size: number; theme: ReturnType<typeof useHostTheme>; primary: string; secondary: string }) {
  if (slot.source === "none") return null;
  if (slot.source === "custom_gallery") {
    return <PhotoMock size={size} label={slot.customName || "Your photo"} accent={primary} theme={theme} variant="gallery" />;
  }
  if (slot.source === "custom_camera") {
    return <PhotoMock size={size} label={slot.customName || "Your photo"} accent={primary} theme={theme} variant="camera" />;
  }
  return <PresetArt preset={slot.source} size={size} primary={primary} secondary={secondary} />;
}

function WallpaperBand({ slot, theme, primary, secondary, wash }: { slot: ImageSlot; theme: ReturnType<typeof useHostTheme>; primary: string; secondary: string; wash: string }) {
  if (slot.source === "none") return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: `color-mix(in srgb, ${primary} 6%, ${wash})` }}>
      <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", opacity: 0.1 }}>
        <ImageArt slot={slot} size={64} theme={theme} primary={primary} secondary={secondary} />
      </div>
    </div>
  );
}

function ImagePickerGrid({
  value,
  onChange,
  theme,
  accent,
  uploadPrefix,
}: {
  value: ImageSlot;
  onChange: (slot: ImageSlot) => void;
  theme: ReturnType<typeof useHostTheme>;
  accent: string;
  uploadPrefix: string;
}) {
  return (
    <Stack gap={12}>
      <Grid columns={3} gap={8}>
        {IMAGE_PRESETS.map((preset) => {
          const active = value.source === preset.id;
          return (
            <div key={preset.id}>
              <button
                type="button"
                onClick={() => onChange({ source: preset.id, customName: value.customName })}
                style={{ width: "100%", border: active ? `2px solid ${theme.stroke.focused}` : `1px solid ${theme.stroke.tertiary}`, borderRadius: 12, padding: 8, background: theme.fill.quaternary, cursor: "pointer" }}
              >
                <Stack gap={6} style={{ alignItems: "center" }}>
                  <ImageArt slot={{ source: preset.id, customName: "" }} size={34} theme={theme} primary={accent} secondary={theme.category.green} />
                  <Text size="small" tone="secondary" style={{ margin: 0, textAlign: "center" }}>{preset.label}</Text>
                </Stack>
              </button>
            </div>
          );
        })}
      </Grid>
      <Row gap={8} wrap>
        <Button variant="secondary" onClick={() => onChange({ source: "custom_gallery", customName: mockUploadName("gallery", uploadPrefix) })}>Upload from gallery</Button>
        <Button variant="secondary" onClick={() => onChange({ source: "custom_camera", customName: mockUploadName("camera", uploadPrefix) })}>Use camera photo</Button>
      </Row>
      {(value.source === "custom_gallery" || value.source === "custom_camera") && (
        <Text size="small" tone="tertiary">Selected file: {value.customName}</Text>
      )}
    </Stack>
  );
}

function ThemeColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: Color;
  onChange: (color: Color) => void;
}) {
  return (
    <Stack gap={6}>
      <Text size="small" weight="semibold">{label}</Text>
      <Text size="small" tone="tertiary">{hint}</Text>
      <ColorPickerRow label="" value={value} onChange={onChange} />
    </Stack>
  );
}

function AppIcon({
  iconId,
  size,
  background,
  foreground,
  monogram,
}: {
  iconId: IconId;
  size: number;
  background: string;
  foreground: string;
  monogram: string;
}) {
  const radius = Math.round(size * 0.28);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect x={1} y={1} width={size - 2} height={size - 2} rx={radius} fill={background} />
      {iconId === "gecko" && (
        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fill={foreground} fontSize={size * 0.3} fontWeight={700} fontFamily="system-ui, sans-serif">
          {monogram}
        </text>
      )}
      {iconId === "timer" && (
        <>
          <circle cx={size * 0.5} cy={size * 0.54} r={size * 0.22} stroke={foreground} strokeWidth={size * 0.03} fill="none" />
          <path d={`M${size * 0.5} ${size * 0.54}V${size * 0.4}`} stroke={foreground} strokeWidth={size * 0.03} strokeLinecap="round" />
          <path d={`M${size * 0.5} ${size * 0.54}H${size * 0.6}`} stroke={foreground} strokeWidth={size * 0.03} strokeLinecap="round" />
          <path d={`M${size * 0.4} ${size * 0.28}H${size * 0.6}`} stroke={foreground} strokeWidth={size * 0.03} strokeLinecap="round" />
        </>
      )}
      {iconId === "monogram" && (
        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fill={foreground} fontSize={size * 0.3} fontWeight={700} fontFamily="system-ui, sans-serif">
          {monogram}
        </text>
      )}
      {iconId === "focus" && (
        <>
          <circle cx={size * 0.5} cy={size * 0.5} r={size * 0.18} stroke={foreground} strokeWidth={size * 0.03} fill="none" />
          <path d={`M${size * 0.5} ${size * 0.18}V${size * 0.3}`} stroke={foreground} strokeWidth={size * 0.03} strokeLinecap="round" />
          <path d={`M${size * 0.5} ${size * 0.7}V${size * 0.82}`} stroke={foreground} strokeWidth={size * 0.03} strokeLinecap="round" />
          <path d={`M${size * 0.18} ${size * 0.5}H${size * 0.3}`} stroke={foreground} strokeWidth={size * 0.03} strokeLinecap="round" />
          <path d={`M${size * 0.7} ${size * 0.5}H${size * 0.82}`} stroke={foreground} strokeWidth={size * 0.03} strokeLinecap="round" />
        </>
      )}
      {iconId === "custom_gallery" && (
        <>
          <rect x={size * 0.24} y={size * 0.3} width={size * 0.52} height={size * 0.36} rx={size * 0.04} fill={foreground} opacity={0.2} />
          <circle cx={size * 0.38} cy={size * 0.44} r={size * 0.05} fill={foreground} />
          <path d={`M${size * 0.3} ${size * 0.6}L${size * 0.44} ${size * 0.48}L${size * 0.56} ${size * 0.58}L${size * 0.7} ${size * 0.44}V${size * 0.66}H${size * 0.3}Z`} fill={foreground} opacity={0.85} />
        </>
      )}
      {iconId === "custom_camera" && (
        <>
          <rect x={size * 0.28} y={size * 0.34} width={size * 0.44} height={size * 0.3} rx={size * 0.05} stroke={foreground} strokeWidth={size * 0.03} fill="none" />
          <circle cx={size * 0.5} cy={size * 0.49} r={size * 0.09} stroke={foreground} strokeWidth={size * 0.03} fill="none" />
          <rect x={size * 0.4} y={size * 0.3} width={size * 0.2} height={size * 0.05} rx={size * 0.02} fill={foreground} />
        </>
      )}
    </svg>
  );
}

function TimerRing({ progress, color, track, strokeWidth, size = 220 }: { progress: number; color: string; track: string; strokeWidth: number; spots?: string; size?: number }) {
  const radius = size * 0.4;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={center} cy={center} r={radius} stroke={track} strokeWidth={strokeWidth} fill="none" opacity={0.55} />
      <circle cx={center} cy={center} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform={`rotate(-90 ${center} ${center})`} />
      <circle cx={center} cy={center} r={radius - strokeWidth * 2.2} stroke={track} strokeWidth={1} fill="none" opacity={0.25} />
    </svg>
  );
}

function AndroidStatusBar({ theme, surface }: { theme: ReturnType<typeof useHostTheme>; surface: string }) {
  const time = formatClockTime(new Date());
  return (
    <Row justify="space-between" align="center" style={{ height: 28, background: surface, padding: "0 20px" }}>
      <Text size="small" weight="semibold" style={{ margin: 0, fontSize: 12 }}>{time}</Text>
      <Row gap={6} align="center">
        <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden><path d="M1 11V8M4 11V5M7 11V3M10 11V6M13 11V1" stroke={theme.text.primary} strokeWidth={1.4} strokeLinecap="round" /></svg>
        <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden><path d="M1.5 9.5c2-3 4.5-3 6.5 0M7 3.5a2.2 2.2 0 0 1 2.2 2.2" stroke={theme.text.primary} strokeWidth={1.3} strokeLinecap="round" fill="none" /></svg>
        <svg width={18} height={10} viewBox="0 0 18 10" aria-hidden><rect x={0.5} y={0.5} width={14} height={9} rx={2} stroke={theme.text.primary} strokeWidth={1} fill="none" /><rect x={2} y={2} width={10} height={6} rx={1} fill={theme.text.primary} /><path d="M16 4v2" stroke={theme.text.primary} strokeWidth={1.4} strokeLinecap="round" /></svg>
      </Row>
    </Row>
  );
}

function MaterialTopAppBar({
  title,
  subtitle,
  theme,
  surface,
}: {
  title: string;
  subtitle?: string;
  theme: ReturnType<typeof useHostTheme>;
  surface: string;
}) {
  return (
    <Row align="center" gap={12} style={{ background: surface, padding: "14px 20px 16px", borderBottom: `1px solid ${theme.stroke.tertiary}` }}>
      <Stack gap={2} style={{ flex: 1 }}>
        <Text style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>{title}</Text>
        {subtitle ? <Text size="small" tone="tertiary" style={{ margin: 0 }}>{subtitle}</Text> : null}
      </Stack>
    </Row>
  );
}

function MaterialNavigationBar({
  active,
  onChange,
  theme,
  accent,
  surface,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
  theme: ReturnType<typeof useHostTheme>;
  accent: string;
  surface: string;
}) {
  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "home", label: TAB_META.home.label },
    { id: "tasks", label: TAB_META.tasks.label },
    { id: "alerts", label: TAB_META.alerts.label },
    { id: "style", label: TAB_META.style.label },
  ];
  return (
    <div style={{ background: surface, borderTop: `1px solid ${theme.stroke.tertiary}`, padding: "6px 8px 8px" }}>
      <Row gap={0} justify="space-between">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const color = isActive ? accent : theme.text.tertiary;
          return (
            <div key={tab.id} style={{ flex: 1 }}>
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: "6px 0 4px",
                  position: "relative",
                }}
              >
                {isActive ? (
                  <div style={{ position: "absolute", top: 2, width: 56, height: 32, borderRadius: 16, background: `color-mix(in srgb, ${accent} 16%, transparent)` }} />
                ) : null}
                <div style={{ position: "relative" }}><NavGlyph tab={tab.id} color={color} /></div>
                <span style={{ position: "relative", fontSize: 12, fontWeight: isActive ? 600 : 500, color }}>{tab.label}</span>
              </button>
            </div>
          );
        })}
      </Row>
    </div>
  );
}

function AndroidGestureBar({ theme, surface }: { theme: ReturnType<typeof useHostTheme>; surface: string }) {
  return (
    <div style={{ height: 20, background: surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 108, height: 4, borderRadius: 2, background: theme.text.quaternary, opacity: 0.45 }} />
    </div>
  );
}

function MaterialListGroup({ children, theme }: { children: unknown; theme: ReturnType<typeof useHostTheme> }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", background: theme.bg.elevated, border: `1px solid ${theme.stroke.tertiary}` }}>
      {children}
    </div>
  );
}

function MaterialListItem({
  title,
  subtitle,
  leading,
  trailing,
  theme,
  accent,
  active,
  onClick,
  disabled,
  showDivider,
}: {
  title: string;
  subtitle?: string;
  leading?: unknown;
  trailing?: unknown;
  theme: ReturnType<typeof useHostTheme>;
  accent: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showDivider?: boolean;
}) {
  const row = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: subtitle ? "10px 16px" : "12px 16px",
        minHeight: subtitle ? 72 : 56,
        background: active ? `color-mix(in srgb, ${accent} 10%, ${theme.bg.elevated})` : theme.bg.elevated,
        opacity: disabled ? 0.5 : 1,
        borderBottom: showDivider ? `1px solid ${theme.stroke.tertiary}` : undefined,
      }}
    >
      {leading}
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ margin: 0, fontSize: 16, fontWeight: 400 }}>{title}</Text>
        {subtitle ? <Text size="small" tone="tertiary" style={{ margin: 0 }}>{subtitle}</Text> : null}
      </Stack>
      {trailing}
    </div>
  );
  if (onClick) {
    return (
      <button type="button" disabled={disabled} onClick={onClick} style={{ width: "100%", border: "none", padding: 0, margin: 0, background: "transparent", cursor: disabled ? "not-allowed" : "pointer", textAlign: "left" }}>
        {row}
      </button>
    );
  }
  return row;
}

function MaterialFab({ label, onClick, color, foreground }: { label: string; onClick: () => void; color: string; foreground: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        height: 56,
        padding: "0 20px",
        borderRadius: 16,
        border: "none",
        background: color,
        color: foreground,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
      {label}
    </button>
  );
}

function PhoneFrame({
  children,
  theme,
  brand,
  iconBackground,
  monogram,
  panelBg,
}: {
  children: unknown;
  theme: ReturnType<typeof useHostTheme>;
  brand: BrandSettings;
  iconBackground: string;
  monogram: string;
  panelBg: string;
}) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px 40px", background: `color-mix(in srgb, ${theme.category.purple} 6%, ${theme.bg.chrome})` }}>
      <Stack gap={20} style={{ alignItems: "center", width: "100%", maxWidth: 440 }}>
        <Row gap={10} align="center">
          <AppIcon iconId={brand.iconId} size={36} background={iconBackground} foreground={theme.text.onAccent} monogram={monogram} />
          <Text weight="semibold" style={{ margin: 0, fontSize: 15, letterSpacing: -0.2 }}>{brand.appName}</Text>
        </Row>
        <div style={{ width: 400, borderRadius: 44, border: `11px solid ${theme.stroke.secondary}`, background: theme.stroke.secondary, padding: 10 }}>
          <div style={{ borderRadius: 34, overflow: "hidden", background: panelBg, display: "flex", flexDirection: "column", height: 780 }}>
            <div style={{ height: 26, display: "flex", justifyContent: "center", paddingTop: 8, background: theme.bg.elevated }}>
              <div style={{ width: 72, height: 22, borderRadius: 11, background: theme.stroke.secondary }} />
            </div>
            {children}
          </div>
        </div>
      </Stack>
    </div>
  );
}

function SectionHeader({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  return (
    <Stack gap={6}>
      {eyebrow ? <Text size="small" tone="tertiary" style={{ margin: 0, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 10, fontWeight: 600 }}>{eyebrow}</Text> : null}
      <H3 style={{ margin: 0, fontWeight: 600 }}>{title}</H3>
      {subtitle ? <Text size="small" tone="tertiary" style={{ margin: 0, lineHeight: 1.5 }}>{subtitle}</Text> : null}
    </Stack>
  );
}

function MetricStrip({ items, theme }: { items: Array<{ label: string; value: string }>; theme: ReturnType<typeof useHostTheme> }) {
  return (
    <Row gap={6} wrap style={{ width: "100%" }}>
      {items.map((item) => (
        <div key={item.label} style={{ flex: 1, minWidth: 96, padding: "12px 10px", borderRadius: RADIUS_MD, background: theme.fill.secondary, textAlign: "center" }}>
          <Stack gap={4}>
            <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.4, textTransform: "uppercase" }}>{item.label}</Text>
            <Text weight="semibold" style={{ margin: 0, fontVariantNumeric: "tabular-nums" }}>{item.value}</Text>
          </Stack>
        </div>
      ))}
    </Row>
  );
}

function TaskListRow({
  title,
  subtitle,
  badge,
  icon,
  theme,
  accent,
  active,
  onClick,
  disabled,
  trailing,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  icon: unknown;
  theme: ReturnType<typeof useHostTheme>;
  accent: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  trailing?: unknown;
}) {
  const sharedStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    borderRadius: RADIUS_MD,
    border: `1px solid ${active ? theme.stroke.secondary : theme.stroke.tertiary}`,
    boxShadow: active ? `inset 3px 0 0 ${accent}` : undefined,
    background: active ? theme.fill.secondary : theme.fill.quaternary,
    opacity: disabled ? 0.5 : 1,
    textAlign: "left" as const,
  };
  const iconBox = (
    <div style={{ width: 40, height: 40, borderRadius: 999, background: theme.fill.tertiary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </div>
  );
  const content = (
    <>
      {iconBox}
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text weight="semibold" truncate style={{ margin: 0, fontSize: 14 }}>{title}</Text>
        {subtitle ? <Text size="small" tone="tertiary" truncate style={{ margin: 0, lineHeight: 1.4 }}>{subtitle}</Text> : null}
      </Stack>
      {badge ? <Pill size="sm" active>{badge}</Pill> : null}
      {trailing}
    </>
  );
  if (onClick) {
    return (
      <button type="button" disabled={disabled} onClick={onClick} style={{ ...sharedStyle, cursor: disabled ? "not-allowed" : "pointer" }}>
        {content}
      </button>
    );
  }
  return <div style={sharedStyle}>{content}</div>;
}

function SleekIconTile({
  label,
  description,
  icon,
  theme,
  accent,
  active,
  onClick,
  disabled,
  compact,
}: {
  label: string;
  description: string;
  icon: unknown;
  theme: ReturnType<typeof useHostTheme>;
  accent: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const iconBox = compact ? 44 : 56;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        border: active ? `2px solid ${accent}` : `1px solid ${theme.stroke.tertiary}`,
        borderRadius: 16,
        padding: compact ? "10px 8px" : "14px 10px",
        background: active ? theme.fill.secondary : theme.fill.quaternary,
        cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
        opacity: disabled ? 0.45 : 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: compact ? 6 : 8,
        textAlign: "center",
      }}
    >
      <div style={{ width: iconBox, height: iconBox, borderRadius: 14, background: theme.fill.tertiary, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <Text size="small" weight="semibold" style={{ margin: 0 }}>{label}</Text>
      <Text size="small" tone="tertiary" style={{ margin: 0, lineHeight: 1.35 }}>{description}</Text>
    </button>
  );
}

const TAB_META: Record<TabId, { label: string; description: string }> = {
  home: { label: "Timer", description: "Run your queue" },
  tasks: { label: "Tasks", description: "Edit task list" },
  alerts: { label: "Alerts", description: "Sounds & voices" },
  style: { label: "Settings", description: "Colors & images" },
};

function VisualTile({
  label,
  caption,
  background,
  foreground,
  active,
  onClick,
  icon,
  wide,
}: {
  label: string;
  caption?: string;
  background: string;
  foreground: string;
  active?: boolean;
  onClick: () => void;
  icon: unknown;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: wide ? 92 : 108,
        border: active ? `2px solid ${foreground}` : "1px solid transparent",
        borderRadius: 18,
        padding: 14,
        background,
        color: foreground,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Stack gap={10}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: foreground, opacity: 0.14, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <Stack gap={2}>
          <Text weight="semibold" style={{ color: foreground, margin: 0 }}>{label}</Text>
          {caption ? <Text size="small" style={{ color: foreground, opacity: 0.82, margin: 0 }}>{caption}</Text> : null}
        </Stack>
      </Stack>
    </button>
  );
}

function TaskCard({
  task,
  theme,
  isCurrent,
  isRunning,
  onEdit,
  onDuplicate,
  onRemove,
  panelBg,
  accent,
  secondaryAccent,
  showDivider,
}: {
  task: TaskItem;
  theme: ReturnType<typeof useHostTheme>;
  isCurrent: boolean;
  isRunning: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  panelBg: string;
  accent: string;
  secondaryAccent: string;
  showDivider?: boolean;
}) {
  const statusBits = [
    task.completed ? "Done" : null,
    task.airplaneModeUntilComplete ? "Do not disturb" : null,
    isCurrent ? "Active" : null,
  ].filter(Boolean).join(" · ");
  const subtitle = `${formatDuration(task.durationSeconds)}${statusBits ? ` · ${statusBits}` : ""}`;
  return (
    <MaterialListItem
      title={task.name}
      subtitle={subtitle}
      theme={theme}
      accent={accent}
      active={isCurrent}
      showDivider={showDivider}
      leading={
        <div style={{ width: 40, height: 40, borderRadius: 20, background: theme.fill.tertiary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ImageArt slot={task.image} size={24} theme={theme} primary={theme.category[task.color]} secondary={panelBg} />
        </div>
      }
      trailing={
        <Row gap={2}>
          {isCurrent ? <Pill size="sm" active>Now</Pill> : null}
          <IconButton title="Edit" onClick={onEdit} disabled={isRunning}><ActionGlyph kind="edit" color={theme.text.secondary} size={16} /></IconButton>
          <IconButton title="Duplicate" onClick={onDuplicate} disabled={isRunning}>+</IconButton>
          <IconButton title="Delete" onClick={onRemove} disabled={isRunning}>×</IconButton>
        </Row>
      }
    />
  );
}

function ColorPickerRow({ label, value, onChange, disabled }: { label: string; value: Color; onChange: (color: Color) => void; disabled?: boolean }) {
  return (
    <Stack gap={8}>
      {label ? <Text size="small" tone="secondary">{label}</Text> : null}
      <Row gap={8} wrap>
        {COLOR_OPTIONS.map((color) => (
          <button key={color} type="button" disabled={disabled} onClick={() => onChange(color)} style={{ border: value === color ? "2px solid currentColor" : "1px solid transparent", borderRadius: 10, padding: 4, background: "transparent", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }} title={color}>
            <Swatch color={color} />
          </button>
        ))}
      </Row>
    </Stack>
  );
}

function PreferenceRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row gap={10} align="center">
      <Stack gap={2} style={{ flex: 1 }}>
        <Text size="small" weight="semibold">{title}</Text>
        <Text size="small" tone="tertiary">{description}</Text>
      </Stack>
      <Toggle checked={checked} onChange={onChange} />
    </Row>
  );
}

function LauncherPreview({ brand, theme, shellBg, panelBg }: { brand: BrandSettings; theme: ReturnType<typeof useHostTheme>; shellBg: string; panelBg: string }) {
  const monogram = monogramFromName(brand.appName);
  const iconBg = theme.category[brand.iconBackground];
  return (
    <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}>
      <CardBody>
        <Stack gap={14}>
          <SectionHeader eyebrow="Preview" title="Home screen" subtitle="How your app appears on the device launcher." />
          <div style={{ borderRadius: RADIUS_MD, padding: 20, background: panelBg }}>
            <Row gap={20} align="center" wrap>
              <Stack gap={8} style={{ alignItems: "center", width: 84 }}>
                <AppIcon iconId={brand.iconId} size={64} background={iconBg} foreground={theme.text.onAccent} monogram={monogram} />
                {brand.showNameOnLauncher && <Text size="small" truncate style={{ width: 84, textAlign: "center" }}>{brand.appName}</Text>}
              </Stack>
              <Stack gap={4} style={{ flex: 1, minWidth: 160 }}>
                <Text weight="semibold">{brand.appName}</Text>
                <Text size="small" tone="tertiary">{brand.tagline}</Text>
              </Stack>
            </Row>
          </div>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function HeathersHelperMockup() {
  const theme = useHostTheme();

  const [activeTab, setActiveTab] = useCanvasState<TabId>("activeTab", "home");
  const [brand, setBrand] = useCanvasState<BrandSettings>("brand", DEFAULT_BRAND);
  const [prefs, setPrefs] = useCanvasState<UserPreferences>("prefs", DEFAULT_PREFS);
  const [tasks, setTasks] = useCanvasState<TaskItem[]>("tasks", DEFAULT_TASKS);
  const [alarm, setAlarm] = useCanvasState<AlarmSettings>("alarm", DEFAULT_ALARM);
  const [themeColors, setThemeColors] = useCanvasState<ThemeColors>("themeColors", DEFAULT_THEME);
  const [appImages, setAppImages] = useCanvasState<AppImages>("appImages", DEFAULT_IMAGES);
  const [activeIndex, setActiveIndex] = useCanvasState("activeIndex", 0);
  const [remainingSeconds, setRemainingSeconds] = useCanvasState("remainingSeconds", 120);
  const [isRunning, setIsRunning] = useCanvasState("isRunning", false);
  const [intervalId, setIntervalId] = useCanvasState<number | null>("intervalId", null);
  const [transitionMessage, setTransitionMessage] = useCanvasState<string | null>("transitionMessage", null);
  const [previewMessage, setPreviewMessage] = useCanvasState<string | null>("previewMessage", null);
  const [airplaneModeActive, setAirplaneModeActive] = useCanvasState("airplaneModeActive", false);
  const [sessionComplete, setSessionComplete] = useCanvasState("sessionComplete", false);
  const [confirmResetOpen, setConfirmResetOpen] = useCanvasState("confirmResetOpen", false);
  const [editingTaskId, setEditingTaskId] = useCanvasState<string | null>("editingTaskId", null);
  const [taskSearch, setTaskSearch] = useCanvasState("taskSearch", "");
  const [routineName, setRoutineName] = useCanvasState("routineName", "Daily schedule");
  const [stylePanel, setStylePanel] = useCanvasState<StylePanel>("stylePanel", "hub");

  const [draftName, setDraftName] = useCanvasState("draftName", "");
  const [draftMinutes, setDraftMinutes] = useCanvasState("draftMinutes", "5");
  const [draftSeconds, setDraftSeconds] = useCanvasState("draftSeconds", "0");
  const [draftColor, setDraftColor] = useCanvasState<Color>("draftColor", "purple");
  const [draftAirplaneMode, setDraftAirplaneMode] = useCanvasState("draftAirplaneMode", false);
  const [draftImage, setDraftImage] = useCanvasState<ImageSlot>("draftImage", { source: "sun", customName: "" });

  const accent = theme.category[themeColors.primary];
  const secondaryAccent = theme.category[themeColors.secondary];
  const pageBg = tintedBg(theme, themeColors.background, "soft");
  const panelBg = tintedBg(theme, themeColors.background, themeColors.bgStrength);
  const shellBg = tintedBg(theme, themeColors.background, themeColors.bgStrength === "soft" ? "medium" : "deep");
  const deepWash = tintedBg(theme, themeColors.background, "deep");
  const borderColor = theme.category[themeColors.border];
  const iconBackground = theme.category[brand.iconBackground];
  const monogram = monogramFromName(brand.appName);

  const updateThemeColor = <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => setThemeColors({ ...themeColors, [key]: value });
  const updateAppImage = <K extends keyof AppImages>(key: K, value: AppImages[K]) => setAppImages({ ...appImages, [key]: value });
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const currentTask = pendingTasks[activeIndex] ?? null;
  const totalOriginalSeconds = tasks.reduce((sum, t) => sum + t.durationSeconds, 0);
  const completedSeconds = completedTasks.reduce((sum, t) => sum + t.durationSeconds, 0);
  const totalQueueSeconds = pendingTasks.reduce((sum, t) => sum + t.durationSeconds, 0);
  const currentTotal = currentTask?.durationSeconds ?? 1;
  const progress = currentTask ? remainingSeconds / currentTotal : 0;
  const taskColor = currentTask ? theme.category[currentTask.color] : accent;
  const queuePercent = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);
  const remainingQueueSeconds = pendingTasks.reduce((sum, t, i) => {
    if (i < activeIndex) return sum;
    if (i === activeIndex) return sum + remainingSeconds;
    return sum + t.durationSeconds;
  }, 0);
  const estimatedFinish = new Date(Date.now() + remainingQueueSeconds * 1000);
  const filteredTasks = tasks.filter((t) => t.name.toLowerCase().includes(taskSearch.trim().toLowerCase()));
  const timerFontSize = prefs.largeTimerText ? 48 : 40;

  const updateBrand = <K extends keyof BrandSettings>(key: K, value: BrandSettings[K]) => setBrand({ ...brand, [key]: value });
  const updatePrefs = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => setPrefs({ ...prefs, [key]: value });
  const updateAlarm = <K extends keyof AlarmSettings>(key: K, value: AlarmSettings[K]) => setAlarm({ ...alarm, [key]: value });

  const clearTimer = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  };

  const applyRoutine = (template: RoutineTemplate) => {
    if (isRunning) return;
    clearTimer();
    const next = cloneTemplateTasks(template);
    setTasks(next);
    setRoutineName(template.name);
    setActiveIndex(0);
    setRemainingSeconds(next[0]?.durationSeconds ?? 0);
    setSessionComplete(false);
    setTransitionMessage(null);
    setActiveTab("home");
  };

  const resetQueue = () => {
    clearTimer();
    setTasks(DEFAULT_TASKS.map((t) => ({ ...t, completed: false })));
    setRoutineName("Daily schedule");
    setActiveIndex(0);
    setRemainingSeconds(DEFAULT_TASKS[0].durationSeconds);
    setTransitionMessage(null);
    setAirplaneModeActive(false);
    setSessionComplete(false);
    setConfirmResetOpen(false);
    setEditingTaskId(null);
  };

  const requestReset = () => {
    if (prefs.confirmReset) {
      setConfirmResetOpen(true);
      return;
    }
    resetQueue();
  };

  const loadTaskAt = (index: number, taskList = pendingTasks) => {
    const task = taskList[index];
    if (!task) return;
    setActiveIndex(index);
    setRemainingSeconds(task.durationSeconds);
  };

  const finishCurrentTask = () => {
    if (!currentTask) return;
    const updated = tasks.map((t) => (t.id === currentTask.id ? { ...t, completed: true } : t));
    setTasks(updated);
    const nextPending = updated.filter((t) => !t.completed);
    const hadAirplane = currentTask.airplaneModeUntilComplete ?? false;
    if (hadAirplane) setAirplaneModeActive(false);

    let message = describeAlarm(alarm, prefs);
    if (hadAirplane) message = `Do not disturb off. ${message}`;
    if (prefs.vibrationEnabled) message = `${message} Phone vibrates.`;
    setTransitionMessage(message);

    if (nextPending.length === 0) {
      clearTimer();
      setSessionComplete(true);
      setTransitionMessage("Routine complete. Every task is finished.");
      return;
    }

    if (!prefs.autoAdvance) {
      loadTaskAt(0, nextPending);
      return;
    }

    loadTaskAt(0, nextPending);
    const nextTask = nextPending[0];
    const delay = Math.max(0, prefs.breakBetweenTasksSec) * 1000 + 1200;
    window.setTimeout(() => {
      setTransitionMessage(null);
      startTimer(nextTask.durationSeconds, nextTask);
    }, delay);
  };

  const startTimer = (initialSeconds?: number, task?: TaskItem | null) => {
    clearTimer();
    setSessionComplete(false);
    if (initialSeconds !== undefined) setRemainingSeconds(initialSeconds);
    const activeTask = task ?? currentTask;
    setAirplaneModeActive(Boolean(activeTask?.airplaneModeUntilComplete ?? false));
    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setIntervalId(null);
          setIsRunning(false);
          finishCurrentTask();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
    setIsRunning(true);
    setTransitionMessage(null);
  };

  const adjustCurrentTaskTime = (deltaSeconds: number) => {
    if (!currentTask || isRunning) return;
    const next = Math.max(1, remainingSeconds + deltaSeconds);
    setRemainingSeconds(next);
    setTasks(tasks.map((t) => (t.id === currentTask.id ? { ...t, durationSeconds: next } : t)));
  };

  const updateTask = (id: string, patch: Partial<TaskItem>) => {
    if (isRunning) return;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const duplicateTask = (id: string) => {
    if (isRunning) return;
    const source = tasks.find((t) => t.id === id);
    if (!source) return;
    setTasks([...tasks, { ...source, id: makeId(), completed: false, name: `${source.name} (copy)` }]);
  };

  const clearCompleted = () => {
    if (isRunning) return;
    setTasks(tasks.filter((t) => !t.completed));
  };

  const addTask = () => {
    const minutes = Math.max(0, Number.parseInt(draftMinutes || "0", 10) || 0);
    const seconds = Math.max(0, Number.parseInt(draftSeconds || "0", 10) || 0);
    const duration = minutes * 60 + seconds;
    const name = draftName.trim() || `Task ${tasks.length + 1}`;
    if (duration <= 0) return;
    setTasks([...tasks, { id: makeId(), name, durationSeconds: duration, color: draftColor, completed: false, airplaneModeUntilComplete: draftAirplaneMode, image: draftImage }]);
    setDraftName("");
    setDraftMinutes("5");
    setDraftSeconds("0");
    setDraftAirplaneMode(false);
    setDraftImage({ source: "sun", customName: "" });
    setSessionComplete(false);
  };

  const removeTask = (id: string) => {
    if (isRunning) return;
    const next = tasks.filter((t) => t.id !== id);
    setTasks(next);
    if (editingTaskId === id) setEditingTaskId(null);
    const pending = next.filter((t) => !t.completed);
    if (pending.length === 0) {
      setActiveIndex(0);
      setRemainingSeconds(0);
      return;
    }
    loadTaskAt(Math.min(activeIndex, pending.length - 1), pending);
  };

  const moveTask = (id: string, direction: -1 | 1) => {
    if (isRunning) return;
    const index = tasks.findIndex((t) => t.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= tasks.length) return;
    const next = [...tasks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setTasks(next);
  };

  const surface = theme.bg.elevated;
  const appBarTitle = activeTab === "home" ? (pendingTasks.length > 0 ? routineName : "Timer") : TAB_META[activeTab].label;
  const appBarSubtitle = activeTab === "home"
    ? (isRunning ? `${currentTask?.name ?? "Task"} · running` : currentTask?.name ?? brand.tagline)
    : activeTab === "tasks"
      ? `${filteredTasks.length} tasks`
      : activeTab === "alerts"
        ? "Sounds and notifications"
        : "Theme and preferences";

  return (
    <PhoneFrame theme={theme} brand={brand} iconBackground={iconBackground} monogram={monogram} panelBg={panelBg}>
      <AndroidStatusBar theme={theme} surface={surface} />
      <MaterialTopAppBar title={appBarTitle} subtitle={appBarSubtitle} theme={theme} surface={surface} />
      <div style={{ flex: 1, overflow: "auto", padding: 16, background: panelBg, position: "relative" }}>
        <Stack gap={16}>
          {activeTab === "home" && (
            <>
              {prefs.showGuide && (
                <Callout tone="info" title="Getting started">
                  <Stack gap={10}>
                    <Text size="small">Add tasks, customize alerts and colors, then press Start on the Timer tab to run your queue.</Text>
                    <Row gap={8} wrap>
                      <Button variant="secondary" onClick={() => setActiveTab("tasks")}>Add tasks</Button>
                      <Button variant="secondary" onClick={() => setActiveTab("style")}>Customize style</Button>
                      <Button variant="ghost" onClick={() => updatePrefs("showGuide", false)}>Dismiss</Button>
                    </Row>
                  </Stack>
                </Callout>
              )}
              {confirmResetOpen && (
                <Callout tone="warning" title="Reset queue?">
                  <Stack gap={10}>
                    <Text size="small">This restores the sample tasks and clears your progress.</Text>
                    <Row gap={8}>
                      <Button variant="primary" onClick={resetQueue} style={{ background: accent }}>Reset queue</Button>
                      <Button variant="ghost" onClick={() => setConfirmResetOpen(false)}>Cancel</Button>
                    </Row>
                  </Stack>
                </Callout>
              )}
              {airplaneModeActive && <Callout tone="warning" title="Do not disturb">Phone stays in airplane mode until this task finishes.</Callout>}
              {transitionMessage && <Callout tone="info" title="Status">{transitionMessage}</Callout>}
              {sessionComplete ? (
                <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}>
                  <CardHeader>Routine complete</CardHeader>
                  <CardBody>
                    <Stack gap={16}>
                      {appImages.victoryBanner.source !== "none" ? (
                        <Row gap={12} align="center" style={{ padding: 16, borderRadius: RADIUS_MD, background: panelBg }}>
                          <ImageArt slot={appImages.victoryBanner} size={44} theme={theme} primary={accent} secondary={secondaryAccent} />
                          <Text size="small" tone="tertiary">Custom victory banner</Text>
                        </Row>
                      ) : null}
                      <SpeechNote theme={theme} accent={accent} bubbleBg={panelBg} message="All tasks complete. Well done finishing your routine." />
                      <Grid columns={3} gap={8}>
                        <Stat label="Tasks done" value={completedTasks.length} />
                        <Stat label="Total time" value={formatDuration(completedSeconds)} />
                        <Stat label="Routine" value={routineName} />
                      </Grid>
                      <Row gap={10} wrap>
                        <Button variant="primary" style={{ background: accent, flex: 1, minWidth: 140 }} onClick={() => { setSessionComplete(false); setTasks(tasks.map((t) => ({ ...t, completed: false }))); setActiveIndex(0); setRemainingSeconds(tasks[0]?.durationSeconds ?? 0); }}>Run again</Button>
                        <Button variant="secondary" style={{ flex: 1, minWidth: 140 }} onClick={() => setActiveTab("tasks")}>Edit tasks</Button>
                      </Row>
                    </Stack>
                  </CardBody>
                </Card>
              ) : pendingTasks.length === 0 ? (
                <Callout tone="info" title="No tasks yet">
                  <Stack gap={10}>
                    <Text size="small">Add tasks to build a routine, or load a template to get started quickly.</Text>
                    <Row gap={8} wrap>
                      <Button variant="primary" style={{ background: accent }} onClick={() => setActiveTab("tasks")}>Add tasks</Button>
                      <Button variant="secondary" onClick={() => applyRoutine(ROUTINE_TEMPLATES[0])}>Load morning routine</Button>
                    </Row>
                  </Stack>
                </Callout>
              ) : (
                <Stack gap={18}>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardBody>
                      <Stack gap={12}>
                        <Row gap={10} align="center">
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Routine</Text>
                            <Text weight="semibold" truncate style={{ margin: 0 }}>{routineName}</Text>
                          </Stack>
                          <Pill size="sm" active>{queuePercent}%</Pill>
                        </Row>
                        <UsageBar
                          total={totalOriginalSeconds || 1}
                          topLeftLabel={`${completedTasks.length} of ${tasks.length} tasks`}
                          topRightLabel={`Finishes ${formatClockTime(estimatedFinish)}`}
                          segments={completedTasks.map((task) => ({ id: task.id, value: task.durationSeconds, color: task.color }))}
                        />
                      </Stack>
                    </CardBody>
                  </Card>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardBody>
                      <Stack gap={20} style={{ alignItems: "center" }}>
                        <SectionHeader
                          eyebrow={`Task ${activeIndex + 1} of ${pendingTasks.length}`}
                          title={currentTask?.name ?? "Current task"}
                          subtitle={isRunning ? "In progress" : "Ready when you are"}
                        />
                        <div style={{ position: "relative", width: 260, height: 260 }}>
                          <TimerRing progress={progress} color={taskColor} track={theme.fill.secondary} strokeWidth={timerStrokeWidth(brand.timerStyle)} size={260} />
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
                            <Text weight="bold" style={{ fontSize: timerFontSize, letterSpacing: 3, fontVariantNumeric: "tabular-nums" }}>{formatDuration(remainingSeconds)}</Text>
                            <Text size="small" tone="tertiary" style={{ margin: 0 }}>{isRunning ? "Running" : "Paused"}</Text>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          style={{ width: "100%", background: secondaryAccent, borderRadius: RADIUS_MD, padding: "12px 20px" }}
                          onClick={() => (isRunning ? clearTimer() : startTimer())}
                        >
                          {isRunning ? "Pause" : "Start"}
                        </Button>
                        <Row gap={6} wrap style={{ width: "100%", justifyContent: "center" }}>
                          <Button variant="ghost" onClick={() => { clearTimer(); finishCurrentTask(); }} disabled={!isRunning && !currentTask}>Skip</Button>
                          <Button variant="ghost" onClick={requestReset}>Reset</Button>
                          {!isRunning && currentTask ? (
                            <>
                              <Button variant="ghost" onClick={() => adjustCurrentTaskTime(60)}>+1m</Button>
                              <Button variant="ghost" onClick={() => adjustCurrentTaskTime(-60)}>-1m</Button>
                              <Button variant="ghost" onClick={() => setActiveTab("tasks")}>Edit</Button>
                            </>
                          ) : null}
                        </Row>
                        <MetricStrip
                          theme={theme}
                          items={[
                            { label: "Remaining", value: formatDuration(totalQueueSeconds) },
                            { label: "Duration", value: formatDuration(currentTask?.durationSeconds ?? 0) },
                            { label: "Finish by", value: formatClockTime(estimatedFinish) },
                          ]}
                        />
                      </Stack>
                    </CardBody>
                  </Card>
                </Stack>
              )}
              {!sessionComplete && pendingTasks.length > 0 ? (
                <>
                  <Divider />
                  <SectionHeader eyebrow="Queue" title="Up next" subtitle={pendingTasks.length > 6 ? `First 6 of ${pendingTasks.length} tasks` : undefined} />
                  <MaterialListGroup theme={theme}>
                    {pendingTasks.slice(0, 6).map((task, index) => (
                      <div key={task.id}>
                        <MaterialListItem
                          title={task.name}
                          subtitle={formatDuration(task.durationSeconds)}
                          theme={theme}
                          accent={accent}
                          active={index === activeIndex}
                          disabled={isRunning}
                          showDivider={index < Math.min(5, pendingTasks.slice(0, 6).length - 1)}
                          onClick={() => { if (!isRunning) loadTaskAt(index); }}
                          leading={
                            <div style={{ width: 40, height: 40, borderRadius: 20, background: theme.fill.tertiary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ImageArt slot={task.image} size={24} theme={theme} primary={theme.category[task.color]} secondary={panelBg} />
                            </div>
                          }
                          trailing={index === activeIndex ? <Pill size="sm" active>Now</Pill> : null}
                        />
                      </div>
                    ))}
                  </MaterialListGroup>
                </>
              ) : null}
            </>
          )}

          {activeTab === "tasks" && (
            <>
              <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                <CardHeader>Routine</CardHeader>
                <CardBody>
                  <Stack gap={14}>
                    <Stack gap={6}>
                      <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>Name</Text>
                      <TextInput value={routineName} onChange={setRoutineName} placeholder="Morning routine" />
                    </Stack>
                    <Stack gap={6}>
                      <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>Search</Text>
                      <TextInput value={taskSearch} onChange={setTaskSearch} placeholder="Search by name..." />
                    </Stack>
                  </Stack>
                </CardBody>
              </Card>
              <SectionHeader eyebrow="Library" title="Templates" subtitle="Replace your current list with a preset routine." />
              <MaterialListGroup theme={theme}>
                {ROUTINE_TEMPLATES.map((template, index) => {
                  const leadTask = template.tasks[0];
                  return (
                    <div key={template.id}>
                      <MaterialListItem
                        title={template.name}
                        subtitle={`${template.tasks.length} tasks · ${template.description}`}
                        theme={theme}
                        accent={accent}
                        showDivider={index < ROUTINE_TEMPLATES.length - 1}
                        onClick={() => applyRoutine(template)}
                        leading={
                          <div style={{ width: 40, height: 40, borderRadius: 20, background: theme.fill.tertiary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ImageArt slot={leadTask.image} size={24} theme={theme} primary={theme.category[leadTask.color]} secondary={panelBg} />
                          </div>
                        }
                      />
                    </div>
                  );
                })}
              </MaterialListGroup>
              <Row gap={8} justify="space-between" align="end">
                <SectionHeader eyebrow="List" title="Your tasks" subtitle={`${filteredTasks.length} task${filteredTasks.length === 1 ? "" : "s"}`} />
                <Button variant="ghost" onClick={clearCompleted} disabled={isRunning || completedTasks.length === 0}>Clear completed</Button>
              </Row>
              <MaterialListGroup theme={theme}>
                {filteredTasks.map((task, index) => (
                  editingTaskId === task.id ? null : (
                    <div key={task.id}>
                      <TaskCard
                        task={task}
                        theme={theme}
                        panelBg={panelBg}
                        accent={accent}
                        secondaryAccent={secondaryAccent}
                        isCurrent={pendingTasks[activeIndex]?.id === task.id}
                        isRunning={isRunning}
                        showDivider={index < filteredTasks.length - 1}
                        onEdit={() => setEditingTaskId(task.id)}
                        onDuplicate={() => duplicateTask(task.id)}
                        onRemove={() => removeTask(task.id)}
                      />
                    </div>
                  )
                ))}
              </MaterialListGroup>
              {filteredTasks.map((task) => (
                editingTaskId === task.id ? (
                  <div key={`edit-${task.id}`}>
                    <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_MD }}>
                    <CardBody>
                      <Stack gap={10}>
                        <TextInput value={task.name} onChange={(v) => updateTask(task.id, { name: v })} placeholder="Task name" />
                        <ColorPickerRow label="Color" value={task.color} onChange={(color) => updateTask(task.id, { color })} disabled={isRunning} />
                        <Stack gap={6}>
                          <Text size="small" tone="secondary">Task image</Text>
                          <ImagePickerGrid value={task.image} onChange={(image) => updateTask(task.id, { image })} theme={theme} accent={accent} uploadPrefix={`task-${task.id}`} />
                        </Stack>
                        <PreferenceRow title="Do not disturb" description="Silence notifications until this task finishes." checked={task.airplaneModeUntilComplete ?? false} onChange={(v) => updateTask(task.id, { airplaneModeUntilComplete: v })} />
                        <Button variant="primary" style={{ background: accent, alignSelf: "flex-start" }} onClick={() => setEditingTaskId(null)}>Save changes</Button>
                      </Stack>
                    </CardBody>
                    </Card>
                  </div>
                ) : null
              ))}
              <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                <CardHeader>Add task</CardHeader>
                <CardBody>
                  <Stack gap={14}>
                    <Stack gap={6}>
                      <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>Name</Text>
                      <TextInput value={draftName} onChange={setDraftName} placeholder="Task name" />
                    </Stack>
                    <Stack gap={8}>
                      <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>Duration</Text>
                      <Row gap={6} wrap>
                      {QUICK_DURATIONS.map((seconds) => (
                        <div key={seconds}>
                          <Pill active={Number(draftMinutes) * 60 + Number(draftSeconds) === seconds} onClick={() => { setDraftMinutes(String(Math.floor(seconds / 60))); setDraftSeconds(String(seconds % 60)); }}>
                            {seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`}
                          </Pill>
                        </div>
                      ))}
                      </Row>
                    </Stack>
                    <Row gap={8}>
                      <Stack gap={6} style={{ flex: 1 }}><Text size="small" tone="secondary">Minutes</Text><TextInput value={draftMinutes} onChange={setDraftMinutes} type="number" /></Stack>
                      <Stack gap={6} style={{ flex: 1 }}><Text size="small" tone="secondary">Seconds</Text><TextInput value={draftSeconds} onChange={setDraftSeconds} type="number" /></Stack>
                    </Row>
                    <ColorPickerRow label="Task color" value={draftColor} onChange={setDraftColor} />
                    <Stack gap={6}>
                      <Text size="small" tone="secondary">Task image</Text>
                      <ImagePickerGrid value={draftImage} onChange={setDraftImage} theme={theme} accent={accent} uploadPrefix="new-task" />
                    </Stack>
                    <PreferenceRow title="Do not disturb" description="Silence notifications during this task." checked={draftAirplaneMode} onChange={setDraftAirplaneMode} />
                    <Button variant="primary" style={{ background: secondaryAccent, alignSelf: "flex-start" }} onClick={addTask}>Add task</Button>
                  </Stack>
                </CardBody>
              </Card>
            </>
          )}

          {activeTab === "alerts" && (
            <>
              <SectionHeader eyebrow="Notifications" title="Alert type" subtitle="How you're notified when a task ends." />
              <Row gap={6} wrap>
                <Pill active={alarm.type === "ringtone"} onClick={() => updateAlarm("type", "ringtone")}>Ringtone</Pill>
                <Pill active={alarm.type === "song"} onClick={() => updateAlarm("type", "song")}>Music</Pill>
                <Pill active={alarm.type === "spoken"} onClick={() => updateAlarm("type", "spoken")}>Voice</Pill>
              </Row>
              <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}>
                <CardHeader>Settings</CardHeader>
                <CardBody>
                  <Stack gap={14}>
                    <Stack gap={6}>
                      <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>Volume</Text>
                      <Select value={prefs.alarmVolume} onChange={(v) => updatePrefs("alarmVolume", v as AlarmVolume)} options={[{ value: "soft", label: "Soft" }, { value: "medium", label: "Normal" }, { value: "loud", label: "Loud" }]} />
                    </Stack>
                    <Stack gap={6}>
                      <Text size="small" tone="tertiary" style={{ margin: 0, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>Snooze</Text>
                      <Select value={String(prefs.snoozeSeconds)} onChange={(v) => updatePrefs("snoozeSeconds", Number.parseInt(v, 10) || 30)} options={[{ value: "15", label: "15 seconds" }, { value: "30", label: "30 seconds" }, { value: "60", label: "1 minute" }]} />
                    </Stack>
                    <PreferenceRow title="Vibration" description="Vibrate when an alert plays." checked={prefs.vibrationEnabled} onChange={(v) => updatePrefs("vibrationEnabled", v)} />
                  </Stack>
                </CardBody>
              </Card>
              {alarm.type === "ringtone" && (
                <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}><CardHeader>Ringtone</CardHeader><CardBody><Stack gap={12}><Select value={alarm.ringtone} onChange={(v) => updateAlarm("ringtone", v)} options={RINGTONE_OPTIONS} /><Button variant="secondary" onClick={() => setPreviewMessage(describeAlarm({ ...alarm, type: "ringtone" }, prefs))}>Preview</Button></Stack></CardBody></Card>
              )}
              {alarm.type === "song" && (
                <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}><CardHeader>Music</CardHeader><CardBody><Stack gap={12}><Row gap={8} align="center"><Button variant="secondary" onClick={() => updateAlarm("songName", "Sunrise Walk - Playlist")}>Choose track</Button><Text size="small" tone="tertiary" truncate>{alarm.songName || "No track selected"}</Text></Row><Button variant="secondary" onClick={() => setPreviewMessage(describeAlarm({ ...alarm, type: "song" }, prefs))}>Preview</Button></Stack></CardBody></Card>
              )}
              {alarm.type === "spoken" && (
                <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}>
                  <CardHeader>Voice script</CardHeader>
                  <CardBody>
                    <Stack gap={12}>
                      <TextArea value={alarm.spokenText} onChange={(v) => updateAlarm("spokenText", v)} placeholder="What should the voice say when time is up?" rows={4} />
                      <Grid columns={2} gap={10}>
                        <Stack gap={6}><Text size="small" tone="secondary">Voice tone</Text><Select value={alarm.voiceTone} onChange={(v) => updateAlarm("voiceTone", v as VoiceTone)} options={[{ value: "stern", label: "Firm" }, { value: "neutral", label: "Neutral" }, { value: "warm", label: "Warm" }]} /></Stack>
                        <Stack gap={6}><Text size="small" tone="secondary">Voice</Text><Select value={alarm.voiceGender} onChange={(v) => updateAlarm("voiceGender", v as VoiceGender)} options={[{ value: "woman", label: "Woman" }, { value: "man", label: "Man" }]} /></Stack>
                      </Grid>
                      <Stack gap={6}><Text size="small" tone="secondary">Accent</Text><Select value={alarm.voiceAccent} onChange={(v) => updateAlarm("voiceAccent", v)} options={ACCENT_OPTIONS} /></Stack>
                      <Button variant="secondary" onClick={() => setPreviewMessage(describeAlarm({ ...alarm, type: "spoken" }, prefs))}>Preview voice</Button>
                    </Stack>
                  </CardBody>
                </Card>
              )}
              <PreferenceRow title="Per-task alerts" description="Unique sound per task" checked={alarm.useCustomPerTask} onChange={(v) => updateAlarm("useCustomPerTask", v)} />
              {previewMessage && <Callout tone="info" title="Alert preview">{previewMessage}</Callout>}
            </>
          )}

          {activeTab === "style" && (
            <>
              {stylePanel !== "hub" ? (
                <Button variant="ghost" onClick={() => setStylePanel("hub")}>← Settings</Button>
              ) : null}

              {stylePanel === "hub" && (
                <>
                  <LauncherPreview brand={brand} theme={theme} shellBg={surface} panelBg={panelBg} />
                  <SectionHeader eyebrow="Preferences" title="Settings" subtitle="Appearance, branding, and timer behavior." />
                  <MaterialListGroup theme={theme}>
                    <MaterialListItem title="Colors" subtitle="Accent colors and background tints" theme={theme} accent={accent} showDivider onClick={() => setStylePanel("colors")} leading={<ActionGlyph kind="colors" color={accent} size={22} />} />
                    <MaterialListItem title="Images" subtitle="Header wallpaper and decorative accents" theme={theme} accent={accent} showDivider onClick={() => setStylePanel("pictures")} leading={<ActionGlyph kind="pictures" color={accent} size={22} />} />
                    <MaterialListItem title="App icon" subtitle="Home screen launcher appearance" theme={theme} accent={accent} showDivider onClick={() => setStylePanel("icon")} leading={<AppIcon iconId={brand.iconId} size={22} background={iconBackground} foreground={theme.text.onAccent} monogram={monogram} />} />
                    <MaterialListItem title="Brand" subtitle="App name and tagline" theme={theme} accent={accent} showDivider onClick={() => setStylePanel("brand")} leading={<ActionGlyph kind="brand" color={accent} size={22} />} />
                    <MaterialListItem title="Session rules" subtitle="Auto-advance, breaks, and confirmations" theme={theme} accent={accent} onClick={() => setStylePanel("session")} leading={<ActionGlyph kind="rules" color={accent} size={22} />} />
                  </MaterialListGroup>
                </>
              )}

              {stylePanel === "brand" && (
                <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}>
                  <CardHeader>App branding</CardHeader>
                  <CardBody>
                    <Stack gap={12}>
                      <Stack gap={6}><Text size="small" tone="secondary">App name</Text><TextInput value={brand.appName} onChange={(v) => updateBrand("appName", v)} /></Stack>
                      <Stack gap={6}><Text size="small" tone="secondary">Tagline</Text><TextInput value={brand.tagline} onChange={(v) => updateBrand("tagline", v)} placeholder="Sequential task timer" /></Stack>
                      <PreferenceRow title="Show name under icon" description="Show the app name under the launcher icon." checked={brand.showNameOnLauncher} onChange={(v) => updateBrand("showNameOnLauncher", v)} />
                    </Stack>
                  </CardBody>
                </Card>
              )}

              {stylePanel === "icon" && (
                <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}>
                  <CardHeader>App icon</CardHeader>
                  <CardBody>
                    <Stack gap={14}>
                      <Grid columns={3} gap={8}>
                        {ICON_OPTIONS.map((option) => (
                          <div key={option.id}>
                            <SleekIconTile
                              label={option.label}
                              description="Launcher icon"
                              theme={theme}
                              accent={accent}
                              active={brand.iconId === option.id}
                              compact
                              icon={<AppIcon iconId={option.id} size={32} background={iconBackground} foreground={theme.text.onAccent} monogram={monogram} />}
                              onClick={() => updateBrand("iconId", option.id)}
                            />
                          </div>
                        ))}
                      </Grid>
                      <Row gap={8} wrap>
                        <Button variant="secondary" onClick={() => { updateBrand("iconId", "custom_gallery"); updateBrand("customIconName", mockUploadName("gallery", "app-icon")); }}>Choose from gallery</Button>
                        <Button variant="secondary" onClick={() => { updateBrand("iconId", "custom_camera"); updateBrand("customIconName", mockUploadName("camera", "app-icon")); }}>Take a photo</Button>
                      </Row>
                      {brand.customIconName ? <Text size="small" tone="tertiary">Selected file: {brand.customIconName}</Text> : null}
                      <ColorPickerRow label="Icon background" value={brand.iconBackground} onChange={(c) => updateBrand("iconBackground", c)} />
                    </Stack>
                  </CardBody>
                </Card>
              )}

              {stylePanel === "colors" && (
                <>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardHeader>App colors</CardHeader>
                    <CardBody>
                      <Stack gap={16}>
                        {THEME_COLOR_FIELDS.map((field) => (
                          <div key={field.key}>
                            <ThemeColorField
                              label={field.label}
                              hint={field.hint}
                              value={themeColors[field.key] as Color}
                              onChange={(color) => updateThemeColor(field.key, color)}
                            />
                          </div>
                        ))}
                        <Stack gap={6}>
                          <Text size="small" weight="semibold">Background strength</Text>
                          <Text size="small" tone="tertiary">How strong the background tint looks.</Text>
                          <Select
                            value={themeColors.bgStrength}
                            onChange={(v) => updateThemeColor("bgStrength", v as BgStrength)}
                            options={[
                              { value: "soft", label: "Soft wash" },
                              { value: "medium", label: "Medium wash" },
                              { value: "deep", label: "Deep wash" },
                            ]}
                          />
                        </Stack>
                        <Stack gap={6}>
                          <Text size="small" tone="secondary">Timer ring style</Text>
                          <Select value={brand.timerStyle} onChange={(v) => updateBrand("timerStyle", v as TimerStyle)} options={[{ value: "minimal", label: "Slim ring" }, { value: "classic", label: "Classic ring" }, { value: "bold", label: "Bold ring" }]} />
                        </Stack>
                        <PreferenceRow title="Giant timer digits" description="Easier to read while the timer runs." checked={prefs.largeTimerText} onChange={(v) => updatePrefs("largeTimerText", v)} />
                        <Button variant="ghost" onClick={() => setThemeColors(DEFAULT_THEME)}>Reset to default colors</Button>
                      </Stack>
                    </CardBody>
                  </Card>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardHeader>Task colors</CardHeader>
                    <CardBody>
                      <Grid columns={2} gap={10}>
                        {tasks.map((task) => (
                          <div key={task.id}>
                            <VisualTile
                              label={task.name}
                              caption={formatDuration(task.durationSeconds)}
                              background={theme.fill.quaternary}
                              foreground={theme.text.primary}
                              onClick={() => {}}
                              icon={<ImageArt slot={task.image} size={28} theme={theme} primary={theme.category[task.color]} secondary={panelBg} />}
                              wide
                            />
                            <div style={{ marginTop: 8 }}>
                              <ColorPickerRow label="" value={task.color} onChange={(color) => setTasks(tasks.map((t) => (t.id === task.id ? { ...t, color } : t)))} disabled={isRunning} />
                            </div>
                          </div>
                        ))}
                      </Grid>
                    </CardBody>
                  </Card>
                </>
              )}

              {stylePanel === "pictures" && (
                <>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardHeader>Header image</CardHeader>
                    <CardBody>
                      <ImagePickerGrid value={appImages.mascot} onChange={(slot) => updateAppImage("mascot", slot)} theme={theme} accent={accent} uploadPrefix="mascot" />
                    </CardBody>
                  </Card>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardHeader>Header wallpaper</CardHeader>
                    <CardBody>
                      <ImagePickerGrid value={appImages.headerWallpaper} onChange={(slot) => updateAppImage("headerWallpaper", slot)} theme={theme} accent={accent} uploadPrefix="wallpaper" />
                    </CardBody>
                  </Card>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardHeader>Timer accent</CardHeader>
                    <CardBody>
                      <ImagePickerGrid value={appImages.timerMascot} onChange={(slot) => updateAppImage("timerMascot", slot)} theme={theme} accent={accent} uploadPrefix="timer-mascot" />
                    </CardBody>
                  </Card>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardHeader>Victory banner</CardHeader>
                    <CardBody>
                      <ImagePickerGrid value={appImages.victoryBanner} onChange={(slot) => updateAppImage("victoryBanner", slot)} theme={theme} accent={accent} uploadPrefix="victory" />
                    </CardBody>
                  </Card>
                  <Card variant="borderless" style={{ background: surface, borderRadius: RADIUS_LG }}>
                    <CardHeader>Task images</CardHeader>
                    <CardBody>
                      <Stack gap={14}>
                        {tasks.map((task) => (
                          <div key={task.id}>
                            <Stack gap={8}>
                              <Text size="small" weight="semibold">{task.name}</Text>
                              <ImagePickerGrid
                                value={task.image}
                                onChange={(image) => setTasks(tasks.map((t) => (t.id === task.id ? { ...t, image } : t)))}
                                theme={theme}
                                accent={accent}
                                uploadPrefix={`style-task-${task.id}`}
                              />
                            </Stack>
                          </div>
                        ))}
                      </Stack>
                    </CardBody>
                  </Card>
                  <Button variant="ghost" onClick={() => setAppImages(DEFAULT_IMAGES)}>Reset to default images</Button>
                </>
              )}

              {stylePanel === "session" && (
                <Card variant="borderless" style={{ background: shellBg, borderRadius: RADIUS_LG }}>
                  <CardHeader>Session rules</CardHeader>
                  <CardBody>
                    <Stack gap={12}>
                      <PreferenceRow title="Auto-advance tasks" description="Automatically start the next task when one finishes." checked={prefs.autoAdvance} onChange={(v) => updatePrefs("autoAdvance", v)} />
                      <Stack gap={6}>
                        <Text size="small" tone="secondary">Break between tasks</Text>
                        <Select value={String(prefs.breakBetweenTasksSec)} onChange={(v) => updatePrefs("breakBetweenTasksSec", Number.parseInt(v, 10) || 0)} options={[{ value: "0", label: "No pause" }, { value: "5", label: "5 seconds" }, { value: "10", label: "10 seconds" }, { value: "30", label: "30 seconds" }]} />
                      </Stack>
                      <PreferenceRow title="Ask before reset" description="Confirm before restoring the sample routine." checked={prefs.confirmReset} onChange={(v) => updatePrefs("confirmReset", v)} />
                    </Stack>
                  </CardBody>
                </Card>
              )}
            </>
          )}
        </Stack>
        {activeTab === "tasks" ? (
          <MaterialFab label="Task" onClick={addTask} color={accent} foreground={theme.text.onAccent} />
        ) : null}
      </div>
      <MaterialNavigationBar
        active={activeTab}
        onChange={(tab: TabId) => {
          setActiveTab(tab);
          if (tab !== "style") setStylePanel("hub");
        }}
        theme={theme}
        accent={accent}
        surface={surface}
      />
      <AndroidGestureBar theme={theme} surface={surface} />
    </PhoneFrame>
  );
}
