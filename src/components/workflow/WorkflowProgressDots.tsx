/**
 * @fileoverview ワークフローの権限とアクセスを横向きにコンパクト表示するコンポーネント
 *
 * @module components/workflow/WorkflowProgressDots
 */

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import type { Workflow } from "@/gen/sapphillon/v1/workflow_pb";
import { parseWorkflowCode } from "./ast-utils";
import { groupStatementsIntoActions } from "./action-grouper";
import { ACTION_TYPES, getActionColor } from "./constants";
import {
    LuArrowRight,
    LuCode,
    LuCornerDownRight,
    LuDatabase,
    LuGitBranch,
    LuMousePointer,
} from "react-icons/lu";
import type { ActionType } from "./constants";

interface WorkflowProgressDotsProps {
    /** 表示するワークフロー定義 */
    workflow: Workflow;
    /** 現在のステップインデックス（0-indexed、オプション） */
    currentStep?: number;
    /** 完了したステップ数（オプション） */
    completedSteps?: number;
    /** クリック時のコールバック */
    onStepClick?: (index: number) => void;
    /** コンパクト表示（アイコンのみ） */
    minimal?: boolean;
}

/**
 * アクションタイプに応じたアイコンを返す（小サイズ）
 */
const getActionIcon = (type: ActionType, size = 12) => {
    switch (type) {
        case ACTION_TYPES.NAVIGATION:
            return <LuArrowRight size={size} />;
        case ACTION_TYPES.INTERACTION:
            return <LuMousePointer size={size} />;
        case ACTION_TYPES.DATA_EXTRACTION:
            return <LuDatabase size={size} />;
        case ACTION_TYPES.CONTROL_FLOW:
            return <LuGitBranch size={size} />;
        case ACTION_TYPES.RETURN:
            return <LuCornerDownRight size={size} />;
        case ACTION_TYPES.COMPUTATION:
        default:
            return <LuCode size={size} />;
    }
};

/**
 * ワークフローの権限とアクセスを横向きにコンパクト表示
 */
export const WorkflowProgressDots: React.FC<WorkflowProgressDotsProps> = ({
    workflow,
    currentStep,
    completedSteps = 0,
    onStepClick,
    minimal = false,
}) => {
    const latestCode = workflow.workflowCode[workflow.workflowCode.length - 1]
        ?.code;

    // AST解析とアクショングループ化
    const actions = useMemo(() => {
        if (!latestCode) return [];
        const { workflowBody, parseError } = parseWorkflowCode(latestCode);
        if (parseError || !workflowBody) return [];
        return groupStatementsIntoActions(workflowBody);
    }, [latestCode]);

    if (actions.length === 0) {
        return (
            <Text fontSize="xs" color="fg.muted">
                ステップなし
            </Text>
        );
    }

    return (
        <HStack
            gap={0}
            overflowX="auto"
            py={1}
            css={{
                "&::-webkit-scrollbar": {
                    height: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "var(--chakra-colors-gray-300)",
                    borderRadius: "2px",
                },
            }}
        >
            {actions.map((action, index) => {
                const colorScheme = getActionColor(
                    action.type,
                    action.importance,
                );
                const isCompleted = index < completedSteps;
                const isCurrent = index === currentStep;
                const isPending = !isCompleted && !isCurrent;

                return (
                    <React.Fragment key={index}>
                        {/* ステップドット */}
                        <Box
                            as="button"
                            onClick={() => onStepClick?.(index)}
                            cursor={onStepClick ? "pointer" : "default"}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            title={action.title}
                            _hover={onStepClick
                                ? { transform: "scale(1.1)" }
                                : undefined}
                            transition="transform 0.15s"
                        >
                            <VStack gap={0.5}>
                                <Box
                                    w={minimal ? "20px" : "28px"}
                                    h={minimal ? "20px" : "28px"}
                                    rounded="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    bg={isCompleted
                                        ? `${colorScheme}.500`
                                        : isCurrent
                                        ? `${colorScheme}.400`
                                        : "gray.200"}
                                    _dark={{
                                        bg: isCompleted
                                            ? `${colorScheme}.600`
                                            : isCurrent
                                            ? `${colorScheme}.500`
                                            : "gray.700",
                                        color: isPending ? "gray.400" : "white",
                                    }}
                                    color={isPending ? "gray.500" : "white"}
                                    boxShadow={isCurrent
                                        ? `0 0 0 3px var(--chakra-colors-${colorScheme}-200)`
                                        : undefined}
                                    transition="all 0.2s"
                                >
                                    {getActionIcon(
                                        action.type,
                                        minimal ? 10 : 12,
                                    )}
                                </Box>
                                {!minimal && (
                                    <Text
                                        fontSize="2xs"
                                        color={isPending ? "fg.muted" : "fg"}
                                        fontWeight={isCurrent
                                            ? "bold"
                                            : "normal"}
                                        maxW="60px"
                                        textAlign="center"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                    >
                                        {action.title.length > 8
                                            ? `${action.title.slice(0, 7)}…`
                                            : action.title}
                                    </Text>
                                )}
                            </VStack>
                        </Box>

                        {/* コネクターライン */}
                        {index < actions.length - 1 && (
                            <Box
                                w={minimal ? "12px" : "20px"}
                                h="2px"
                                bg={index < completedSteps
                                    ? `${colorScheme}.400`
                                    : "gray.300"}
                                _dark={{
                                    bg: index < completedSteps
                                        ? `${colorScheme}.500`
                                        : "gray.600",
                                }}
                                flexShrink={0}
                                alignSelf="center"
                                mt={minimal ? 0 : "-16px"}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </HStack>
    );
};

export default WorkflowProgressDots;
