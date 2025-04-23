/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** Information mainly derived from https://github.com/orgs/mantinedev/discussions/3685 */
import { Input } from '@mantine/core';
import { RichTextEditor, Link as RTELink } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

interface CustomInputProps {
  value?: string;
  defaultValue?: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

const RichEditorInput = ({ value, defaultValue, label, onChange, onFocus, onBlur, error }: CustomInputProps) => {
  const editor = useEditor({
    extensions: [StarterKit, RTELink],
    content: defaultValue,
    onUpdate({ editor }) {
      const content = editor.getHTML();
      onChange && onChange(content as never);
    }
  });

  return (
    <Input.Wrapper label={label}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content aria-label={label} />
      </RichTextEditor>
    </Input.Wrapper>
  );
};

export default RichEditorInput;
