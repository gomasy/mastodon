# frozen_string_literal: true

module MarkdownHelper
  def renderer_options
    {
      no_images: true,
      no_styles: true,
      safe_links_only: true,
      hard_wrap: true,
      xhtml: true,
      link_attributes: { target: "_blank", rel: "nofollow noopener noreferrer" },
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
      highlight: true,
    }
  end

  def unescape(text)
    text
      .gsub("&amp;", "&")
      .gsub("&lt;", "<")
      .gsub("&gt;", ">")
      .gsub("&quot;", "\"")
      .gsub("&#39;", "'")
  end

  def parse_markdown(text)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(renderer_options), renderer_extensions)
    markdown.render(unescape(text)).delete("\n")
  end
end
