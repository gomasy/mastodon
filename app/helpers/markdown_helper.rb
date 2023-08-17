# frozen_string_literal: true

module MarkdownHelper
  def renderer_options
    {
      no_images: true,
      no_styles: true,
      safe_links_only: true,
      hard_wrap: true,
    }
  end

  def renderer_extensions
    {
      no_intra_emphasis: true,
      fenced_code_blocks: true,
      disable_indented_code_blocks: true,
      strikethrough: true,
      space_after_headers: true,
      underline: true,
    }
  end

  def parse_markdown(text)
    renderer = Redcarpet::Render::HTML.new(renderer_options)
    markdown = Redcarpet::Markdown.new(renderer, renderer_extensions)
    markdown.render(text.gsub('&gt;', '>')).delete("\n")
  end
end
