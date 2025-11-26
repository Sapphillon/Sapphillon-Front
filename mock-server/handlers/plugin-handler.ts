import { create } from "@bufbuild/protobuf";
import type { ServiceImpl } from "@connectrpc/connect";
import { PluginService } from "@/gen/sapphillon/v1/plugin_service_pb";
import type {
  ListPluginsRequest,
  ListPluginsResponse,
} from "@/gen/sapphillon/v1/plugin_service_pb";
import { ListPluginsResponseSchema } from "@/gen/sapphillon/v1/plugin_service_pb";
import { getPlugins } from "../data/mock-data";

/**
 * PluginServiceのモックハンドラー実装
 */
export const pluginHandler: ServiceImpl<typeof PluginService> = {
  /**
   * プラグイン一覧を取得
   */
  async listPlugins(request: ListPluginsRequest): Promise<ListPluginsResponse> {
    console.log("[PluginService] listPlugins called", request);
    const plugins = getPlugins();

    // ページネーション
    const pageSize = request.pageSize || 10;
    const startIndex = request.pageToken ? parseInt(request.pageToken, 10) : 0;
    const paginatedPlugins = plugins.slice(startIndex, startIndex + pageSize);
    const nextPageToken =
      startIndex + pageSize < plugins.length
        ? (startIndex + pageSize).toString()
        : "";

    return create(ListPluginsResponseSchema, {
      plugins: paginatedPlugins,
      nextPageToken,
    });
  },
};
