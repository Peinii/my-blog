import { useCallback, useState } from "react";
import { Box, Button, Card, Code, Flex, Stack, Text } from "@sanity/ui";
import { ClipboardIcon, CheckmarkIcon } from "@sanity/icons";
import type { SlugInputProps } from "sanity";
import { shareUrl } from "@/lib/site-mode";

/**
 * Input khusus untuk field "Share link" di Studio.
 *
 * Tetap memakai tampilan slug bawaan (supaya tombol Generate tetap ada),
 * lalu menambahkan satu baris di bawahnya: URL lengkap + tombol salin.
 * Tanpa ini, kamu harus menyusun sendiri alamatnya dari potongan kode.
 */
export default function ShareLinkInput(props: SlugInputProps) {
  const [copied, setCopied] = useState(false);
  const url = shareUrl(props.value?.current);

  const copy = useCallback(() => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {}
    );
  }, [url]);

  return (
    <Stack space={3}>
      {props.renderDefault(props)}

      {url ? (
        <Card padding={3} radius={2} tone="primary" border>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Link siap dibagikan
            </Text>
            <Flex align="center" gap={2} wrap="wrap">
              <Box flex={1} style={{ minWidth: 220, overflowX: "auto" }}>
                <Code size={1}>{url}</Code>
              </Box>
              <Button
                mode="ghost"
                tone={copied ? "positive" : "default"}
                icon={copied ? CheckmarkIcon : ClipboardIcon}
                text={copied ? "Tersalin" : "Salin"}
                onClick={copy}
              />
            </Flex>
            <Text size={1} muted>
              Penerima hanya melihat artikel ini. Kosongkan field di atas lalu
              Publish untuk mematikan link.
            </Text>
          </Stack>
        </Card>
      ) : (
        <Card padding={3} radius={2} tone="transparent" border>
          <Text size={1} muted>
            Belum bisa dibagikan. Klik <strong>Generate</strong> di atas untuk
            membuat kode, lalu Publish.
          </Text>
        </Card>
      )}
    </Stack>
  );
}
