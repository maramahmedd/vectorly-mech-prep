/**
 * TypeScript type definitions for Desmos Calculator API
 * Based on Desmos API v1.11 documentation
 * https://www.desmos.com/api
 */

declare namespace Desmos {
  interface GraphingCalculatorOptions {
    keypad?: boolean;
    graphpaper?: boolean;
    expressions?: boolean;
    settingsMenu?: boolean;
    zoomButtons?: boolean;
    expressionsTopbar?: boolean;
    pointsOfInterest?: boolean;
    trace?: boolean;
    border?: boolean;
    lockViewport?: boolean;
    expressionsCollapsed?: boolean;
    capExpressionSize?: boolean;
    administerSecretFolders?: boolean;
    images?: boolean;
    folders?: boolean;
    notes?: boolean;
    sliders?: boolean;
    links?: boolean;
    qwertyKeyboard?: boolean;
    restrictedFunctions?: boolean;
    forceEnableGeometryFunctions?: boolean;
    pasteGraphLink?: boolean;
    pasteTableData?: boolean;
    plotSingleVariableImplicitEquations?: boolean;
    plotImplicits?: boolean;
    plotInequalities?: boolean;
    degreeMode?: boolean;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    xAxisNumbers?: boolean;
    yAxisNumbers?: boolean;
    polarNumbers?: boolean;
    polarMode?: boolean;
    projectorMode?: boolean;
    invertedColors?: boolean;
    fontSize?: number;
    language?: string;
    brailleMode?: 'none' | 'nemeth' | 'ueb';
    sixKeyInput?: boolean;
    audio?: boolean;
    backgroundColor?: string;
  }

  interface ScientificCalculatorOptions {
    keypad?: boolean;
    expressions?: boolean;
    settingsMenu?: boolean;
    zoomButtons?: boolean;
    expressionsTopbar?: boolean;
    border?: boolean;
    lockViewport?: boolean;
    projectorMode?: boolean;
    degreeMode?: boolean;
    fontSize?: number;
    language?: string;
    brailleMode?: 'none' | 'nemeth' | 'ueb';
    sixKeyInput?: boolean;
    audio?: boolean;
    invertedColors?: boolean;
  }

  interface FourFunctionCalculatorOptions {
    keypad?: boolean;
    expressions?: boolean;
    settingsMenu?: boolean;
    border?: boolean;
    projectorMode?: boolean;
    fontSize?: number;
    language?: string;
    brailleMode?: 'none' | 'nemeth' | 'ueb';
    sixKeyInput?: boolean;
    audio?: boolean;
    invertedColors?: boolean;
  }

  interface Expression {
    id?: string;
    latex?: string;
    color?: string;
    lineStyle?: 'SOLID' | 'DASHED' | 'DOTTED';
    lineWidth?: number;
    lineOpacity?: number;
    pointStyle?: 'POINT' | 'OPEN' | 'CROSS';
    pointSize?: number;
    pointOpacity?: number;
    fillOpacity?: number;
    points?: boolean;
    lines?: boolean;
    dragMode?: 'NONE' | 'X' | 'Y' | 'XY' | 'AUTO';
    secret?: boolean;
    hidden?: boolean;
    type?: string;
    label?: string;
    showLabel?: boolean;
  }

  interface Calculator {
    destroy(): void;
    setBlank(options?: { allowUndo?: boolean }): void;
    setExpression(expression: Expression): void;
    removeExpression(expression: { id: string }): void;
    setExpressions(expressions: Expression[]): void;
    getExpressions(): Expression[];
    updateSettings(settings: Partial<GraphingCalculatorOptions>): void;
    resize(): void;
    screenshot(options?: {
      width?: number;
      height?: number;
      targetPixelRatio?: number;
      preserveAxisNumbers?: boolean;
      mathBounds?: MathBounds;
      showLabels?: boolean;
    }): string;
    asyncScreenshot(
      options: {
        width?: number;
        height?: number;
        targetPixelRatio?: number;
        preserveAxisNumbers?: boolean;
        mathBounds?: MathBounds;
        showLabels?: boolean;
      },
      callback: (dataUri: string) => void
    ): void;
    getState(): any;
    setState(state: any, options?: { allowUndo?: boolean; remapColors?: boolean }): void;
    setDefaultState(state: any): void;
    undo(): void;
    redo(): void;
    clearHistory(): void;
    setMathBounds(bounds: MathBounds): void;
    getMathBounds(): MathBounds;
    observeEvent(eventName: string, callback: (event: any) => void): void;
    unobserveEvent(eventName: string): void;
    observe(property: string, callback: () => void): void;
    unobserve(property: string): void;
  }

  interface MathBounds {
    left: number;
    right: number;
    bottom: number;
    top: number;
  }

  function GraphingCalculator(
    element: HTMLElement,
    options?: GraphingCalculatorOptions
  ): Calculator;

  function ScientificCalculator(
    element: HTMLElement,
    options?: ScientificCalculatorOptions
  ): Calculator;

  function FourFunctionCalculator(
    element: HTMLElement,
    options?: FourFunctionCalculatorOptions
  ): Calculator;

  const enabledFeatures: {
    graphing?: boolean;
    geometry?: boolean;
    scientific?: boolean;
    fourFunction?: boolean;
  };
}

interface Window {
  Desmos: typeof Desmos;
}
