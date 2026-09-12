'use client'

import {
  MDXEditor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  ListsToggle,
  StrikeThroughSupSubToggles,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

/**
 * WYSIWYG markdown editor used by the admin Blog form.
 * Loaded client-side only (next/dynamic with ssr:false) — MDXEditor touches
 * browser APIs during render and must never run during SSR/hydration.
 * Output is markdown, rendered on the public blog with react-markdown.
 */
export default function RichTextEditor({ markdown, onChange }: { markdown: string; onChange: (md: string) => void }) {
  return (
    <div className="rounded-md border border-[#E5E7EB] bg-white overflow-hidden [&_.mdxeditor-toolbar]:bg-[#F8FAFC] [&_.mdxeditor-toolbar]:border-[#E5E7EB]">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        className="mdx-blog-editor"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <StrikeThroughSupSubToggles />
                <ListsToggle />
                <CreateLink />
              </>
            ),
          }),
        ]}
      />
    </div>
  )
}
