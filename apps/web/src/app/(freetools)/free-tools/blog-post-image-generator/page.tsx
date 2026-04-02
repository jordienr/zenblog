"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Download, ImageIcon, ArrowRight } from "lucide-react";
import { ZendoLogo } from "@/components/ZendoLogo";
import Link from "next/link";
import { FaBrush } from "react-icons/fa6";
import { IconCircleWrapper } from "@/components/icon-circle-wrapper";

import { themes, colorPresets, googleFonts, getThemeById } from "./themes";
import { drawTheme, drawThemePreview } from "./drawing-utils";
import { useQueryState } from "nuqs";

export default function OGImageGenerator() {
  const [title, setTitle] = useQueryState("title", {
    defaultValue: "Announcing Large Scale Inference",
    parse: (value) => decodeURIComponent(value),
    serialize: (value) => encodeURIComponent(value),
  });
  const [description, setDescription] = useQueryState("description", {
    defaultValue: "Batch powered by Modular and SFC!",
    parse: (value) => decodeURIComponent(value),
    serialize: (value) => encodeURIComponent(value),
  });
  const [url, setUrl] = useQueryState("url", {
    defaultValue: "sfcompute.com",
    parse: (value) => decodeURIComponent(value),
    serialize: (value) => encodeURIComponent(value),
  });
  const [selectedTheme, setSelectedTheme] = useQueryState("theme", {
    defaultValue: "minimal",
  });
  const [backgroundColor, setBackgroundColor] = useQueryState("bg", {
    defaultValue: "#3b82f6",
  });
  const [textColor, setTextColor] = useQueryState("text", {
    defaultValue: "#ffffff",
  });
  const [selectedFont, setSelectedFont] = useQueryState("font", {
    defaultValue: "Inter",
  });
  const [fontPreviewKey, setFontPreviewKey] = useState(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [isFontLoading, setIsFontLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  // Handle logo removal and clear URL
  const handleLogoRemove = () => {
    setLogo(null);
    setLogoFile(null);
    // Clear logo from URL if it exists
    const url = new URL(window.location.href);
    url.searchParams.delete("logo");
    window.history.replaceState({}, "", url.toString());
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to format font names for canvas
  const getFormattedFontName = (fontName: string) => {
    // Fonts with spaces need to be wrapped in quotes for canvas
    if (fontName.includes(" ")) {
      return `"${fontName}"`;
    }
    return fontName;
  };

  // Helper function to check if a font is loaded
  const isFontLoaded = (fontName: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.fonts && document.fonts.check) {
        // Modern browsers support document.fonts.check
        if (document.fonts.check(`12px ${getFormattedFontName(fontName)}`)) {
          resolve(true);
        } else {
          // Wait for font to load
          document.fonts.ready.then(() => {
            resolve(
              document.fonts.check(`12px ${getFormattedFontName(fontName)}`)
            );
          });
        }
      } else {
        // Fallback for older browsers
        resolve(true);
      }
    });
  };

  // Load Google Fonts and restore state from URL on component mount
  useEffect(() => {
    // Load all fonts at once for the dropdown
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@400;600;700&family=Nunito:wght@400;600;700&family=Space+Mono:wght@400;600;700&family=Instrument+Serif:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Serif:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600;700&family=Silkscreen:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Note: Logo restoration from URL hash would require server-side storage
    // For now, we'll just restore the other theming options which are handled by nuqs

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  // Handle font changes and redraw canvas
  useEffect(() => {
    // Update font preview immediately
    setFontPreviewKey((prev) => prev + 1);

    // Wait for font to load, then update loading state
    const redrawCanvas = async () => {
      setIsFontLoading(true);
      try {
        await isFontLoaded(selectedFont);
        // Small delay to ensure font is fully rendered
        setTimeout(() => {
          setIsFontLoading(false);
        }, 100);
      } catch (error) {
        console.warn("Font loading check failed, proceeding anyway:", error);
        // Fallback: update loading state after a delay
        setTimeout(() => {
          setIsFontLoading(false);
        }, 200);
      }
    };

    redrawCanvas();
  }, [selectedFont]);

  // Generate canvas image when any theming option changes
  useEffect(() => {
    // Add a small delay to ensure state is fully updated
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        generateImage();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [
    title,
    description,
    url,
    selectedTheme,
    backgroundColor,
    textColor,
    selectedFont,
    logo,
  ]);

  // Redraw theme previews when content changes
  useEffect(() => {
    const redrawPreviews = async () => {
      // Wait for font to load before drawing previews
      try {
        await isFontLoaded(selectedFont);
      } catch (error) {
        console.warn("Font loading check failed for previews:", error);
      }

      const canvasElements = document.querySelectorAll('canvas[width="96"]');
      canvasElements.forEach((canvas) => {
        if (canvas instanceof HTMLCanvasElement) {
          const themeId = canvas
            .closest("[data-theme-id]")
            ?.getAttribute("data-theme-id");
          if (themeId) {
            const themeConfig = getThemeById(themeId);
            if (themeConfig) {
              drawThemePreview(canvas, themeConfig, {
                title,
                description,
                url,
                logo,
                selectedFont,
                backgroundColor,
                textColor,
                styling: themeConfig.styling,
              });
            }
          }
        }
      });
    };

    redrawPreviews();
  }, [title, description, backgroundColor, textColor, selectedFont]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (Open Graph standard: 1200x630)
    canvas.width = 1200;
    canvas.height = 630;

    // Get current theme configuration
    const theme = getThemeById(selectedTheme);
    if (!theme) return;

    // Clear canvas with theme background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the theme using the new system
    drawTheme(ctx, theme, {
      title,
      description,
      url,
      logo,
      selectedFont,
      backgroundColor,
      textColor,
      styling: theme.styling,
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setLogo(result);
          // Store logo hash in URL for sharing (base64 is too long)
          const logoHash = btoa(
            file.name + file.size + file.lastModified
          ).replace(/[^a-zA-Z0-9]/g, "");
          const url = new URL(window.location.href);
          url.searchParams.set("logo", logoHash);
          window.history.replaceState({}, "", url.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `og-image-${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-background flex h-screen max-h-screen flex-col">
      <header className="border-border border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ZendoLogo size={40} hideText />
              <div className="flex flex-col">
                <h1 className="text-foreground font-medium">
                  Blog Post Image Generator
                </h1>
                <p className="text-muted-foreground -mt-px text-sm font-medium">
                  A free tool by Zenblog
                </p>
              </div>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/" className="flex items-center gap-1 font-medium">
                Try Zenblog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-slate-100">
        <div className="flex h-full">
          <aside className="w-80 space-y-8 overflow-y-auto border-r bg-white p-4 pb-32">
            {/* Theme Picker */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Theme</Label>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsThemeDialogOpen(true)}
                >
                  <FaBrush className="mr-2 h-4 w-4" />
                  {themes.find((t) => t.id === selectedTheme)?.name ||
                    "Choose Theme"}
                </Button>
              </div>
            </div>

            {/* Font Picker */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Font Family
                </Label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {googleFonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font, fontSize: "14px" }}>
                          {font}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-foreground text-sm font-medium">Content</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-muted-foreground text-sm"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog post title"
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-muted-foreground text-sm"
                  >
                    Description (optional)
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="url"
                    className="text-muted-foreground text-sm"
                  >
                    URL (optional)
                  </Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="your-website.com"
                    className="border-border"
                  />
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-border border-t"></div>

            {/* Logo / Emoji / Icon Picker */}
            <div className="space-y-4">
              <h2 className="text-foreground text-sm font-medium">
                Logo / Icon
              </h2>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="h-12 w-full justify-start gap-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {logoFile ? logoFile.name : "Upload Logo"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {logo && (
                  <div className="space-y-3">
                    <div className="bg-muted flex justify-center rounded-lg p-4">
                      <img
                        src={logo || "/placeholder.svg"}
                        alt="Logo preview"
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleLogoRemove}
                    >
                      Remove Logo
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="border-border border-t"></div>

            {/* Color / Gradient Pickers */}
            <div className="space-y-4">
              <h2 className="text-foreground text-sm font-medium">Colors</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-6 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      className="border-border h-8 w-8 rounded border transition-transform hover:scale-105"
                      style={{ backgroundColor: preset.bg }}
                      onClick={() => {
                        setBackgroundColor(preset.bg);
                        setTextColor(preset.text);
                      }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="border-border h-10 w-12 p-1"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="border-border flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Text
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="border-border h-10 w-12 p-1"
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="border-border flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="mx-auto max-w-2xl flex-1 px-4 pt-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1.5 text-sm font-medium">
                <h2 className="text-foreground">Preview</h2>
                <p className="text-muted-foreground">1200 × 630</p>
              </div>

              <div className="overflow-hidden border">
                <canvas
                  ref={canvasRef}
                  className="h-auto w-full max-w-full bg-white"
                  style={{ aspectRatio: "1200/630" }}
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={exportImage}
                  variant="outline"
                  className="gap-2 rounded-full"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Theme Picker Dialog */}
      <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              <IconCircleWrapper className="bg-blue-500 text-white">
                <FaBrush className="rotate-[145deg]" size={16} />
              </IconCircleWrapper>
              Choose Theme
            </DialogTitle>
            <DialogDescription>
              Select a theme template for your blog post image
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                data-theme-id={theme.id}
                className={`group cursor-pointer rounded-lg border-2 p-5 transition-all ${
                  selectedTheme === theme.id
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-border bg-background hover:bg-muted/50 hover:border-blue-500/50"
                }`}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  setIsThemeDialogOpen(false);
                }}
              >
                <div className="mx-auto mb-4 flex items-center justify-center rounded">
                  <canvas
                    className="h-16 w-24 rounded"
                    width={96}
                    height={64}
                    ref={(canvas) => {
                      if (canvas) {
                        const themeConfig = getThemeById(theme.id);
                        if (themeConfig) {
                          drawThemePreview(canvas, themeConfig, {
                            title,
                            description,
                            url,
                            logo,
                            selectedFont,
                            backgroundColor,
                            textColor,
                            styling: themeConfig.styling,
                          });
                        }
                      }
                    }}
                  />
                </div>
                <h3
                  className={`mb-1 text-center text-sm font-medium ${
                    selectedTheme === theme.id
                      ? "text-blue-600"
                      : "text-foreground"
                  }`}
                >
                  {theme.name}
                </h3>
                <p className="text-muted-foreground text-center text-xs leading-relaxed">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
