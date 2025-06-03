import { useStore } from "@/store/store";
import { defaultPresets } from "@/themes/theme-presets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/context/theme-context";
import type { ThemePreset } from "@/themes/theme-types";

function ColorPreview({ colors }: { colors: { [key: string]: string } }) {
  return (
    <div className="flex gap-1">
      <div
        className="size-3 rounded-sm border"
        style={{ backgroundColor: colors.background }}
        title="Background"
      />
      <div
        className="size-3 rounded-sm border"
        style={{ backgroundColor: colors.primary }}
        title="Primary"
      />
      <div
        className="size-3 rounded-sm border"
        style={{ backgroundColor: colors.secondary }}
        title="Secondary"
      />
      <div
        className="size-3 rounded-sm border"
        style={{ backgroundColor: colors.accent }}
        title="Accent"
      />
    </div>
  );
}

const getThemeStyle = (preset: ThemePreset, mode: "light" | "dark") => {
  return {
    color: preset.styles[mode].foreground,
    borderColor: preset.styles[mode].border,
    "--radius": preset.styles[mode].radius,
    padding: preset.styles[mode].spacing,
    fontFamily: preset.styles[mode]["font-sans"],
  };
};

export function ThemeSelector() {
  const { theme } = useTheme();
  const { selectedThemePreset, setSelectedThemePreset } = useStore();

  return (
    <div className="space-y-2">
      <Select
        value={selectedThemePreset}
        onValueChange={setSelectedThemePreset}
      >
        <SelectTrigger className="w-[280px]">
          <div className="flex items-center gap-2">
            <SelectValue placeholder="Select theme" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(defaultPresets).map(([key, preset]) => (
            <SelectItem key={key} value={key}>
              <div
                className="w-full flex items-center justify-between gap-4"
                style={getThemeStyle(
                  preset,
                  theme === "dark" ? "dark" : "light"
                )}
              >
                <ColorPreview colors={preset.styles.light} />
                <span>{preset.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
