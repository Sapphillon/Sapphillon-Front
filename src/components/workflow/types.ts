/**
 * @fileoverview ワークフロー関連のコンポーネント型定義
 *
 * @module components/workflow/types
 */

import type { Workflow } from "@/gen/sapphillon/v1/workflow_pb";
import type { Statement } from "@babel/types";
import type { ActionType, ImportanceLevel, ViewMode } from "./constants";

/**
 * WorkflowCanvasコンポーネントのProps
 */
export interface WorkflowCanvasProps {
  /** 表示するワークフロー定義 */
  workflow: Workflow;
  /** 背景グリッドを表示するか（デフォルト: true） */
  withBackground?: boolean;
}

/**
 * ワークフローアクション
 *
 * 複数のステートメントをグループ化したもの
 */
export interface WorkflowAction {
  /** アクションのタイプ */
  type: ActionType;
  /** アクションの説明 */
  description: string;
  /** アクションに含まれるステートメント */
  statements: Statement[];
  /** 重要度 */
  importance: ImportanceLevel;
}

/**
 * ActionNodeコンポーネントのProps
 */
export interface ActionNodeProps {
  /** 表示するアクション */
  action: WorkflowAction;
  /** アクションのインデックス */
  index: number;
}

/**
 * AstNodeコンポーネントのProps
 */
export interface AstNodeProps {
  /** 表示するASTノード */
  node: Statement;
  /** ネストの深さ（デフォルト: 0） */
  depth?: number;
  /** 重要なノードのみ表示するか */
  importantOnly?: boolean;
  /** ワークフロー定義（関数定義の検索に使用） */
  workflow?: Workflow;
}

/**
 * NodeContainerコンポーネントのProps
 */
export interface NodeContainerProps {
  /** ノードのタイトル */
  title: string;
  /** ノードのサマリー（1行表示） */
  summary?: string;
  /** ノードのアイコン */
  icon?: React.ReactElement;
  /** ノードのタイプ */
  type?: "action" | "condition" | "loop" | "error";
  /** カラーパレット */
  palette?:
    | "gray"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "green"
    | "teal"
    | "blue"
    | "cyan"
    | "purple"
    | "pink";
  /** 展開/折りたたみ可能か */
  expandable?: boolean;
  /** デフォルトで折りたたまれているか */
  defaultCollapsed?: boolean;
  /** 子要素 */
  children?: React.ReactNode;
}

/**
 * BodyRendererコンポーネントのProps
 */
export interface BodyRendererProps {
  /** レンダリングするステートメント */
  body: Statement | Statement[];
  /** ネストの深さ */
  depth?: number;
  /** セクションのラベル */
  label?: string;
  /** ワークフロー定義 */
  workflow?: Workflow;
}

/**
 * 関数定義情報
 */
export interface FunctionDefinition {
  /** 関数名 */
  name: string;
  /** 関数の説明 */
  description?: string;
  /** パッケージ名 */
  packageName?: string;
  /** パラメータ */
  parameters?: Array<{
    name: string;
    type?: string;
    description?: string;
  }>;
}

/**
 * コード解析結果
 */
export interface ParsedWorkflow {
  /** ワークフロー関数のボディ */
  workflowBody: Statement[] | null;
  /** パースエラー */
  parseError: Error | null;
}

/**
 * ビュー状態
 */
export interface ViewState {
  /** 現在のビューモード */
  mode: ViewMode;
  /** ビューモードを変更する関数 */
  setMode: (mode: ViewMode) => void;
}
