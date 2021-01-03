import { Box, BoxProps, Flex, FlexProps } from "rebass";

interface ContainerProps {
  children: React.ReactNode, 
  flexProps?: FlexProps, // override flex props
  boxProps?: BoxProps, // override box props
}

export default function Container({ children, flexProps, boxProps }: ContainerProps) {
  return (
    <Flex flexDirection="column" alignItems="center" {...flexProps}>
      <Box width="100%" maxWidth={1080} p={4} mt={2} {...boxProps}>
        {children}
      </Box>
    </Flex>
  );
}
