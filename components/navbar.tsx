import Link from "next/link";
import { CSSProperties } from "react";
import { Flex, Text } from "rebass";

interface BlogNavbarProps {
  title: string;
}

const styles: CSSProperties = {
  height: 64,
  position: "sticky",
  top: 0,
  flex: '0 0 auto', // dont shrink 
}

export default function BlogNavbar({ title }: BlogNavbarProps) {
  return <Flex flexDirection="row" alignItems="center" px={4} style={styles} sx={{
    backgroundColor: "background",
    boxShadow: "0px -3px 6px 6px rgba(0, 0, 0, 0.2)",
  }}>
    <Link href="/"> rod41732's blog </Link>
    <Text px={2}> / </Text> 
    {/* <Text flex='0 0 auto' fontSize={2} pr={1} color="secondaryText"> You are reading:</Text> */}
    <Text flex='1 1 auto' style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}} fontSize={3}> {title} </Text>
    
  </Flex>
}