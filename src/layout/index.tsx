import Navbar from "@/layout/components/navbar";
import { AppShell, Card, useMantineTheme, Styles, Space } from "@mantine/core";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const theme = useMantineTheme();
  const styles: Styles<"body" | "main" | "root", never> | undefined = {
    main: {
      background: theme.colors.dark[8],
    },
  };

  return (
    <AppShell styles={styles} navbar={<Navbar />} padding={"xl"}>
      <Space h={"sm"} />
      <Card style={{ backgroundColor: theme.colors.dark[7] }} radius={"md"}>
        <Outlet />
      </Card>
    </AppShell>
  );
};

export default Layout;
