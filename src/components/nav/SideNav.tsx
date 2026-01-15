import React from "react";
import { NavLink } from "react-router-dom";
import { getRoutes } from "@/routes/registry";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useI18n } from "@/hooks/useI18n";
import { LuShoppingBag } from "react-icons/lu";

export interface SideNavProps {
  onNavigate?: () => void;
}

export function SideNav({ onNavigate }: SideNavProps = {}) {
  const { t } = useI18n();
  const routes = React.useMemo(() => getRoutes(t), [t]);
  return (
    <VStack align="stretch" p={2} gap={1} h="full">
      {routes.flatMap((r) => {
        const navItem = (
          <NavItem
            key={r.key}
            to={r.path}
            label={r.label}
            Icon={r.icon}
            onClick={onNavigate}
          />
        );
        if (r.key === "plugins") {
          return [
            navItem,
            <ExternalNavItem
              key="store"
              href="http://localhost:5173"
              label={t("nav.store")}
              Icon={LuShoppingBag}
            />,
          ];
        }
        return [navItem];
      })}
      <Box
        px={3}
        py={2}
        display={{ base: "block", lg: "none" }}
        borderTopWidth="1px"
        borderTopColor="border"
        mt="auto"
      >
        <HStack gap={2} align="center">
          <Text fontSize="sm" color="fg.muted">
            {t("nav.theme")}
          </Text>
          <ColorModeButton />
        </HStack>
      </Box>
    </VStack>
  );
}

interface NavItemProps {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: string | number }>;
  onClick?: () => void;
}

function NavItem({ to, label, Icon, onClick }: NavItemProps) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }} onClick={onClick}>
      {({ isActive }) => (
        <HStack
          position="relative"
          px={3}
          py={2}
          rounded="md"
          gap={3}
          bg={isActive ? "bg.subtle" : undefined}
          color={isActive ? "fg" : "fg.muted"}
          transitionProperty="colors, shadow"
          transitionDuration="normal"
          _hover={{ bg: isActive ? "bg.subtle" : "bg.subtle" }}
        >
          {isActive && (
            <Box
              position="absolute"
              left={0}
              width="4px"
              height="60%"
              bg="accent.focusRing"
              borderRightRadius="full"
            />
          )}
          <Box as={Icon} css={{ width: 18, height: 18 }} />
          <Text fontSize={{ base: "sm", md: "md" }}>{label}</Text>
        </HStack>
      )}
    </NavLink>
  );
}

interface ExternalNavItemProps {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: string | number }>;
}

function ExternalNavItem({ href, label, Icon }: ExternalNavItemProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <HStack
        position="relative"
        px={3}
        py={2}
        rounded="md"
        gap={3}
        color="fg.muted"
        transitionProperty="colors, shadow"
        transitionDuration="normal"
        _hover={{ bg: "bg.subtle", color: "fg" }}
      >
        <Box as={Icon} css={{ width: 18, height: 18 }} />
        <Text fontSize={{ base: "sm", md: "md" }}>{label}</Text>
      </HStack>
    </a>
  );
}
