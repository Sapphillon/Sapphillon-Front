/**
 * @fileoverview 既存ワークフローの実行を管理するカスタムフック
 *
 * @module pages/workflows/useWorkflowRun
 */

import React from "react";
import { clients } from "@/lib/grpc-clients";
import type { RunWorkflowResponse } from "@/gen/sapphillon/v1/workflow_service_pb";
import { WorkflowSourceByIdSchema } from "@/gen/sapphillon/v1/workflow_service_pb";
import type { Workflow } from "@/gen/sapphillon/v1/workflow_pb";
import { create } from "@bufbuild/protobuf";

/**
 * ワークフロー実行中のイベント
 */
export type RunEvent = {
  /** イベント発生時刻（Unixタイムスタンプ） */
  t: number;
  /** イベント種別 */
  kind: "message" | "error" | "done";
  /** イベントのペイロード（種別により異なる） */
  payload?: unknown;
};

/**
 * useWorkflowRunフックの戻り値
 */
export interface UseWorkflowRunReturn {
  /** 現在実行中かどうか */
  running: boolean;
  /** 実行中に発生したイベントのリスト */
  events: RunEvent[];
  /** ワークフロー実行結果 */
  runRes: RunWorkflowResponse | null;
  /** ワークフローを実行（ID指定） */
  runById: (workflowId: string, workflowCodeId?: string) => Promise<void>;
  /** ワークフローを実行（定義指定） */
  runByDefinition: (workflow: Workflow) => Promise<void>;
  /** イベントログをクリア */
  clearEvents: () => void;
}

/**
 * ワークフロー実行フック
 *
 * 既存のワークフローを実行するための状態管理とロジックを提供します。
 *
 * @returns ワークフロー実行のための状態と関数
 */
export function useWorkflowRun(): UseWorkflowRunReturn {
  const [running, setRunning] = React.useState(false);
  const [events, setEvents] = React.useState<RunEvent[]>([]);
  const [runRes, setRunRes] = React.useState<RunWorkflowResponse | null>(null);

  const append = React.useCallback((e: Omit<RunEvent, "t">) => {
    setEvents((prev) => [...prev, { t: Date.now(), ...e }]);
  }, []);

  const runById = React.useCallback(
    async (workflowId: string, workflowCodeId?: string) => {
      if (running) return;
      setEvents([]);
      setRunRes(null);
      setRunning(true);
      try {
        append({ kind: "message", payload: { stage: "run", status: "start" } });
        const res = await clients.workflow.runWorkflow({
          byId: create(WorkflowSourceByIdSchema, {
            workflowId,
            workflowCodeId: workflowCodeId || "",
          }),
        });
        setRunRes(res);
        append({ kind: "message", payload: res });
        append({ kind: "done", payload: { stage: "run" } });
      } catch (e) {
        append({ kind: "error", payload: e });
      } finally {
        setRunning(false);
      }
    },
    [append, running]
  );

  /**
   * ワークフロー定義から直接実行（非推奨）
   *
   * 注意: API v0.9.0 以降、直接ワークフロー定義から実行する機能は削除されました。
   * ワークフローを実行するには、まず保存してから runById を使用してください。
   *
   * @deprecated 代わりに runById を使用してください
   */
  const runByDefinition = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_workflow: Workflow) => {
      append({
        kind: "error",
        payload: new Error(
          "Direct workflow definition execution is no longer supported. " +
            "Please save the workflow first and use runById instead."
        ),
      });
    },
    [append]
  );

  const clearEvents = React.useCallback(() => {
    setEvents([]);
  }, []);

  return {
    running,
    events,
    runRes,
    runById,
    runByDefinition,
    clearEvents,
  } as const;
}
