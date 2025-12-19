import React, { useMemo } from "react";
import { Stack, Text, TextInput, Button, Inline, Card } from "@sanity/ui";
import type { StringInputProps } from "sanity";
import { set, unset } from "sanity";

export default function CloudinaryFolderInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props;

  const folder = (value as string) || "";
  const cloudinaryConsole = "https://console.cloudinary.com/console/media_library/folders/all";

  const normalized = useMemo(() => folder.trim().replace(/\\/g, "/"), [folder]);
  const hasBackslashes = folder.includes("\\");

  return (
    <Stack space={3}>
      <TextInput
        value={folder}
        readOnly={readOnly}
        placeholder="Portfolio/huisdieren"
        onChange={(e) => {
          const next = e.currentTarget.value;
          onChange(next ? set(next) : unset());
        }}
      />

      <Inline space={3}>
        <Button
          text="Open Cloudinary"
          tone="primary"
          as="a"
          href={cloudinaryConsole}
          target="_blank"
          rel="noreferrer"
        />
        <Button
          text="Copy folder"
          mode="ghost"
          disabled={!normalized}
          onClick={() => navigator.clipboard.writeText(normalized)}
        />
      </Inline>

      <Card padding={3} radius={2} tone="transparent">
        <Text size={1} muted>
          Tip: gebruik altijd forward slashes: <strong>Portfolio/huisdieren</strong>.
        </Text>

        {hasBackslashes && (
          <Text size={1} style={{ marginTop: 8 }}>
            ⚠️ Je gebruikt <strong>\</strong> — beter is <strong>/</strong>.
          </Text>
        )}
      </Card>
    </Stack>
  );
}
