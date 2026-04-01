// Shared theme configuration with type safety
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;

  // Layout and positioning
  layout: {
    logo: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    title: {
      x: number;
      y: number;
      maxWidth: number;
      lineHeight: number;
      fontSize: number;
      fontWeight: string;
    };
    description: {
      x: number;
      y: number;
      maxWidth: number;
      fontSize: number;
      fontWeight: string;
    };
    url: {
      x: number;
      y: number;
      fontSize: number;
      fontWeight: string;
      opacity: number;
    };
  };

  // Visual styling
  styling: {
    backgroundColor: string;
    textColor: string;
    accentColor?: string;
    cardBackground?: string;
    browserChrome?: string;
    codeHeader?: string;
  };

  // Text alignment
  textAlign: "left" | "center" | "right";

  // Custom drawing function for complex themes
  customDraw?: (ctx: CanvasRenderingContext2D, config: DrawingConfig) => void;
}

export interface DrawingConfig {
  title: string;
  description: string;
  url: string;
  logo: string | null;
  selectedFont: string;
  backgroundColor: string;
  textColor: string;
  styling?: {
    backgroundColor: string;
    textColor: string;
    accentColor?: string;
    cardBackground?: string;
    browserChrome?: string;
    codeHeader?: string;
  };
}

// Shared default values
const defaultLayout = {
  logo: {
    x: 80,
    y: 80,
    width: 60,
    height: 60,
  },
  title: {
    x: 80,
    y: 180,
    maxWidth: 1000,
    lineHeight: 80,
    fontSize: 64,
    fontWeight: "normal",
  },
  description: {
    x: 80,
    y: 350,
    maxWidth: 1000,
    fontSize: 32,
    fontWeight: "normal",
  },
  url: {
    x: 80,
    y: 550,
    fontSize: 32,
    fontWeight: "normal",
    opacity: 0.7,
  },
};

const defaultStyling = {
  backgroundColor: "#3b82f6",
  textColor: "#ffffff",
};

// Theme definitions
export const themes: ThemeConfig[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple",
    layout: { ...defaultLayout },
    styling: { ...defaultStyling },
    textAlign: "left",
  },

  {
    id: "centered",
    name: "Centered",
    description: "Balanced and focused",
    layout: {
      logo: {
        x: 570,
        y: 100,
        width: 60,
        height: 60,
      },
      title: {
        x: 600,
        y: 220,
        maxWidth: 1000,
        lineHeight: 70,
        fontSize: 64,
        fontWeight: "bold",
      },
      description: {
        x: 600,
        y: 380,
        maxWidth: 1000,
        fontSize: 28,
        fontWeight: "normal",
      },
      url: {
        x: 600,
        y: 520,
        fontSize: 32,
        fontWeight: "normal",
        opacity: 0.7,
      },
    },
    styling: { ...defaultStyling },
    textAlign: "center",
  },

  {
    id: "split",
    name: "Split",
    description: "Modern two-column",
    layout: {
      logo: {
        x: 80,
        y: 100,
        width: 50,
        height: 50,
      },
      title: {
        x: 80,
        y: 200,
        maxWidth: 500,
        lineHeight: 60,
        fontSize: 48,
        fontWeight: "bold",
      },
      description: {
        x: 80,
        y: 380,
        maxWidth: 500,
        fontSize: 24,
        fontWeight: "normal",
      },
      url: {
        x: 80,
        y: 500,
        fontSize: 20,
        fontWeight: "normal",
        opacity: 0.7,
      },
    },
    styling: { ...defaultStyling },
    textAlign: "left",
    customDraw: (ctx, config) => {
      // Right side decoration
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = config.textColor;
      ctx.fillRect(700, 0, 500, 630);
      ctx.globalAlpha = 1;
      ctx.fillStyle = config.textColor;
    },
  },

  {
    id: "card",
    name: "Card",
    description: "Elegant card design",
    layout: {
      logo: {
        x: 150,
        y: 150,
        width: 50,
        height: 50,
      },
      title: {
        x: 150,
        y: 240,
        maxWidth: 800,
        lineHeight: 65,
        fontSize: 52,
        fontWeight: "bold",
      },
      description: {
        x: 150,
        y: 400,
        maxWidth: 800,
        fontSize: 26,
        fontWeight: "normal",
      },
      url: {
        x: 150,
        y: 470,
        fontSize: 22,
        fontWeight: "normal",
        opacity: 0.7,
      },
    },
    styling: {
      ...defaultStyling,
      cardBackground: "rgba(255, 255, 255, 0.1)",
    },
    textAlign: "left",
    customDraw: (ctx, config) => {
      // Card background
      ctx.fillStyle =
        config.styling?.cardBackground || "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(100, 100, 1000, 430);
      ctx.fillStyle = config.textColor;
    },
  },

  // {
  //   id: "browser",
  //   name: "Browser",
  //   description: "Web browser interface",
  //   layout: {
  //     logo: {
  //       x: 80,
  //       y: 120,
  //       width: 60,
  //       height: 60,
  //     },
  //     title: {
  //       x: 80,
  //       y: 220,
  //       maxWidth: 1000,
  //       lineHeight: 70,
  //       fontSize: 56,
  //       fontWeight: "bold",
  //     },
  //     description: {
  //       x: 80,
  //       y: 400,
  //       maxWidth: 1000,
  //       fontSize: 28,
  //       fontWeight: "normal",
  //     },
  //     url: {
  //       x: 80,
  //       y: 540,
  //       fontSize: 24,
  //       fontWeight: "normal",
  //       opacity: 0.7,
  //     },
  //   },
  //   styling: {
  //     ...defaultStyling,
  //     browserChrome: "#e5e7eb",
  //   },
  //   textAlign: "left",
  //   customDraw: (ctx, config) => {
  //     // Browser chrome (top bar)
  //     ctx.fillStyle = config.styling?.browserChrome || "#e5e7eb";
  //     ctx.fillRect(0, 0, 1200, 80);

  //     // Browser controls (red, yellow, green dots)
  //     ctx.fillStyle = "#ef4444";
  //     ctx.beginPath();
  //     ctx.arc(40, 40, 12, 0, 2 * Math.PI);
  //     ctx.fill();

  //     ctx.fillStyle = "#f59e0b";
  //     ctx.beginPath();
  //     ctx.arc(70, 40, 12, 0, 2 * Math.PI);
  //     ctx.fill();

  //     ctx.fillStyle = "#10b981";
  //     ctx.beginPath();
  //     ctx.arc(100, 40, 12, 0, 2 * Math.PI);
  //     ctx.fill();

  //     // URL bar
  //     ctx.fillStyle = "#ffffff";
  //     ctx.fillRect(150, 25, 800, 30);
  //     ctx.strokeStyle = "#d1d5db";
  //     ctx.lineWidth = 1;
  //     ctx.strokeRect(150, 25, 800, 30);

  //     // URL text
  //     ctx.fillStyle = "#6b7280";
  //     ctx.font = `16px ${config.selectedFont}, sans-serif`;
  //     ctx.fillText(config.url, 160, 45);

  //     // Content area
  //     ctx.fillStyle = config.backgroundColor;
  //     ctx.fillRect(0, 80, 1200, 550);

  //     // Reset text properties for content
  //     ctx.fillStyle = config.textColor;
  //     ctx.textAlign = "left";
  //     ctx.textBaseline = "top";
  //   },
  // },

  // {
  //   id: "codeblock",
  //   name: "Code Block",
  //   description: "Code editor style",
  //   layout: {
  //     logo: {
  //       x: 1000,
  //       y: 80,
  //       width: 40,
  //       height: 40,
  //     },
  //     title: {
  //       x: 80,
  //       y: 100,
  //       maxWidth: 1040,
  //       lineHeight: 60,
  //       fontSize: 48,
  //       fontWeight: "bold",
  //     },
  //     description: {
  //       x: 80,
  //       y: 220,
  //       maxWidth: 1040,
  //       fontSize: 24,
  //       fontWeight: "normal",
  //     },
  //     url: {
  //       x: 80,
  //       y: 280,
  //       fontSize: 18,
  //       fontWeight: "normal",
  //       opacity: 1,
  //     },
  //   },
  //   styling: {
  //     backgroundColor: "#1f2937",
  //     textColor: "#e2e8f0",
  //     codeHeader: "#374151",
  //   },
  //   textAlign: "left",
  //   customDraw: (ctx, config) => {
  //     // Code block background
  //     ctx.fillStyle = config.styling?.backgroundColor || "#1f2937";
  //     ctx.fillRect(0, 0, 1200, 630);

  //     // Code block header
  //     ctx.fillStyle = config.styling?.codeHeader || "#374151";
  //     ctx.fillRect(0, 0, 1200, 60);

  //     // Code block controls (dots)
  //     ctx.fillStyle = "#ef4444";
  //     ctx.beginPath();
  //     ctx.arc(40, 30, 8, 0, 2 * Math.PI);
  //     ctx.fill();

  //     ctx.fillStyle = "#f59e0b";
  //     ctx.beginPath();
  //     ctx.arc(60, 30, 8, 0, 2 * Math.PI);
  //     ctx.fill();

  //     ctx.fillStyle = "#10b981";
  //     ctx.beginPath();
  //     ctx.arc(80, 30, 8, 0, 2 * Math.PI);
  //     ctx.fill();

  //     // File name
  //     ctx.fillStyle = "#9ca3af";
  //     ctx.font = `16px ${config.selectedFont}, sans-serif`;
  //     ctx.textAlign = "center";
  //     ctx.fillText("blog-post.md", 600, 35);

  //     // Reset text alignment for content
  //     ctx.textAlign = "left";
  //   },
  // },
];

// Helper function to get theme by ID
export const getThemeById = (id: string): ThemeConfig | undefined => {
  return themes.find((theme) => theme.id === id);
};

// Helper function to get default theme
export const getDefaultTheme = (): ThemeConfig => {
  return themes[0]!;
};

// Color presets
export const colorPresets = [
  { name: "Blue", bg: "oklch(54.6% 0.245 262.881)", text: "#ffffff" },
  { name: "Dark", bg: "#1e293b", text: "#ffffff" },
  { name: "Light", bg: "#f8fafc", text: "#1e293b" },
  { name: "White", bg: "#ffffff", text: "#1e293b" },
];

// Google Fonts options
export const googleFonts = [
  "Inter",
  "Poppins",
  "Nunito",
  "Space Mono",
  "Instrument Serif",
  "IBM Plex Sans",
  "IBM Plex Serif",
  "IBM Plex Mono",
  "Silkscreen",
];
