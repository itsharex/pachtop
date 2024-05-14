import { DefaultMantineColor, Paper, Group, RingProgress, Center, rem, Text } from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight, TablerIconsProps } from "@tabler/icons-react";

interface StatsRingProps {
  label: string;
  stats: string;
  progress: number;
  color: DefaultMantineColor;
  Icon: (props: TablerIconsProps) => JSX.Element;
}

const StatsRing: React.FC<StatsRingProps> = (props) => {
  return (
    <Paper withBorder radius={"md"} p={"xs"}>
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: props.progress, color: props.color }]}
          label={
            <Center>
              <props.Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </Center>
          }
        />
        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {props.label}
          </Text>
          <Text fw={700} size="xl">
            {props.stats}
          </Text>
        </div>
      </Group>
    </Paper>
  );
};

export default StatsRing;
