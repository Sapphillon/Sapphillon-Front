import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import {
    PermissionLevel,
    PermissionType,
} from "@/gen/sapphillon/v1/permission_pb";
import type { AllowedPermission } from "@/gen/sapphillon/v1/permission_pb";
import {
    LuBot,
    LuFileText,
    LuGlobe,
    LuHardDrive,
    LuPlay,
    LuShield,
    LuTriangleAlert,
} from "react-icons/lu";

function PermissionIcon({ type }: { type: PermissionType }) {
    switch (type) {
        case PermissionType.EXECUTE:
            return <LuPlay size={16} />;
        case PermissionType.FILESYSTEM_READ:
            return <LuFileText size={16} />;
        case PermissionType.FILESYSTEM_WRITE:
            return <LuHardDrive size={16} />;
        case PermissionType.NET_ACCESS:
            return <LuGlobe size={16} />;
        case PermissionType.ALLOW_MCP:
            return <LuBot size={16} />;
        case PermissionType.ALLOW_ALL:
            return <LuTriangleAlert size={16} color="orange" />;
        default:
            return <LuShield size={16} />;
    }
}

function PermissionLevelBadge({ level }: { level: PermissionLevel }) {
    let color = "gray";
    let text = "Unknown";

    switch (level) {
        case PermissionLevel.MEDIUM:
            color = "blue";
            text = "Medium";
            break;
        case PermissionLevel.HIGH:
            color = "orange";
            text = "High";
            break;
        case PermissionLevel.CRITICAL:
            color = "red";
            text = "Critical";
            break;
        default:
            return null;
    }

    return (
        <Box
            as="span"
            px={1.5}
            py={0.5}
            rounded="full"
            fontSize="2xs"
            fontWeight="medium"
            bg={`${color}.100`}
            color={`${color}.700`}
            _dark={{
                bg: `${color}.900`,
                color: `${color}.300`,
            }}
        >
            {text}
        </Box>
    );
}

export function PermissionList(
    { permissions }: { permissions: AllowedPermission[] },
) {
    if (!permissions || permissions.length === 0) {
        return (
            <Text fontSize="sm" color="fg.muted">
                No permissions required.
            </Text>
        );
    }

    return (
        <VStack align="stretch" gap={4}>
            {permissions.map((ap, i) => (
                <Box key={i} borderWidth="1px" rounded="md" p={3}>
                    <Text fontWeight="medium" fontSize="sm" mb={2}>
                        Plugin: {ap.pluginFunctionId}
                    </Text>
                    <VStack align="stretch" gap={2}>
                        {ap.permissions.map((p, j) => (
                            <HStack key={j} align="start" gap={2}>
                                <Box mt={0.5} color="fg.muted">
                                    <PermissionIcon type={p.permissionType} />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <HStack>
                                        <Text fontSize="sm" fontWeight="medium">
                                            {p.displayName ||
                                                "Unknown Permission"}
                                        </Text>
                                        <PermissionLevelBadge
                                            level={p.permissionLevel}
                                        />
                                    </HStack>
                                    {p.description && (
                                        <Text fontSize="xs" color="fg.muted">
                                            {p.description}
                                        </Text>
                                    )}
                                    {p.resource.length > 0 && (
                                        <Text
                                            fontSize="xs"
                                            fontFamily="mono"
                                            color="fg.subtle"
                                        >
                                            Resource: {p.resource.join(", ")}
                                        </Text>
                                    )}
                                </VStack>
                            </HStack>
                        ))}
                    </VStack>
                </Box>
            ))}
        </VStack>
    );
}
