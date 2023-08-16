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

  def parse_markdown(text)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(renderer_options))
    markdown.render(text).delete("\n")
  end

  def h(text)
    text.gsub('&', '&amp;').gsub('"', '&quot;').gsub('<', '&lt;')
  end
end
