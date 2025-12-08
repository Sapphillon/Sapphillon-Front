import { create } from "@bufbuild/protobuf";
import type { Workflow } from "@/gen/sapphillon/v1/workflow_pb";
import {
  WorkflowSchema,
  WorkflowLanguage,
  WorkflowResultSchema,
  WorkflowResultType,
} from "@/gen/sapphillon/v1/workflow_pb";
import type { PluginPackage } from "@/gen/sapphillon/v1/plugin_pb";
import {
  PluginPackageSchema,
  PluginFunctionSchema,
  FunctionDefineSchema,
  FunctionParameterSchema,
} from "@/gen/sapphillon/v1/plugin_pb";
import {
  PermissionSchema,
  AllowedPermissionSchema,
  PermissionType,
  PermissionLevel,
} from "@/gen/sapphillon/v1/permission_pb";

// モックデータストア
const workflows: Workflow[] = [];
const plugins: PluginPackage[] = [];

// ヘルパー関数: タイムスタンプを作成
function createTimestamp(): { seconds: bigint; nanos: number } {
  return {
    seconds: BigInt(Math.floor(Date.now() / 1000)),
    nanos: 0,
  };
}

// 初期モックデータを生成
export function initializeMockData() {
  if (plugins.length === 0) {
    // プラグイン1: 通知プラグイン
    plugins.push(
      create(PluginPackageSchema, {
        packageId: "com.sapphillon.notifications",
        packageName: "通知プラグイン",
        packageVersion: "1.2.0",
        description: "メールやSlackなどの通知を送信するプラグイン",
        pluginStoreUrl:
          "https://plugins.sapphillon.com/com.sapphillon.notifications",
        verified: true,
        internalPlugin: false,
        deprecated: false,
        installedAt: createTimestamp(),
        updatedAt: createTimestamp(),
        functions: [
          create(PluginFunctionSchema, {
            functionId: "send_email",
            functionName: "メール送信",
            description: "メールを送信します",
            functionDefine: create(FunctionDefineSchema, {
              parameters: [
                create(FunctionParameterSchema, {
                  name: "to",
                  type: "string",
                  description: "送信先メールアドレス",
                }),
                create(FunctionParameterSchema, {
                  name: "subject",
                  type: "string",
                  description: "メール件名",
                }),
                create(FunctionParameterSchema, {
                  name: "body",
                  type: "string",
                  description: "メール本文",
                }),
              ],
              returns: [
                create(FunctionParameterSchema, {
                  name: "success",
                  type: "boolean",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "messageId",
                  type: "string",
                  description: "",
                }),
              ],
            }),
            permissions: [
              create(PermissionSchema, {
                displayName: "メール送信",
                description: "メールを送信する権限",
                permissionType: PermissionType.EXECUTE,
                resource: ["notifications/email"],
                permissionLevel: PermissionLevel.MEDIUM,
              }),
            ],
          }),
          create(PluginFunctionSchema, {
            functionId: "send_slack",
            functionName: "Slack通知",
            description: "Slackチャンネルにメッセージを送信します",
            functionDefine: create(FunctionDefineSchema, {
              parameters: [
                create(FunctionParameterSchema, {
                  name: "channel",
                  type: "string",
                  description: "Slackチャンネル名",
                }),
                create(FunctionParameterSchema, {
                  name: "message",
                  type: "string",
                  description: "送信メッセージ",
                }),
              ],
              returns: [
                create(FunctionParameterSchema, {
                  name: "success",
                  type: "boolean",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "ts",
                  type: "string",
                  description: "メッセージタイムスタンプ",
                }),
              ],
            }),
            permissions: [
              create(PermissionSchema, {
                displayName: "Slack通知",
                description: "Slackにメッセージを送信する権限",
                permissionType: PermissionType.EXECUTE,
                resource: ["notifications/slack"],
                permissionLevel: PermissionLevel.MEDIUM,
              }),
            ],
          }),
        ],
      })
    );

    // プラグイン2: ファイル操作プラグイン
    plugins.push(
      create(PluginPackageSchema, {
        packageId: "com.sapphillon.filesystem",
        packageName: "ファイルシステム",
        packageVersion: "2.0.1",
        description: "ファイルの読み書きや操作を行うプラグイン",
        pluginStoreUrl:
          "https://plugins.sapphillon.com/com.sapphillon.filesystem",
        verified: true,
        internalPlugin: false,
        deprecated: false,
        installedAt: createTimestamp(),
        updatedAt: createTimestamp(),
        functions: [
          create(PluginFunctionSchema, {
            functionId: "read_file",
            functionName: "ファイル読み込み",
            description: "ファイルを読み込みます",
            functionDefine: create(FunctionDefineSchema, {
              parameters: [
                create(FunctionParameterSchema, {
                  name: "path",
                  type: "string",
                  description: "ファイルパス",
                }),
                create(FunctionParameterSchema, {
                  name: "encoding",
                  type: "string",
                  description: "エンコーディング (default: utf-8)",
                }),
              ],
              returns: [
                create(FunctionParameterSchema, {
                  name: "content",
                  type: "string",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "size",
                  type: "number",
                  description: "",
                }),
              ],
            }),
            permissions: [
              create(PermissionSchema, {
                displayName: "ファイル読み込み",
                description: "ファイルを読み込む権限",
                permissionType: PermissionType.FILESYSTEM_READ,
                resource: [],
                permissionLevel: PermissionLevel.MEDIUM,
              }),
            ],
          }),
          create(PluginFunctionSchema, {
            functionId: "write_file",
            functionName: "ファイル書き込み",
            description: "ファイルに書き込みます",
            functionDefine: create(FunctionDefineSchema, {
              parameters: [
                create(FunctionParameterSchema, {
                  name: "path",
                  type: "string",
                  description: "ファイルパス",
                }),
                create(FunctionParameterSchema, {
                  name: "content",
                  type: "string",
                  description: "書き込む内容",
                }),
                create(FunctionParameterSchema, {
                  name: "encoding",
                  type: "string",
                  description: "エンコーディング (default: utf-8)",
                }),
              ],
              returns: [
                create(FunctionParameterSchema, {
                  name: "success",
                  type: "boolean",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "bytesWritten",
                  type: "number",
                  description: "",
                }),
              ],
            }),
            permissions: [
              create(PermissionSchema, {
                displayName: "ファイル書き込み",
                description: "ファイルに書き込む権限",
                permissionType: PermissionType.FILESYSTEM_WRITE,
                resource: [],
                permissionLevel: PermissionLevel.HIGH,
              }),
            ],
          }),
        ],
      })
    );

    // プラグイン3: HTTPリクエストプラグイン
    plugins.push(
      create(PluginPackageSchema, {
        packageId: "com.sapphillon.http",
        packageName: "HTTPクライアント",
        packageVersion: "1.5.0",
        description: "HTTPリクエストを送信するプラグイン",
        pluginStoreUrl: "https://plugins.sapphillon.com/com.sapphillon.http",
        verified: true,
        internalPlugin: false,
        deprecated: false,
        installedAt: createTimestamp(),
        updatedAt: createTimestamp(),
        functions: [
          create(PluginFunctionSchema, {
            functionId: "fetch",
            functionName: "HTTPリクエスト",
            description: "HTTPリクエストを送信します",
            functionDefine: create(FunctionDefineSchema, {
              parameters: [
                create(FunctionParameterSchema, {
                  name: "url",
                  type: "string",
                  description: "リクエストURL",
                }),
                create(FunctionParameterSchema, {
                  name: "method",
                  type: "string",
                  description: "HTTPメソッド (default: GET)",
                }),
                create(FunctionParameterSchema, {
                  name: "headers",
                  type: "object",
                  description: "リクエストヘッダー",
                }),
                create(FunctionParameterSchema, {
                  name: "body",
                  type: "string",
                  description: "リクエストボディ",
                }),
              ],
              returns: [
                create(FunctionParameterSchema, {
                  name: "status",
                  type: "number",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "statusText",
                  type: "string",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "headers",
                  type: "object",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "body",
                  type: "string",
                  description: "",
                }),
              ],
            }),
            permissions: [
              create(PermissionSchema, {
                displayName: "ネットワークアクセス",
                description: "ネットワークリクエストを送信する権限",
                permissionType: PermissionType.NET_ACCESS,
                resource: [],
                permissionLevel: PermissionLevel.MEDIUM,
              }),
            ],
          }),
        ],
      })
    );

    // プラグイン4: データベースプラグイン
    plugins.push(
      create(PluginPackageSchema, {
        packageId: "com.sapphillon.database",
        packageName: "データベース",
        packageVersion: "1.0.0",
        description: "データベースクエリを実行するプラグイン",
        pluginStoreUrl:
          "https://plugins.sapphillon.com/com.sapphillon.database",
        verified: true,
        internalPlugin: true,
        deprecated: false,
        installedAt: createTimestamp(),
        updatedAt: createTimestamp(),
        functions: [
          create(PluginFunctionSchema, {
            functionId: "query",
            functionName: "データベースクエリ",
            description: "SQLクエリを実行します",
            functionDefine: create(FunctionDefineSchema, {
              parameters: [
                create(FunctionParameterSchema, {
                  name: "sql",
                  type: "string",
                  description: "SQLクエリ",
                }),
                create(FunctionParameterSchema, {
                  name: "params",
                  type: "array",
                  description: "パラメータ",
                }),
              ],
              returns: [
                create(FunctionParameterSchema, {
                  name: "rows",
                  type: "array",
                  description: "",
                }),
                create(FunctionParameterSchema, {
                  name: "rowCount",
                  type: "number",
                  description: "",
                }),
              ],
            }),
            permissions: [
              create(PermissionSchema, {
                displayName: "データベース読み込み",
                description: "データベースからデータを読み込む権限",
                permissionType: PermissionType.EXECUTE,
                resource: ["database"],
                permissionLevel: PermissionLevel.HIGH,
              }),
            ],
          }),
        ],
      })
    );
  }

  if (workflows.length === 0) {
    // ワークフロー1: シンプルなサンプル
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-1",
        displayName: "サンプルワークフロー",
        description: "これはモックデータのサンプルワークフローです",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-1",
            codeRevision: 1,
            code: `// サンプルワークフローコード
function workflow() {
  const page = browser.newPage();
  page.goto("https://example.com");
  const title = page.title();
  console.log("Page title:", title);
  return { success: true, title };
}`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [],
            pluginFunctionIds: [],
            allowedPermissions: [],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [],
      })
    );

    // ワークフロー2: 天気チェック（プラグイン使用なし）
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-2",
        displayName: "天気チェックワークフロー",
        description: "天気をチェックして通知を送信するワークフロー",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-2",
            codeRevision: 1,
            code: `// 天気チェックワークフロー
function workflow() {
  const weather = checkWeather();
  if (weather === "rain") {
    sendNotification("雨が降っています");
  } else {
    console.log("天気は良好です");
  }
  return { weather, notified: weather === "rain" };
}`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [],
            pluginFunctionIds: [],
            allowedPermissions: [],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [],
      })
    );

    // ワークフロー3: 通知送信ワークフロー（プラグイン使用）
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-3",
        displayName: "定期レポート送信",
        description: "日次レポートを生成してメールで送信するワークフロー",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-3",
            codeRevision: 1,
            code: `// 定期レポート送信ワークフロー
function workflow() {
  const report = generateReport();
  
  try {
    const result = send_email({
      to: "admin@example.com",
      subject: "日次レポート",
      body: report,
    });
    return { success: result.success, messageId: result.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
}`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [plugins[0]], // 通知プラグイン
            pluginFunctionIds: ["send_email"],
            allowedPermissions: [
              create(AllowedPermissionSchema, {
                pluginFunctionId: "send_email",
                permissions: plugins[0].functions[0].permissions,
              }),
            ],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [
          create(WorkflowResultSchema, {
            id: "result-3-1",
            displayName: "2025-11-02 実行結果",
            description: "正常に実行されました",
            result: JSON.stringify({ success: true, messageId: "msg-12345" }),
            ranAt: createTimestamp(),
            resultType: WorkflowResultType.SUCCESS_UNSPECIFIED,
            exitCode: 0,
            workflowResultRevision: 1,
          }),
        ],
      })
    );

    // ワークフロー4: ファイル処理ワークフロー（プラグイン使用）
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-4",
        displayName: "ログファイル分析",
        description: "ログファイルを読み込んで分析し、結果をSlackに送信",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-4",
            codeRevision: 1,
            code: `
function workflow() {
  const logContent = read_file({ path: "/var/log/app.log" });
  const analysis = analyzeLogs(logContent.content);

  send_slack({
    channel: "#alerts",
    message: \`分析結果: \${JSON.stringify(analysis)}\`,
  });
  return { success: true, analysis };
}
workflow();
`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [plugins[0], plugins[1]], // 通知プラグインとファイルシステムプラグイン
            pluginFunctionIds: ["read_file", "send_slack"],
            allowedPermissions: [
              create(AllowedPermissionSchema, {
                pluginFunctionId: "read_file",
                permissions: plugins[1].functions[0].permissions,
              }),
              create(AllowedPermissionSchema, {
                pluginFunctionId: "send_slack",
                permissions: plugins[0].functions[1].permissions,
              }),
            ],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [],
      })
    );

    // ワークフロー5: HTTPリクエストワークフロー
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-5",
        displayName: "API監視",
        description: "外部APIのステータスを監視し、異常があれば通知",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-5",
            codeRevision: 1,
            code: `// API監視ワークフロー
import { fetch } from "com.sapphillon.http";
import { send_email } from "com.sapphillon.notifications";

function workflow() {
  const response = fetch({
    url: "https://api.example.com/health",
    method: "GET",
  });
  
  if (response.status !== 200) {
    send_email({
      to: "ops@example.com",
      subject: "API異常検知",
      body: \`APIが異常です: ステータス \${response.status}\`,
    });
    return { status: response.status, alerted: true };
  }
  
  return { status: response.status, alerted: false };
}`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [plugins[0], plugins[2]], // 通知プラグインとHTTPプラグイン
            pluginFunctionIds: ["fetch", "send_email"],
            allowedPermissions: [
              create(AllowedPermissionSchema, {
                pluginFunctionId: "fetch",
                permissions: plugins[2].functions[0].permissions,
              }),
              create(AllowedPermissionSchema, {
                pluginFunctionId: "send_email",
                permissions: plugins[0].functions[0].permissions,
              }),
            ],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [
          create(WorkflowResultSchema, {
            id: "result-5-1",
            displayName: "2025-11-02 10:00 実行結果",
            description: "APIは正常でした",
            result: JSON.stringify({ status: 200, alerted: false }),
            ranAt: createTimestamp(),
            resultType: WorkflowResultType.SUCCESS_UNSPECIFIED,
            exitCode: 0,
            workflowResultRevision: 1,
          }),
        ],
      })
    );

    // ワークフロー6: データベースクエリワークフロー
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-6",
        displayName: "データベースバックアップ",
        description: "データベースからデータをエクスポートしてバックアップ",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-6",
            codeRevision: 1,
            code: `// データベースバックアップワークフロー
import { query } from "com.sapphillon.database";
import { write_file } from "com.sapphillon.filesystem";

function workflow() {
  const data = query({
    sql: "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '1 day'",
  });
  
  const backup = JSON.stringify(data.rows);
  write_file({
    path: "/backups/users-backup.json",
    content: backup,
  });
  
  return { 
    success: true, 
    rowCount: data.rowCount,
    backupPath: "/backups/users-backup.json",
  };
}`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [plugins[1], plugins[3]], // ファイルシステムプラグインとデータベースプラグイン
            pluginFunctionIds: ["query", "write_file"],
            allowedPermissions: [
              create(AllowedPermissionSchema, {
                pluginFunctionId: "query",
                permissions: plugins[3].functions[0].permissions,
              }),
              create(AllowedPermissionSchema, {
                pluginFunctionId: "write_file",
                permissions: plugins[1].functions[1].permissions,
              }),
            ],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [],
      })
    );

    // ワークフロー7: 複数ステップのワークフロー
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-7",
        displayName: "データ処理パイプライン",
        description: "データを取得、変換、保存、通知する一連の処理",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-7",
            codeRevision: 1,
            code: `// データ処理パイプライン
import { fetch } from "com.sapphillon.http";
import { write_file } from "com.sapphillon.filesystem";
import { send_slack } from "com.sapphillon.notifications";

function workflow() {
  // 1. データ取得
  const response = fetch({
    url: "https://api.example.com/data",
    method: "GET",
  });
  
  // 2. データ変換
  const processed = transformData(response.body);
  
  // 3. ファイル保存
  write_file({
    path: "/data/processed.json",
    content: JSON.stringify(processed),
  });
  
  // 4. 通知
  send_slack({
    channel: "#data-team",
    message: \`処理完了: \${processed.length}件のデータを処理しました\`,
  });
  
  return { success: true, processedCount: processed.length };
}`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [plugins[0], plugins[1], plugins[2]],
            pluginFunctionIds: ["fetch", "write_file", "send_slack"],
            allowedPermissions: [
              create(AllowedPermissionSchema, {
                pluginFunctionId: "fetch",
                permissions: plugins[2].functions[0].permissions,
              }),
              create(AllowedPermissionSchema, {
                pluginFunctionId: "write_file",
                permissions: plugins[1].functions[1].permissions,
              }),
              create(AllowedPermissionSchema, {
                pluginFunctionId: "send_slack",
                permissions: plugins[0].functions[1].permissions,
              }),
            ],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [],
      })
    );

    // ワークフロー8: 条件分岐とループのサンプル
    workflows.push(
      create(WorkflowSchema, {
        id: "workflow-8",
        displayName: "条件分岐とループのデモ",
        description: "if-else文やfor文を使った処理の例",
        workflowLanguage: WorkflowLanguage.TYPESCRIPT,
        workflowCode: [
          {
            id: "code-8",
            codeRevision: 1,
            code: `// 条件分岐とループのサンプル
function workflow() {
  const data = fetchData();
  const results = [];
  
  // ループで各データを処理
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // 条件分岐で処理を変える
    if (item.status === "active") {
      // アクティブなアイテムの処理
      const processed = processActiveItem(item);
      results.push(processed);
    } else if (item.status === "pending") {
      // ペンディングのアイテムの処理
      const reviewed = reviewPendingItem(item);
      results.push(reviewed);
    } else {
      // その他のアイテムはスキップ
      console.log("Skipping item:", item.id);
    }
  }
  
  // エラーハンドリング
  try {
    saveResults(results);
    sendNotification("処理が完了しました");
  } catch (error) {
    console.error("エラーが発生しました:", error);
    sendAlert("処理に失敗しました");
  } finally {
    cleanup();
  }
  
  return { success: true, processedCount: results.length };
}`,
            language: WorkflowLanguage.TYPESCRIPT,
            createdAt: createTimestamp(),
            result: [],
            pluginPackages: [],
            pluginFunctionIds: [],
            allowedPermissions: [],
          },
        ],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        workflowResults: [],
      })
    );
  }
}

export function getWorkflows(): Workflow[] {
  return workflows;
}

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}

export function addWorkflow(workflow: Workflow): void {
  workflows.push(workflow);
}

export function updateWorkflow(id: string, workflow: Workflow): boolean {
  const index = workflows.findIndex((w) => w.id === id);
  if (index === -1) return false;
  workflows[index] = workflow;
  return true;
}

export function deleteWorkflow(id: string): boolean {
  const index = workflows.findIndex((w) => w.id === id);
  if (index === -1) return false;
  workflows.splice(index, 1);
  return true;
}

export function getPlugins(): PluginPackage[] {
  return plugins;
}

export function getPluginById(id: string): PluginPackage | undefined {
  return plugins.find((p) => p.packageId === id);
}
