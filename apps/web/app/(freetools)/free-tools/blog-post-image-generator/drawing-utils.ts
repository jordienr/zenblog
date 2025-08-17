import type { ThemeConfig, DrawingConfig } from "./themes";

// Helper function to format font names for canvas
export const getFormattedFontName = (fontName: string): string => {
  // Fonts with spaces need to be wrapped in quotes for canvas
  if (fontName.includes(" ")) {
    return `"${fontName}"`;
  }
  return fontName;
};

// Helper function to wrap text to fit within maxWidth
export const wrapText = (
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

// Main drawing function that uses theme configuration
export const drawTheme = (
  ctx: CanvasRenderingContext2D,
  theme: ThemeConfig,
  config: DrawingConfig
): void => {
  const { layout, styling, textAlign, customDraw } = theme;

  // Set text properties
  ctx.textAlign = textAlign;
  ctx.textBaseline = "top";

  // Apply custom drawing if theme has it
  if (customDraw) {
    // Create a config object that includes theme styling for custom draw functions
    const configWithStyling = {
      ...config,
      styling: theme.styling,
    };
    customDraw(ctx, configWithStyling);
  }

  // Draw logo if exists
  if (config.logo) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(
        img,
        layout.logo.x,
        layout.logo.y,
        layout.logo.width,
        layout.logo.height
      );
    };
    img.src = config.logo;
  }

  // Draw title
  ctx.font = `${layout.title.fontWeight} ${
    layout.title.fontSize
  }px ${getFormattedFontName(config.selectedFont)}, sans-serif`;
  ctx.fillStyle = config.textColor;
  const titleLines = wrapText(ctx, config.title, layout.title.maxWidth);
  titleLines.forEach((line, index) => {
    ctx.fillText(
      line,
      layout.title.x,
      layout.title.y + index * layout.title.lineHeight
    );
  });

  // Draw description
  ctx.font = `${layout.description.fontWeight} ${
    layout.description.fontSize
  }px ${getFormattedFontName(config.selectedFont)}, sans-serif`;
  ctx.fillText(config.description, layout.description.x, layout.description.y);

  // Draw URL
  ctx.font = `${layout.url.fontWeight} ${
    layout.url.fontSize
  }px ${getFormattedFontName(config.selectedFont)}, sans-serif`;
  ctx.globalAlpha = layout.url.opacity;
  ctx.fillText(config.url, layout.url.x, layout.url.y);
  ctx.globalAlpha = 1;
};

// Preview drawing function for theme picker
export const drawThemePreview = (
  canvas: HTMLCanvasElement,
  theme: ThemeConfig,
  config: DrawingConfig
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size
  canvas.width = 64;
  canvas.height = 64;

  // Clear canvas with background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, 64, 64);

  // Scale factor: 64/1200 = 0.0533 for width, 64/630 = 0.1016 for height
  const scaleX = 64 / 1200;
  const scaleY = 64 / 630;

  // Helper function to scale coordinates
  const scale = (value: number) => value * scaleX;
  const scaleYCoord = (value: number) => value * scaleY;

  // Create scaled config for preview
  const scaledConfig: DrawingConfig = {
    ...config,
    selectedFont: getFormattedFontName(config.selectedFont),
    styling: theme.styling,
  };

  // Create scaled theme for preview
  const scaledTheme: ThemeConfig = {
    ...theme,
    layout: {
      logo: {
        x: scale(theme.layout.logo.x),
        y: scaleYCoord(theme.layout.logo.y),
        width: scale(theme.layout.logo.width),
        height: scaleYCoord(theme.layout.logo.height),
      },
      title: {
        x: scale(theme.layout.title.x),
        y: scaleYCoord(theme.layout.title.y),
        maxWidth: scale(theme.layout.title.maxWidth),
        lineHeight: scaleYCoord(theme.layout.title.lineHeight),
        fontSize: Math.max(4, scaleYCoord(theme.layout.title.fontSize)),
        fontWeight: theme.layout.title.fontWeight,
      },
      description: {
        x: scale(theme.layout.description.x),
        y: scaleYCoord(theme.layout.description.y),
        maxWidth: scale(theme.layout.description.maxWidth),
        fontSize: Math.max(3, scaleYCoord(theme.layout.description.fontSize)),
        fontWeight: theme.layout.description.fontWeight,
      },
      url: {
        x: scale(theme.layout.url.x),
        y: scaleYCoord(theme.layout.url.y),
        fontSize: Math.max(2, scaleYCoord(theme.layout.url.fontSize)),
        fontWeight: theme.layout.url.fontWeight,
        opacity: theme.layout.url.opacity,
      },
    },
    styling: theme.styling,
    textAlign: theme.textAlign,
    customDraw: theme.customDraw
      ? (ctx, config) => {
          // Scale the custom drawing for preview
          ctx.save();
          ctx.scale(scaleX, scaleY);
          // Create a config object that includes theme styling for custom draw functions
          const configWithStyling = {
            ...config,
            styling: theme.styling,
          };
          theme.customDraw!(ctx, configWithStyling);
          ctx.restore();
        }
      : undefined,
  };

  // Draw the scaled theme
  drawTheme(ctx, scaledTheme, scaledConfig);
};
