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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, ImageIcon } from "lucide-react";

// Layout templates
const layouts = [
  { id: "minimal", name: "Minimal" },
  { id: "centered", name: "Centered" },
  { id: "split", name: "Split" },
  { id: "card", name: "Card" },
];

const colorPresets = [
  { name: "Blue", bg: "#3b82f6", text: "#ffffff" },
  { name: "Slate", bg: "#64748b", text: "#ffffff" },
  { name: "Dark", bg: "#1e293b", text: "#ffffff" },
  { name: "Light", bg: "#f8fafc", text: "#1e293b" },
  { name: "White", bg: "#ffffff", text: "#1e293b" },
  { name: "Gray", bg: "#94a3b8", text: "#ffffff" },
];

// Google Fonts options
const googleFonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Source Sans Pro",
  "Nunito",
];

export default function OGImageGenerator() {
  const [title, setTitle] = useState("Announcing Large Scale Inference");
  const [description, setDescription] = useState(
    "Batch powered by Modular and SFC!"
  );
  const [url, setUrl] = useState("sfcompute.com");
  const [selectedLayout, setSelectedLayout] = useState("minimal");
  const [backgroundColor, setBackgroundColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Google Font dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(
      " ",
      "+"
    )}:wght@400;600;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFont]);

  // Generate canvas image
  useEffect(() => {
    generateImage();
  }, [
    title,
    description,
    url,
    selectedLayout,
    backgroundColor,
    textColor,
    selectedFont,
    logo,
  ]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (Open Graph standard: 1200x630)
    canvas.width = 1200;
    canvas.height = 630;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Draw based on selected layout
    switch (selectedLayout) {
      case "minimal":
        drawMinimalLayout(ctx);
        break;
      case "centered":
        drawCenteredLayout(ctx);
        break;
      case "split":
        drawSplitLayout(ctx);
        break;
      case "card":
        drawCardLayout(ctx);
        break;
      default:
        drawMinimalLayout(ctx);
    }
  };

  const drawMinimalLayout = (ctx: CanvasRenderingContext2D) => {
    // Logo
    if (logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 80, 80, 60, 60);
      };
      img.src = logo;
    }

    // Title
    ctx.font = `bold 64px ${selectedFont}, sans-serif`;
    const titleLines = wrapText(ctx, title, 1000);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 80, 180 + index * 80);
    });

    // Description
    ctx.font = `32px ${selectedFont}, sans-serif`;
    ctx.fillText(description, 80, 350);

    // URL
    ctx.font = `24px ${selectedFont}, sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(url, 80, 550);
    ctx.globalAlpha = 1;
  };

  const drawCenteredLayout = (ctx: CanvasRenderingContext2D) => {
    ctx.textAlign = "center";

    // Logo
    if (logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 570, 100, 60, 60);
      };
      img.src = logo;
    }

    // Title
    ctx.font = `bold 56px ${selectedFont}, sans-serif`;
    const titleLines = wrapText(ctx, title, 1000);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 600, 220 + index * 70);
    });

    // Description
    ctx.font = `28px ${selectedFont}, sans-serif`;
    ctx.fillText(description, 600, 380);

    // URL
    ctx.font = `22px ${selectedFont}, sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(url, 600, 520);
    ctx.globalAlpha = 1;
  };

  const drawSplitLayout = (ctx: CanvasRenderingContext2D) => {
    // Left side content
    ctx.textAlign = "left";

    // Logo
    if (logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 80, 100, 50, 50);
      };
      img.src = logo;
    }

    // Title
    ctx.font = `bold 48px ${selectedFont}, sans-serif`;
    const titleLines = wrapText(ctx, title, 500);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 80, 200 + index * 60);
    });

    // Description
    ctx.font = `24px ${selectedFont}, sans-serif`;
    ctx.fillText(description, 80, 380);

    // URL
    ctx.font = `20px ${selectedFont}, sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(url, 80, 500);
    ctx.globalAlpha = 1;

    // Right side decoration
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = textColor;
    ctx.fillRect(700, 0, 500, 630);
    ctx.globalAlpha = 1;
    ctx.fillStyle = textColor;
  };

  const drawCardLayout = (ctx: CanvasRenderingContext2D) => {
    // Card background
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(100, 100, 1000, 430);

    // Reset text color
    ctx.fillStyle = textColor;

    // Logo
    if (logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 150, 150, 50, 50);
      };
      img.src = logo;
    }

    // Title
    ctx.font = `bold 52px ${selectedFont}, sans-serif`;
    const titleLines = wrapText(ctx, title, 800);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 150, 240 + index * 65);
    });

    // Description
    ctx.font = `26px ${selectedFont}, sans-serif`;
    ctx.fillText(description, 150, 400);

    // URL
    ctx.font = `22px ${selectedFont}, sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(url, 150, 470);
    ctx.globalAlpha = 1;
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(" ");
    if (words.length === 0 || !words[0]) return [];

    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
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
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-muted-foreground h-6 w-6" />
              <h1 className="text-foreground text-xl font-medium">
                OG Image Generator
              </h1>
            </div>
            <Button onClick={exportImage} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            {/* Layout Selection */}
            <div className="space-y-4">
              <h2 className="text-foreground text-sm font-medium">Layout</h2>
              <div className="grid grid-cols-2 gap-3">
                {layouts.map((layout) => (
                  <Button
                    key={layout.id}
                    variant={
                      selectedLayout === layout.id ? "default" : "outline"
                    }
                    className="h-12 text-sm"
                    onClick={() => setSelectedLayout(layout.id)}
                  >
                    {layout.name}
                  </Button>
                ))}
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
                    Description
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
                    URL
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

            {/* Logo Upload */}
            <div className="space-y-4">
              <h2 className="text-foreground text-sm font-medium">Logo</h2>
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
                  <div className="bg-muted flex justify-center rounded-lg p-4">
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="Logo preview"
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Styling */}
            <div className="space-y-4">
              <h2 className="text-foreground text-sm font-medium">Styling</h2>
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="fonts">Fonts</TabsTrigger>
                </TabsList>
                <TabsContent value="colors" className="space-y-6">
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
                </TabsContent>
                <TabsContent value="fonts" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Font Family
                    </Label>
                    <Select
                      value={selectedFont}
                      onValueChange={setSelectedFont}
                    >
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {googleFonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-foreground text-sm font-medium">Preview</h2>
                <p className="text-muted-foreground text-sm">
                  1200 × 630 pixels
                </p>
              </div>

              <div className="border-border bg-muted/30 overflow-hidden rounded-lg border">
                <canvas
                  ref={canvasRef}
                  className="h-auto w-full max-w-full"
                  style={{ aspectRatio: "1200/630" }}
                />
              </div>

              <div className="flex justify-center">
                <Button onClick={exportImage} size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
